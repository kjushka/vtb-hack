from datetime import datetime, timedelta
from hashlib import sha512

from fastapi.responses import JSONResponse
from jwt import encode
from sqlalchemy import select
from sqlalchemy.dialects.postgresql import insert
from sqlalchemy.exc import IntegrityError

from config import Service
from models.auth_info import AuthInfo, Role, RoleUser
from service.database import DatabaseConnection


async def auth(login: str, password: str):
    password = sha512(password.encode()).hexdigest()
    async with DatabaseConnection.engine.begin() as connection:
        user = (await connection.execute(select(
            AuthInfo
        ).where(
            AuthInfo.login == login,
            AuthInfo.password == password
        ))).fetchone()

        if not user:
            return JSONResponse({'error': 'Forbidden'}, status_code=403)

        roles = (await connection.execute(select(
            Role
        ).where(
            Role.id == RoleUser.role_id,
            RoleUser.user_id == user['id']
        ))).fetchall()

    response = JSONResponse({'result': {'login': login, 'id': user['id']}})
    response.set_cookie('auth_jwt', value=encode(
        {
            'id': user['id'],
            'login': login,
            'roles': [role.name for role in roles],
            'exp': datetime.now() + timedelta(days=7)
        },
        key=Service.jwt_key
    ))
    return response


USER_ROLE = 4


async def register(login: str, password: str):
    try:
        async with DatabaseConnection.engine.begin() as connection:
            user = (await connection.execute(insert(AuthInfo).values(
                login=login, password=sha512(password.encode()).hexdigest()
            ).returning(AuthInfo.id))).fetchone()
            await connection.execute(insert(RoleUser).values(user_id=user[0], role_id=USER_ROLE))
        return JSONResponse({'result': {'registered': True, 'id': user['id']}})
    except IntegrityError:
        return JSONResponse({'error': 'User already exists'}, status_code=403)
