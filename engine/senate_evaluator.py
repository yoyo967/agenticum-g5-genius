from pydantic import BaseModel
from vertexai.generative_models import GenerativeModel, GenerationConfig
import json

class SenateEvaluation(BaseModel):
    compliance_score: int
    seo_excellence_score: int
    veto_triggered: bool
    feedback: str
    action_required: str

senate_model = GenerativeModel("gemini-1.5-pro-002")

from engine.config import PROJECT_ID, REGION
import vertexai

vertexai.init(project=PROJECT_ID, location=REGION)
db = firestore.Client(project=PROJECT_ID)

async def evaluate_content_block(run_id: str, content: str) -> dict:
    """
    Der algorithmische Senat prüft den Output des Grounding Arbiters.
    Gibt ein striktes JSON-Schema zurück.
    """
    
    senate_prompt = f"""
    Du bist der 'Security Senate' von AGENTICUM G5. 
    Analysiere diesen Content-Block streng nach unseren EU-first, Maximum Excellence Standards.
    Wenn SEO-Struktur (H2/H3), Entity-Dichte oder Fakten fehlen, lege ein VETO ein.
    
    CONTENT ZU PRÜFEN:
    {content}
    """
    
    # Erzwinge strukturierten JSON-Output
    response = senate_model.generate_content(
        senate_prompt,
        generation_config=GenerationConfig(
            temperature=0.0,
            response_mime_type="application/json",
            response_schema={
                "type": "OBJECT",
                "properties": {
                    "compliance_score": {"type": "INTEGER", "description": "0-100"},
                    "seo_excellence_score": {"type": "INTEGER", "description": "0-100"},
                    "veto_triggered": {"type": "BOOLEAN"},
                    "feedback": {"type": "STRING", "description": "Genaue Kritik falls Veto"},
                    "action_required": {"type": "STRING", "enum": ["PUBLISH", "REWRITE_REQUIRED", "DROP"]}
                },
                "required": ["compliance_score", "seo_excellence_score", "veto_triggered", "feedback", "action_required"]
            }
        )
    )
    
    evaluation = json.loads(response.text)
    
    # PERFECT TWIN UPDATE
    db.collection("perfect_twin_logs").document(run_id).update({
        "senate_evaluation": evaluation,
        "senate_approved": not evaluation["veto_triggered"]
    })
    
    return evaluation
