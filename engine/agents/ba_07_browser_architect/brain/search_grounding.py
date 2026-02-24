"""
ba07 Google Search Grounding
Ermöglicht ba07 während der Browser-Session zu googlen via Sub-Agent.
"""
from google.adk import Agent

try:
    from google.adk.tools import google_search
except ImportError:
    google_search = None

try:
    from google.adk.tools import AgentTool
except ImportError:
    from google.adk.tools.agent_tool import AgentTool

# Search Tools
search_tools = []
if google_search:
    search_tools.append(google_search)

search_agent = Agent(
    model="gemini-2.0-flash", 
    name="ba07_search_enricher",
    description="Enriches ba07 findings with Google Search context",
    instruction=(
        "Du bist ein Search-Enricher für ba07. "
        "Wenn ba07 einen Competitor analysiert, lieferst du: "
        "Funding-Status, Marktposition, Tech-Stack-Bestätigung. "
        "Antworte immer als strukturiertes JSON."
    ),
    tools=search_tools,
)

search_enricher_tool = AgentTool(agent=search_agent)
