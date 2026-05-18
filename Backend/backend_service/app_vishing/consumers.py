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
                    (REFUSED, GAVE_INFORMATION, INCOMPLETE)""",
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
            types.FunctionDeclaration(
                name="sendPopUpNotification",
                description="""
                    **USE THIS FUNCTION**:
                    - After system say they will send a notification to user
                    
                    this function is called with a notification message to be shown to user as a pop-up in the frontend.
                    
                    **EXAMPLE**:
                    notification=true
                    """,
                parameters=genai.types.Schema(
                    type=genai.types.Type.OBJECT,
                    properties={
                        "notification": genai.types.Schema(
                            type=genai.types.Type.STRING
                        ),
                    },
                    required=["notification"],
                ),
            ),
        ]
    ),
]

_client = genai.Client(
    http_options={"api_version": "v1beta"},
    api_key=os.environ.get("GEMINI_API_KEY"),
)


def _build_live_connect_config(system_instruction: str, voice: str) -> types.LiveConnectConfig:
    return types.LiveConnectConfig(
        system_instruction=system_instruction,
        response_modalities=["AUDIO"],
        tools=tools,
        speech_config=types.SpeechConfig(
            voice_config=types.VoiceConfig(
                prebuilt_voice_config=types.PrebuiltVoiceConfig(
                    voice_name=voice
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
            chosen_variant = secrets.choice(SYSTEM_INSTRUCTION_VARIANTS.list)
            system_instruction = chosen_variant["rule"]
            voice = chosen_variant["voice"]
            
            # Substitute username into the rule
            user = self.scope["user"]
            username = user.username if user.is_authenticated else "User"
            system_instruction = system_instruction.format(username=username)
            
            print(f"Chosen variant:\nIdentity: {chosen_variant['identity']}\nVoice: {voice}\n---")
            config = _build_live_connect_config(system_instruction, voice)
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
            try:
                if self.session is None:
                    await asyncio.sleep(0.01)
                    continue

                turn = self.session.receive()
                async for response in turn:
                    if response.tool_call:
                        calls = response.tool_call.function_calls
                        if not calls:
                            return
                        
                        first_call = calls[0]
                        
                        print(f"Tool call received: {first_call.name} with args {first_call.args}")
                        if first_call.name == "talkSummary":
                            result = first_call.args.get("result", "")
                            await self.send(text_data=json.dumps({"type": "text", "text": "end"}))
                            await self.send(text_data=json.dumps({"type": "summary", "text": result}))
                            await self._save_vishing_result(result)
                            
                            await self.close(code=1000) 
                            return    
                        
                        if first_call.name == "sendPopUpNotification":
                            notification = first_call.args.get("notification", "")
                            await self.send(text_data=json.dumps({"type": "notification", "text": notification}))
                            
                            
                    if response.data:
                        await self.send(bytes_data=response.data)
                    if response.text:
                        await self.send(text_data=json.dumps({"type": "text", "text": response.text}))
                        
                await asyncio.sleep(0.01)
            except asyncio.CancelledError:
                break
            except Exception as e:
                print(f"Error in _receiver_loop: {e}")
                try:
                    await self.send(text_data=json.dumps({"type": "summary", "text": "INCOMPLETE"}))
                    # await self._save_vishing_result("INCOMPLETE")
                except Exception:
                    pass
                break

    @database_sync_to_async
    def _save_vishing_result(self, result: str):
        user = self.scope.get("user")
        if not user or getattr(user, "is_anonymous", True):
            return None

        allowed = {k for (k, _label) in VishingScenario.STATUS}
        if result not in allowed:
            result = "UNAUDIBLE"

        return VishingScenario.objects.create(user=user, status=result)