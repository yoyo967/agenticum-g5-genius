import vertexai
from vertexai.generative_models import GenerativeModel, Tool, grounding
from google.cloud import firestore
import uuid
from datetime import datetime, timezone

from engine.config import PROJECT_ID, REGION
import vertexai

vertexai.init(project=PROJECT_ID, location=REGION)
db = firestore.Client(project=PROJECT_ID)

# Das Tool für Live Google Search Grounding aktivieren
grounding_tool = Tool.from_google_search_retrieval(
    google_search_retrieval=grounding.GoogleSearchRetrieval()
)

# Gemini 1.5 Pro als Core Reasoning Engine
model = GenerativeModel("gemini-1.5-pro-002")

async def execute_grounded_directive(directive: str, context_tags: list) -> dict:
    """
    Führt einen Agent-Task mit Search Grounding aus und speichert 
    die gesamte Provenienz in Firestore (Perfect Twin).
    """
    run_id = f"run_{uuid.uuid4().hex[:12]}"
    timestamp = datetime.now(timezone.utc)
    
    system_instruction = """
    Du bist der Grounding & Entity Arbiter des AGENTICUM G5 OS.
    Nutze ZWINGEND die Google Search Funktion, um alle Fakten zu verifizieren.
    Liefere strukturierte, hochpräzise Pillar-Content-Bausteine für B2B SaaS.
    """
    
    # Model Call MIT Grounding Tool
    response = model.generate_content(
        f"{system_instruction}\n\nDIREKTIVE:\n{directive}",
        tools=[grounding_tool],
        generation_config={"temperature": 0.2}
    )
    
    # Extrahieren der Grounding Metadaten
    search_queries = []
    grounding_chunks = []
    if response.candidates and response.candidates[0].grounding_metadata:
        metadata = response.candidates[0].grounding_metadata
        if metadata.web_search_queries:
            search_queries = list(metadata.web_search_queries)
        if hasattr(metadata, 'grounding_chunks'):
             grounding_chunks = [chunk.web.uri for chunk in metadata.grounding_chunks if hasattr(chunk, 'web')]

    result_text = response.text

    # PERFECT TWIN: Speichere den exakten State in Firestore
    twin_ref = db.collection("perfect_twin_logs").document(run_id)
    twin_ref.set({
        "run_id": run_id,
        "timestamp": timestamp,
        "type": "grounding",
        "agent": "GB-01 Grounding Arbiter",
        "severity": "info",
        "message": f"Faktencheck & Grounding abgeschlossen für: {directive[:50]}...",
        "directive": directive,
        "tags": context_tags,
        "output": result_text,
        "telemetry": {
            "search_queries_used": search_queries,
            "grounding_sources": grounding_chunks,
            "model_version": "gemini-1.5-pro-002"
        },
        "senate_approved": False 
    })
    
    return {
        "run_id": run_id,
        "content": result_text,
        "sources": grounding_chunks
    }
