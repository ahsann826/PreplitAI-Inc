import React from 'react';
import { useCurrentFrame, useVideoConfig, interpolate, Audio } from 'remotion';

// ── Design tokens ──────────────────────────────────────────────────────────────
export const COLORS = {
  bg:        '#0f0f1a',
  surface:   '#1a1a2e',
  accent:    '#e63946',
  accentSoft:'#ff6b6b',
  text:      '#f1f1f1',
  textMuted: '#9999bb',
  border:    '#2a2a4a',
};

export const FONTS = {
  heading: 'system-ui, -apple-system, sans-serif',
  body:    'system-ui, -apple-system, sans-serif',
};

// ── SceneWrapper ───────────────────────────────────────────────────────────────
// Every composition wraps its content with this — handles:
//  • Background gradient
//  • Fade-in animation (first 15 frames)
//  • Title bar at top
//  • Optional audio track
//  • Slide-in for the content area
interface SceneWrapperProps {
  title: string;
  audioPath?: string;
  children: React.ReactNode;
}

export const SceneWrapper: React.FC<SceneWrapperProps> = ({ title, audioPath, children }) => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();

  const opacity = interpolate(frame, [0, 15], [0, 1], { extrapolateRight: 'clamp' });
  const contentY = interpolate(frame, [0, 20], [30, 0], { extrapolateRight: 'clamp' });
  const fadeOut  = interpolate(frame, [durationInFrames - 15, durationInFrames], [1, 0], { extrapolateLeft: 'clamp' });

  return (
    <div style={{
      width: '100%', height: '100%',
      background: `linear-gradient(135deg, ${COLORS.bg} 0%, ${COLORS.surface} 100%)`,
      fontFamily: FONTS.body,
      color: COLORS.text,
      opacity: opacity * fadeOut,
      overflow: 'hidden',
      display: 'flex',
      flexDirection: 'column',
    }}>
      {/* Audio track */}
      {audioPath && <Audio src={audioPath} />}

      {/* Title bar */}
      <div style={{
        padding: '28px 48px 20px',
        borderBottom: `2px solid ${COLORS.border}`,
        display: 'flex', alignItems: 'center', gap: 16,
      }}>
        <div style={{
          width: 6, height: 32, borderRadius: 3,
          background: `linear-gradient(180deg, ${COLORS.accent}, ${COLORS.accentSoft})`,
        }} />
        <h1 style={{
          margin: 0, fontSize: 28, fontWeight: 700,
          color: COLORS.text, letterSpacing: '-0.5px',
        }}>
          {title}
        </h1>
      </div>

      {/* Content area */}
      <div style={{
        flex: 1, padding: '32px 48px',
        transform: `translateY(${contentY}px)`,
        overflow: 'hidden',
      }}>
        {children}
      </div>
    </div>
  );
};
