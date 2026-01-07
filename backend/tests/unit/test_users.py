from app.services.user_service import UserService
from app.schemas.user import UserCreate

def test_create_user(db_session):
    data = UserCreate(
        name="Usuário Teste",
        email="teste@empresa.com",
        password="123456",
        tenant_id=1,
        role="operador"
    )

    user = UserService.create(db_session, data)

    assert user.id is not None
    assert user.email == data.email
    assert user.tenant_id == 1
