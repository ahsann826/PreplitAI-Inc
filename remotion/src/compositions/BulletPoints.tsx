import React from 'react';
import { useCurrentFrame, interpolate } from 'remotion';
import { SceneWrapper, COLORS } from '../SceneWrapper';

interface BulletPointsProps {
  scene: { title: string; visual: { data: { heading: string; points: string[] } } };
  audioPath: string;
  sceneIndex: number;
}

export const BulletPoints: React.FC<BulletPointsProps> = ({ scene, audioPath }) => {
  const frame = useCurrentFrame();
  const { heading, points = [] } = scene.visual?.data || {};
  const framesPerPoint = 20;

  return (
    <SceneWrapper title={scene.title} audioPath={audioPath}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8, maxWidth: 860 }}>
        {heading && (
          <p style={{
            margin: '0 0 20px', fontSize: 20, fontWeight: 600,
            color: COLORS.accentSoft, letterSpacing: '-0.3px',
          }}>
            {heading}
          </p>
        )}

        {points.map((point, i) => {
          const start   = 20 + i * framesPerPoint;
          const opacity = interpolate(frame, [start, start + 15], [0, 1], { extrapolateRight: 'clamp' });
          const x       = interpolate(frame, [start, start + 15], [-24, 0], { extrapolateRight: 'clamp' });

          return (
            <div key={i} style={{
              display: 'flex', alignItems: 'flex-start', gap: 16,
              opacity, transform: `translateX(${x}px)`,
              padding: '12px 20px',
              background: i % 2 === 0 ? `${COLORS.surface}` : 'transparent',
              borderRadius: 10,
              border: `1px solid ${i % 2 === 0 ? COLORS.border : 'transparent'}`,
            }}>
              {/* Bullet */}
              <div style={{
                marginTop: 6, flexShrink: 0,
                width: 10, height: 10, borderRadius: '50%',
                background: `linear-gradient(135deg, ${COLORS.accent}, ${COLORS.accentSoft})`,
              }} />
              <p style={{ margin: 0, fontSize: 19, color: COLORS.text, lineHeight: 1.5 }}>
                {point}
              </p>
            </div>
          );
        })}
      </div>
    </SceneWrapper>
  );
};
