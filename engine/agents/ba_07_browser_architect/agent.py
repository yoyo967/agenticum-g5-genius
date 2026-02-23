"""
BA-07 Browser Architect — FULL BRAIN VERSION
"""
import os
from google.adk import Agent
from google.adk.tools.computer_use.computer_use_toolset import ComputerUseToolset
from google.adk.tools import built_in_code_execution
from google.adk.tools.agent_tool import AgentTool
from google.adk.tools.retrieval.vertex_ai_search_tool import VertexAiSearchTool

from .playwright import PlaywrightComputer
from .brain.master_instruction import BA07_MASTER_INSTRUCTION
from .brain.search_grounding import search_enricher_tool

SCREEN_W = int(os.getenv("BA07_SCREEN_WIDTH", "1280"))
SCREEN_H = int(os.getenv("BA07_SCREEN_HEIGHT", "936"))
HEADLESS = os.getenv("BA07_HEADLESS", "true").lower() == "true"

knowledge_agent = Agent(
    model="gemini-2.0-flash",
    name="ba07_knowledge_retriever",
    description="Retrieves grounded knowledge from BA-07 internal documents",
    instruction=(
        "Durchsuche die Knowledge Base nach relevanten Informationen. "
        "Priorisiere: DSGVO-Regeln, Competitor-Archiv, UX-Patterns, Agenticum-Produkt."
    ),
    tools=[
        VertexAiSearchTool(
            data_store_id=os.getenv(
                "VERTEX_DATASTORE_DSGVO",
                "projects/697051612685/locations/eu/collections/default_collection/dataStores/dsgvo-playbook"
            )
        ),
        VertexAiSearchTool(
            data_store_id=os.getenv(
                "VERTEX_DATASTORE_COMPETITORS",
                "projects/697051612685/locations/eu/collections/default_collection/dataStores/competitor-archive"
            )
        ),
    ],
)

root_agent = Agent(
    model="gemini-2.0-flash-exp", # Updated for computer use compatibility
    name="ba_07_browser_architect",
    description=(
        "BA-07 ist der hyperintelligente Browser Architect im Agenticum G5 SwarmProtocol. "
        "Er navigiert, analysiert, kommuniziert, interagiert und erledigt Aufgaben."
    ),
    instruction=BA07_MASTER_INSTRUCTION,
    tools=[
        ComputerUseToolset(
            computer=PlaywrightComputer(
                screen_size=(SCREEN_W, SCREEN_H),
                headless=HEADLESS
            )
        ),
        built_in_code_execution,
        search_enricher_tool,
        AgentTool(agent=knowledge_agent),
    ],
)
