def split_text_into_chunks(
    text: str,
    chunk_size: int = 450,
    chunk_overlap: int = 80,
) -> list[str]:
    text = text.strip()
    if not text:
        return []

    paragraphs = [p.strip() for p in text.split("\n\n") if p.strip()]
    if not paragraphs:
        return []

    chunks: list[str] = []
    current = ""

    for paragraph in paragraphs:
        if not current:
            current = paragraph
            continue

        proposed = current + "\n\n" + paragraph
        if len(proposed) <= chunk_size:
            current = proposed
        else:
            chunks.append(current)
            overlap_text = current[-chunk_overlap:] if chunk_overlap > 0 else ""
            current = (overlap_text + "\n\n" + paragraph).strip()

    if current:
        chunks.append(current)

    cleaned_chunks = [c.strip() for c in chunks if c.strip()]
    return cleaned_chunks