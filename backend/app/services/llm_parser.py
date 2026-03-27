import json


def parse_chat_turn_llm_output(content: str) -> dict:
    data = _load_json_content(content)

    reply = str(data.get("reply", "")).strip()
    if not reply:
        raise ValueError("LLM response is missing 'reply'")

    feedback = data.get("feedback", {}) or {}

    grammar_notes = _normalize_string_list(feedback.get("grammar_notes", []))
    better_expressions = _normalize_string_list(feedback.get("better_expressions", []))
    clarity_hint = feedback.get("clarity_hint")

    if clarity_hint is not None:
        clarity_hint = str(clarity_hint).strip() or None

    return {
        "reply": reply,
        "feedback": {
            "grammar_notes": grammar_notes,
            "better_expressions": better_expressions,
            "clarity_hint": clarity_hint,
        },
    }


def _load_json_content(content: str) -> dict:
    if not content or not content.strip():
        raise ValueError("Empty LLM response")

    candidates = [content.strip()]

    start = content.find("{")
    end = content.rfind("}")
    if start != -1 and end != -1 and end > start:
        extracted = content[start:end + 1].strip()
        if extracted not in candidates:
            candidates.append(extracted)

    last_error = None

    for candidate in candidates:
        try:
            data = json.loads(candidate)
            if not isinstance(data, dict):
                raise ValueError("LLM JSON root must be an object")
            return data
        except Exception as e:
            last_error = e

    raise ValueError(f"Failed to parse LLM JSON response: {last_error}")


def _normalize_string_list(value) -> list[str]:
    if not isinstance(value, list):
        return []

    result: list[str] = []
    for item in value:
        text = str(item).strip()
        if text:
            result.append(text)

    return result