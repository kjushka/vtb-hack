from typing import Any


class Wallet:
    id: int = None
    private_key: str = None
    public_key: str = None
    user_id: int = None

    def __init__(self, id: int, private_key: str, public_key: str, user_id: int) -> None:
        self.id = id
        self.private_key = private_key
        self.public_key = public_key
        self.user_id = user_id

    @classmethod
    def from_orm(cls, orm: Any) -> 'Wallet':
        return cls(id=orm.id, private_key=orm.private_key, public_key=orm.public_key, user_id=orm.user_id)
