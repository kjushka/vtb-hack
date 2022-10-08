"""
Unified request manager
"""

from typing import Dict, Any

from aiohttp import ClientSession
from aiohttp.typedefs import StrOrURL


class RequestManager:
    def __init__(self) -> None:
        """
        Connection object with methods to communicate with web api
        """
        self.connection = None

    async def connect(self) -> None:
        """
        Create session on application startup
        """
        self.connection = ClientSession()

    async def close(self):
        """
        Closing connection
        """
        await self.connection.close()

    async def post(self, url: StrOrURL, **kwargs) -> Dict[str, Any]:
        """
        Send post request and return json data

        :param url: url of service to send request
        :param kwargs: aiohttp post kwargs
        :return: json response
        """
        async with self.connection.post(url, **kwargs) as response:
            return await response.json()

    async def get(self, url: StrOrURL, **kwargs) -> Dict[str, Any]:
        """
        Send post request and return json data

        :param url: url of service to send request
        :param kwargs: aiohttp post kwargs
        :return: json response
        """
        async with self.connection.get(url, **kwargs) as response:
            return await response.json()


request_manager = RequestManager()
