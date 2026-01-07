from fastapi import FastAPI, Request, HTTPException, status
from fastapi.responses import JSONResponse


# ======================================================
# EXCEÇÃO BASE DA APLICAÇÃO
# ======================================================

class AppException(HTTPException):
    def __init__(self, status_code: int, detail: str):
        super().__init__(status_code=status_code, detail=detail)


# ======================================================
# EXCEÇÕES HTTP PADRÃO
# ======================================================

class BadRequestException(AppException):
    def __init__(self, detail: str = "Requisição inválida"):
        super().__init__(status.HTTP_400_BAD_REQUEST, detail)


class UnauthorizedException(HTTPException):
    def __init__(self, detail: str = "Não autorizado"):
        super().__init__(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail=detail,
            headers={"WWW-Authenticate": "Bearer"},
        )


class ForbiddenException(AppException):
    def __init__(self, detail: str = "Acesso negado"):
        super().__init__(status.HTTP_403_FORBIDDEN, detail)


class NotFoundException(AppException):
    def __init__(self, detail: str = "Recurso não encontrado"):
        super().__init__(status.HTTP_404_NOT_FOUND, detail)


class ConflictException(AppException):
    def __init__(self, detail: str = "Conflito de estado"):
        super().__init__(status.HTTP_409_CONFLICT, detail)


class RateLimitExceededException(AppException):
    def __init__(self, detail: str = "Limite de requisições excedido"):
        super().__init__(status.HTTP_429_TOO_MANY_REQUESTS, detail)


class ExternalServiceException(AppException):
    def __init__(self, detail: str = "Falha em serviço externo"):
        super().__init__(status.HTTP_502_BAD_GATEWAY, detail)


# ======================================================
# EXCEÇÕES DE AUTENTICAÇÃO
# ======================================================

class AuthenticationError(UnauthorizedException):
    """
    Erro específico de autenticação:
    - credenciais inválidas
    - token expirado
    - token malformado
    """
    def __init__(self, detail: str = "Credenciais inválidas"):
        super().__init__(detail=detail)


# ======================================================
# REGISTRO GLOBAL DE EXCEPTION HANDLERS
# ======================================================

def register_exception_handlers(app: FastAPI) -> None:
    """
    Registra handlers globais de exceções da aplicação
    """

    @app.exception_handler(AppException)
    async def app_exception_handler(
        request: Request,
        exc: AppException,
    ):
        return JSONResponse(
            status_code=exc.status_code,
            content={
                "error": exc.detail,
                "path": request.url.path,
            },
        )

    @app.exception_handler(Exception)
    async def unhandled_exception_handler(
        request: Request,
        exc: Exception,
    ):
        return JSONResponse(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            content={
                "error": "Erro interno do servidor",
                "path": request.url.path,
            },
        )
