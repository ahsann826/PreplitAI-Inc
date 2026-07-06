'use strict';
/**
 * Remotion Scene Renderer
 *
 * Renders each scene's JSON + audio file into an MP4 clip using
 * Remotion's server-side rendering API (@remotion/renderer).
 *
 * All scenes are rendered IN PARALLEL across up to REMOTION_CONCURRENCY
 * worker threads (default: 4), so total render time scales with the
 * slowest single scene rather than the total number of scenes.
 *
 * Architecture:
 *   - Each scene has a scene_type: one of 7 types defined in the spec.
 *   - The Remotion bundle is pre-built once per server startup and reused.
 *   - Output: one MP4 per scene at <outputDir>/scene_<N>.mp4
 *
 * Environment variables:
 *   REMOTION_CONCURRENCY — max parallel render workers (default: 4)
 *
 * Design note (logged in final report):
 *   Remotion compositions are matched to scene_type by name convention.
 *   Each scene_type maps to a React component in remotion/src/compositions/.
 *   The composition ID is the PascalCase of the scene_type, e.g.
 *   "bullet_points" → "BulletPoints".
 */

const path = require('path');
const fs = require('fs').promises;

// Dynamic import of @remotion/renderer — it's an optional dependency.
// If not installed, Remotion rendering will throw a clear error and
// the queue will fall back to the Python pipeline.
let remotionRenderer = null;
async function getRemotionRenderer() {
  if (!remotionRenderer) {
    try {
      remotionRenderer = await import('@remotion/renderer');
    } catch {
      throw new Error(
        '@remotion/renderer is not installed. ' +
        'Run: npm install @remotion/renderer @remotion/bundler react react-dom ' +
        'in the server directory, then rebuild the Remotion bundle.'
      );
    }
  }
  return remotionRenderer;
}

// Path to the Remotion composition bundle (built separately via npm run build:remotion)
const BUNDLE_PATH = path.join(__dirname, '..', '..', 'remotion', 'bundle', 'index.html');

// Concurrency — how many scenes render in parallel
const CONCURRENCY = parseInt(process.env.REMOTION_CONCURRENCY || '4', 10);

/**
 * Map scene_type string to the Remotion composition ID.
 * Composition ID = PascalCase of scene_type.
 *
 * All 7 scene types from the spec are covered here.
 */
function sceneTypeToCompositionId(sceneType) {
  const map = {
    definition:    'Definition',
    flowchart:     'Flowchart',
    timeline:      'Timeline',
    comparison:    'Comparison',
    diagram:       'Diagram',
    bar_chart:     'BarChart',
    bullet_points: 'BulletPoints',
  };
  const id = map[sceneType];
  if (!id) throw new Error(`Unknown scene_type: "${sceneType}". Valid types: ${Object.keys(map).join(', ')}`);
  return id;
}

/**
 * Render a single scene to MP4.
 *
 * @param {object} scene       - Scene JSON from scriptGenerator
 * @param {number} sceneIndex  - 0-based index (for output filename)
 * @param {string} audioPath   - Path to the ElevenLabs-generated MP3 for this scene
 * @param {string} outputDir   - Directory to write the rendered MP4
 * @returns {Promise<string>}  - Absolute path to the rendered scene MP4
 */
async function renderScene(scene, sceneIndex, audioPath, outputDir) {
  const { renderMedia, selectComposition } = await getRemotionRenderer();

  const outputPath = path.join(outputDir, `scene_${sceneIndex}.mp4`);
  const compositionId = sceneTypeToCompositionId(scene.scene_type);

  // Props passed to the React composition
  const inputProps = {
    scene,        // full scene JSON (title, narration, visual data)
    audioPath,    // path to the MP3 file for this scene
    sceneIndex,
  };

  const composition = await selectComposition({
    serveUrl: BUNDLE_PATH,
    id: compositionId,
    inputProps,
  });

  await renderMedia({
    composition,
    serveUrl: BUNDLE_PATH,
    codec: 'h264',
    outputLocation: outputPath,
    inputProps,
    concurrency: 1,  // each worker renders one scene; outer Promise.all controls parallelism
    chromiumOptions: { disableWebSecurity: true },
    onProgress: ({ progress }) => {
      if (progress % 0.25 < 0.01) { // log at 0%, 25%, 50%, 75%, 100%
        console.log(`[Remotion] scene ${sceneIndex} (${compositionId}): ${Math.round(progress * 100)}%`);
      }
    },
  });

  return outputPath;
}

/**
 * Render ALL scenes IN PARALLEL using Promise.all with concurrency capping.
 *
 * Scenes are dispatched CONCURRENCY at a time (default: 4 workers).
 * This prevents overwhelming the system while still being faster than sequential.
 *
 * @param {object[]} scenes       - Array of scene objects
 * @param {string[]} audioPaths   - Audio file path for each scene (parallel to scenes array)
 * @param {string}  outputDir     - Directory to write rendered scene MP4s
 * @returns {Promise<string[]>}   - Array of scene MP4 paths, in scene order
 */
async function renderAllScenes(scenes, audioPaths, outputDir) {
  await fs.mkdir(outputDir, { recursive: true });

  const results = new Array(scenes.length);

  // Process in chunks of CONCURRENCY
  for (let i = 0; i < scenes.length; i += CONCURRENCY) {
    const chunk = scenes.slice(i, i + CONCURRENCY);
    const chunkAudio = audioPaths.slice(i, i + CONCURRENCY);

    const chunkPaths = await Promise.all(
      chunk.map((scene, j) => renderScene(scene, i + j, chunkAudio[j], outputDir))
    );
    chunkPaths.forEach((p, j) => { results[i + j] = p; });
  }

  console.log(JSON.stringify({
    event: 'REMOTION_RENDER_COMPLETE',
    sceneCount: scenes.length,
    concurrency: CONCURRENCY,
  }));

  return results;
}

module.exports = { renderAllScenes, renderScene, sceneTypeToCompositionId };
