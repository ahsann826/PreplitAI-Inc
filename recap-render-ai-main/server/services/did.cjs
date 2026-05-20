const path = require('path');
const fs = require('fs').promises;

const DID_API_BASE = 'https://api.d-id.com';

function authHeader(apiKey) {
  // D-ID expects the API key directly as Basic auth
  // The key format should be: email:password already encoded in the .env
  console.log('[D-ID] Using API key:', apiKey.substring(0, 10) + '...');
  return `Basic ${apiKey}`;
}

const fetchFn = (...args) => (typeof fetch === 'function' ? fetch(...args) : import('node-fetch').then(m => m.default(...args)));

async function httpJson(url, opts = {}) {
  const res = await fetchFn(url, opts);
  if (!res.ok) {
    const t = await res.text();
    const status = res.status;
    throw new Error(`${status}: ${t}`);
  }
  return res.json();
}

async function createTalk({ text, voiceId = 'en-US-JennyNeural', driverUrl = 'https://create-images-results.d-id.com/DefaultPresenters/Noelle_f/image.jpeg', ratio = '16:9' }, apiKey) {
  if (!apiKey) {
    throw new Error('D-ID API key is required');
  }
  
  const payload = {
    script: {
      type: 'text',
      input: text,
      provider: { type: 'microsoft', voice_id: voiceId },
    },
    source_url: driverUrl,
    config: { ratio }
  };
  
  console.log('[D-ID] Creating talk with payload:', JSON.stringify(payload, null, 2));
  
  return httpJson(`${DID_API_BASE}/talks`, {
    method: 'POST',
    headers: {
      'Authorization': authHeader(apiKey),
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(payload)
  });
}

async function pollTalk(id, apiKey, { timeoutMs = 180000, intervalMs = 2000 } = {}) {
  const start = Date.now();
  while (Date.now() - start < timeoutMs) {
    const r = await fetchFn(`${DID_API_BASE}/talks/${id}`, {
      headers: { 'Authorization': authHeader(apiKey) }
    });
    if (!r.ok) {
      const t = await r.text();
      throw new Error(`D-ID poll failed (${r.status}): ${t}`);
    }
    const j = await r.json();
    if (j.result_url) return j.result_url;
    if (j.status === 'error') throw new Error(j.error || 'D-ID returned error');
    await new Promise(res => setTimeout(res, intervalMs));
  }
  throw new Error('D-ID polling timed out');
}

async function downloadToFile(url, outPath) {
  const r = await fetchFn(url);
  if (!r.ok) throw new Error(`Download failed: ${r.status}`);
  const buf = Buffer.from(await r.arrayBuffer());
  await fs.mkdir(path.dirname(outPath), { recursive: true });
  await fs.writeFile(outPath, buf);
  return outPath;
}

async function generateDidVideo({ text, voiceId, driverUrl, ratio }, outDir, apiKey) {
  console.log('[D-ID] Starting video generation...');
  console.log('[D-ID] Text length:', text.length, 'characters');
  console.log('[D-ID] Voice:', voiceId);
  console.log('[D-ID] Avatar URL:', driverUrl);
  
  // D-ID has a character limit (usually around 10000)
  if (text.length > 10000) {
    throw new Error(`Text is too long (${text.length} chars). D-ID supports max ~10000 characters.`);
  }
  
  try {
    const { id } = await createTalk({ text, voiceId, driverUrl, ratio }, apiKey);
    console.log('[D-ID] Talk created with ID:', id);
    
    const resultUrl = await pollTalk(id, apiKey);
    console.log('[D-ID] Video ready at:', resultUrl);
    
    const ts = new Date().toISOString().replace(/[:.]/g, '-');
    const outMp4 = path.join(outDir, `did_${ts}.mp4`);
    await downloadToFile(resultUrl, outMp4);
    console.log('[D-ID] Video downloaded to:', outMp4);
    
    return outMp4;
  } catch (error) {
    console.error('[D-ID] Error details:', error);
    throw error;
  }
}

module.exports = { generateDidVideo, createTalk, pollTalk, downloadToFile };