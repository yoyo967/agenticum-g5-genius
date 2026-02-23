"""
Firestore Service — browser_sessions Collection für BA-07
"""
import os
from google.cloud import firestore
from engine.models.browser_session import BrowserSessionFirestore

db = firestore.AsyncClient(
    project=os.getenv("GOOGLE_CLOUD_PROJECT", "agenticum-g5"),
    database=os.getenv("FIRESTORE_DATABASE", "agenticum-g5-db")
)

async def save_browser_session(session: BrowserSessionFirestore) -> str:
    """
    Persistiert BA-07 Session in Firestore.
    Collection: browser_sessions
    Document ID: session.session_id
    """
    doc_ref = db.collection("browser_sessions").document(session.session_id)
    await doc_ref.set(session.model_dump())
    return session.session_id

async def get_browser_session(session_id: str) -> dict:
    """Lädt eine BA-07 Session aus Firestore."""
    doc_ref = db.collection("browser_sessions").document(session_id)
    doc = await doc_ref.get()
    return doc.to_dict() if doc.exists else {}

async def get_latest_browser_sessions(limit: int = 10) -> list:
    """Gibt die letzten N BA-07 Sessions für SP-01 Intel Feed zurück."""
    query = (
        db.collection("browser_sessions")
        .order_by("timestamp", direction=firestore.Query.DESCENDING)
        .limit(limit)
    )
    docs = await query.get()
    return [doc.to_dict() for doc in docs]
