from fastapi import APIRouter, File, UploadFile, Form, HTTPException
from fastapi.responses import StreamingResponse
import io
from app.services.llm_service import llm_service
from app.services.stt_service import stt_service
from app.services.tts_service import tts_service
from app.services.rag_service import rag_service
from app.services.speaking_evaluation_service import speaking_evaluation_service
from app.services.learning_feedback_service import learning_feedback_service
from app.core.config import settings

def extract_audio_bytes(tts_result):
    """
    Chuẩn hóa kết quả từ tts_service.
    Hỗ trợ:
    - bytes
    - bytearray
    - dict có key 'audio'
    - dict có key 'audio_bytes'
    """
    if not tts_result:
        return None

    if isinstance(tts_result, (bytes, bytearray)):
        return bytes(tts_result)

    if isinstance(tts_result, dict):
        if isinstance(tts_result.get("audio"), (bytes, bytearray)):
            return bytes(tts_result["audio"])
        if isinstance(tts_result.get("audio_bytes"), (bytes, bytearray)):
            return bytes(tts_result["audio_bytes"])

    return None

router = APIRouter(prefix="/chat", tags=["Chat"])

SAMPLE_DOCUMENTS = [
    "The restaurant is open from 9 AM to 10 PM daily. We serve breakfast, lunch, and dinner.",
    "Our menu includes pizza, pasta, burgers, and salads. Vegetarian options are available.",
    "To place an order, please tell me what you'd like. You can say: I'd like a pizza please.",
    "For reservations, please provide your name, number of guests, and preferred time.",
]
rag_service.add_documents("restaurant", SAMPLE_DOCUMENTS)


def build_messages(user_message: str, use_rag: bool):
    messages = [{"role": "user", "content": user_message}]
    if use_rag:
        context = rag_service.search("restaurant", user_message)
        if context:
            context_text = "\n".join(context)
            messages.insert(0, {"role": "system", "content": f"Use this context to answer: {context_text}"})
    return messages


@router.post("/text")
async def chat_text(message: str = Form(...), use_rag: bool = Form(False)):
    messages = build_messages(message, use_rag)
    response = await llm_service.generate(messages)
    if not response["success"]:
        raise HTTPException(status_code=500, detail=response["error"])
    return {
        "text": response["message"],
        "usage": response.get("usage", {}),
        "provider": response.get("provider"),
    }


@router.post("/voice")
async def chat_voice(
    audio: UploadFile = File(...),
    use_rag: bool = Form(False)
):
    audio_data = await audio.read()

    stt_result = await stt_service.transcribe(
        audio_data=audio_data,
        filename=audio.filename or "audio.webm",
        content_type=audio.content_type or "audio/webm",
        language=settings.DEFAULT_LANGUAGE
    )

    if not stt_result["success"]:
        raise HTTPException(status_code=400, detail=stt_result["error"])

    transcribed_text = stt_result["text"]

    if not transcribed_text:
        raise HTTPException(status_code=400, detail="Could not transcribe audio")

    messages = build_messages(transcribed_text, use_rag)

    response = await llm_service.generate(messages)

    if not response["success"]:
        raise HTTPException(status_code=500, detail=response["error"])

    evaluation_result = await speaking_evaluation_service.evaluate_transcript(
        transcript=transcribed_text,
        scenario="general"
    )

    feedback_result = await learning_feedback_service.generate_feedback(
        transcript=transcribed_text,
        scenario="restaurant" if use_rag else "general"
    )

    tts_result = await tts_service.synthesize(response["message"])
    audio_bytes = extract_audio_bytes(tts_result)

    tts_error = None
    if isinstance(tts_result, dict) and not tts_result.get("success", True):
        tts_error = tts_result.get("error")

    return {
        "text": response["message"],
        "transcribed_text": transcribed_text,
        "audio": audio_bytes.hex() if audio_bytes else None,
        "usage": response.get("usage", {}),
        "stt_provider": stt_result.get("provider"),
        "tts_error": tts_error,
        "speaking_evaluation": evaluation_result.get("analysis"),
        "learning_feedback": feedback_result.get("feedback")
    }


@router.post("/voice-stream")
async def chat_voice_stream(audio: UploadFile = File(...), use_rag: bool = Form(False)):
    audio_data = await audio.read()
    print("VOICE STREAM filename:", audio.filename)
    print("VOICE STREAM content_type:", audio.content_type)

    stt_result = await stt_service.transcribe(
    audio_data=audio_data,
    filename=audio.filename or "audio.webm",
    content_type=audio.content_type or "audio/webm",
    language=settings.DEFAULT_LANGUAGE
)

    if not stt_result["success"]:
        raise HTTPException(status_code=400, detail=stt_result["error"])

    transcribed_text = stt_result["text"]
    messages = build_messages(transcribed_text, use_rag)

    response = await llm_service.generate(messages)
    if not response["success"]:
        raise HTTPException(status_code=500, detail=response["error"])

    tts_result = await tts_service.synthesize(response["message"])
    if tts_result["success"] and tts_result["audio"]:
        return StreamingResponse(
            io.BytesIO(tts_result["audio"]),
            media_type="audio/mpeg",
            headers={
                "X-Transcribed-Text": transcribed_text,
                "X-Response-Text": response["message"],
                "X-STT-Provider": stt_result.get("provider", ""),
                "X-LLM-Provider": response.get("provider", ""),
                "X-TTS-Provider": tts_result.get("provider", ""),
            },
        )

    return {
        "text": response["message"],
        "transcribed_text": transcribed_text,
        "tts_error": tts_result.get("error"),
    }


@router.post("/rag/add")
async def add_documents(collection: str = Form(...), documents: str = Form(...)):
    docs = [d.strip() for d in documents.split("\n") if d.strip()]
    if not docs:
        raise HTTPException(status_code=400, detail="No documents provided")
    rag_service.add_documents(collection, docs)
    return {"message": f"Added {len(docs)} documents to collection '{collection}'"}


@router.get("/rag/search")
async def search_documents(collection: str, query: str, n_results: int = 3):
    results = rag_service.search(collection, query, n_results)
    return {"query": query, "results": results}


@router.get("/rag/collections")
async def list_collections():
    return {"collections": rag_service.list_collections()}
