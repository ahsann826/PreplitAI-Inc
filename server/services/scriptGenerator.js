const Groq = require('groq-sdk');
const textFormatter = require('../utils/textFormatter');

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });
const MODEL_CANDIDATES = [
  'llama-3.3-70b-versatile',
  'llama-3.1-8b-instant',
  'mixtral-8x7b-32768'
];

async function generateChatWithFallback(system, user) {
  let lastErr;
  for (const model of MODEL_CANDIDATES) {
    try {
      const completion = await groq.chat.completions.create({
        model,
        temperature: 0.7,
        messages: [
          { role: 'system', content: system },
          { role: 'user', content: user }
        ]
      });
      return completion.choices?.[0]?.message?.content?.trim() || '';
    } catch (e) {
      lastErr = e;
      const msg = String(e?.message || e || '');
      if (/model.*not.*found|Unknown model|404|decommissioned|invalid_request_error/i.test(msg)) {
        continue; // try next model id
      }
      throw e; // different error, surface immediately
    }
  }
  throw new Error(lastErr?.message || String(lastErr));
}

async function generateTextWithFallback(prompt) {
  return generateChatWithFallback(
    'You are a helpful assistant for educational content and video pre-production.',
    prompt
  );
}

class ScriptGenerator {
  /**
   * Generate lecture script based on mode and style
   */
  async generateScript(text, mode, style) {
    const prompts = this.getPrompt(mode, style);
    try {
      const userMsg = `${prompts.user}\n\nNotes:\n${text}`;
      const rawScript = await generateChatWithFallback(prompts.system, userMsg);
      // Clean script to avoid TTS issues or slide rendering overflow
      return textFormatter.stripMarkdown(rawScript);
    } catch (error) {
      throw new Error(`Script generation failed: ${error.message}`);
    }
  }

  /**
   * Get prompt templates based on mode and style
   */
  getPrompt(mode, style) {
    const basePrompts = {
      summary: {
        system: 'You are an expert educator creating concise, engaging lecture scripts. Focus on key concepts and main ideas.',
        user: 'Create a summary lecture script covering the main points and key concepts from these notes. Keep it concise but comprehensive.'
      },
      detailed: {
        system: 'You are an expert educator creating detailed, comprehensive lecture scripts. Explain concepts thoroughly with examples.',
        user: 'Create a detailed lecture script that thoroughly explains all concepts from these notes. Include examples and explanations.'
      },
      test: {
        system: 'You are an expert educator creating test preparation lecture scripts. Focus on likely exam questions and solutions.',
        user: 'Create a test prep lecture script. Identify key topics, generate likely exam questions, and provide clear solutions with explanations.'
      }
    };

    const styleModifiers = {
      professor: '\n\nFormat: Write as if you are a professor teaching in front of a class. Use conversational language, engage students, and explain as you would write on a board.',
      visual: '\n\nFormat: Write in a way that can be visualized. Include descriptions of diagrams, charts, or visual metaphors that would help explain concepts.'
    };

    const prompt = basePrompts[mode];
    prompt.user += styleModifiers[style];

    return prompt;
  }

  /**
   * Generate structured scenes for video production
   */
  async generateStructuredScenes(text, mode, style) {
    try {
      const prompt = `You are an expert educational content designer. You output only valid JSON arrays with no markdown formatting, no backticks, no explanation. Your visual designs are clear, educational, and appropriate for the content type.

Based on the following lecture script, break it down into scenes. For each scene, you must provide a valid JSON object matching this exact schema in an array:
{
  "scene_number": 1,
  "title": "string — short scene heading",
  "narration": "string — full spoken narration for this scene, 2-4 sentences",
  "scene_type": "one of: definition | flowchart | timeline | comparison | diagram | bar_chart | bullet_points",
  "visual": {
    "type": "matches scene_type exactly",
    "data": {} // see below
  }
}

Visual data shapes by type:
- definition: { "term": "string", "explanation": "string", "example": "string or null" }
- flowchart: { "steps": ["step1", "step2", "step3", ...] }
- timeline: { "events": [{"year": "string", "label": "string"}, ...] }
- comparison: { "left_label": "string", "right_label": "string", "left_points": ["string", ...], "right_points": ["string", ...] }
- diagram: { "title": "string", "parts": [{"label": "string", "description": "string"}, ...] }
- bar_chart: { "title": "string", "bars": [{"label": "string", "value": 100}, ...] }
- bullet_points: { "heading": "string", "points": ["string", ...] }

Output ONLY the JSON array. Do NOT wrap it in \`\`\`json or \`\`\`.

Script:
${text}`;

      let rawResponse = await generateTextWithFallback(prompt);
      
      // Strip markdown wrappers if the model still includes them
      rawResponse = rawResponse.trim();
      if (rawResponse.startsWith('\`\`\`json')) {
        rawResponse = rawResponse.substring(7);
      } else if (rawResponse.startsWith('\`\`\`')) {
        rawResponse = rawResponse.substring(3);
      }
      if (rawResponse.endsWith('\`\`\`')) {
        rawResponse = rawResponse.substring(0, rawResponse.length - 3);
      }
      rawResponse = rawResponse.trim();

      let parsed;
      try {
        parsed = JSON.parse(rawResponse);
      } catch (e) {
        throw new Error("Scene JSON parse failed");
      }

      if (!Array.isArray(parsed) || parsed.length === 0) {
        throw new Error("Scene JSON parse failed: Result is not a non-empty array");
      }

      return parsed;
    } catch (error) {
      throw new Error(`Structured scene generation failed: ${error.message}`);
    }
  }
}

module.exports = new ScriptGenerator();
