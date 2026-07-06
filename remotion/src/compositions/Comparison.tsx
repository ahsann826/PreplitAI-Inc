import React from 'react';
import { useCurrentFrame, interpolate } from 'remotion';
import { SceneWrapper, COLORS } from '../SceneWrapper';

interface ComparisonProps {
  scene: {
    title: string;
    visual: { data: { left_label: string; right_label: string; left_points: string[]; right_points: string[] } };
  };
  audioPath: string;
  sceneIndex: number;
}

export const Comparison: React.FC<ComparisonProps> = ({ scene, audioPath }) => {
  const frame = useCurrentFrame();
  const { left_label, right_label, left_points = [], right_points = [] } = scene.visual?.data || {};

  const maxPoints = Math.max(left_points.length, right_points.length);
  const colOpacity = interpolate(frame, [15, 30], [0, 1], { extrapolateRight: 'clamp' });

  const Column = ({
    label, points, accentColor, startFrame,
  }: { label: string; points: string[]; accentColor: string; startFrame: number }) => (
    <div style={{ flex: 1, opacity: colOpacity }}>
      <div style={{
        background: `${accentColor}22`,
        border: `1px solid ${accentColor}55`,
        borderRadius: '12px 12px 0 0', padding: '14px 20px', textAlign: 'center',
      }}>
        <p style={{ margin: 0, fontSize: 18, fontWeight: 700, color: accentColor }}>{label}</p>
      </div>
      <div style={{ border: `1px solid ${accentColor}33`, borderTop: 'none', borderRadius: '0 0 12px 12px', overflow: 'hidden' }}>
        {points.map((pt, i) => {
          const s = startFrame + i * 12;
          const op = interpolate(frame, [s, s + 10], [0, 1], { extrapolateRight: 'clamp' });
          return (
            <div key={i} style={{
              padding: '12px 20px', opacity: op,
              background: i % 2 === 0 ? COLORS.surface : `${COLORS.border}44`,
              borderTop: `1px solid ${COLORS.border}`,
              display: 'flex', alignItems: 'center', gap: 12,
            }}>
              <div style={{ width: 6, height: 6, borderRadius: '50%', background: accentColor, flexShrink: 0 }} />
              <p style={{ margin: 0, fontSize: 15, color: COLORS.text, lineHeight: 1.4 }}>{pt}</p>
            </div>
          );
        })}
      </div>
    </div>
  );

  return (
    <SceneWrapper title={scene.title} audioPath={audioPath}>
      <div style={{ display: 'flex', gap: 24, height: '100%' }}>
        <Column label={left_label}  points={left_points}  accentColor={COLORS.accent}     startFrame={30} />
        {/* Divider */}
        <div style={{ width: 2, background: COLORS.border, borderRadius: 1, alignSelf: 'stretch' }} />
        <Column label={right_label} points={right_points} accentColor={COLORS.accentSoft}  startFrame={30} />
      </div>
    </SceneWrapper>
  );
};
