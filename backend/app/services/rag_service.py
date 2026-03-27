from pathlib import Path
from app.core.config import settings
from app.core.exceptions import BadRequestException, NotFoundException
from app.db.chroma import get_kb_collection
from app.services.scenario_service import ScenarioService
from app.services.text_chunker import split_text_into_chunks


class RagService:
    def __init__(self):
        self.collection = get_kb_collection()
        self.scenario_service = ScenarioService()

    async def reindex_scenario(self, scenario_id: str) -> int:
        scenario = await self.scenario_service.get_scenario_by_id(scenario_id)

        kb_path = scenario.get("kb_path")
        if not kb_path:
            raise BadRequestException("Scenario does not have kb_path")

        file_paths = self._resolve_kb_files(kb_path)
        if not file_paths:
            raise BadRequestException("No KB files found for this scenario")

        self.collection.delete(where={"scenario_id": scenario_id})

        ids: list[str] = []
        documents: list[str] = []
        metadatas: list[dict] = []

        global_chunk_index = 0

        for file_path in file_paths:
            raw_text = file_path.read_text(encoding="utf-8").strip()
            if not raw_text:
                continue

            chunks = split_text_into_chunks(
                text=raw_text,
                chunk_size=settings.rag_chunk_size,
                chunk_overlap=settings.rag_chunk_overlap,
            )

            for local_chunk_index, chunk in enumerate(chunks):
                chunk_id = f"{scenario_id}:{file_path.stem}:{global_chunk_index}"

                ids.append(chunk_id)
                documents.append(chunk)
                metadatas.append(
                    {
                        "scenario_id": scenario_id,
                        "scenario_slug": scenario["slug"],
                        "source_file": file_path.name,
                        "source_stem": file_path.stem,
                        "chunk_index": global_chunk_index,
                        "local_chunk_index": local_chunk_index,
                        "level": scenario["level"],
                        "category": scenario["category"],
                    }
                )

                global_chunk_index += 1

        if not ids:
            raise BadRequestException("No valid chunks generated from KB files")

        self.collection.add(
            ids=ids,
            documents=documents,
            metadatas=metadatas,
        )

        return len(ids)

    async def reindex_all_scenarios(self) -> tuple[int, int]:
        scenarios = await self.scenario_service.get_all_active_scenarios()

        total_scenarios = 0
        total_chunks = 0

        for scenario in scenarios:
            kb_path = scenario.get("kb_path")
            if not kb_path:
                continue

            indexed_count = await self.reindex_scenario(scenario["scenario_id"])
            total_scenarios += 1
            total_chunks += indexed_count

        return total_scenarios, total_chunks

    async def retrieve(
        self,
        scenario_id: str,
        query_text: str,
        top_k: int | None = None,
    ) -> list[dict]:
        clean_query = query_text.strip()
        if not clean_query:
            return []

        result = self.collection.query(
            query_texts=[clean_query],
            n_results=top_k or settings.rag_top_k,
            where={"scenario_id": scenario_id},
            include=["documents", "metadatas", "distances"],
        )

        ids_batch = result.get("ids", [[]])[0]
        docs_batch = result.get("documents", [[]])[0]
        metas_batch = result.get("metadatas", [[]])[0]
        distances_batch = result.get("distances", [[]])[0]

        retrieved: list[dict] = []

        for item_id, doc, meta, dist in zip(ids_batch, docs_batch, metas_batch, distances_batch):
            retrieved.append(
                {
                    "chunk_id": item_id,
                    "text": doc,
                    "metadata": meta,
                    "distance": dist,
                }
            )

        return retrieved[: settings.rag_max_context_chunks]

    def _resolve_kb_files(self, kb_path: str) -> list[Path]:
        path = Path(kb_path)

        if path.is_file():
            return [path]

        if path.is_dir():
            return sorted(path.glob("*.txt"))

        raise NotFoundException(f"KB path not found: {kb_path}")