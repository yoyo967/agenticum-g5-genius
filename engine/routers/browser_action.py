"""
BA-07 Browser Action Router
FastAPI Endpunkt: POST /browser-action
Integriert BA-07 Browser Architect in G5 Swarm
"""
import os
import uuid
import asyncio
from datetime import datetime
from fastapi import APIRouter, HTTPException, BackgroundTasks
from google.adk.runners import Runner
from google.adk.sessions import InMemorySessionService
from google.genai.types import Content, Part

from engine.models.browser_session import (
    BrowserActionRequest,
    BrowserActionResponse,
    BrowserSessionFirestore
)
import httpx
from engine.agents.ba_07_browser_architect import root_agent as ba07_agent
from engine.services.firestore_service import save_browser_session

router = APIRouter(prefix="/browser-action", tags=["BA-07 Browser Architect"])

# ADK Runner + Session Service (Singleton pro Instanz)
session_service = InMemorySessionService()

runner = Runner(
    agent=ba07_agent,
    app_name="agenticum_g5",
    session_service=session_service
)

@router.post("/", response_model=BrowserActionResponse)
async def launch_browser_action(
    request: BrowserActionRequest,
    background_tasks: BackgroundTasks
):
    """
    Startet BA-07 Browser-Agent für eine Competitor-URL.
    
    Flow:
    1. RA-01 Senate DSGVO Pre-Check (wenn dsgvo_scope=True)
    2. BA-07 Agent via ADK Runner starten
    3. Gemini Vision Output extrahieren
    4. SP-01 Intel Feed generieren
    5. Firestore browser_sessions persistieren
    """
    session_id = request.session_id or f"ba07_{uuid.uuid4().hex[:12]}"
    
    # --- DSGVO Pre-Check via RA-01 Senate ---
    if request.dsgvo_scope:
        dsgvo_ok = await _ra01_senate_precheck(request.url)
        if not dsgvo_ok:
            return BrowserActionResponse(
                session_id=session_id,
                status="blocked_by_senate",
                target_url=request.url,
                task_intent=request.task,
                ra01_approval=False,
                dsgvo_compliant=False,
                error="RA-01 Senate: URL nicht DSGVO-konform oder gesperrt",
                timestamp=datetime.utcnow().isoformat() + "Z"
            )

    # --- ADK Session erstellen ---
    session = await session_service.create_session(
        app_name="agenticum_g5",
        user_id="swarm_internal",
        session_id=session_id
    )

    # --- BA-07 Task formulieren ---
    task_prompt = (
        f"Navigiere zu: {request.url}\n\n"
        f"Aufgabe: {request.task}\n\n"
        f"Extrahiere alle relevanten Daten als strukturiertes JSON. "
        f"Scrolle durch die gesamte Seite und analysiere alle Sections."
    )

    user_message = Content(
        role="user",
        parts=[Part(text=task_prompt)]
    )

    # --- ADK Runner ausführen ---
    vision_output = {}
    try:
        async for event in runner.run_async(
            user_id="swarm_internal",
            session_id=session_id,
            new_message=user_message
        ):
            # --- REAL-TIME STREAMING BRIDGE ---
            # Push screenshots to Node.js EventFabric via bridge endpoint
            if hasattr(event, 'screenshot') and event.screenshot:
                try:
                    import base64
                    encoded = base64.b64encode(event.screenshot).decode('utf-8')
                    backend_url = os.getenv("BACKEND_URL", "https://agenticum-backend-697051612685.europe-west1.run.app")
                    async with httpx.AsyncClient() as client:
                        await client.post(f"{backend_url}/api/bridge/stream", json={
                            "sessionId": session_id,
                            "agentId": "ba-07",
                            "type": "screenshot",
                            "data": encoded
                        })
                except Exception as stream_err:
                    print(f"Streaming error: {stream_err}")

            if event.is_final_response():
                raw_text = event.content.parts[0].text if event.content.parts else "{}"
                try:
                    import json
                    vision_output = json.loads(raw_text)
                except json.JSONDecodeError:
                    vision_output = {"raw_output": raw_text}

    except Exception as e:
        return BrowserActionResponse(
            session_id=session_id,
            status="failed",
            target_url=request.url,
            task_intent=request.task,
            ra01_approval=True,
            dsgvo_compliant=True,
            error=f"BA-07 Agent Error: {str(e)}",
            timestamp=datetime.utcnow().isoformat() + "Z"
        )

    # --- SP-01 Intel Feed generieren ---
    from engine.agents.ba_07_browser_architect.tools.intel_extractor import extract_competitor_intel
    sp01_feed = extract_competitor_intel(vision_output)

    # --- Firestore persistieren (async background) ---
    session_doc = BrowserSessionFirestore(
        session_id=session_id,
        triggered_by=request.triggered_by,
        target_url=request.url,
        task_intent=request.task,
        gemini_vision_output=vision_output,
        sp01_intel_feed=sp01_feed,
        ra01_approval=True,
        dsgvo_compliant=True,
        timestamp=datetime.utcnow().isoformat() + "Z",
        cloud_run_instance="europe-west1"
    )
    background_tasks.add_task(save_browser_session, session_doc)

    return BrowserActionResponse(
        session_id=session_id,
        status="completed",
        target_url=request.url,
        task_intent=request.task,
        gemini_vision_output=vision_output,
        sp01_intel_feed=sp01_feed,
        ra01_approval=True,
        dsgvo_compliant=True,
        timestamp=datetime.utcnow().isoformat() + "Z"
    )


async def _ra01_senate_precheck(url: str) -> bool:
    """
    Vereinfachter DSGVO-Precheck — URL-Blocklist + Domain-Validierung.
    In Production: HTTP call an RA-01 Senate Microservice.
    """
    BLOCKED_DOMAINS = [
        "facebook.com", "instagram.com",   # Social = personenbezogene Daten
        "linkedin.com/in/",                 # Persönliche Profile
        "bank", "health", "medical"         # Sensitive Sektoren
    ]
    url_lower = url.lower()
    for blocked in BLOCKED_DOMAINS:
        if blocked in url_lower:
            return False
    return True
