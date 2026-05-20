import fetch from 'node-fetch';
import path from 'path';
import fs from 'fs/promises';

const DID_API_BASE = 'https://api.d-id.com';

function authHeader(apiKey) {
  const token = Buffer.from(`${apiKey}:`).toString('base64');
  return `Basic ${token}`;
}

export async function createTalk({ text, voiceId = 'en-US-JennyNeural', driverUrl = 'https://d-id-public-bucket.s3.amazonaws.com/or-roman.jpg', ratio = '16:9' }, apiKey) {
  const resp = await fetch(`${DID_API_BASE}/talks`, {
    method: 'POST',
    headers: {
      'Authorization': authHeader(apiKey),
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      script: {
        type: 'text',
        input: text,
        provider: { type: 'microsoft', voice_id: voiceId },
      },
      source_url: driverUrl,
      config: { ratio }
    })
  });
  if (!resp.ok) {
    const t = await resp.text();
    throw new Error(`D-ID create failed (${resp.status}): ${t}`);
  }
  return resp.json(); // { id, ... }
}

export async function pollTalk(id, apiKey, { timeoutMs = 180000, intervalMs = 2000 } = {}) {
  const start = Date.now();
  while (Date.now() - start < timeoutMs) {
    const r = await fetch(`${DID_API_BASE}/talks/${id}`, {
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

export async function downloadToFile(url, outPath) {
  const r = await fetch(url);
  if (!r.ok) throw new Error(`Download failed: ${r.status}`);
  const buf = Buffer.from(await r.arrayBuffer());
  await fs.mkdir(path.dirname(outPath), { recursive: true });
  await fs.writeFile(outPath, buf);
  return outPath;
}

export async function generateDidVideo({ text, voiceId, driverUrl, ratio }, outDir, apiKey) {
  const { id } = await createTalk({ text, voiceId, driverUrl, ratio }, apiKey);
  const resultUrl = await pollTalk(id, apiKey);
  const ts = new Date().toISOString().replace(/[:.]/g, '-');
  const outMp4 = path.join(outDir, `did_${ts}.mp4`);
  await downloadToFile(resultUrl, outMp4);
  return outMp4;
}
