from google.cloud import firestore
from datetime import datetime, timezone
import uuid
from typing import Any, Literal, Optional
import os

# Initialize Firestore Client
db = firestore.Client()

OutputType = Literal["copy", "image_prompt", "strategy", "audit", "video", "analysis", "blog_post"]

class BaseAgent:
    """
    Alle Agenten erben von hier.
    Die write_output-Methode ist die einzige Wahrheitsquelle für Output-Routing.
    """
    agent_id: str = "unknown"
    agent_name: str = "Unknown Agent"

    def __init__(self, run_id: str, campaign_id: Optional[str] = None):
        self.run_id = run_id
        self.campaign_id = campaign_id
        self.db = db

    async def write_output(
        self,
        output_type: OutputType,
        payload: dict[str, Any],
        task_id: Optional[str] = None,
        senate_required: bool = False,
    ) -> str:
        """
        Schreibt Agent-Output nach Firestore /agent_outputs/{id}.
        Gibt die output_id zurück.
        Wenn senate_required=True, wird zusätzlich /senate_queue/{id} geschrieben.
        """
        output_id = str(uuid.uuid4())
        now = datetime.now(timezone.utc)
        
        output_doc = {
            "output_id": output_id,
            "run_id": self.run_id,
            "campaign_id": self.campaign_id,
            "task_id": task_id,
            "agent_id": self.agent_id,
            "agent_name": self.agent_name,
            "type": output_type,
            "payload": payload,
            "created_at": now,
            "senate_status": "pending" if senate_required else "approved",
            "visible_in_ui": not senate_required,  # UI zeigt erst nach Senate-Approval
        }

        # Primäres Output-Dokument
        await self.db.collection("agent_outputs").document(output_id).set(output_doc)

        # Swarm Run Task-Status aktualisieren
        if task_id and self.run_id:
            run_ref = self.db.collection("swarm_runs").document(self.run_id)
            # Use dot notation for nested field update in Firestore
            await run_ref.update({
                f"tasks.{task_id}.status": "completed",
                f"tasks.{task_id}.output_id": output_id,
                f"tasks.{task_id}.completed_at": now,
            })

        # Senate Queue eintragen wenn nötig
        if senate_required:
            await self.db.collection("senate_queue").document(output_id).set({
                **output_doc,
                "senate_status": "pending",
                "review_required": True,
            })

        # Campaign Timeline updaten
        if self.campaign_id:
            campaign_ref = self.db.collection("campaigns").document(self.campaign_id)
            await campaign_ref.update({
                "timeline": firestore.ArrayUnion([{
                    "output_id": output_id,
                    "type": output_type,
                    "agent_id": self.agent_id,
                    "created_at": now,
                }])
            })

        # WebSocket Event feuern (für Echtzeit-UI-Updates ohne Page Reload)
        await self._emit_websocket_event("agent_output", {
            "output_id": output_id,
            "type": output_type,
            "agent_id": self.agent_id,
            "run_id": self.run_id,
            "campaign_id": self.campaign_id,
        })

        return output_id

    async def _emit_websocket_event(self, event_type: str, data: dict):
        """Sendet Event an alle verbundenen WebSocket-Clients."""
        # Note: In a real distributed system, this might go via Pub/Sub or a shared Redis
        # For now, we attempt to use the local ws_manager if in the same process, 
        # or we could rely on Firestore onSnapshot on the frontend.
        # But the Handbook suggests a broadcast.
        try:
            from core.ws_manager import ws_manager
            await ws_manager.broadcast({
                "event": event_type,
                "data": data,
                "timestamp": datetime.now(timezone.utc).isoformat(),
            })
        except ImportError:
            # If core.ws_manager is not available (e.g. running in a different container),
            # the frontend will still catch it via Firestore onSnapshot.
            pass

    async def update_status(self, status: str, meta: dict = {}):
        """Aktualisiert den Agent-Status in der Synergy Map."""
        await self.db.collection("agent_status").document(self.agent_id).set({
            "status": status,
            "agent_id": self.agent_id,
            "run_id": self.run_id,
            "updated_at": datetime.now(timezone.utc),
            **meta,
        }, merge=True)
        
        await self._emit_websocket_event("agent_status", {
            "agent_id": self.agent_id,
            "status": status,
        })
