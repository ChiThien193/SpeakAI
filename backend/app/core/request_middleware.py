import time
import uuid
from fastapi import FastAPI, Request

from app.core.logging import get_logger

logger = get_logger("speakai.request")


def register_request_middleware(app: FastAPI) -> None:
    @app.middleware("http")
    async def add_request_context(request: Request, call_next):
        request_id = uuid.uuid4().hex[:12]
        request.state.request_id = request_id

        start = time.perf_counter()
        client_host = request.client.host if request.client else "-"

        response = await call_next(request)

        process_time_ms = round((time.perf_counter() - start) * 1000, 2)

        response.headers["X-Request-ID"] = request_id
        response.headers["X-Process-Time-MS"] = str(process_time_ms)

        logger.info(
            "request completed",
            extra={
                "request_id": request_id,
                "method": request.method,
                "path": request.url.path,
                "status_code": response.status_code,
                "process_time_ms": process_time_ms,
                "client_host": client_host,
            },
        )

        return response