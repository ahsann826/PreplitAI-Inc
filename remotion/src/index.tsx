import React from 'react';
import { Composition } from 'remotion';
import { Definition } from './compositions/Definition';
import { Flowchart } from './compositions/Flowchart';
import { Timeline } from './compositions/Timeline';
import { Comparison } from './compositions/Comparison';
import { Diagram } from './compositions/Diagram';
import { BarChart } from './compositions/BarChart';
import { BulletPoints } from './compositions/BulletPoints';

// All scenes are 30fps, 1280x720 (720p).
// Duration is set from the audio length prop — the composition reads
// durationInFrames from its inputProps at render time.
// Default here (150 frames = 5s) is overridden per-render.
const FPS = 30;
const W = 1280;
const H = 720;
const DEFAULT_FRAMES = 150;

export const RemotionRoot: React.FC = () => (
  <>
    <Composition id="Definition"    component={Definition}    fps={FPS} width={W} height={H} durationInFrames={DEFAULT_FRAMES} defaultProps={{ scene: {}, audioPath: '', sceneIndex: 0 }} />
    <Composition id="Flowchart"     component={Flowchart}     fps={FPS} width={W} height={H} durationInFrames={DEFAULT_FRAMES} defaultProps={{ scene: {}, audioPath: '', sceneIndex: 0 }} />
    <Composition id="Timeline"      component={Timeline}      fps={FPS} width={W} height={H} durationInFrames={DEFAULT_FRAMES} defaultProps={{ scene: {}, audioPath: '', sceneIndex: 0 }} />
    <Composition id="Comparison"    component={Comparison}    fps={FPS} width={W} height={H} durationInFrames={DEFAULT_FRAMES} defaultProps={{ scene: {}, audioPath: '', sceneIndex: 0 }} />
    <Composition id="Diagram"       component={Diagram}       fps={FPS} width={W} height={H} durationInFrames={DEFAULT_FRAMES} defaultProps={{ scene: {}, audioPath: '', sceneIndex: 0 }} />
    <Composition id="BarChart"      component={BarChart}      fps={FPS} width={W} height={H} durationInFrames={DEFAULT_FRAMES} defaultProps={{ scene: {}, audioPath: '', sceneIndex: 0 }} />
    <Composition id="BulletPoints"  component={BulletPoints}  fps={FPS} width={W} height={H} durationInFrames={DEFAULT_FRAMES} defaultProps={{ scene: {}, audioPath: '', sceneIndex: 0 }} />
  </>
);
