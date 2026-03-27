from fastapi import APIRouter, Depends, File, Form, UploadFile, BackgroundTasks
from fastapi.responses import FileResponse

from app.api_deps import get_current_user
from app.schemas.speech_schema import (
    SpeechTranscriptionResponse,
    VoiceTurnResponse,
)
from app.schemas.tts_schema import TtsRequest, VoiceListResponse
from app.services.speech_service import SpeechService
from app.services.chat_service import ChatService
from app.services.tts_service import TtsService

router = APIRouter()


@router.post("/transcribe", response_model=SpeechTranscriptionResponse)
async def transcribe_audio(
    audio: UploadFile = File(...),
    language: str | None = Form(default=None),
    prompt: str | None = Form(default=None),
    current_user: dict = Depends(get_current_user),
):
    speech_service = SpeechService()

    result = await speech_service.transcribe_upload(
        audio=audio,
        language=language,
        prompt=prompt,
    )

    return result


@router.post("/voice-turn", response_model=VoiceTurnResponse)
async def create_voice_turn(
    session_id: str = Form(...),
    audio: UploadFile = File(...),
    language: str | None = Form(default=None),
    prompt: str | None = Form(default=None),
    current_user: dict = Depends(get_current_user),
):
    speech_service = SpeechService()
    chat_service = ChatService()

    transcription = await speech_service.transcribe_upload(
        audio=audio,
        language=language,
        prompt=prompt,
    )

    chat_result = await chat_service.process_text_turn(
        user_firebase_uid=current_user["uid"],
        session_id=session_id,
        text=transcription["transcript"],
        input_type="audio",
        input_metadata={
            "stt_model": transcription["model"],
            "stt_language": transcription["language"],
            "stt_segments_count": transcription["segments_count"],
            "stt_low_confidence_segments": transcription["low_confidence_segments"],
            "stt_likely_non_speech_segments": transcription["likely_non_speech_segments"],
            "original_filename": transcription["filename"],
        },
    )

    return {
        "session_id": session_id,
        "transcription": transcription,
        "chat": chat_result,
    }


@router.get("/voices", response_model=VoiceListResponse)
async def get_tts_voices(
    locale: str | None = None,
    current_user: dict = Depends(get_current_user),
):
    tts_service = TtsService()
    items = await tts_service.list_voices(locale=locale)

    return {
        "items": items,
        "total": len(items),
    }


@router.post("/tts")
async def synthesize_tts(
    payload: TtsRequest,
    background_tasks: BackgroundTasks,
    current_user: dict = Depends(get_current_user),
):
    tts_service = TtsService()

    result = await tts_service.synthesize_to_file(
        text=payload.text,
        voice=payload.voice,
        rate=payload.rate,
        volume=payload.volume,
        pitch=payload.pitch,
        filename_prefix=payload.filename_prefix,
    )

    background_tasks.add_task(
        tts_service.delete_file_safely,
        result["file_path"],
    )

    return FileResponse(
        path=result["file_path"],
        media_type="audio/mpeg",
        filename=result["filename"],
        background=background_tasks,
        headers={
            "X-TTS-Voice": result["voice"],
            "X-TTS-Rate": result["rate"],
            "X-TTS-Volume": result["volume"],
            "X-TTS-Pitch": result["pitch"],
        },
    )