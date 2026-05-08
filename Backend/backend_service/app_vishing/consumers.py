import asyncio
import json
import os
import secrets
from . import SYSTEM_INSTRUCTION_VARIANTS
from typing import Any, Optional

from channels.generic.websocket import AsyncWebsocketConsumer

from google import genai
from google.genai import types
from channels.db import database_sync_to_async
from .models import VishingScenario

MODEL = "models/gemini-2.5-flash-native-audio-preview-12-2025"

# Three alternative system-instruction variants for vishing-awareness simulation.
# Pick one randomly per connection to avoid a single repeated script.

def sendEndCall():
    print("Call ended.")
    return

def talkSummary(result):
    print(result)
    return



tools = [
    types.Tool(
        function_declarations=[
            types.FunctionDeclaration(
                name="talkSummary",
                description="""
                    **USE THIS FUNCTION**:
                    - After system say goodbye or farewelling to user
                    - After collecting both first and last names
                    - Invoke if user explicitly refuses to give information after being asked at least twice.
                    - User might refuse to give information, might give information, or might be inaudible.
                    
                    this function is called with a summary of the conversation. 
                    
                    **YOU MUST RESPONSE STRICTLY WITH ONE OF THESE STRINGS**:
                    (REFUSED, GAVE_INFORMATION, UNAUDIBLE)""",
                parameters=genai.types.Schema(
                    type=genai.types.Type.OBJECT,
                    properties={
                        "result": genai.types.Schema(
                            type=genai.types.Type.STRING
                        ),
                    },
                    required=["result"],
                ),
            ),
        ]
    ),
]

_client = genai.Client(
    http_options={"api_version": "v1beta"},
    api_key=os.environ.get("GEMINI_API_KEY"),
)


def _build_live_connect_config(system_instruction: str) -> types.LiveConnectConfig:
    chosen_voice = secrets.choice(SYSTEM_INSTRUCTION_VARIANTS.voices)
    return types.LiveConnectConfig(
        system_instruction=system_instruction,
        response_modalities=["AUDIO"],
        tools=tools,
        speech_config=types.SpeechConfig(
            voice_config=types.VoiceConfig(
                prebuilt_voice_config=types.PrebuiltVoiceConfig(
                    voice_name=chosen_voice
                )
            )
        ),
        context_window_compression=types.ContextWindowCompressionConfig(
            trigger_tokens=25600,
            sliding_window=types.SlidingWindow(target_tokens=12800),
        ),
    )


class GeminiAudioConsumer(AsyncWebsocketConsumer):
    
    session: Any

    async def connect(self):
        await self.accept()

        self._send_q: asyncio.Queue[dict] = asyncio.Queue(maxsize=100)
        self._tasks: list[asyncio.Task] = []

        self._session_cm = None
        self.session = None

        try:
            chosen_instruction = SYSTEM_INSTRUCTION_VARIANTS.list
            print(f"Chosen system instruction:\n{SYSTEM_INSTRUCTION_VARIANTS.list}\n---")
            config = _build_live_connect_config(chosen_instruction)
            self._session_cm = _client.aio.live.connect(model=MODEL, config=config)
            self.session = await self._session_cm.__aenter__()

            self._tasks.append(asyncio.create_task(self._sender_loop()))
            self._tasks.append(asyncio.create_task(self._receiver_loop()))

            await self.send(text_data=json.dumps({"type": "ready"}))
        except Exception as e:
            await self.send(
                text_data=json.dumps({"type": "error", "message": str(e)})
            )
            await self.close(code=1011)

    async def disconnect(self, close_code):
        for t in self._tasks:
            t.cancel()

        if self._session_cm is not None:
            try:
                await self._session_cm.__aexit__(None, None, None)
            except Exception:
                pass

        self.session = None
        self._session_cm = None

    async def receive(self, text_data: Optional[str] = None, bytes_data: Optional[bytes] = None):
        # Binary: treated as live audio chunk
        if bytes_data is not None:
            try:
                await self._send_q.put({"data": bytes_data, "mime_type": "audio/pcm"})
            except asyncio.QueueFull:
                # Backpressure: drop chunk to keep latency low.
                pass
            return

        if not text_data:
            return

        try:
            msg = json.loads(text_data)
        except json.JSONDecodeError:
            await self.send(text_data=json.dumps({"type": "error", "message": "Invalid JSON"}))
            return

        mtype = msg.get("type")

        if self.session is None:
            await self.send(text_data=json.dumps({"type": "error", "message": "Session not ready"}))
            return

        if mtype == "text":
            await self.session.send(input=str(msg.get("text", "")), end_of_turn=True)
        elif mtype == "end_turn":
            await self.session.send(input=".", end_of_turn=True)
        else:
            await self.send(text_data=json.dumps({"type": "error", "message": f"Unknown type: {mtype}"}))

    async def _sender_loop(self):
        while True:
            msg = await self._send_q.get()
            if self.session is not None:
                await self.session.send(input=msg)

    async def _receiver_loop(self):
        while True:
            if self.session is None:
                await asyncio.sleep(0.01)
                continue

            turn = self.session.receive()
            async for response in turn:
                if response.tool_call:
                    calls = response.tool_call.function_calls
                    if not calls:
                        return

                    # Access the first item in the list
                    first_call = calls[0]

                    if first_call.name == "talkSummary":
                        # Use getattr or direct attribute access since it's an object
                        result = first_call.args.get("result", "")
                        await self.send(text_data=json.dumps({"type": "text", "text": "end"}))
                        await self.send(text_data=json.dumps({"type": "summary", "text": result}))
                        await self._save_vishing_result(result)
                        
                        await self.close(code=1000) 
                        return    
                        
                if response.data:
                    await self.send(bytes_data=response.data)
                if response.text:
                    await self.send(text_data=json.dumps({"type": "text", "text": response.text}))

            # Yield to the event loop between turns
            await asyncio.sleep(0.01)

    @database_sync_to_async
    def _save_vishing_result(self, result: str):
        user = self.scope.get("user")
        if not user or getattr(user, "is_anonymous", True):
            return None  # or raise, if you want to require login

        allowed = {k for (k, _label) in VishingScenario.STATUS}
        if result not in allowed:
            result = "UNAUDIBLE"  # defensive fallback

        return VishingScenario.objects.create(user=user, status=result)