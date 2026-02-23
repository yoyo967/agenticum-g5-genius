"""
BA-07 Browser Architect — Agenticum G5 SwarmProtocol
======================================================
Rolle: Autonomer Browser-Agent für Competitor Intelligence
Modell: gemini-2.5-computer-use-preview-10-2025
Stack: Google ADK v1.17+ ComputerUseToolset + PlaywrightComputer
Hackathon: Gemini Live Agent Challenge — UI Navigator Kategorie
"""
import os
from google.adk import Agent
from google.adk.tools.computer_use.computer_use_toolset import ComputerUseToolset
from .playwright import PlaywrightComputer

# Screen-Dimensionen aus ENV (Fallback auf Hackathon-Standard 1280x936)
SCREEN_W = int(os.getenv("BA07_SCREEN_WIDTH", "1280"))
SCREEN_H = int(os.getenv("BA07_SCREEN_HEIGHT", "936"))
HEADLESS = os.getenv("BA07_HEADLESS", "true").lower() == "true"

root_agent = Agent(
    model="gemini-2.5-computer-use-preview-10-2025",
    name="ba_07_browser_architect",
    description=(
        "BA-07 ist der Browser-Architect im Agenticum G5 SwarmProtocol. "
        "Er navigiert Competitor-URLs autonom, analysiert Screenshots via "
        "Gemini Vision und extrahiert strukturierte Intel-Daten für SP-01 "
        "Columna Competitive Intelligence. "
        "Er respektiert alle DSGVO-Constraints aus RA-01 Senate Approvals."
    ),
    instruction=(
        "Du bist BA-07 Browser Architect im Agenticum G5 SwarmProtocol.\n\n"
        "DEINE MISSION:\n"
        "- Navigiere die übergebene Ziel-URL\n"
        "- Analysiere visuelle Elemente: Pricing, CTAs, Layout, Value Props\n"
        "- Extrahiere strukturierte Daten als JSON für SP-01\n"
        "- Scrolle vollständig durch die Seite (Above + Below Fold)\n"
        "- Mache Screenshots von kritischen Sections\n\n"
        "CONSTRAINTS (RA-01 Senate):\n"
        "- Kein Login, keine Auth-Bypässe\n"
        "- Keine persönlichen Daten extrahieren (DSGVO)\n"
        "- Nur öffentlich zugängliche URLs\n"
        "- Max. 3 Minuten pro Session\n\n"
        "OUTPUT FORMAT:\n"
        "Gib alle Erkenntnisse als strukturiertes JSON zurück:\n"
        "{ 'url', 'title', 'meta_description', 'pricing', "
        "'ctas', 'value_props', 'tech_stack_hints', 'visual_insights' }\n\n"
        "Du arbeitest im EU-first Kontext (Cloud Run europe-west1)."
    ),
    tools=[
        ComputerUseToolset(
            computer=PlaywrightComputer(
                screen_size=(SCREEN_W, SCREEN_H),
                headless=HEADLESS
            )
        )
    ],
)
