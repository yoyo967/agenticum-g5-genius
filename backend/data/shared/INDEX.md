# AGENTICUM G5 GENIUS — KNOWLEDGE BASE INDEX
## Complete Wissensdatenbank für Vertex AI Discovery Engine

**Version**: 1.0  
**Erstellt für**: Gemini Live Agent Challenge 2026  
**Projekt**: online-marketing-manager (GCP)  
**Upload-Ziel**: Vertex AI Discovery Engine / Search App

---

## VOLLSTÄNDIGE DATEISTRUKTUR

```
knowledge_base/
│
├── SN-00_ORCHESTRATOR/
│   └── SN00_SYSTEMS_THINKING.md
│       → Orchestration theory, Systems Thinking (Senge), OODA Loop, 
│         Project Management (CPM, Agile), communication architecture,
│         quality standards, AI coordination principles
│
├── SP-01_STRATEGIST/
│   ├── SP01_STRATEGY_FRAMEWORKS.md
│   │   → McKinsey 7S, Porter's Five Forces, Blue Ocean Strategy,
│   │     Jobs-to-Be-Done, Behavioral Economics (Kahneman), 8 core biases,
│   │     Price Psychology, HBR Brand Equity Model, Ehrenberg-Bass Laws,
│   │     Binet & Field 60/40 Rule, Competitive Intelligence,
│   │     RACE Framework, CAC/LTV, Global Market Data
│   │
│   └── SP01_CONSUMER_PSYCHOLOGY.md
│       → Brand Loyalty Ladder, NPS, Double Jeopardy Law,
│         B2B Buying Committee (6–10 stakeholders), Challenger Sale,
│         Hero's Journey in marketing, StoryBrand Framework,
│         Strategic Brief anatomy, KPI measurement stack
│
├── RA-01_MI-01_SENATE/
│   └── RA01_ETHICS_COMPLIANCE.md
│       → FTC Four-Part Test, FTC Endorsement Guidelines,
│         FTC Green Claims Guidelines, 10 Dark Pattern Categories,
│         Vulnerable Population Protections, ROI Claim Validation,
│         Financial Product Standards, 7 Sins of Greenwashing (TerraChoice),
│         EU Green Claims Directive 2024, Carbon Scope 1/2/3,
│         Competitive Audit Framework 4-Tier, Visual Analysis Protocol
│
├── CC-06_DIRECTOR/
│   ├── CC06_STORYTELLING_CRAFT.md
│   │   → Ogilvy's 8 Commandments, Three-Act Structure,
│   │     12-Beat Emotional Journey, Aristotle's Rhetorical Triangle,
│   │     Video Grammar (shot types, camera movement, editing rhythm),
│   │     4-Minute Demo Video Framework, AIDA/PAS/FAB formulas,
│   │     4 U's Headline Formula, Platform-Specific Content Principles,
│   │     Voice-Over Writing Rules, Dialogue Writing Standards
│   │
│   └── CC06_CONTENT_SYSTEMS.md
│       → Content Pyramid (4 tiers), Content Themes Rotation,
│         Headline Testing Database (6 formulas), Hook Formula (5 types),
│         Email Marketing Architecture, Integrated Campaign Framework,
│         Campaign Phase Structure (4 phases), Creative Brief Requirements,
│         High-Context vs. Low-Context Communication (Hall),
│         German Market Specifics
│
├── DA-03_ARCHITECT/
│   └── DA03_DESIGN_THEORY.md
│       → Bauhaus Philosophy & Form Theory, Kandinsky-Itten Color-Form,
│         Golden Ratio & Rule of Thirds, Itten's 7 Color Contrasts,
│         Color Psychology (8 colors with brand applications),
│         60-30-10 Color Rule, WCAG Accessibility Standards,
│         Type Classification & Brand Voice, Typographic Scale,
│         Gestalt Principles (6), Visual Hierarchy (4 levels),
│         Complete Brand Identity System (7 components),
│         Nielsen-Norman 10 Heuristics, Cognitive Load Theory, Fitts's Law
│
├── PM-07_PERSISTENT/
│   └── PM07_PROACTIVE_INTELLIGENCE.md
│       → 5 Autonomy Levels, Continuous Intelligence Stack (4 layers),
│         Morning Brief Protocol, Campaign Memory Architecture (Firestore schema),
│         Memory Continuity Protocol, Autonomous Action Matrix,
│         Google Workspace Integration (Chat, Calendar, Gmail),
│         Trigger-Event Action Mapping (5 triggers),
│         Client Communication Style (4 types), Trust-Building Timeline
│
└── SHARED/
    └── SHARED_BRAND_INTELLIGENCE.md
        → Brand Case Studies: Apple, Patagonia, Oatly, Nike,
          Luxury Brand Architecture (4 pillars),
          Wellness Category Intelligence, B2B SaaS Category Intelligence,
          DTC Brand Architecture, Google Ads Performance Standards,
          Meta Ads Targeting Intelligence, Crisis Communication (4 types),
          The 3 Rs of Crisis Response
```

---

## UPLOAD-ANWEISUNGEN FÜR VERTEX AI DISCOVERY ENGINE

### Schritt 1: App erstellen
1. GCP Console → Search & Conversation (Discovery Engine)
2. "New App" → Type: **Search**
3. App Name: `agenticum-genius-knowledge`
4. Region: `eu` (für DSGVO-Konformität)

### Schritt 2: Datastore erstellen
1. "Create new data store"
2. Source: **Cloud Storage**
3. Data type: **Unstructured documents**
4. Bucket: Neuen Bucket erstellen `gs://agenticum-genius-knowledge`

### Schritt 3: Dateien hochladen
```bash
# Alle Knowledge Base Dateien in GCS hochladen
gsutil -m cp -r knowledge_base/* gs://agenticum-genius-knowledge/

# Datastore Import triggern
gcloud discovery-engine operations list \
  --location=eu \
  --collection=default_collection
```

### Schritt 4: Agent-spezifische Datastore-Konfiguration
Jeder Agent bekommt seinen eigenen Discovery Engine Filter:

```python
# SP-01 Filter
search_filter = "file_path: SP-01_STRATEGIST/*"

# DA-03 Filter  
search_filter = "file_path: DA-03_ARCHITECT/*"

# Shared (für alle Agents zusätzlich)
search_filter = "file_path: SHARED/* OR file_path: {AGENT_FOLDER}/*"
```

---

## ERWEITERUNGSPLAN — NÄCHSTE WISSENSDATEIEN

### Priorität 1 (Vor Hackathon-Deadline hinzufügen):
- `SP-01_STRATEGIST/SP01_GERMAN_MARKET_DEEP_DIVE.md` — DACH-Markt-spezifische Daten
- `RA-01_MI-01_SENATE/RA01_GDPR_ADVERTISING_COMPLIANCE.md` — vollständige DSGVO-Werberegeln
- `DA-03_ARCHITECT/DA03_MOTION_DESIGN_PRINCIPLES.md` — Animationssystem und Timing-Regeln
- `CC-06_DIRECTOR/CC06_GERMAN_COPYWRITING.md` — Deutsche Werbetexte-Kultur und Stilregeln

### Priorität 2 (Post-Launch Erweiterung):
- Branchenspezifische Wissens-Module pro Kundentyp (Retail, SaaS, Healthcare, F&B)
- Real-Time-Daten-Integration via Search Grounding (kein Upload nötig — direkt in Agents)
- Kundenprojekt-spezifische Knowledge Stores (private, client-by-client)

---

## WISSENSQUALITÄTS-STANDARDS

Jede Wissensdatei erfüllt folgende Kriterien:

✅ **Quellenbasiert**: Alle Frameworks beruhen auf anerkannten Autoren, Studien oder Institutionen (Kahneman, Ogilvy, NNGroup, FTC, Bauhaus, Ehrenberg-Bass, Binet & Field, etc.)

✅ **Handlungsorientiert**: Jedes Framework endet mit einer Agent-spezifischen Direktive oder einer praktischen Anwendungsregel — kein reines Theorie-Wissen.

✅ **Ethisch verfasst**: Keine Manipulation, keine Irreführung, kein Dark-Pattern-Wissen. Das MI-01 Senate-Wissen schützt das System vor sich selbst.

✅ **Google-Stack-kompatibel**: Alle Wissens-Inhalte sind als unstrukturierte Dokumente für Vertex AI Discovery Engine optimiert. Keine proprietären Drittanbieter-Referenzen im Infrastruktur-Kontext.

✅ **Erweiterbar**: Jede Datei hat eine klare Struktur (MODULE → SECTION → RULE) die weitere Inhalte nahtlos aufnehmen kann.

---

*Dieses Knowledge-System ist das Fundament der Genius Agents. Mit diesem Wissen arbeiten die Agents nicht nur schnell — sie arbeiten auf Weltklasse-Niveau.*
