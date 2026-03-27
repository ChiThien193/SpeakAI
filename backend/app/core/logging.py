import logging
from pathlib import Path

from app.core.config import settings


class SafeExtraFormatter(logging.Formatter):
    def format(self, record):
        defaults = {
            "request_id": "-",
            "method": "-",
            "path": "-",
            "status_code": "-",
            "process_time_ms": "-",
            "client_host": "-",
        }

        for key, value in defaults.items():
            if not hasattr(record, key):
                setattr(record, key, value)

        return super().format(record)


def configure_logging() -> None:
    root_logger = logging.getLogger()

    if getattr(root_logger, "_speakai_configured", False):
        return

    level = getattr(logging, settings.log_level.upper(), logging.INFO)
    root_logger.setLevel(level)
    root_logger.handlers.clear()

    formatter = SafeExtraFormatter(
        "%(asctime)s | %(levelname)s | %(name)s | req=%(request_id)s | "
        "%(method)s %(path)s | status=%(status_code)s | "
        "%(process_time_ms)sms | client=%(client_host)s | %(message)s"
    )

    stream_handler = logging.StreamHandler()
    stream_handler.setLevel(level)
    stream_handler.setFormatter(formatter)
    root_logger.addHandler(stream_handler)

    if settings.log_to_file:
        log_dir = Path(settings.log_dir)
        log_dir.mkdir(parents=True, exist_ok=True)

        file_handler = logging.FileHandler(
            log_dir / "backend.log",
            encoding="utf-8"
        )
        file_handler.setLevel(level)
        file_handler.setFormatter(formatter)
        root_logger.addHandler(file_handler)

    root_logger._speakai_configured = True


def get_logger(name: str) -> logging.Logger:
    return logging.getLogger(name)