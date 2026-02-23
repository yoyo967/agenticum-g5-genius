import asyncio
from fastapi import APIRouter, HTTPException
from playwright.async_api import async_playwright
from bs4 import BeautifulSoup
import vertexai
from vertexai.language_models import TextEmbeddingModel
from google.cloud import firestore
from google.cloud.firestore_v1.vector import Vector

from engine.config import PROJECT_ID, REGION
import vertexai

_db = None
_embedding_model = None

def get_db():
    global _db
    if _db is None:
        from google.cloud import firestore
        _db = firestore.Client(project=PROJECT_ID)
    return _db

def get_embedding_model():
    global _embedding_model
    if _embedding_model is None:
        from vertexai.language_models import TextEmbeddingModel
        vertexai.init(project=PROJECT_ID, location=REGION)
        _embedding_model = TextEmbeddingModel.from_pretrained("text-embedding-004")
    return _embedding_model

router = APIRouter()

async def fetch_competitor_dom(url: str) -> str:
    """Lädt die Seite asynchron via Playwright (JS-Rendering Support) und blockiert Media."""
    async with async_playwright() as p:
        # Headless=True für Speed. Chromium ist der Goldstandard für Scraping.
        browser = await p.chromium.launch(headless=True)
        page = await browser.new_page()
        
        # Performance-Hack: Bilder und CSS blockieren, wir brauchen nur den Text/DOM
        await page.route("**/*", lambda route: route.abort() 
            if route.request.resource_type in ["image", "media", "font", "stylesheet"] 
            else route.continue_()
        )
        
        try:
            # Wait-until 'domcontentloaded' ist schneller als 'networkidle'
            await page.goto(url, wait_until="domcontentloaded", timeout=15000)
            html = await page.content()
            return html
        except Exception as e:
            raise HTTPException(status_code=400, detail=f"Scraping failed: {str(e)}")
        finally:
            await browser.close()

def extract_pillar_skeleton(html: str) -> dict:
    """Extrahiert die Core-SEO-Architektur mit BeautifulSoup."""
    soup = BeautifulSoup(html, 'html.parser')
    
    # H1 bis H3 Hierarchie extrahieren
    headings = []
    for tag in soup.find_all(['h1', 'h2', 'h3']):
        headings.append({"level": tag.name, "text": tag.get_text(strip=True)})
        
    # Body Text (für Embeddings)
    # Entferne Script/Style Tags vor dem Text-Extract
    for script in soup(["script", "style", "nav", "footer"]):
        script.decompose()
    
    main_text = soup.get_text(separator=' ', strip=True)
    
    # Optional: Finde ausgehende Links (Wen verlinken sie als Autorität?)
    outbound_links = [a['href'] for a in soup.find_all('a', href=True) if a['href'].startswith('http')]

    return {
        "headings": headings,
        "content_length": len(main_text),
        "raw_text": main_text[:8000], # Limit für das Embedding Modell
        "outbound_links": list(set(outbound_links))[:10]
    }

@router.post("/columna/decompile")
async def decompile_competitor(url: str, competitor_name: str, session_id: Optional[str] = None):
    """
    API Endpunkt: Zieht die Seite, berechnet Embeddings und speichert
    sie via SwarmBus für den gesamten Swarm.
    """
    run_id = session_id or f"columna_{int(time.time())}"
    
    # --- SWARM BUS INITIALIZATION ---
    from engine.swarm.swarm_bus import SwarmBus
    from engine.swarm.entities import CompetitorIntelEntity, CompetitorProfile
    from google.adk.sessions import Session
    from unittest.mock import MagicMock
    
    mock_session = Session(app_name="agenticum_g5", user_id="swarm_internal", session_id=run_id)
    mock_ctx = MagicMock()
    mock_ctx.session = mock_session
    bus = SwarmBus(mock_ctx)

    # 1. HTML via Playwright ziehen
    html_content = await fetch_competitor_dom(url)
    
    # 2. Skelett extrahieren
    skeleton = extract_pillar_skeleton(html_content)
    
    # 3. Vertex AI Embedding generieren
    model = get_embedding_model()
    embeddings = model.get_embeddings([skeleton["raw_text"]])
    vector_values = embeddings[0].values
    
    # 4. In SwarmBus schreiben
    profile = CompetitorProfile(
        url=url,
        threat_score=80, # Base threat for direct competitors
        value_props=skeleton.get("headings", []),
        tech_stack=skeleton.get("outbound_links", [])
    )
    
    bus.write_intel(CompetitorIntelEntity(
        competitors=[profile],
        counter_strike_angle="Analyze gaps in their SEO skeleton and H1-H3 hierarchy.",
        grounding_sources=[url]
    ))
    
    # Vector DB fallback
    db = get_db()
    db.collection("columna_intelligence").add({
        "url": url,
        "competitor": competitor_name,
        "embedding_field": Vector(vector_values),
        "run_id": run_id
    })

    await bus.persist()
    
    return {
        "status": "success",
        "message": f"Competitor '{competitor_name}' decompiled and synchronized to SwarmBus.",
        "run_id": run_id,
        "data_points_extracted": len(skeleton["headings"])
    }
