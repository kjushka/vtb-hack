"""
Types for post requests on transfer
"""

from pydantic import BaseModel, validator


class TransferCoinInput(BaseModel):
    from_user_id: int
    to_user_id: int
    amount: float

    @validator('from_user_id', 'to_user_id')
    def key_exists(cls, v):
        if not v:
            raise ValueError('User ids must not be empty')
        return v

    @validator('from_user_id', 'to_user_id', 'amount')
    def value_greater_zero(cls, v):
        if v <= 0:
            raise ValueError('Value on fields must be greater than zero')
        return v


class TransferMaticInput(TransferCoinInput):
    pass


class TransferRubleInput(TransferCoinInput):
    pass


class TransferNftInput(BaseModel):
    from_user_id: str
    to_user_id: str
    token_id: int

    @validator('from_user_id', 'to_user_id', 'token_id')
    def field_exists(cls, v):
        if not v:
            raise ValueError('Fields must be not empty')
        return v
