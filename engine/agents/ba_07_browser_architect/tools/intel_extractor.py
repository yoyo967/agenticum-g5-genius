"""
Post-Processing Tool: Konvertiert BA-07 Rohdaten → SP-01 Intel Feed Format
"""
import json
from typing import Any

from engine.swarm.entities import BrowserIntelEntity, CompetitorProfile, PricingTier

def extract_competitor_intel(raw_vision_output: dict) -> BrowserIntelEntity:
    """
    Transformiert Gemini Vision Output → SwarmBus-konformes Intel.
    """
    pricing_data = raw_vision_output.get("pricing", [])
    tiers = []
    
    if isinstance(pricing_data, list):
        for p in pricing_data:
            tiers.append(PricingTier(
                name=p.get("name", "Standard"),
                price=p.get("price"),
                currency=p.get("currency", "EUR"),
                features=p.get("features", [])
            ))

    profile = CompetitorProfile(
        url=raw_vision_output.get("url", ""),
        threat_score=raw_vision_output.get("threat_score", 50),
        pricing=tiers,
        value_props=raw_vision_output.get("value_props", []),
        tech_stack=raw_vision_output.get("tech_stack_hints", []),
        ba07_enriched=True
    )

    return BrowserIntelEntity(
        session_id=raw_vision_output.get("session_id", "ba07_unknown"),
        pages_visited=[profile.url] if profile.url else [],
        competitor_profiles=[profile],
        raw_vision_output=raw_vision_output,
        confidence_avg=0.9
    )
