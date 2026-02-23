"""
Post-Processing Tool: Konvertiert BA-07 Rohdaten → SP-01 Intel Feed Format
"""
import json
from typing import Any

def extract_competitor_intel(raw_vision_output: dict) -> dict:
    """
    Transformiert Gemini Vision Output → strukturierten Columna Intel Entry.
    Wird von SP-01 als Counter-Strike-Cluster Input verwendet.
    """
    return {
        "source": "ba_07_browser_architect",
        "url": raw_vision_output.get("url", ""),
        "pricing_intelligence": {
            "detected_prices": raw_vision_output.get("pricing", []),
            "pricing_model": raw_vision_output.get("pricing_model", "unknown"),
            "free_tier": raw_vision_output.get("has_free_tier", False),
        },
        "positioning": {
            "headline": raw_vision_output.get("title", ""),
            "value_props": raw_vision_output.get("value_props", []),
            "primary_cta": raw_vision_output.get("ctas", [{}])[0] if raw_vision_output.get("ctas") else {},
        },
        "tech_signals": raw_vision_output.get("tech_stack_hints", []),
        "visual_quality_score": raw_vision_output.get("visual_quality", 0),
        "counter_strike_recommendations": [],  # SP-01 füllt dieses Feld
    }
