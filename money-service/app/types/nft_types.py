"""
Types for post requests on NFT
"""

from pydantic import BaseModel, validator


class GenerateNftInput(BaseModel):
    to_public_key: str
    uri: str
    nft_count: int

    @validator('to_public_key', 'uri', 'nft_count')
    def field_exists(cls, v):
        if not v:
            raise ValueError('Fields must be not empty')
        return v

    @validator('nft_count')
    def nft_count_greater_zero(cls, v):
        if v > 0:
            return v
        raise ValueError('NFT count must be greater than zero')

