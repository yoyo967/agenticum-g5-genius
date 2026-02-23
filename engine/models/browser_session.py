"""
Pydantic-Modelle für BA-07 Browser Sessions
"""
from pydantic import BaseModel, Field
from typing import Optional, List, Any
from datetime import datetime

class BrowserActionRequest(BaseModel):
    """Request-Schema für POST /browser-action"""
    url: str = Field(..., description="Ziel-URL für Browser-Agent")
    task: str = Field(..., description="Intent z.B. 'Extract pricing table'")
    dsgvo_scope: bool = Field(
        True,
        description="Wenn True: RA-01 Senate Pre-Check wird ausgelöst"
    )
    triggered_by: str = Field(
        "sn_00",
        description="Aufrufender Swarm-Node (für Audit Trail)"
    )
    session_id: Optional[str] = Field(
        None,
        description="Optional: vorgegebene Session-ID für Tracing"
    )

class BrowserActionResponse(BaseModel):
    """Response-Schema für POST /browser-action"""
    session_id: str
    status: str  # "initiated" | "completed" | "failed" | "blocked_by_senate"
    target_url: str
    task_intent: str
    gemini_vision_output: Optional[dict] = None
    sp01_intel_feed: Optional[dict] = None
    ra01_approval: bool
    dsgvo_compliant: bool
    error: Optional[str] = None
    cloud_run_instance: str = "europe-west1"
    timestamp: str = Field(
        default_factory=lambda: datetime.utcnow().isoformat() + "Z"
    )

class BrowserSessionFirestore(BaseModel):
    """Firestore-Dokument-Schema: Collection 'browser_sessions'"""
    session_id: str
    triggered_by: str
    target_url: str
    task_intent: str
    screenshots: List[str] = []      # GCS URLs: gs://agenticum-screenshots/...
    gemini_vision_output: dict = {}
    sp01_intel_feed: dict = {}
    ra01_approval: bool = False
    dsgvo_compliant: bool = False
    timestamp: str
    cloud_run_instance: str = "europe-west1"
    duration_ms: Optional[int] = None
    error: Optional[str] = None
