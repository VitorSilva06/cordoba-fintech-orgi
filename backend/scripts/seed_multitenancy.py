"""
Script para popular o banco com dados de teste multi-tenant.
Execute: python -m scripts.seed_multitenancy
"""
import sys
import os
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from datetime import date, timedelta
from decimal import Decimal
import random

from app.db.session import SessionLocal
from app.models.tenant import Tenant
from app.models.user import User, UserRole
from app.models.cliente import Cliente, Sexo
from app.models.contrato import Contrato, StatusContrato
from app.core.security import get_password_hash


def seed_database():
    db = SessionLocal()
    
    try:
        print("🌱 Iniciando seed do banco de dados...")
        
        # =====================================================
        # 1. CRIAR TENANTS
        # =====================================================
        print("\n📦 Criando tenants...")
        
        tenants_data = [
            {"nome": "Empresa Alpha Cobrança", "cnpj": "11.111.111/0001-11"},
            {"nome": "Beta Recuperadora", "cnpj": "22.222.222/0001-22"},
            {"nome": "Gamma Assessoria", "cnpj": "33.333.333/0001-33"},
        ]
        
        tenants = []
        for t_data in tenants_data:
            existing = db.query(Tenant).filter(Tenant.cnpj == t_data["cnpj"]).first()
            if not existing:
                tenant = Tenant(**t_data)
                db.add(tenant)
                db.flush()
                tenants.append(tenant)
                print(f"   ✅ Tenant criado: {tenant.nome}")
            else:
                tenants.append(existing)
                print(f"   ⏭️  Tenant já existe: {existing.nome}")
        
        # =====================================================
        # 2. CRIAR USUÁRIOS
        # =====================================================
        print("\n👤 Criando usuários...")
        
        # Diretor (acesso global)
        diretor = db.query(User).filter(User.email == "diretor@cordoba.com").first()
        if not diretor:
            diretor = User(
                name="Carlos Diretor",
                email="diretor@cordoba.com",
                hashed_password=get_password_hash("dir123"),
                role=UserRole.DIRETOR,
                tenant_id=None,  # NULL = acesso a todos
                is_active=True,
            )
            db.add(diretor)
            print("   ✅ Diretor criado: diretor@cordoba.com / dir123")
        else:
            print("   ⏭️  Diretor já existe")
        
        # Gerentes e Operadores por tenant
        for i, tenant in enumerate(tenants):
            # Gerente
            gerente_email = f"gerente{i+1}@{tenant.nome.split()[0].lower()}.com"
            gerente = db.query(User).filter(User.email == gerente_email).first()
            if not gerente:
                gerente = User(
                    name=f"Gerente {tenant.nome.split()[0]}",
                    email=gerente_email,
                    hashed_password=get_password_hash("ger123"),
                    role=UserRole.GERENTE,
                    tenant_id=tenant.id,
                    is_active=True,
                )
                db.add(gerente)
                print(f"   ✅ Gerente criado: {gerente_email} / ger123")
            
            # Operador
            operador_email = f"operador{i+1}@{tenant.nome.split()[0].lower()}.com"
            operador = db.query(User).filter(User.email == operador_email).first()
            if not operador:
                operador = User(
                    name=f"Operador {tenant.nome.split()[0]}",
                    email=operador_email,
                    hashed_password=get_password_hash("op123"),
                    role=UserRole.OPERADOR,
                    tenant_id=tenant.id,
                    is_active=True,
                )
                db.add(operador)
                print(f"   ✅ Operador criado: {operador_email} / op123")
        
        db.flush()
        
        # =====================================================
        # 3. CRIAR CLIENTES (DEVEDORES) POR TENANT
        # =====================================================
        print("\n👥 Criando clientes (devedores)...")
        
        nomes_masculinos = ["João", "Pedro", "Carlos", "José", "Antonio", "Paulo", "Lucas", "Marcos"]
        nomes_femininos = ["Maria", "Ana", "Juliana", "Fernanda", "Patricia", "Sandra", "Lucia", "Carla"]
        sobrenomes = ["Silva", "Santos", "Oliveira", "Souza", "Costa", "Pereira", "Rodrigues", "Almeida"]
        
        clientes_por_tenant = {}
        
        for tenant in tenants:
            clientes_por_tenant[tenant.id] = []
            
            # Verifica se já existem clientes
            existing_count = db.query(Cliente).filter(Cliente.tenant_id == tenant.id).count()
            if existing_count > 0:
                print(f"   ⏭️  {tenant.nome} já tem {existing_count} clientes")
                clientes_por_tenant[tenant.id] = db.query(Cliente).filter(Cliente.tenant_id == tenant.id).all()
                continue
            
            # Cria 50 clientes por tenant
            for j in range(50):
                is_male = random.random() > 0.5
                nome = random.choice(nomes_masculinos if is_male else nomes_femininos)
                sobrenome = random.choice(sobrenomes)
                
                # CPF aleatório
                cpf_nums = ''.join([str(random.randint(0, 9)) for _ in range(11)])
                cpf = f"{cpf_nums[:3]}.{cpf_nums[3:6]}.{cpf_nums[6:9]}-{cpf_nums[9:]}"
                
                # Data nascimento (25-65 anos)
                idade = random.randint(25, 65)
                nascimento = date.today() - timedelta(days=idade * 365)
                
                cliente = Cliente(
                    tenant_id=tenant.id,
                    nome=f"{nome} {sobrenome}",
                    cpf=cpf,
                    data_nascimento=nascimento,
                    sexo=Sexo.MASCULINO if is_male else Sexo.FEMININO,
                    telefone=f"({random.randint(11,99)}) 9{random.randint(1000,9999)}-{random.randint(1000,9999)}",
                    email=f"{nome.lower()}.{sobrenome.lower()}{j}@email.com",
                )
                db.add(cliente)
                clientes_por_tenant[tenant.id].append(cliente)
            
            db.flush()
            print(f"   ✅ {tenant.nome}: 50 clientes criados")
        
        # =====================================================
        # 4. CRIAR CONTRATOS POR CLIENTE
        # =====================================================
        print("\n📄 Criando contratos...")
        
        for tenant in tenants:
            existing_count = db.query(Contrato).filter(Contrato.tenant_id == tenant.id).count()
            if existing_count > 0:
                print(f"   ⏭️  {tenant.nome} já tem {existing_count} contratos")
                continue
            
            contratos_criados = 0
            
            for cliente in clientes_por_tenant[tenant.id]:
                # 1-3 contratos por cliente
                num_contratos = random.randint(1, 3)
                
                for k in range(num_contratos):
                    # Valor entre 500 e 50.000
                    valor = Decimal(str(random.randint(500, 50000)))
                    
                    # Data do contrato (1-3 anos atrás)
                    dias_atras = random.randint(30, 1095)
                    data_contrato = date.today() - timedelta(days=dias_atras)
                    
                    # Vencimento (30-365 dias após contrato)
                    dias_venc = random.randint(30, 365)
                    data_vencimento = data_contrato + timedelta(days=dias_venc)
                    
                    # Status baseado na data
                    if data_vencimento > date.today():
                        status = StatusContrato.ATIVO
                        valor_pago = Decimal("0")
                    elif random.random() > 0.7:
                        status = StatusContrato.PAGO
                        valor_pago = valor
                    elif random.random() > 0.8:
                        status = StatusContrato.NEGOCIADO
                        valor_pago = valor * Decimal("0.3")
                    else:
                        status = StatusContrato.ATRASADO
                        valor_pago = Decimal("0")
                    
                    contrato = Contrato(
                        tenant_id=tenant.id,
                        cliente_id=cliente.id,
                        numero_contrato=f"CTR-{tenant.id}-{cliente.id}-{k+1}",
                        valor_original=valor,
                        data_contrato=data_contrato,
                        data_vencimento=data_vencimento,
                        status=status,
                        valor_pago=valor_pago,
                    )
                    db.add(contrato)
                    contratos_criados += 1
            
            print(f"   ✅ {tenant.nome}: {contratos_criados} contratos criados")
        
        # =====================================================
        # COMMIT FINAL
        # =====================================================
        db.commit()
        print("\n✨ Seed concluído com sucesso!")
        
        # Resumo
        print("\n📊 Resumo:")
        print(f"   Tenants: {db.query(Tenant).count()}")
        print(f"   Usuários: {db.query(User).count()}")
        print(f"   Clientes: {db.query(Cliente).count()}")
        print(f"   Contratos: {db.query(Contrato).count()}")
        
        print("\n🔑 Credenciais de acesso:")
        print("   Diretor: diretor@cordoba.com / dir123")
        print("   Gerentes: gerente1@empresa.com / ger123")
        print("   Operadores: operador1@empresa.com / op123")
        
    except Exception as e:
        db.rollback()
        print(f"\n❌ Erro: {e}")
        raise
    finally:
        db.close()


if __name__ == "__main__":
    seed_database()
