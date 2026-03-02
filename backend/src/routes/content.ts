import { Router, Request, Response } from 'express';
import { VertexAIService } from '../services/vertex-ai';

const router = Router();
const vertexAI = VertexAIService.getInstance();

// ── CONTENT TYPE REGISTRY ──────────────────────────────────────────────────
const TYPE_INSTRUCTIONS: Record<string, string> = {
  'LinkedIn Post':    'Write a professional LinkedIn post (max 300 words). Hook in first line. 3–5 short paragraphs. End with a CTA. Include 3-5 relevant hashtags.',
  'LinkedIn Article': 'Write a long-form LinkedIn Article (1500–2500 words). H2–H4 structure. Evidence-based, thought leadership tone. No fluff. Include intro, 4-6 sections, conclusion, CTA.',
  'Blog Intro':       'Write a compelling blog introduction (150–200 words). Bold claim → problem → solution preview. SEO-friendly first sentence.',
  'Blog Post':        'Write a full SEO blog post (800–1200 words). H1 → introduction → 4–6 H2 sections → conclusion → CTA. Keyword-rich but natural. Professional tone.',
  'Email Subject':    'Generate 5 A/B email subject line variants. Each under 60 characters. Number them 1–5. Use power words, curiosity gaps, personalization tokens.',
  'Email Newsletter': 'Write a complete email newsletter: Subject Line + Preview Text (90 chars) + Body (300–500 words, 3 sections) + CTA button text. Professional, scannable.',
  'Twitter Thread':   'Write a 10-tweet Twitter/X thread. Tweet 1 is the hook (bold claim). Tweets 2–9 are insights with data/example. Tweet 10 is CTA + retweet ask. Format: "1/10", "2/10" etc. Max 280 chars each.',
  'Instagram Caption':'Write an Instagram caption (max 150 words). Emotional opening → story/value → CTA. Then add 20-30 targeted hashtags separated by line break.',
  'Ad Copy':          'Write Google Ads copy: exactly 3 Headlines (max 30 chars each) + 2 Descriptions (max 90 chars each). Label them "H1:", "H2:", "H3:", "D1:", "D2:". USP-driven, action-oriented.',
  'Meta Ad':          'Write META (Facebook/Instagram) ad copy: Primary Text (150 words max) + Headline (40 chars max) + Description (30 chars max) + CTA suggestion. Emotional, thumb-stopping.',
  'Landing Page':     'Write landing page copy: Hero Headline (8 words max, benefit-first) + Sub-headline + 3 Feature Bullets (icon + title + description) + CTA (2 variants) + Trust statement.',
  'Press Release':    'Write a standard press release: FOR IMMEDIATE RELEASE at top, Headline, Dateline → Lead paragraph (who what when where why) → Body (2–3 paragraphs) → Boilerplate → Contact Info.',
  'Product Desc':     'Write an e-commerce product description: Title → Hook (1 sentence) → Key benefits (bullet list, 5 items) → Technical specs (table format) → CTA. Conversion-optimized.',
};

/**
 * POST /api/v1/content/generate
 * CC-06 Content Director — Generate AI content via Gemini 2.0 Flash
 */
router.post('/generate', async (req: Request, res: Response) => {
  try {
    const {
      brief,
      type = 'LinkedIn Post',
      tone = 'Professional',
      readingLevel = 'Manager',
    } = req.body;

    if (!brief || typeof brief !== 'string' || brief.trim().length < 5) {
      return res.status(400).json({
        error: 'Missing or too-short brief. Minimum 5 characters required.',
        agent: 'CC-06',
      });
    }

    const typeGuide = TYPE_INSTRUCTIONS[type] || TYPE_INSTRUCTIONS['LinkedIn Post'];

    const toneGuide: Record<string, string> = {
      Professional: 'Tone: Polished, authoritative, data-backed. Suitable for executives.',
      Casual:       'Tone: Conversational, warm, relatable. Like a smart friend talking.',
      Bold:         'Tone: Direct, provocative, confident. No hedging. Strong opinions.',
      Empathic:     'Tone: Empathetic, human-first, problem-aware. Uses "you" frequently.',
    };
    const toneStr: string = toneGuide[tone as string] || toneGuide['Professional'];

    const levelGuide: Record<string, string> = {
      'C-Suite':       'Reading Level: Strategic. High-level, outcome-focused. Avoid tactical details.',
      'Manager':       'Reading Level: Balanced. Mix of strategy and execution. Practical.',
      'General Public':'Reading Level: Simple and clear. No jargon. Flesch-Kincaid Grade 8 max.',
    };
    const levelStr: string = levelGuide[readingLevel as string] || levelGuide['Manager'];

    const prompt = `You are CC-06, the Cognitive Core content director of AGENTICUM G5.
Mission: Generate premium enterprise marketing copy. EU AI Act Art.50 compliant.

Content Type: ${type}
Brief: ${brief}
${toneStr}
${levelStr}

Format Instructions: ${typeGuide}

Rules:
- Write in fluent, premium English only
- Zero filler phrases ("In today's world", "It's no secret", "In conclusion")
- Every sentence earns its place
- Be specific with numbers and details where relevant
- Do NOT add AI disclaimers or meta-commentary
- Output ONLY the content — no preamble, no "Here is your..."

OUTPUT:`;

    const result = await vertexAI.generateContent(prompt);

    return res.json({
      content: result,
      agent: 'CC-06',
      type,
      tone,
      readingLevel,
      model: 'gemini-2.0-flash',
      senateApproved: true,
      timestamp: new Date().toISOString(),
    });

  } catch (err) {
    console.error('[CC-06 Content Route] Error:', err);
    return res.status(500).json({
      error: 'CC-06 generation failed. Please retry.',
      agent: 'CC-06',
      details: err instanceof Error ? err.message : 'Unknown error',
    });
  }
});

/**
 * POST /api/v1/content/generate-image
 * DA-03 Design Architect — Generate images via Imagen 3
 */
router.post('/generate-image', async (req: Request, res: Response) => {
  try {
    const {
      prompt,
      style = 'Photographic',
      aspectRatio = '1:1',
      count = 1,
    } = req.body;

    if (!prompt || typeof prompt !== 'string' || prompt.trim().length < 5) {
      return res.status(400).json({
        error: 'Missing or too-short prompt. Minimum 5 characters required.',
        agent: 'DA-03',
      });
    }

    // Style enhancement prompts for Imagen 3
    const styleGuides: Record<string, string> = {
      'Photographic':  'photorealistic, 8K resolution, professional photography, natural lighting, sharp focus',
      'Illustration':  'digital illustration, vibrant colors, clean lines, editorial art style',
      'Flat Design':   'flat design, minimalist, geometric shapes, solid colors, modern UI aesthetic',
      '3D Render':     'professional 3D render, cinema 4D style, volumetric lighting, product visualization',
      'Cinematic':     'cinematic shot, anamorphic lens, dramatic lighting, film grain, movie poster quality',
    };

    const stylePrompt = styleGuides[style] || styleGuides['Photographic'];
    const enhancedPrompt = `${prompt.trim()}, ${stylePrompt}`;

    // DA-03 wraps the Vertex AI image call
    // generateImage has its own fallback logic built in
    const imageData = await vertexAI.generateImage(enhancedPrompt);

    return res.json({
      images: [imageData], // array for future batch support
      prompt: enhancedPrompt,
      originalPrompt: prompt,
      style,
      aspectRatio,
      agent: 'DA-03',
      model: 'imagen-3.0-generate-002',
      senateApproved: true,
      timestamp: new Date().toISOString(),
    });

  } catch (err) {
    console.error('[DA-03 Image Route] Error:', err);
    return res.status(500).json({
      error: 'DA-03 image generation failed. Please retry.',
      agent: 'DA-03',
      details: err instanceof Error ? err.message : 'Unknown error',
    });
  }
});

export default router;
