from typing import Dict, List, Union

from app.request_manager import request_manager
from settings import Settings

s = Settings()


async def vtb_create_wallet() -> Dict[str, str]:
    response = await request_manager.post(f'{s.base_url}/v1/wallets/new')
    return {'private_key': response['privateKey'], 'public_key': response['publicKey']}


async def vtb_matic_transfer(from_private: str, to_public: str, amount: float) -> str:
    body = {'fromPrivateKey': from_private, 'toPublicKey': to_public, 'amount': amount}
    response = await request_manager.post(f'{s.base_url}/v1/transfers/matic', data=body)
    return response['transactionHash']


async def vtb_ruble_transfer(from_private: str, to_public: str, amount: float) -> str:
    body = {'fromPrivateKey': from_private, 'toPublicKey': to_public, 'amount': amount}
    response = await request_manager.post(f'{s.base_url}/v1/transfers/ruble', data=body)
    return response['transactionHash']


async def vtb_transfer_nft(from_private: str, to_public: str, token_id: int) -> str:
    body = {'fromPrivateKey': from_private, 'toPublicKey': to_public, 'tokenId': token_id}
    response = await request_manager.post(f'{s.base_url}/v1/transfers/nft', data=body)
    return response['transactionHash']


async def vtb_check_transaction_status(transaction_hash: str) -> str:
    response = await request_manager.post(f'{s.base_url}/v1/transfers/status/{transaction_hash}')
    return response['status']


async def vtb_get_balance(public_key: str) -> Dict[str, float]:
    response = await request_manager.get(f'{s.base_url}/v1/wallets/{public_key}/balance')
    return {'matic_amount': response['maticAmount'], 'coins_amount': response['coinsAmount']}


async def vtb_get_balance_nft(public_key: str) -> List[Dict[str, Union[str, List[int]]]]:
    response = await request_manager.get(f'{s.base_url}/v1/wallets/{public_key}/nft/balance')
    return response['balance']


async def vtb_generate_nft(public_key: str, uri: str, nft_count: int) -> str:
    body = {'publicKey': public_key, 'uri': uri, 'nftCount': nft_count}
    response = await request_manager.post(f'{s.base_url}/v1/nft/generate', data=body)
    return response['transactionHash']


async def vtb_get_nft_info(token_id: int) -> Dict[str, Union[int, str]]:
    response = await request_manager.get(f'{s.base_url}/v1/nft/{token_id}')
    return {'token_id': response['tokenId'], 'uri': response['uri'], 'public_key': response['publicKey']}


async def vtb_get_nft_list(transaction_hash: str) -> List[Dict[str, Union[str, List[int]]]]:
    response = await request_manager.get(f'{s.base_url}/v1/nft/generate/{transaction_hash}')
    return response


async def vtb_get_transaction_history(
    public_key: str, page: int = 1, offset: int = 20, sort: str = 'asc'
) -> List[Dict[str, Union[str, int]]]:
    body = {'page': page, 'offset': offset, 'sort': sort}
    response = await request_manager.post(f'{s.base_url}/v1/wallets/{public_key}/history', data=body)
    return response['history']
