from yaml import load, SafeLoader


class Settings:
    host: str
    port: str
    pg_host: str
    pg_port: str
    pg_user: str
    pg_password: str
    pg_database: str

    def __init__(self):
        with open('settings.yaml', 'r') as f:
            config = load(f, SafeLoader)
        self.host = config['host']
        self.port = config['port']
        self.pg_host = config['pg_host']
        self.pg_port = config['pg_port']
        self.pg_user = config['pg_user']
        self.pg_password = config['pg_password']
        self.pg_database = config['pg_database']
