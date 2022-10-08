from pydantic import BaseModel


class CreateWalletInput(BaseModel):
    user_id: int
