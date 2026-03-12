from google.cloud import firestore
from datetime import datetime, timezone
import uuid

db = firestore.Client()

AGENT_CONNECTIONS = {
    "sn00": ["sp01", "cc06", "da03", "ra01", "ba07", "ve01"],
    "sp01": ["cc06", "da03"],
    "cc06": ["ra01"],
    "da03": ["ra01"],
    "ba07": ["sp01"],
}

async def log_data_flow(from_agent: str, to_agent: str, flow_type: str, description: str):
    """Schreibt einen Data-Flow-Eintrag für die Synergy Map."""
    flow_id = str(uuid.uuid4())
    await db.collection("agent_data_flows").document(flow_id).set({
        "flow_id": flow_id,
        "from_agent": from_agent,
        "to_agent": to_agent,
        "type": flow_type,
        "description": description,
        "created_at": datetime.now(timezone.utc),
    })
