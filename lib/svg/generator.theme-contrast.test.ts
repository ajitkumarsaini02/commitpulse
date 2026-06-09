import { describe, it, expect } from 'vitest';
import { generateSVG } from './generator';
import type { BadgeParams, ContributionCalendar, StreakStats } from '../../types';
import { hexColor } from './sanitizer';

describe('theme contrast', () => {
  const stats: StreakStats = {
    currentStreak: 5,
    longestStreak: 10,
    totalContributions: 100,
    todayDate: '2026-06-09',
  };

  const calendar: ContributionCalendar = {
    totalContributions: 100,
    weeks: [],
  };

  const params: BadgeParams = {
    user: 'theme-test',
    bg: hexColor('0d1117'),
    text: hexColor('c9d1d9'),
    accent: hexColor('58a6ff'),
    speed: '8s',
    scale: 'linear',
    autoTheme: true,
  };

  it('includes dark mode media query', () => {
    const svg = generateSVG(stats, params, calendar);

    expect(svg).toContain('prefers-color-scheme: dark');
  });

  it('defines theme CSS variables', () => {
    const svg = generateSVG(stats, params, calendar);

    expect(svg).toContain('--cp-bg');
    expect(svg).toContain('--cp-text');
    expect(svg).toContain('--cp-accent');
  });

  it('includes text styling classes', () => {
    const svg = generateSVG(stats, params, calendar);

    expect(svg).toContain('cp-text-fill');
  });

  it('includes accent styling classes', () => {
    const svg = generateSVG(stats, params, calendar);

    expect(svg).toContain('cp-accent-fill');
  });

  it('includes background styling classes', () => {
    const svg = generateSVG(stats, params, calendar);

    expect(svg).toContain('cp-bg-fill');
  });
});
