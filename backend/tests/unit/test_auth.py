import pytest
from app.services.auth_service import AuthService
from app.core.exceptions import AuthenticationError


def test_authenticate_success(db_session, user_factory):
    user = user_factory(password="123456")

    result = AuthService.authenticate(
        db=db_session,
        email=user.email,
        password="123456",
        tenant_id=user.tenant_id,
    )

    assert "access_token" in result
    assert result["user"]["email"] == user.email


def test_authenticate_invalid_password(db_session, user_factory):
    user = user_factory(password="123456")

    with pytest.raises(AuthenticationError):
        AuthService.authenticate(
            db=db_session,
            email=user.email,
            password="wrong",
        )


def test_authenticate_inactive_user(db_session, user_factory):
    user = user_factory(is_active=False)

    with pytest.raises(AuthenticationError):
        AuthService.authenticate(
            db=db_session,
            email=user.email,
            password="123456",
        )
