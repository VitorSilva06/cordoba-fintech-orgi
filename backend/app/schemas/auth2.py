from fastapi import Form
from pydantic import EmailStr

class OAuth2EmailRequestForm:
    def __init__(
        self,
        email: EmailStr = Form(...),
        password: str = Form(...),
    ):
        self.username = email
        self.password = password
