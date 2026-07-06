import React from 'react';
import { useCurrentFrame, interpolate } from 'remotion';
import { SceneWrapper, COLORS } from '../SceneWrapper';

interface Bar { label: string; value: number; }
interface BarChartProps {
  scene: { title: string; visual: { data: { title: string; bars: Bar[] } } };
  audioPath: string;
  sceneIndex: number;
}

export const BarChart: React.FC<BarChartProps> = ({ scene, audioPath }) => {
  const frame = useCurrentFrame();
  const { title: chartTitle, bars = [] } = scene.visual?.data || {};
  const maxValue = Math.max(...bars.map(b => b.value), 1);
  const CHART_HEIGHT = 280;
  const ANIM_START   = 25;
  const ANIM_DUR     = 40;

  return (
    <SceneWrapper title={scene.title} audioPath={audioPath}>
      {chartTitle && (
        <p style={{ margin: '0 0 20px', fontSize: 15, color: COLORS.textMuted, textTransform: 'uppercase', letterSpacing: 2 }}>
          {chartTitle}
        </p>
      )}

      <div style={{
        display: 'flex', alignItems: 'flex-end', justifyContent: 'space-around',
        height: CHART_HEIGHT, gap: 16, paddingBottom: 40, position: 'relative',
      }}>
        {/* Baseline */}
        <div style={{
          position: 'absolute', bottom: 40, left: 0, right: 0,
          height: 2, background: COLORS.border, borderRadius: 1,
        }} />

        {bars.map((bar, i) => {
          const targetRatio = bar.value / maxValue;
          const progress    = interpolate(frame, [ANIM_START + i * 8, ANIM_START + i * 8 + ANIM_DUR], [0, 1], { extrapolateRight: 'clamp' });
          const barH        = progress * targetRatio * (CHART_HEIGHT - 40);
          const labelOp     = interpolate(frame, [ANIM_START + i * 8 + 20, ANIM_START + i * 8 + 35], [0, 1], { extrapolateRight: 'clamp' });

          // Gradient from accent to a lighter shade per bar
          const hue = (i * 37) % 360;
          const barColor = i === 0 ? COLORS.accent : `hsl(${hue}, 70%, 60%)`;

          return (
            <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'flex-end', gap: 8, height: '100%' }}>
              {/* Value label */}
              <p style={{ margin: 0, fontSize: 14, fontWeight: 700, color: barColor, opacity: labelOp }}>
                {bar.value}
              </p>
              {/* Bar */}
              <div style={{
                width: '70%', height: barH,
                background: `linear-gradient(180deg, ${barColor}, ${barColor}88)`,
                borderRadius: '6px 6px 0 0',
                transition: 'height 0.05s',
              }} />
              {/* Label */}
              <p style={{ margin: 0, fontSize: 13, color: COLORS.textMuted, textAlign: 'center', opacity: labelOp, position: 'absolute', bottom: 6, maxWidth: '90%' }}>
                {bar.label}
              </p>
            </div>
          );
        })}
      </div>
    </SceneWrapper>
  );
};
