from django.conf import settings
from google import genai
from google.genai import types

import json
from typing import Any, Dict
def _extract_json_text(text: str) -> str:
    """
    Best-effort extraction if the model wraps JSON in ```json ... ``` fences.
    """
    t = (text or "").strip()
    if t.startswith("```"):
        # remove starting fence line (``` or ```json)
        first_nl = t.find("\n")
        if first_nl != -1:
            t = t[first_nl + 1 :]
        # remove ending fence
        if t.endswith("```"):
            t = t[: -3]
    return t.strip()

def generate_quiz_json(prompt: str) -> str:
    """
    Calls Gemini and returns the generated text (non-streaming).
    `prompt` should be a string (you already build JSON with json.dumps).
    """
    client = genai.Client(api_key=settings.GEMINI_API_KEY)

    model = "gemini-2.5-flash"

    contents = [
        types.Content(
            role="user",
            parts=[types.Part.from_text(text=prompt)],
        ),
    ]

    # If you don't need Google Search, remove tools entirely.
    config = types.GenerateContentConfig(
        response_mime_type="application/json",
        thinking_config=types.ThinkingConfig(thinking_budget=-1),
        # tools=[types.Tool(googleSearch=types.GoogleSearch())],
    )

    # Non-streaming call (simpler for an API response)
    resp = client.models.generate_content(
        model=model,
        contents=contents,
        config=config,
    )

    raw_text = (getattr(resp, "text", None) or "").strip()
    json_text = _extract_json_text(raw_text)

    try:
        return json.loads(json_text)
    except json.JSONDecodeError as e:
        raise ValueError(f"Gemini returned invalid JSON: {e}\nRaw:\n{raw_text}") from e