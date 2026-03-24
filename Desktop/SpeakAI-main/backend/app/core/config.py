from pydantic_settings import BaseSettings, SettingsConfigDict

class Settings(BaseSettings):
    PROJECT_NAME: str = "SpeakAI Backend"
    VERSION: str = "1.0.0"
    API_V1_STR: str = "/api/v1"

    LLM_PROVIDER: str = "groq"
    STT_PROVIDER: str = "openai"
    STT_FALLBACK_PROVIDER: str = "groq"
    TTS_PROVIDER: str = "openai"

    GROQ_BASE_URL: str = "https://api.groq.com/openai/v1"
    OPENAI_BASE_URL: str = "https://api.openai.com/v1"

    GROQ_API_KEY: str = ""
    OPENAI_API_KEY: str = ""

    LLM_MODEL: str = "llama-3.1-8b-instant"
    STT_MODEL: str = "whisper-1"
    GROQ_STT_MODEL: str = "whisper-large-v3-turbo"
    TTS_MODEL: str = "tts-1"
    TTS_VOICE: str = "nova"

    REQUEST_TIMEOUT: int = 30
    DEFAULT_LANGUAGE: str = "en"

    CHUNK_SIZE: int = 500
    CHUNK_OVERLAP: int = 50

    model_config = SettingsConfigDict(
        env_file=".env",
        case_sensitive=True,
        extra="ignore",
    )

settings = Settings()