"""
AGENTICUM G5 — SwarmBus
========================
Zentraler Kommunikations-Layer für alle 6 Agenten.
"""
import json
import time
from datetime import datetime
from typing import Optional, Any
from google.adk.agents.invocation_context import InvocationContext
from google.cloud import firestore

from .entities import (
    SwarmBusState, SwarmBriefEntity, CompetitorIntelEntity,
    ContentOutputEntity, VisualOutputEntity, SenateVerdictEntity,
    BrowserIntelEntity, WorkflowPhase
)

_db = firestore.AsyncClient(project="online-marketing-manager")

class SwarmBus:
    def __init__(self, context: InvocationContext):
        self.ctx = context
        self.state = context.session.state
        if "swarm_session_id" not in self.state:
             self.state["swarm_session_id"] = f"swarm_{int(time.time())}"

    def _log_timeline(self, agent: str, action: str):
        if "agent_timeline" not in self.state:
            self.state["agent_timeline"] = []
        self.state["agent_timeline"].append({
            "agent": agent,
            "action": action,
            "timestamp": datetime.utcnow().isoformat() + "Z"
        })

    def write_brief(self, entity: SwarmBriefEntity):
        self.state["sn00.brief"] = entity.model_dump()
        self.state["workflow_phase"] = WorkflowPhase.PARALLEL
        self._log_timeline("sn_00", "Swarm Brief issued")

    def write_intel(self, entity: CompetitorIntelEntity):
        self.state["sp01.intel"] = entity.model_dump()
        self.state["signal.sp01_ready"] = True
        self._log_timeline("sp_01", "Competitor Intel analyzed")

    def write_browser_intel(self, entity: BrowserIntelEntity):
        self.state["ba07.browser_intel"] = entity.model_dump()
        self.state["signal.ba07_ready"] = True
        self._log_timeline("ba_07", "Live browser research completed")

    def write_copy(self, entity: ContentOutputEntity):
        self.state["cc06.copy"] = entity.model_dump()
        self.state["signal.cc06_ready"] = True
        self._log_timeline("cc_06", "Content created")

    def write_visual(self, entity: VisualOutputEntity):
        self.state["da03.visual"] = entity.model_dump()
        self.state["signal.da03_ready"] = True
        self._log_timeline("da_03", "Visual assets generated")

    def write_verdict(self, entity: SenateVerdictEntity):
        self.state["ra01.verdict"] = entity.model_dump()
        self.state["signal.senate_gate"] = entity.approved
        self._log_timeline("ra_01", f"Audit verdict: {'APPROVED' if entity.approved else 'REJECTED'}")

    async def persist(self):
        """Save the unified state to Firestore."""
        session_id = self.state.get("swarm_session_id")
        doc_ref = _db.collection("swarm_sessions").document(session_id)
        await doc_ref.set(self.state)
        print(f"SwarmBus: Persisted session {session_id}")

    def get_state(self) -> SwarmBusState:
        return SwarmBusState(**self.state)
