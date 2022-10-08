from asyncio import run

from hypercorn.asyncio import serve, Config
from fastapi import FastAPI
import uvloop

from app.api.nft_api import nft_router
from app.api.transfer_api import transfer_router
from app.api.wallet_api import wallet_router
from app.request_manager import request_manager
from settings import Settings


settings = Settings()
app = FastAPI()
app.include_router(wallet_router)
app.include_router(transfer_router)
app.include_router(nft_router)


@app.on_event('startup')
async def startup_event():
    await request_manager.connect()


@app.on_event('shutdown')
async def shutdown_event():
    await request_manager.close()


if __name__ == '__main__':
    config = Config()
    config.bind = f'{settings.host}:{settings.port}'
    config.accesslog = '-'
    config.errorlog = '-'
    uvloop.install()
    run(serve(app, config))  # type: ignore
