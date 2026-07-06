import React from 'react';
import { useCurrentFrame, interpolate } from 'remotion';
import { SceneWrapper, COLORS } from '../SceneWrapper';

interface TimelineEvent { year: string; label: string; }
interface TimelineProps {
  scene: { title: string; visual: { data: { events: TimelineEvent[] } } };
  audioPath: string;
  sceneIndex: number;
}

export const Timeline: React.FC<TimelineProps> = ({ scene, audioPath }) => {
  const frame = useCurrentFrame();
  const events: TimelineEvent[] = scene.visual?.data?.events || [];
  const framesPerEvent = 18;

  return (
    <SceneWrapper title={scene.title} audioPath={audioPath}>
      {/* Horizontal timeline bar */}
      <div style={{ position: 'relative', paddingTop: 60 }}>
        {/* Track line */}
        <div style={{
          position: 'absolute', top: 100, left: 0, right: 0,
          height: 3, background: COLORS.border, borderRadius: 2,
        }} />
        <div style={{
          position: 'absolute', top: 100, left: 0,
          height: 3, width: `${Math.min(100, (frame / ((events.length) * framesPerEvent + 20)) * 100)}%`,
          background: `linear-gradient(90deg, ${COLORS.accent}, ${COLORS.accentSoft})`,
          borderRadius: 2, transition: 'width 0.1s',
        }} />

        {/* Events */}
        <div style={{ display: 'flex', justifyContent: 'space-around', position: 'relative' }}>
          {events.map((ev, i) => {
            const start = 20 + i * framesPerEvent;
            const opacity = interpolate(frame, [start, start + 14], [0, 1], { extrapolateRight: 'clamp' });
            const y = interpolate(frame, [start, start + 14], [20, 0], { extrapolateRight: 'clamp' });

            return (
              <div key={i} style={{ textAlign: 'center', opacity, transform: `translateY(${y}px)`, flex: 1 }}>
                {/* Label above */}
                <div style={{ marginBottom: 12, minHeight: 60, display: 'flex', flexDirection: 'column', justifyContent: 'flex-end' }}>
                  <p style={{ margin: 0, fontSize: 14, color: COLORS.text, lineHeight: 1.3, maxWidth: 140, textAlign: 'center' }}>
                    {ev.label}
                  </p>
                </div>
                {/* Dot */}
                <div style={{
                  width: 16, height: 16, borderRadius: '50%',
                  background: `linear-gradient(135deg, ${COLORS.accent}, ${COLORS.accentSoft})`,
                  margin: '0 auto',
                  boxShadow: `0 0 12px ${COLORS.accent}88`,
                }} />
                {/* Year below */}
                <div style={{ marginTop: 16 }}>
                  <p style={{ margin: 0, fontSize: 16, fontWeight: 700, color: COLORS.accentSoft }}>
                    {ev.year}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </SceneWrapper>
  );
};
