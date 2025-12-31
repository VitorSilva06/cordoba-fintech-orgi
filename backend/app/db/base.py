from sqlalchemy.orm import DeclarativeBase


class Base(DeclarativeBase):
    """
    Classe base para todos os modelos SQLAlchemy.
    Usada para:
    - Mapeamento ORM
    - Criação de tabelas
    - Integração com Alembic
    """
    pass
