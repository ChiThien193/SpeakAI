import chromadb
from app.core.config import settings

chroma_client = None
kb_collection = None


def connect_chroma():
    global chroma_client, kb_collection

    if chroma_client is None:
        chroma_client = chromadb.PersistentClient(path=settings.chroma_path)
        kb_collection = chroma_client.get_or_create_collection(
            name=settings.chroma_collection_name
        )
        print("Connected to ChromaDB")


def get_kb_collection():
    if kb_collection is None:
        raise RuntimeError("ChromaDB is not connected")
    return kb_collection