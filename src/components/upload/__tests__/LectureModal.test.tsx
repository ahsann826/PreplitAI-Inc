import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { LectureModal } from '../LectureModal';
import { BrowserRouter } from 'react-router-dom';

// Simple mock for testing basic render
describe('LectureModal', () => {
  it('renders nothing when not open', () => {
    const { container } = render(
      <BrowserRouter>
        <LectureModal isOpen={false} onClose={() => {}} lecture={null} />
      </BrowserRouter>
    );
    expect(container.firstChild).toBeNull();
  });
});
