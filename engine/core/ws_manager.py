from fastapi import WebSocket
from typing import Set
import json
import asyncio

class WebSocketManager:
    """
    Singleton WebSocket-Manager.
    Alle aktiven Connections werden hier verwaltet.
    Events werden an alle Clients gebroadcastet.
    """
    def __init__(self):
        self.active_connections: Set[WebSocket] = set()

    async def connect(self, websocket: WebSocket):
        await websocket.accept()
        self.active_connections.add(websocket)

    def disconnect(self, websocket: WebSocket):
        self.active_connections.discard(websocket)

    async def broadcast(self, message: dict):
        """Sendet JSON-Message an alle verbundenen Clients."""
        if not self.active_connections:
            return
        
        # Use a custom encoder if needed for datetime objects
        class DateTimeEncoder(json.JSONEncoder):
            def default(self, obj):
                if hasattr(obj, 'isoformat'):
                    return obj.isoformat()
                return super().default(obj)

        payload = json.dumps(message, cls=DateTimeEncoder)
        dead = set()
        for connection in self.active_connections:
            try:
                await connection.send_text(payload)
            except Exception:
                dead.add(connection)
        
        self.active_connections -= dead

    async def send_to(self, websocket: WebSocket, message: dict):
        class DateTimeEncoder(json.JSONEncoder):
            def default(self, obj):
                if hasattr(obj, 'isoformat'):
                    return obj.isoformat()
                return super().default(obj)
        await websocket.send_text(json.dumps(message, cls=DateTimeEncoder))

ws_manager = WebSocketManager()
