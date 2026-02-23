"""
BA-07 Knowledge Base — Vertex AI Search Grounding
Verankert BA-07 in Agenticum-spezifischem Wissen.
"""
import os
from google.adk.tools.retrieval.vertex_ai_search_tool import VertexAiSearchTool

DATASTORES = {
    "dsgvo_playbook": VertexAiSearchTool(
        data_store_id=os.getenv(
            "VERTEX_DATASTORE_DSGVO",
            "projects/697051612685/locations/eu/collections/default_collection/dataStores/dsgvo-playbook"
        )
    ),
    "competitor_archive": VertexAiSearchTool(
        data_store_id=os.getenv(
            "VERTEX_DATASTORE_COMPETITORS",
            "projects/697051612685/locations/eu/collections/default_collection/dataStores/competitor-archive"
        )
    ),
}

def get_knowledge_tools() -> list:
    return list(DATASTORES.values())
