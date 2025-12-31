import time
from typing import Dict

from fastapi import Request
from starlette.middleware.base import BaseHTTPMiddleware
from starlette.responses import JSONResponse
from starlette import status

from app.core.config import settings


class RateLimitMiddleware(BaseHTTPMiddleware):
    """
    Middleware simples de rate limit por IP.
    """

    def __init__(self, app):
        super().__init__(app)
        self.requests: Dict[str, list[float]] = {}

    async def dispatch(self, request: Request, call_next):
        # Se rate limit estiver desabilitado, passa direto
        if not settings.ENABLE_RATE_LIMIT:
            return await call_next(request)

        client_ip = request.client.host if request.client else "unknown"
        now = time.time()

        window_seconds = 60
        max_requests = settings.RATE_LIMIT_PER_MINUTE

        timestamps = self.requests.get(client_ip, [])

        # Remove requisições antigas
        timestamps = [t for t in timestamps if now - t < window_seconds]

        if len(timestamps) >= max_requests:
            return JSONResponse(
                status_code=status.HTTP_429_TOO_MANY_REQUESTS,
                content={
                    "error": "Limite de requisições excedido",
                    "limit": max_requests,
                    "window_seconds": window_seconds,
                },
            )

        timestamps.append(now)
        self.requests[client_ip] = timestamps

        return await call_next(request)
