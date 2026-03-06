const fs = require('fs');
const path = require('path');

const FILE_PATH = path.join(__dirname, 'landing', 'src', 'pages', 'LandingPage.tsx');
let content = fs.readFileSync(FILE_PATH, 'utf-8');

// Define the section blocks using distinct substrings inside the headers
const getSection = (markerTop, markerBottomOverride) => {
    let keyIdx = content.indexOf(markerTop);
    if (keyIdx === -1) throw new Error("Could not find top marker: " + markerTop);
    // Move backwards to the start of the {/* === line
    let startIdx = content.lastIndexOf('{/* =', keyIdx);
    if (startIdx === -1) startIdx = content.lastIndexOf('<section', keyIdx);
    
    let rest = content.substring(startIdx);
    
    // find next section marker
    let endIdx;
    if (markerBottomOverride) {
        endIdx = rest.indexOf(markerBottomOverride);
    } else {
        // Look for the next {/* ====
        let nextMarker = rest.indexOf('{/* =', 10);
        if (nextMarker === -1) {
             nextMarker = rest.indexOf('</section>', 10) + 10;
             if (nextMarker < 10) throw new Error("Could not find end for " + markerTop);
        }
        endIdx = nextMarker;
    }
    
    const block = rest.substring(0, endIdx);
    // remove block from content
    content = content.substring(0, startIdx) + content.substring(startIdx + endIdx);
    return block;
};

const problem = getSection('SECTION 2 — PROBLEM / SOLUTION');
const howItWorks = getSection('SECTION 4 — HOW IT WORKS');
const demoVideo = getSection('NEW: DEMO VIDEO [LP-10]');
const liveApi = getSection('NEW: GEMINI LIVE API SHOWCASE');
const agents = getSection('SECTION 3 — 9 AGENTS');
const archDiagram = getSection('SECTION 5.5 — ARCHITECTURE DIAGRAM [LP-02]');
const techStack = getSection('SECTION 5 — TECH STACK');
const gallery = getSection('NEW: LIVE OUTPUT GALLERY [LP-03]');
const proofCloud = getSection('PROOF OF CLOUD — JURY VERIFIED STRIP');
const compliance = getSection('SECTION 6 — COMPLIANCE');
const roadmap = getSection('SECTION 6.5 — MISSION & ROADMAP (THE STORY)');
const finalCta = getSection('SECTION 7 — FINAL CTA');

const bannerEndMarker = '</section>';
const bannerStartIdx = content.indexOf('HACKATHON ELIGIBILITY BANNER');
const searchFrom = bannerStartIdx > -1 ? bannerStartIdx : 0;
let insertIdx = (content.indexOf(bannerEndMarker, searchFrom) !== -1) 
    ? content.indexOf(bannerEndMarker, searchFrom) + bannerEndMarker.length 
    : content.indexOf('</section>') + bannerEndMarker.length;

const toInsert = problem + '\\n\\n' + howItWorks + '\\n\\n' + demoVideo + '\\n\\n' + liveApi + '\\n\\n' + agents + '\\n\\n' + archDiagram + '\\n\\n' + techStack + '\\n\\n' + gallery + '\\n\\n' + proofCloud + '\\n\\n' + compliance + '\\n\\n' + roadmap + '\\n\\n' + finalCta;

content = content.substring(0, insertIdx) + '\\n\\n' + toInsert.trim() + '\\n\\n      ' + content.substring(insertIdx).trimStart();

fs.writeFileSync(FILE_PATH, content);
console.log('Successfully reordered sections.');
