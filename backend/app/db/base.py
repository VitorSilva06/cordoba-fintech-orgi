from sqlalchemy.orm import DeclarativeBase


class Base(DeclarativeBase):
    """
    Base declarativa do SQLAlchemy.

    Todas as models do projeto devem herdar desta classe
    para que o SQLAlchemy consiga mapear e criar as tabelas.
    """
    pass
