from sqlalchemy import Column, Integer, String, ForeignKey

from service.database import Base


class AuthInfo(Base):
    __tablename__ = 'auth_info'

    id = Column(Integer, primary_key=True)
    login = Column(String, nullable=False, unique=True)
    password = Column(String, nullable=False)


class Role(Base):
    __tablename__ = 'role'

    id = Column(Integer, primary_key=True)
    name = Column(String, nullable=False)
    key = Column(String, nullable=False, unique=True)


class RoleUser(Base):
    __tablename__ = 'role_user'

    id = Column(Integer, primary_key=True)
    user_id = Column(ForeignKey(AuthInfo.id), nullable=False)
    role_id = Column(ForeignKey(Role.id), nullable=False)
