import React from 'react';
import { useCurrentFrame, interpolate } from 'remotion';
import { SceneWrapper, COLORS } from '../SceneWrapper';

interface DiagramPart { label: string; description: string; }
interface DiagramProps {
  scene: { title: string; visual: { data: { title: string; parts: DiagramPart[] } } };
  audioPath: string;
  sceneIndex: number;
}

export const Diagram: React.FC<DiagramProps> = ({ scene, audioPath }) => {
  const frame = useCurrentFrame();
  const { title: diagramTitle, parts = [] } = scene.visual?.data || {};

  return (
    <SceneWrapper title={scene.title} audioPath={audioPath}>
      {diagramTitle && (
        <p style={{
          margin: '0 0 24px', fontSize: 16,
          color: COLORS.textMuted, textTransform: 'uppercase', letterSpacing: 2,
        }}>
          {diagramTitle}
        </p>
      )}

      <div style={{
        display: 'grid',
        gridTemplateColumns: `repeat(${Math.min(parts.length, 3)}, 1fr)`,
        gap: 20,
      }}>
        {parts.map((part, i) => {
          const start = 20 + i * 15;
          const opacity = interpolate(frame, [start, start + 14], [0, 1], { extrapolateRight: 'clamp' });
          const scale   = interpolate(frame, [start, start + 14], [0.9, 1], { extrapolateRight: 'clamp' });

          return (
            <div key={i} style={{
              opacity, transform: `scale(${scale})`,
              background: COLORS.surface,
              border: `1px solid ${COLORS.border}`,
              borderRadius: 16, padding: '20px 24px',
              display: 'flex', flexDirection: 'column', gap: 10,
            }}>
              {/* Colored index badge */}
              <div style={{
                width: 32, height: 32, borderRadius: '50%',
                background: `linear-gradient(135deg, ${COLORS.accent}, ${COLORS.accentSoft})`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 13, fontWeight: 700, color: '#fff',
              }}>
                {String.fromCharCode(65 + i)}
              </div>
              <p style={{ margin: 0, fontSize: 17, fontWeight: 700, color: COLORS.text }}>{part.label}</p>
              <p style={{ margin: 0, fontSize: 14, color: COLORS.textMuted, lineHeight: 1.5 }}>{part.description}</p>
            </div>
          );
        })}
      </div>
    </SceneWrapper>
  );
};
