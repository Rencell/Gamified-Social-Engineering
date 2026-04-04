from __future__ import annotations

from typing import Any, Dict, Literal, Optional

QuizType = Literal[
    'DoDont',
    'MultipleChoice',
    'MatchingType',
    'DragPair',
    'PhishingTactics',
    'ModuleReward',
    'ScenarioTraining',
    'FinalTest',
]

SUPPORTED_QUIZ_TYPES: set[str] = {
    'DoDont',
    'MultipleChoice',
    'MatchingType',
    'DragPair',
    'PhishingTactics',
    'ModuleReward',
    'ScenarioTraining',
    'FinalTest',
}

QUIZ_GENERATION_RULES = """You are generating quiz items for a learning module.

    Rules:
    - Output ONLY valid JSON. No markdown, no commentary.
    - Use only the provided module facts/context. Do not invent new facts.
    - If total > 1, return a JSON array of quiz items; otherwise return ONE quiz item as a single JSON object.
    - CRITICAL: When returning multiple items, the top-level MUST be a JSON array (e.g., [{...}, {...}]).
      Do NOT return an object with numeric keys (e.g., {"0": {...}, "1": {...}}).
    - Each quiz item MUST match this top-level shape exactly:
      { ... }
    - When generating multiple items, do NOT wrap them in any extra object; return the array directly.
    - Include a top-level "question" field ONLY when the schema for that type includes it.
    - The props MUST match the schema for the given type exactly (no extra keys).
    - All strings must be non-empty unless explicitly allowed.
    - the sentence length of question should be between 10 and 100 characters.
    - explanation must be at least 20 characters long when present.
    - IMPORTANT (merge behavior): if you are given an existing list of quiz items, generate ONLY new items and keep the same schema so the caller can append/merge all returned props into the existing list.
    """.strip()


QUIZ_PROPS_RULES: Dict[str, str] = {

    'MultipleChoice': (
        """- Option ids must be simple stable tokens (A, B, C, D...).
            - must be not concise question and explanation.
            example:
            {
                "image": "",
                "question": "Which situation best demonstrates attackers exploiting trust?",
                "options": [
                    {
                        "id": "a",
                        "text": "You receive a random email offering free money"
                    },
                    {
                        "id": "b",
                        "text": "Someone pretends to be your coworker and asks for your login details"
                    },
                    {
                        "id": "c",
                        "text": "A website asks you to update your password regularly"
                    },
                    {
                        "id": "d",
                        "text": "You forget your password and reset it yourself"
                    }
                ],
                "correctAnswer": "b",
                "explanation": "Because the message appears familiar and trustworthy, victims are more likely to share sensitive information without verifying the request."
            }"""
    ),
    'MatchingType': (
        """
            example:
            {
                "match_A": "Fear and Urgency",
                "match_B": "Forcing quick decisions with threats"
            },

        """
    ),
    'DragPair': (
       """
            - correctAnswer must be either 'top' or 'bottom'
            example:
            {
                "question": "What is phishing?",
                "topAnswer": "A technique to steal sensitive information via email or fake websites.",
                "bottomAnswer": "A method of physical intrusion into secure areas.",
                "correctAnswer": "top",
                "feedback": "Phishing involves tricking individuals into revealing sensitive information through deceptive emails or websites."

            }
       """
    ),
    'DoDont': (
       """
            - answer must be either 0 (Do) or 1 (Don't)
            example:
            {
                "text": "It's okay to share your password with a trusted friend.",
                "answer": 1
            }
       """
    ),
    'PhishingTactics': (
        """
            - in the content array, use # for any call-to-action lines that should be emphasized.
            example:
            {
                "type": "email",
                "sender": "IT Support <it-support@company-secure-reset.com>",
                "subject": "Action Required: Password Reset Needed Within 2 Hours",
                "date": "Yesterday, 3:45 PM",
                "link": "https://company-secure-reset.com/login",
                "content": [
                    "Hi Customer,",
                    "We detected unusual sign-in activity from a new device.",
                    "To keep your account active, you must verify your identity and reset your password within 2 hours.",
                    "Failure to act may result in temporary suspension.",
                    "#Verify now:",
                    "— IT Security Team"
                ],
                "options": [
                    {
                        "id": "A",
                        "text": "Scam"
                    },
                    {
                        "id": "B",
                        "text": "Not A Scam"
                    }
                ],
                "correctAnswer": "A"
            }
        """
    ),
    'ScenarioTraining': (
        """
            - scenario and prompt must be non-empty strings.
            - scenario should describe a realistic situation grounded in the provided context/facts.
            - prompt should ask the learner what to do next (single clear action).
            example:
            {
                "scenario": "You receive a message from a coworker asking you to review a shared document and sign in.",
                "prompt": "What is the safest next step before signing in?"
            }
        """
    ),
    'FinalTest': (
        """
            - title and instructions must be non-empty strings.
            - title should be short (<= 60 characters).
            - instructions should clearly describe how the final test works.
            example:
            {
                "title": "Final Test: Phishing Awareness",
                "instructions": "Answer each question based on the module content. You must score at least 80% to pass."
            }
        """
    ),
}


QUIZ_PROPS_TEMPLATES: Dict[str, Dict[str, Any]] = {
    'MultipleChoice': {
        'image': '',
        'question': 'string',
        'options': [
            {'id': 'A', 'text': 'string'},
            {'id': 'B', 'text': 'string'},
            {'id': 'C', 'text': 'string'},
            {'id': 'D', 'text': 'string'},
        ],
        'correctAnswer': 'A',
        'explanation': 'string',
    },
    'MatchingType': {
        'match_A': 'string',
        'match_B': 'string',
    },
    'DragPair': {
        'question': 'string',
        'topAnswer': 'string',
        'bottomAnswer': 'string',
        'correctAnswer': 'top',  # 'top' | 'bottom'
        'feedback': 'string',
    },
    'DoDont': {
        'text': 'string',
        'answer': 1,  # 0 | 1
    },
    'PhishingTactics': {
        'type': 'string',
        'sender': 'string',
        'subject': 'string',
        'date': 'string',
        'link': 'string',
        'content': ['string'],
        'options': [
            {'id': 'A', 'text': 'string'},
            {'id': 'B', 'text': 'string'},
            {'id': 'C', 'text': 'string'},
            {'id': 'D', 'text': 'string'},
        ],
        'correctAnswer': 'A',
    },
    'ScenarioTraining': {
        'scenario': 'string',
        'prompt': 'string',
    },
    'FinalTest': {
        'title': 'string',
        'instructions': 'string',
    },
}


def is_supported_quiz_type(quiz_type: str) -> bool:
    return quiz_type in SUPPORTED_QUIZ_TYPES


def QuizPropsSchema(quiz_type: str) -> Dict[str, Any]:

    if quiz_type not in QUIZ_PROPS_TEMPLATES:
        raise ValueError(f"Unsupported quiz type: {quiz_type}")

    return QUIZ_PROPS_TEMPLATES[quiz_type]

def QuizPropsRules(quiz_type: str) -> str:
    if quiz_type not in QUIZ_PROPS_RULES:
        raise ValueError(f"No exclusive rules defined for quiz type: {quiz_type}")
    return QUIZ_PROPS_RULES[quiz_type]