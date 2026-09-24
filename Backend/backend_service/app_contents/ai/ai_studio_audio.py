"""
## Documentation
Quickstart: https://github.com/google-gemini/cookbook/blob/main/quickstarts/Get_started_LiveAPI.py

## Setup

To install the dependencies for this script, run:

```
pip install google-genai pyaudio
```

(If you previously installed opencv-python / pillow / mss for video/screen capture, they are no longer required.)
"""

import os
import asyncio
import traceback

import pyaudio

import argparse

from google import genai
from google.genai import types

FORMAT = pyaudio.paInt16
CHANNELS = 1
SEND_SAMPLE_RATE = 16000
RECEIVE_SAMPLE_RATE = 24000
CHUNK_SIZE = 1024

MODEL = "models/gemini-2.5-flash-native-audio-preview-12-2025"

client = genai.Client(
    http_options={"api_version": "v1beta"},
    api_key=os.environ.get("GEMINI_API_KEY"),
)

CONFIG = types.LiveConnectConfig(
    response_modalities=["AUDIO"],
    speech_config=types.SpeechConfig(
        voice_config=types.VoiceConfig(
            prebuilt_voice_config=types.PrebuiltVoiceConfig(voice_name="Achird")
        )
    ),
    context_window_compression=types.ContextWindowCompressionConfig(
        trigger_tokens=25600,
        sliding_window=types.SlidingWindow(target_tokens=12800),
    ),
)

pya = pyaudio.PyAudio()


class AudioLoop:
    def __init__(self, enable_text_input: bool = True):
        self.enable_text_input = enable_text_input

        self.audio_in_queue: asyncio.Queue[bytes] | None = None
        self.out_queue: asyncio.Queue[dict] | None = None

        self.session = None

        self.audio_stream = None
        self.playback_stream = None

    async def send_text(self):
        while True:
            text = await asyncio.to_thread(input, "message > ")
            if text.lower() == "q":
                break
            if self.session is not None:
                await self.session.send(input=text or ".", end_of_turn=True)

    async def send_realtime(self):
        while True:
            if self.out_queue is None:
                await asyncio.sleep(0.01)
                continue
            msg = await self.out_queue.get()
            if self.session is not None:
                await self.session.send(input=msg)

    async def listen_audio(self):
        mic_info = pya.get_default_input_device_info()
        self.audio_stream = await asyncio.to_thread(
            pya.open,
            format=FORMAT,
            channels=CHANNELS,
            rate=SEND_SAMPLE_RATE,
            input=True,
            input_device_index=mic_info["index"],
            frames_per_buffer=CHUNK_SIZE,
        )
        kwargs = {"exception_on_overflow": False} if __debug__ else {}
        while True:
            data = await asyncio.to_thread(self.audio_stream.read, CHUNK_SIZE, **kwargs)
            if self.out_queue is not None:
                await self.out_queue.put({"data": data, "mime_type": "audio/pcm"})

    async def receive_audio(self):
        """Background task: reads from the websocket and writes pcm chunks to the output queue."""
        while True:
            if self.session is None or self.audio_in_queue is None:
                await asyncio.sleep(0.01)
                continue

            turn = self.session.receive()
            async for response in turn:
                if data := response.data:
                    self.audio_in_queue.put_nowait(data)
                    continue
                if text := response.text:
                    print(text, end="")

            # If you interrupt the model, it sends a turn_complete.
            # For interruptions to work, we need to stop playback.
            while not self.audio_in_queue.empty():
                self.audio_in_queue.get_nowait()

    async def play_audio(self):
        self.playback_stream = await asyncio.to_thread(
            pya.open,
            format=FORMAT,
            channels=CHANNELS,
            rate=RECEIVE_SAMPLE_RATE,
            output=True,
        )
        while True:
            if self.audio_in_queue is None:
                await asyncio.sleep(0.01)
                continue
            bytestream = await self.audio_in_queue.get()
            await asyncio.to_thread(self.playback_stream.write, bytestream)

    async def _close_streams(self):
        if self.audio_stream is not None:
            try:
                self.audio_stream.stop_stream()
            except Exception:
                pass
            try:
                self.audio_stream.close()
            except Exception:
                pass
            self.audio_stream = None

        if self.playback_stream is not None:
            try:
                self.playback_stream.stop_stream()
            except Exception:
                pass
            try:
                self.playback_stream.close()
            except Exception:
                pass
            self.playback_stream = None

    async def run(self):
        try:
            async with (
                client.aio.live.connect(model=MODEL, config=CONFIG) as session,
                asyncio.TaskGroup() as tg,
            ):
                self.session = session

                self.audio_in_queue = asyncio.Queue()
                self.out_queue = asyncio.Queue(maxsize=10)

                if self.enable_text_input:
                    send_text_task = tg.create_task(self.send_text())
                else:
                    send_text_task = None

                tg.create_task(self.send_realtime())
                tg.create_task(self.listen_audio())
                tg.create_task(self.receive_audio())
                tg.create_task(self.play_audio())

                if send_text_task is not None:
                    await send_text_task
                    raise asyncio.CancelledError("User requested exit")
                else:
                    # Run forever until cancelled (Ctrl+C)
                    await asyncio.Event().wait()

        except asyncio.CancelledError:
            pass
        except ExceptionGroup as EG:
            traceback.print_exception(EG)
        finally:
            await self._close_streams()


if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    parser.add_argument(
        "--no-text",
        action="store_true",
        help="Disable console text input (audio-only).",
    )
    args = parser.parse_args()

    main = AudioLoop(enable_text_input=not args.no_text)
    asyncio.run(main.run())


