import React from 'react';
import { useCurrentFrame, interpolate } from 'remotion';
import { SceneWrapper, COLORS } from '../SceneWrapper';

interface FlowchartProps {
  scene: { title: string; visual: { data: { steps: string[] } } };
  audioPath: string;
  sceneIndex: number;
}

export const Flowchart: React.FC<FlowchartProps> = ({ scene, audioPath }) => {
  const frame = useCurrentFrame();
  const steps: string[] = scene.visual?.data?.steps || [];
  const framesPerStep = 20;

  return (
    <SceneWrapper title={scene.title} audioPath={audioPath}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 0, maxWidth: 700 }}>
        {steps.map((step, i) => {
          const start = 20 + i * framesPerStep;
          const opacity = interpolate(frame, [start, start + 15], [0, 1], { extrapolateRight: 'clamp' });
          const x = interpolate(frame, [start, start + 15], [-20, 0], { extrapolateRight: 'clamp' });
          const isLast = i === steps.length - 1;

          return (
            <div key={i} style={{ opacity, display: 'flex', flexDirection: 'column', alignItems: 'flex-start', transform: `translateX(${x}px)` }}>
              {/* Step box */}
              <div style={{
                display: 'flex', alignItems: 'center', gap: 16,
                background: `linear-gradient(135deg, ${COLORS.surface}, ${COLORS.border}33)`,
                border: `1px solid ${COLORS.border}`,
                borderRadius: 12, padding: '14px 24px',
                width: '100%',
              }}>
                <div style={{
                  width: 36, height: 36, borderRadius: '50%',
                  background: `linear-gradient(135deg, ${COLORS.accent}, ${COLORS.accentSoft})`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 15, fontWeight: 700, color: '#fff', flexShrink: 0,
                }}>
                  {i + 1}
                </div>
                <p style={{ margin: 0, fontSize: 18, color: COLORS.text, lineHeight: 1.4 }}>{step}</p>
              </div>

              {/* Connector arrow */}
              {!isLast && (
                <div style={{ paddingLeft: 18, paddingTop: 0 }}>
                  <div style={{
                    width: 2, height: 16, background: COLORS.accent,
                    margin: '0 0 0 17px',
                  }} />
                  <div style={{
                    width: 0, height: 0,
                    borderLeft: '7px solid transparent',
                    borderRight: '7px solid transparent',
                    borderTop: `10px solid ${COLORS.accent}`,
                    marginLeft: 11,
                  }} />
                </div>
              )}
            </div>
          );
        })}
      </div>
    </SceneWrapper>
  );
};
