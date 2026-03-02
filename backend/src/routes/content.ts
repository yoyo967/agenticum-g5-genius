import { Router, Request, Response } from 'express';
import { VertexAIService } from '../services/vertex-ai';

const router = Router();
const vertexAI = VertexAIService.getInstance();

/**
 * POST /api/v1/content/generate
 * CC-06 Content Director — Generate AI content via Gemini
 */
router.post('/generate', async (req: Request, res: Response) => {
  try {
    const { brief, type = 'LinkedIn Post' } = req.body;

    if (!brief || typeof brief !== 'string' || brief.trim().length < 5) {
      return res.status(400).json({
        error: 'Missing or too-short brief. Minimum 5 characters required.',
        agent: 'CC-06',
      });
    }

    const typeInstructions: Record<string, string> = {
      'LinkedIn Post': 'Write a professional LinkedIn post (max 300 words). Hook in first line. 3–5 short paragraphs. End with a call-to-action.',
      'Blog Intro': 'Write a compelling blog introduction (150–200 words). Open with a bold claim, explain the problem, preview the solution.',
      'Email Subject': 'Generate 5 A/B email subject line variants. Each under 60 characters. Power word, curiosity gap, personalization token.',
      'Ad Copy': 'Write Google Ads copy: 3 Headlines (max 30 chars each) + 2 Descriptions (max 90 chars each). USP-driven, action-oriented.',
      'Tweet Thread': 'Write a 5-tweet thread. Tweet 1 is the hook. Tweets 2–4 are insights. Tweet 5 is the CTA. Max 280 chars each. Numbered 1/5 etc.',
    };

    const typeGuide = typeInstructions[type] || typeInstructions['LinkedIn Post'];

    const prompt = `You are CC-06, the Cognitive Core content director of AGENTICUM G5.
Your role: Generate premium enterprise marketing copy that is clear, persuasive, and EU AI Act Art.50 compliant.

Content Type: ${type}
Brief: ${brief}

Instructions: ${typeGuide}

Guidelines:
- Write in professional, premium English
- Zero filler phrases ("In today's world", "It's no secret")
- Every sentence must earn its place
- Be specific, not generic
- Do NOT add AI disclaimer or meta-commentary
- Output only the content, no preamble

OUTPUT (${type}):`;

    const result = await vertexAI.generateContent(prompt);

    return res.json({
      content: result,
      agent: 'CC-06',
      type,
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

export default router;
