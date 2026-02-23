"""
BA-07 Google Search Grounding
Ermöglicht BA-07 während der Browser-Session zu googlen via Sub-Agent.
"""
from google.adk.tools import google_search
from google.adk import Agent
from google.adk.tools.agent_tool import AgentTool

search_agent = Agent(
    model="gemini-2.0-flash", 
    name="ba07_search_enricher",
    description="Enriches BA-07 findings with Google Search context",
    instruction=(
        "Du bist ein Search-Enricher für BA-07. "
        "Wenn BA-07 einen Competitor analysiert, lieferst du: "
        "Funding-Status, Marktposition, Tech-Stack-Bestätigung. "
        "Antworte immer als strukturiertes JSON."
    ),
    tools=[google_search],
)

search_enricher_tool = AgentTool(agent=search_agent)
