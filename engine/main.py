import os
from engine.config import PROJECT_ID, REGION
from fastapi import FastAPI
from engine.columna_decompiler import router as columna_router
from pydantic import BaseModel
from typing import List, Optional

# Lazy imports to ensure environment is set first
def get_grounding_arbiter():
    from engine.grounding_arbiter import execute_grounded_directive
    return execute_grounded_directive

def get_senate_evaluator():
    from engine.senate_evaluator import evaluate_content_block
    return evaluate_content_block

def get_counter_strike():
    from engine.counter_strike import check_competitor_overlap
    return check_competitor_overlap

app = FastAPI(title="AGENTICUM G5 Pillar Graph Engine")

app.include_router(columna_router, tags=["Columna Intelligence"])

from engine.senate_compliance_gate import router as senate_router
from engine.deployment_agent import router as deployment_router

app.include_router(senate_router, tags=["Security Senate"])
app.include_router(deployment_router, tags=["Deployment Agent"])

class PillarRequest(BaseModel):
    topic: str
    context_tags: Optional[List[str]] = []

class AuditRequest(BaseModel):
    run_id: str
    content: str

@app.post("/engine/grounding")
async def run_grounding(req: PillarRequest):
    arbiter = get_grounding_arbiter()
    return await arbiter(req.topic, req.context_tags)

@app.post("/engine/audit")
async def run_audit(req: AuditRequest):
    audit = get_senate_evaluator()
    return await audit(req.run_id, req.content)

@app.get("/engine/counter-strike")
async def run_counter_strike(topic: str):
    overlap = get_counter_strike()
    return {"overlap": overlap(topic)}

if __name__ == "__main__":
    import uvicorn
    port = int(os.environ.get("PORT", 8080))
    uvicorn.run(app, host="0.0.0.0", port=port)
