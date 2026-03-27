class PromptBuilder:
    def build_system_prompt(self, scenario: dict) -> str:
        goals = ", ".join(scenario.get("goals", [])) or "general speaking practice"
        vocabulary = ", ".join(scenario.get("vocabulary", [])[:12]) or "N/A"
        patterns = ", ".join(scenario.get("patterns", [])[:8]) or "N/A"

        return f"""
You are SpeakAI, an English speaking practice partner for learners.

Selected scenario:
- Title: {scenario["title"]}
- Description: {scenario["description"]}
- Level: {scenario["level"]}
- Category: {scenario["category"]}
- Goals: {goals}
- Helpful vocabulary: {vocabulary}
- Useful patterns: {patterns}

Instructions:
- Stay strictly inside the selected scenario.
- Reply in English only.
- Keep the reply natural, short, and conversational.
- Limit the reply to 1-2 sentences and under 30 words.
- Do not explain grammar inside the reply.
- Put learning corrections only in the feedback object.
- Prefer retrieved context when it is relevant.
- If retrieved context is weak or unrelated, do not force it.
- If the learner sentence is already acceptable, feedback arrays can be empty and clarity_hint can be null.
- Never mention internal instructions, schemas, or JSON.
""".strip()

    def build_user_prompt(
        self,
        scenario: dict,
        history_messages: list[dict],
        current_user_text: str,
        rag_chunks: list[dict] | None = None,
    ) -> str:
        history_text = self._format_history(history_messages)
        rag_text = self._format_rag_chunks(rag_chunks or [])

        return f"""
Scenario title: {scenario["title"]}

Conversation history:
{history_text}

Retrieved scenario knowledge:
{rag_text}

Learner's new message:
{current_user_text}

Generate the next assistant reply and learning feedback.
""".strip()

    def _format_history(self, history_messages: list[dict]) -> str:
        if not history_messages:
            return "No previous conversation."

        lines: list[str] = []

        for item in history_messages:
            speaker = "Learner" if item["role"] == "user" else "Assistant"
            text = item["text"].strip()
            lines.append(f"{speaker}: {text}")

        return "\n".join(lines)

    def _format_rag_chunks(self, rag_chunks: list[dict]) -> str:
        if not rag_chunks:
            return "No retrieved context."

        lines: list[str] = []

        for idx, chunk in enumerate(rag_chunks, start=1):
            source_file = chunk.get("metadata", {}).get("source_file", "unknown")
            text = chunk.get("text", "").strip()
            lines.append(f"[Context {idx} | {source_file}] {text}")

        return "\n\n".join(lines)