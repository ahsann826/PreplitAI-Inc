const path = require('path');
const fs = require('fs').promises;
const { generateDidVideo } = require('./did.cjs');
const scriptGenerator = require('./scriptGenerator');

function parseScenes(text) {
  // Very simple parser: split by lines starting with a number + dot or 'Scene'
  const lines = text.split(/\r?\n/);
  const scenes = [];
  let cur = { title: '', narration: '', visual: '', durationSec: 0 };
  const push = () => {
    if (cur.narration || cur.visual) scenes.push({ ...cur });
    cur = { title: '', narration: '', visual: '', durationSec: 0 };
  };
  for (const ln of lines) {
    const mScene = ln.match(/^\s*(?:Scene\s*)?(\d+)\s*[:.-]?\s*(.*)$/i);
    if (mScene) {
      if (cur.narration || cur.visual) push();
      cur.title = mScene[2] || `Scene ${mScene[1]}`;
      continue;
    }
    const mDur = ln.match(/Duration\s*\(?in seconds\)?\s*[:=-]\s*(\d+(?:\.\d+)?)/i);
    if (mDur) { cur.durationSec = Number(mDur[1]); continue; }
    if (/^\s*(Narration|Voice|Text)\s*[:=-]/i.test(ln)) { cur.narration += ln.replace(/^\s*\w+\s*[:=-]\s*/,'').trim()+" "; continue; }
    if (/^\s*(Visual|Description)\s*[:=-]/i.test(ln)) { cur.visual += ln.replace(/^\s*\w+\s*[:=-]\s*/,'').trim()+" "; continue; }
    cur.narration += (ln.trim()+" ");
  }
  push();
  return scenes.map((s,i)=>({
    title: s.title || `Scene ${i+1}`,
    narration: s.narration.trim(),
    visual: s.visual.trim(),
    durationSec: s.durationSec || undefined,
  })).filter(s=>s.narration);
}

async function generateAvatarLectureFromText(text, options, projectRoot) {
  // 1) Ask LLM for scene breakdown
  const sceneText = await scriptGenerator.generateSceneBreakdown(text);
  const scenes = parseScenes(sceneText);

  // 2) For each scene, create a D-ID avatar clip
  const apiKey = process.env.DID_API_KEY;
  if (!apiKey) throw new Error('Missing DID_API_KEY');
  const videosDir = path.join(projectRoot, 'server', 'outputs', 'videos');
  const tmpDir = path.join(projectRoot, 'server', 'outputs', 'tmp');
  await fs.mkdir(videosDir, { recursive: true });
  await fs.mkdir(tmpDir, { recursive: true });

  const driverUrl = options.driverUrl || 'https://d-id-public-bucket.s3.amazonaws.com/or-roman.jpg';
  const voiceId = options.voiceId || 'en-US-JennyNeural';
  const composedScenes = [];

  for (let i=0;i<scenes.length;i++) {
    const s = scenes[i];
    const mp4 = await generateDidVideo({ text: s.narration, voiceId, driverUrl, ratio: '16:9' }, videosDir, apiKey);
    composedScenes.push({ title: s.title, visual: s.visual, narration: s.narration, avatar_video: mp4 });
  }

  // 3) Write scenes.json for Python composer
  const sceneJsonPath = path.join(tmpDir, `scenes_${Date.now()}.json`);
  const scenePayload = { size: [options.width||1280, options.height||720], theme: options.theme||'dark', fps: options.fps||24, scenes: composedScenes };
  await fs.writeFile(sceneJsonPath, JSON.stringify(scenePayload, null, 2), 'utf-8');
  return { scenesJson: sceneJsonPath };
}

module.exports = { generateAvatarLectureFromText, parseScenes };