import React from 'react';
import { useCurrentFrame, interpolate } from 'remotion';
import { SceneWrapper, COLORS } from '../SceneWrapper';

interface DefinitionProps {
  scene: { title: string; visual: { data: { term: string; explanation: string; example?: string } } };
  audioPath: string;
  sceneIndex: number;
}

export const Definition: React.FC<DefinitionProps> = ({ scene, audioPath }) => {
  const frame = useCurrentFrame();
  const { term, explanation, example } = scene.visual?.data || {};

  const termOpacity   = interpolate(frame, [20, 35], [0, 1], { extrapolateRight: 'clamp' });
  const defOpacity    = interpolate(frame, [35, 50], [0, 1], { extrapolateRight: 'clamp' });
  const exOpacity     = interpolate(frame, [50, 65], [0, 1], { extrapolateRight: 'clamp' });

  return (
    <SceneWrapper title={scene.title} audioPath={audioPath}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 28, maxWidth: 900 }}>

        {/* Term */}
        <div style={{
          opacity: termOpacity,
          background: `linear-gradient(135deg, ${COLORS.accent}22, ${COLORS.accent}11)`,
          border: `1px solid ${COLORS.accent}44`,
          borderRadius: 16, padding: '20px 32px',
        }}>
          <p style={{ margin: 0, fontSize: 13, color: COLORS.accent, textTransform: 'uppercase', letterSpacing: 2, marginBottom: 8 }}>
            Term
          </p>
          <h2 style={{ margin: 0, fontSize: 40, fontWeight: 800, color: COLORS.text }}>
            {term}
          </h2>
        </div>

        {/* Explanation */}
        <div style={{ opacity: defOpacity }}>
          <p style={{ margin: 0, fontSize: 13, color: COLORS.textMuted, textTransform: 'uppercase', letterSpacing: 2, marginBottom: 12 }}>
            Definition
          </p>
          <p style={{ margin: 0, fontSize: 22, lineHeight: 1.7, color: COLORS.text }}>
            {explanation}
          </p>
        </div>

        {/* Example */}
        {example && (
          <div style={{
            opacity: exOpacity,
            background: COLORS.surface,
            border: `1px solid ${COLORS.border}`,
            borderLeft: `4px solid ${COLORS.accentSoft}`,
            borderRadius: 12, padding: '16px 24px',
          }}>
            <p style={{ margin: 0, fontSize: 13, color: COLORS.accentSoft, textTransform: 'uppercase', letterSpacing: 2, marginBottom: 8 }}>
              Example
            </p>
            <p style={{ margin: 0, fontSize: 18, color: COLORS.text, lineHeight: 1.6 }}>
              {example}
            </p>
          </div>
        )}
      </div>
    </SceneWrapper>
  );
};
