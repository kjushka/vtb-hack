"""
API start here
"""

from typing import Dict, Union

from fastapi import APIRouter
from fastapi.exceptions import HTTPException
from sqlalchemy import delete, select
from sqlalchemy.ext.asyncio import AsyncSession

from app.db import SessionLocal
from app.models import Wallet
from app.types.wallet_types import CreateWalletInput
from app.value_objects import Wallet as WalletObject
from app.vtb_api import vtb_create_wallet, vtb_get_balance


wallet_router = APIRouter(prefix='/api/wallet')


@wallet_router.get('/get_wallet/{user_id}')
async def get_wallet_by_id(user_id: int) -> Dict[str, Union[str, int]]:
    """
    Gets wallet by user id

    :param: user_id: id of user
    :return: wallet object
    """
    async with SessionLocal() as s:
        s: AsyncSession
        async with s.begin():
            query = select(Wallet).where(Wallet.user_id == user_id)
            result = await s.execute(query)
            result = result.fetchone()
        if result:
            return WalletObject.from_orm(result['Wallet']).__dict__
        raise HTTPException(status_code=404, detail='Item not found')


@wallet_router.post("/create_wallet")
async def create_wallet(wallet_input: CreateWalletInput) -> Dict[str, int]:
    async with SessionLocal() as s:
        s: AsyncSession
        async with s.begin():
            new_wallet = await vtb_create_wallet()
            w = Wallet(
                user_id=wallet_input.user_id,
                private_key=new_wallet['private_key'],
                public_key=new_wallet['public_key'],
            )
            s.add(w)
        await s.refresh(w)
    return WalletObject.from_orm(w).__dict__


@wallet_router.delete('/delete_wallet/{wallet_id}')
async def delete_wallet(wallet_id: int) -> bool:
    async with SessionLocal() as s:
        s: AsyncSession
        async with s.begin():
            query = delete(Wallet).where(Wallet.id == wallet_id)
            await s.execute(query)
    return True


@wallet_router.get('/get_balance/{user_id}')
async def get_balance_by_user_id(user_id: int) -> Dict[str, float]:
    async with SessionLocal() as s:
        s: AsyncSession
        async with s.begin():
            query = select(Wallet.public_key).where(Wallet.user_id == user_id)
            result = await s.execute(query)
            result = result.fetchone()
    if result:
        return await vtb_get_balance(result[0])
    raise HTTPException(status_code=404, detail='Wallet for this user not found')
