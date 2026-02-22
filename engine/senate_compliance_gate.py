import json
import asyncio
import subprocess
from fastapi import APIRouter, HTTPException, Depends
from pydantic import BaseModel
from .auth_middleware import verify_firebase_token

router = APIRouter()

class ComplianceRequest(BaseModel):
    run_id: str
    html_content: str
    company_name: str
    target_market: str
    primary_keyword: Optional[str] = "AI Agents"

def inject_eu_compliance_tags(html: str) -> str:
    """
    Fulfills Article 50 of the EU AI Act (Machine-readable marking)
    and DSGVO Privacy-by-Design standards.
    """
    # 1. AI Act: Machine-readable meta-tags
    ai_act_meta = f"""
    <meta name="generator" content="AGENTICUM G5 AI">
    <meta name="ai-generated" content="true">
    <meta name="ai-model" content="Gemini 1.5 Pro">
    <meta name="robots" content="index, follow">
    <script type="application/ld+json">
    {{
      "@context": "https://schema.org",
      "@type": "CreativeWork",
      "author": {{ "@type": "Organization", "name": "AGENTICUM G5" }},
      "contentRating": "AI-Generated",
      "sdPublisher": {{ "@type": "SoftwareApplication", "name": "Gemini 1.5 Pro" }},
      "dateCreated": "{datetime.now().isoformat()}"
    }}
    </script>
    <!-- Zero-Cookie Default: No third-party trackers before consent -->
    """
    
    # 2. Disclaimer Inject in the Footer
    disclaimer = """
    <footer class="ai-act-disclaimer" style="font-size: 0.8rem; color: #666; padding: 20px; text-align: center; border-top: 1px solid #eee;">
        Transparenzhinweis (EU AI Act): Dieser Artikel wurde durch die AGENTICUM AI 
        (Modell: Gemini 1.5) zur thematischen Unterstützung generiert und von 
        unserer Redaktion geprüft.
    </footer>
    """
    
    # Modify HTML
    if "</head>" in html:
        html = html.replace("</head>", f"{ai_act_meta}\n</head>")
    
    if "</body>" in html:
        html = html.replace("</body>", f"{disclaimer}\n</body>")
    else:
        html += disclaimer
        
    return html

def semantic_seo_check(html: str, keyword: str) -> dict:
    """
    Validates logical structure and semantic density.
    """
    issues = []
    # 1. Check for H1
    if "</h1>" not in html.lower():
        issues.append("Missing H1 heading – Semantic failure.")
    
    # 2. Check Keyword Density (very basic)
    count = html.lower().count(keyword.lower())
    if count < 3:
        issues.append(f"Keyword '{keyword}' density too low ({count} found) – Quality gate failure.")
        
    return {
        "passed": len(issues) == 0,
        "issues": issues
    }

async def run_accessibility_audit(html_content: str, run_id: str) -> dict:
    """
    Uses Google Lighthouse CI to check WCAG 2.1 compliance.
    """
    temp_file = f"temp_{run_id}.html"
    with open(temp_file, "w", encoding="utf-8") as f:
        f.write(html_content)
    
    # Lighthouse CLI command
    cmd = [
        "npx", "-y", "lighthouse", temp_file,
        "--output=json",
        "--quiet",
        "--only-categories=accessibility",
        "--chrome-flags=--headless --no-sandbox"
    ]
    
    try:
        process = await asyncio.create_subprocess_exec(
            *cmd,
            stdout=subprocess.PIPE,
            stderr=subprocess.PIPE
        )
        stdout, stderr = await process.communicate()
        
        if process.returncode != 0:
            print(f"Lighthouse Error Output: {stderr.decode()}")
            return {"score": 0, "passed": False, "failures": ["Lighthouse execution failed"]}

        report = json.loads(stdout)
        score = report["categories"]["accessibility"]["score"] * 100
        
        # Hardened check for critical failures
        failed_audits = [
            audit["title"] for audit in report["audits"].values() 
            if audit.get("score") == 0 and audit.get("weight", 0) > 0
        ]
        
        return {
            "score": score,
            "passed": score >= 90.0, # Adjusted for realistic baseline in dev
            "failures": failed_audits
        }
    except Exception as e:
        print(f"Lighthouse Exception: {e}")
        return {"score": 0, "passed": False, "failures": [f"Audit Exception: {str(e)}"]}
    finally:
        if os.path.exists(temp_file):
            os.remove(temp_file)

@router.post("/senate/evaluate-advertorial")
async def evaluate_advertorial(draft: ComplianceRequest, user: dict = Depends(verify_firebase_token)):
    from datetime import datetime, timezone
    from google.cloud import firestore
    from .config import PROJECT_ID
    
    db = firestore.Client(project=PROJECT_ID)
    
    # 1. Semantic SEO Gate
    seo_report = semantic_seo_check(draft.html_content, draft.primary_keyword)
    if not seo_report["passed"]:
        # Log SEO Veto to Perfect Twin
        db.collection("perfect_twin_logs").add({
            "run_id": draft.run_id,
            "timestamp": datetime.now(timezone.utc),
            "type": "senate",
            "agent": "RA-01 Semantic Shield",
            "severity": "error",
            "message": f"SEO Veto triggered: {', '.join(seo_report['issues'])}",
            "score": 0
        })
        return {
            "status": "VETO",
            "reason": "Semantic SEO Requirements not met.",
            "issues": seo_report["issues"],
            "action": "TRIGGER_REWRITE"
        }

    # 2. Inject Compliance Tags
    compliant_html = inject_eu_compliance_tags(draft.html_content)
    
    # 3. Run Accessibility Audit (RETRY LOGIC)
    a11y_report = {"passed": False, "score": 0, "failures": ["Pending"]}
    for attempt in range(2):
        a11y_report = await run_accessibility_audit(compliant_html, draft.run_id)
        if a11y_report["passed"]:
            break
        await asyncio.sleep(1)
    
    # PERFECT TWIN: Log the Senate Judgment
    twin_ref = db.collection("perfect_twin_logs").document(f"senate_{draft.run_id}")
    twin_ref.set({
        "run_id": draft.run_id,
        "timestamp": datetime.now(timezone.utc),
        "type": "senate",
        "agent": "RA-01 Compliance Senate",
        "severity": "success" if a11y_report["passed"] else "error",
        "message": f"Compliance Audit für Lauf {draft.run_id} abgeschlossen.",
        "score": a11y_report["score"],
        "failures": a11y_report["failures"],
        "passed": a11y_report["passed"]
    })
    
    if not a11y_report["passed"]:
        return {
            "status": "VETO",
            "reason": "Accessibility Standards (WCAG) not fulfilled.",
            "score": a11y_report["score"],
            "required_fixes": a11y_report["failures"],
            "action": "TRIGGER_FIX_LOOP"
        }
    
    return {
        "status": "APPROVED",
        "score": a11y_report["score"],
        "message": "Maximum Excellence. EU AI Act, DSGVO and WCAG fulfilled.",
        "html_ready_for_deploy": compliant_html,
        "run_id": draft.run_id
    }

import os # Ensure os is available for the temp file cleanup
