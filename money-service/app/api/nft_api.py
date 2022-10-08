from typing import Dict, List, Union

from fastapi import APIRouter

from app.types.nft_types import GenerateNftInput
from app.vtb_api import vtb_generate_nft, vtb_get_nft_info, vtb_get_balance_nft, vtb_get_nft_list

nft_router = APIRouter(prefix='/api/nft')


@nft_router.post('/generate_nft')
async def generate_nft(nft_input: GenerateNftInput) -> str:
    transaction_hash = await vtb_generate_nft(nft_input.to_public_key, nft_input.uri, nft_input.nft_count)
    return transaction_hash


@nft_router.get('/get_nft_info/{token_id}')
async def get_nft_info(token_id: int) -> Dict[str, Union[int, str]]:
    token_info = await vtb_get_nft_info(token_id)
    return token_info


@nft_router.get('/get_nft_balance/{public_key}')
async def get_nft_balance(public_key: str) -> List[Dict[str, Union[str, List[int]]]]:
    nft_balance = await vtb_get_balance_nft(public_key)
    return nft_balance


@nft_router.get('/get_nft_list/{transaction_hash}')
async def get_nft_list(transaction_hash: str) -> List[Dict[str, Union[str, List[int]]]]:
    nft_list = await vtb_get_nft_list(transaction_hash)
    return nft_list
