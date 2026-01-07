from app.core.security import get_password_hash
from app.repositories.user_repository import UserRepository


class UserService:

    @staticmethod
    def create(db, data):
        repo = UserRepository(db)

        return repo.create(
            name=data.name,
            email=data.email,
            hashed_password=get_password_hash(data.password),
            tenant_id=data.tenant_id,
            role=data.role,
        )
