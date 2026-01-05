"""
Script para inicializar o banco de dados.
Cria todas as tabelas baseadas nos modelos SQLAlchemy.

Uso:
    python -m scripts.init_db
"""

import sys
from pathlib import Path

# Adiciona o diretório backend ao path
sys.path.insert(0, str(Path(__file__).parent.parent))

from app.db.base import Base
from app.db.session import engine

# Importa todos os modelos para registrá-los no Base.metadata
from app.models.user import User
# from app.models.payment import *  # Descomente quando tiver modelos
# from app.models.communication import *  # Descomente quando tiver modelos
# from app.models.segmentation import *  # Descomente quando tiver modelos
# from app.models.base_data import *  # Descomente quando tiver modelos


def init_db():
    """
    Cria todas as tabelas no banco de dados.
    """
    print("=" * 50)
    print("Inicializando banco de dados...")
    print("=" * 50)
    
    # Mostra a URL do banco (sem mostrar senhas)
    from app.core.config import settings
    db_url = settings.DATABASE_URL
    if "://" in db_url:
        # Oculta credenciais se houver
        parts = db_url.split("://")
        if "@" in parts[1]:
            safe_url = f"{parts[0]}://***@{parts[1].split('@')[1]}"
        else:
            safe_url = db_url
    else:
        safe_url = db_url
    
    print(f"Database URL: {safe_url}")
    print()
    
    # Cria todas as tabelas
    print("Criando tabelas...")
    Base.metadata.create_all(bind=engine)
    
    # Lista as tabelas criadas
    print("\nTabelas criadas:")
    for table_name in Base.metadata.tables.keys():
        print(f"  ✓ {table_name}")
    
    print()
    print("=" * 50)
    print("Banco de dados inicializado com sucesso!")
    print("=" * 50)


def drop_all():
    """
    Remove todas as tabelas do banco de dados.
    USE COM CUIDADO!
    """
    print("ATENÇÃO: Removendo todas as tabelas...")
    Base.metadata.drop_all(bind=engine)
    print("Todas as tabelas foram removidas.")


if __name__ == "__main__":
    if len(sys.argv) > 1 and sys.argv[1] == "--drop":
        confirm = input("Tem certeza que deseja APAGAR todas as tabelas? (digite 'sim' para confirmar): ")
        if confirm.lower() == "sim":
            drop_all()
        else:
            print("Operação cancelada.")
    else:
        init_db()
