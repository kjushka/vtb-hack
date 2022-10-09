from asyncio import run

from hypercorn.asyncio import serve, Config
from fastapi import FastAPI
from fastapi.routing import APIRoute

from api.auth import auth, register
from config import Service
from service.database import DatabaseConnection


def get_application():
    app = FastAPI(routes=[
        APIRoute('/login', auth, methods=['GET']),
        APIRoute('/register', register, methods=['GET'])
    ])
    app.add_event_handler('startup', DatabaseConnection.open)
    return app


if __name__ == '__main__':
    config = Config()
    config.accesslog = '-'
    config.bind = f'{Service.host}:{Service.port}'
    config.errorlog = '-'
    run(serve(get_application(), config))  # type: ignore
