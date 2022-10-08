from fastapi import APIRouter
from fastapi.exceptions import HTTPException
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.db import SessionLocal
from app.models import Wallet
from app.types.transfer_types import TransferMaticInput, TransferRubleInput, TransferNftInput
from app.vtb_api import vtb_matic_transfer, vtb_ruble_transfer, vtb_transfer_nft, vtb_get_balance


transfer_router = APIRouter(prefix='/api/transfer')


@transfer_router.post('/transfer_matic')
async def transfer_matic(t_input: TransferMaticInput) -> bool:
    async with SessionLocal() as s:
        s: AsyncSession
        async with s.begin():
            query = select(Wallet.private_key, Wallet.public_key).where(
                Wallet.user_id == t_input.from_user_id
            )
            from_wallet = await s.execute(query)
            if (from_wallet := from_wallet.fetchone()) is None:
                raise HTTPException(
                    status_code=404, detail=f'User with id {t_input.from_user_id} has no wallet'
                )
            from_public_key, from_private_key = from_wallet
            if await check_able_to_transfer(from_public_key, t_input.amount, 'matic'):
                query = select(Wallet.public_key).where(Wallet.user_id == t_input.to_user_id)
                to_public_key = await s.execute(query)
                if (to_public_key := to_public_key.fetchone()) is None:
                    raise HTTPException(
                        status_code=404, detail=f'User with id {t_input.to_user_id} has no wallet'
                    )
                await vtb_matic_transfer(from_private_key, to_public_key[0], t_input.amount)
                return True
            raise HTTPException(status_code=403, detail='Can`t transfer coins')


@transfer_router.post('/transfer_ruble')
async def transfer_ruble(t_input: TransferRubleInput) -> bool:
    async with SessionLocal() as s:
        s: AsyncSession
        async with s.begin():
            query = select(Wallet.private_key, Wallet.public_key).where(
                Wallet.user_id == t_input.from_user_id
            )
            from_wallet = await s.execute(query)
            if (from_wallet := from_wallet.fetchone()) is None:
                raise HTTPException(
                    status_code=404, detail=f'User with id {t_input.from_user_id} has no wallet'
                )
            from_public_key, from_private_key = from_wallet
            if await check_able_to_transfer(from_public_key, t_input.amount, 'ruble'):
                query = select(Wallet.public_key).where(Wallet.user_id == t_input.to_user_id)
                to_public_key = await s.execute(query)
                if (to_public_key := to_public_key.fetchone()) is None:
                    raise HTTPException(
                        status_code=404, detail=f'User with id {t_input.to_user_id} has no wallet'
                    )
                await vtb_ruble_transfer(from_private_key, to_public_key[0], t_input.amount)
                return True
            raise HTTPException(status_code=403, detail='Can`t transfer coins')


@transfer_router.post('/transfer_nft')
async def transfer_nft(t_input: TransferNftInput) -> bool:
    async with SessionLocal() as s:
        s: AsyncSession
        async with s.begin():
            query = select(Wallet.private_key).where(Wallet.user_id == t_input.from_user_id)
            from_private_key = await s.execute(query)
            if (from_private_key := from_private_key.fetchone()) is None:
                raise HTTPException(
                    status_code=404, detail=f'User with id {t_input.from_user_id} has no wallet'
                )
            query = select(Wallet.public_key).where(Wallet.user_id == t_input.to_user_id)
            to_public_key = await s.execute(query)
            if (to_public_key := to_public_key.fetchone()) is None:
                raise HTTPException(
                    status_code=404, detail=f'User with id {t_input.to_user_id} has no wallet'
                )
            await vtb_transfer_nft(from_private_key[0], to_public_key[0], t_input.token_id)
            return True
        raise HTTPException(status_code=403, detail='Can`t transfer coins')


# region utils


async def check_able_to_transfer(public_key: str, amount: float, coin_type: str) -> bool:
    balance = await vtb_get_balance(public_key)
    if coin_type == 'matic':
        return balance['matic_amount'] >= amount + 0.2
    if coin_type == 'ruble':
        return balance['coin_amount'] >= amount and balance['matic_amount'] >= 0.2


# endregion
