from datetime import datetime, UTC


def build_scenario_document(
    scenario_id: str,
    title: str,
    slug: str,
    description: str,
    level: str,
    category: str,
    goals: list[str],
    vocabulary: list[str],
    patterns: list[str],
    kb_path: str | None = None,
    status: str = "active",
) -> dict:
    now = datetime.now(UTC)

    return {
        "scenario_id": scenario_id,
        "title": title,
        "slug": slug,
        "description": description,
        "level": level,
        "category": category,
        "goals": goals,
        "vocabulary": vocabulary,
        "patterns": patterns,
        "kb_path": kb_path,
        "status": status,
        "created_at": now,
        "updated_at": now,
    }