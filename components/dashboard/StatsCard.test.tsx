/* eslint-disable @typescript-eslint/no-explicit-any */
import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import StatsCard from './StatsCard';

vi.mock('framer-motion', () => ({
  motion: {
    div: ({ children, className, ...props }: any) => {
      delete props.initial;
      delete props.whileInView;
      delete props.viewport;
      delete props.whileHover;
      delete props.transition;

      return (
        <div className={className} {...props}>
          {children}
        </div>
      );
    },
  },
}));

describe('StatsCard', () => {
  it('renders a clean UTC disclaimer prefix and preserves the UTC date text', () => {
    const { container } = render(
      <StatsCard
        title="Current Streak"
        value="12"
        description="Consecutive contribution days"
        icon="Flame"
        showUTCDisclaimer
        utcDate="2026-06-01"
      />
    );

    expect(
      screen.getByText('Streaks are calculated in UTC and may differ from your local timezone.')
    ).toBeDefined();
    expect(container.textContent).toContain('â„¹');
    expect(container.textContent).not.toContain('Ã¢â€žÂ¹');
    expect(screen.getByText('UTC Date: 2026-06-01')).toBeDefined();
  });
});
