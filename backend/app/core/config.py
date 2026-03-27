from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    app_name: str = "SpeakAI Backend"
    app_env: str = "dev"
    app_host: str = "127.0.0.1"
    app_port: int = 8000

    mongo_uri: str = "mongodb://localhost:27017"
    mongo_db_name: str = "speakai"

    firebase_credentials: str

    groq_api_key: str
    groq_model: str = "openai/gpt-oss-20b"
    groq_temperature: float = 0.2
    groq_max_completion_tokens: int = 512
    max_chat_history_messages: int = 10

    chroma_path: str = "./chroma_data"
    chroma_collection_name: str = "speakai_kb"
    rag_top_k: int = 4
    rag_max_context_chunks: int = 4
    rag_chunk_size: int = 450
    rag_chunk_overlap: int = 80

    stt_model: str = "whisper-large-v3-turbo"
    stt_language: str = "en"
    stt_temperature: float = 0.0
    max_audio_upload_bytes: int = 25 * 1024 * 1024

    tts_voice: str = "en-US-JennyNeural"
    tts_rate: str = "+0%"
    tts_volume: str = "+0%"
    tts_pitch: str = "+0Hz"
    tts_output_dir: str = "./tmp_tts"
    tts_max_text_length: int = 1500

    log_level: str = "INFO"
    log_to_file: bool = True
    log_dir: str = "./logs"

    model_config = SettingsConfigDict(
        env_file=".env",
        case_sensitive=False,
        extra="ignore"
    )


settings = Settings()