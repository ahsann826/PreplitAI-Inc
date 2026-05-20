const Groq = require('groq-sdk');

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
      return await generateChatWithFallback(prompts.system, userMsg);
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
   * Generate scene breakdown for video production
   */
  async generateSceneBreakdown(script) {
    try {
      const prompt = `You are a video production assistant. Break down lecture scripts into scenes with timing and visual descriptions.

Break this lecture script into scenes for video production. For each scene, provide:
1. Scene number
2. Duration (in seconds)
3. Narration text
4. Visual description

Script:
${script}`;

      return await generateTextWithFallback(prompt);
    } catch (error) {
      throw new Error(`Scene breakdown generation failed: ${error.message}`);
    }
  }
}

module.exports = new ScriptGenerator();
