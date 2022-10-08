from yaml import load, SafeLoader


class Settings:
    host: str
    port: str
    vtb_public_key: str
    vtb_private_key: str
    pg_host: str
    pg_port: str
    pg_user: str
    pg_password: str
    pg_database: str
    base_url: str = 'https://hackathon.lsp.team/hk'

    def __init__(self):
        with open('settings.yaml', 'r') as f:
            config = load(f, SafeLoader)
        self.host = config['host']
        self.port = config['port']
        self.vtb_private_key = config['vtb_private_key']
        self.vtb_public_key = config['vtb_public_key']
        self.pg_host = config['pg_host']
        self.pg_port = config['pg_port']
        self.pg_user = config['pg_user']
        self.pg_password = config['pg_password']
        self.pg_database = config['pg_database']
