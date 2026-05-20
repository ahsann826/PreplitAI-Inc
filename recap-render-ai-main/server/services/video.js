const { spawn } = require('child_process');
const path = require('path');
const fs = require('fs').promises;

async function ensureDirs() {
  await fs.mkdir(path.join(__dirname, '..', 'outputs', 'scripts'), { recursive: true });
  await fs.mkdir(path.join(__dirname, '..', 'outputs', 'videos'), { recursive: true });
}

function resolvePython() {
  // Prefer the project venv python on Windows (project root/.venv)
  const venvPy = path.join(__dirname, '..', '..', '.venv', 'Scripts', 'python.exe');
  return venvPy; // let spawn try it; if missing, process will error and we can suggest installing
}

async function generateVideoFromTextFile(textFilePath, opts = {}) {
  await ensureDirs();
  const projectRoot = path.join(__dirname, '..', '..');
  const py = resolvePython();

  const ts = new Date().toISOString().replace(/[:.]/g, '-');
  const baseName = path.basename(textFilePath, path.extname(textFilePath));
  const outMp4 = path.join(__dirname, '..', 'outputs', 'videos', `${baseName}_${ts}.mp4`);

  const args = [
    '-m', 'src.video_lecture.cli',
    textFilePath,
    '--tts-provider', opts.ttsProvider || 'edge',
    '--theme', opts.theme || 'dark',
    '--fps', String(opts.fps || 24),
    '--width', String(opts.width || 1280),
    '--height', String(opts.height || 720),
    '--output', outMp4,
  ];
  if (opts.voice) args.push('--voice', opts.voice);
  if (opts.music) args.push('--music', opts.music);
  if (opts.font) args.push('--font', opts.font);
  if (opts.kenburns) args.push('--kenburns');

  return new Promise((resolve, reject) => {
    const child = spawn(py, args, { cwd: projectRoot, shell: false });
    let stdout = '';
    let stderr = '';

    child.stdout.on('data', (d) => { stdout += d.toString(); });
    child.stderr.on('data', (d) => { stderr += d.toString(); });

    child.on('error', (err) => reject(new Error(`Failed to start python: ${err.message}`)));
    child.on('close', async (code) => {
      if (code !== 0) {
        return reject(new Error(`Video generation failed (code ${code}): ${stderr || stdout}`));
      }
      const outSrt = outMp4.replace(/\.mp4$/i, '.srt');
      resolve({ outMp4, outSrt, stdout });
    });
  });
}

module.exports = { generateVideoFromTextFile };
