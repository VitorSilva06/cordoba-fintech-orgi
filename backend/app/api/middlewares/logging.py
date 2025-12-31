import time
import logging
from starlette.middleware.base import BaseHTTPMiddleware
from starlette.requests import Request
from starlette.responses import Response

logger = logging.getLogger("app.logger")


class LoggingMiddleware(BaseHTTPMiddleware):
    async def dispatch(self, request: Request, call_next):
        start_time = time.time()

        response: Response = await call_next(request)

        process_time = time.time() - start_time

        logger.info(
            "%s %s | status=%s | time=%.3fs | client=%s",
            request.method,
            request.url.path,
            response.status_code,
            process_time,
            request.client.host if request.client else "unknown",
        )

        return response


# Funcionalidades:

# -------------------------
#   Metodo HTTP (GET, POST, etc.)
#   Endpoint acessado
#   Status da resposta
# T empo de processamento
#   IP do cliente
# -------------------------