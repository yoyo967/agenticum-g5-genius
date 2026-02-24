"""
AGENTICUM G5 — SwarmBus Entity Schemas
=======================================
Jeder Agent schreibt NUR sein typisiertes Entity in session.state.
Das ist die Single-Source-of-Truth für den gesamten Swarm.
"""
from pydantic import BaseModel, Field
from typing import Optional, List, Dict, Any
from datetime import datetime
from enum import Enum


class WorkflowPhase(str, Enum):
    INIT       = "init"
    PARALLEL   = "parallel"
    SENATE     = "senate"
    OUTPUT     = "output"
    COMPLETE   = "complete"
    FAILED     = "failed"


# sn00: SWARM BRIEF
class SwarmBriefEntity(BaseModel):
    session_id:          str
    user_intent:         str
    intent_category:     str
    target_brand:        Optional[str] = None
    target_url:          Optional[str] = None
    target_keywords:     List[str] = []
    workflow_depth:      str = "standard"
    activated_agents:    List[str] = []
    timestamp:           str = Field(default_factory=lambda: datetime.utcnow().isoformat() + "Z")


# sp01: COMPETITOR INTEL
class PricingTier(BaseModel):
    name:       str
    price:      Optional[float] = None
    currency:   str = "EUR"
    cycle:      str = "monthly"
    features:   List[str] = []
    confidence: float = 0.0


class CompetitorProfile(BaseModel):
    url:              str
    threat_score:     int = 0
    pricing:          List[PricingTier] = []
    value_props:      List[str] = []
    tech_stack:       List[str] = []
    ba07_enriched:    bool = False


class CompetitorIntelEntity(BaseModel):
    competitors:                 List[CompetitorProfile] = []
    counter_strike_angle:        str = ""
    confidence_avg:              float = 0.0
    grounding_sources:           List[str] = []
    timestamp:                   str = Field(default_factory=lambda: datetime.utcnow().isoformat() + "Z")


# cc06: CONTENT OUTPUT
class ContentBlock(BaseModel):
    block_type:    str
    content:       str
    word_count:    int = 0
    seo_score:     float = 0.0


class ContentOutputEntity(BaseModel):
    pillar_title:        str
    blocks:              List[ContentBlock] = []
    meta_title:          str = ""
    meta_description:    str = ""
    timestamp:           str = Field(default_factory=lambda: datetime.utcnow().isoformat() + "Z")


# da03: VISUAL OUTPUT
class VisualAsset(BaseModel):
    asset_id:       str
    public_url:     str
    prompt_used:    str


class VisualOutputEntity(BaseModel):
    assets:             List[VisualAsset] = []
    brand_consistency:  float = 0.0
    timestamp:          str = Field(default_factory=lambda: datetime.utcnow().isoformat() + "Z")


# ra01: SENATE VERDICT
class AuditCheck(BaseModel):
    category:    str
    passed:      bool
    score:       float = 0.0
    details:     str = ""


class SenateVerdictEntity(BaseModel):
    approved:           bool
    overall_score:      float = 0.0
    checks:             List[AuditCheck] = []
    timestamp:          str = Field(default_factory=lambda: datetime.utcnow().isoformat() + "Z")


# ba07: BROWSER INTEL
class BrowserIntelEntity(BaseModel):
    session_id:          str
    pages_visited:       List[str] = []
    competitor_profiles: List[CompetitorProfile] = []
    screenshot_urls:     List[str] = []
    dsgvo_compliant:     bool = True
    confidence_avg:      float = 0.0
    timestamp:           str = Field(default_factory=lambda: datetime.utcnow().isoformat() + "Z")


# MASTER STATE
class SwarmBusState(BaseModel):
    swarm_session_id:   str
    user_intent:        str
    workflow_phase:     WorkflowPhase = WorkflowPhase.INIT
    sn00_brief:         Optional[SwarmBriefEntity] = None
    sp01_intel:         Optional[CompetitorIntelEntity] = None
    cc06_copy:          Optional[ContentOutputEntity] = None
    da03_visual:        Optional[VisualOutputEntity] = None
    ra01_verdict:       Optional[SenateVerdictEntity] = None
    ba07_browser_intel: Optional[BrowserIntelEntity] = None
    timestamp_start:    str = Field(default_factory=lambda: datetime.utcnow().isoformat() + "Z")
