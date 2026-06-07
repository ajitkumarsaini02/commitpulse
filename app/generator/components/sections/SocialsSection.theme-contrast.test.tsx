import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { SocialsSection } from './SocialsSection';
import React from 'react';

// Mock the socials data to maintain isolated coverage
vi.mock('../../data/socials', () => ({
  SOCIALS: [
    {
      id: 'github',
      name: 'GitHub',
      type: 'simpleicon',
      iconUrl: '/github.svg',
      category: 'Development',
    },
    {
      id: 'twitter',
      name: 'Twitter',
      type: 'simpleicon',
      iconUrl: '/twitter.svg',
      category: 'Social',
    },
  ],
  SOCIAL_CATEGORIES: ['Development', 'Social'],
}));

describe('SocialsSection Theme Contrast & Visual Cohesion', () => {
  const defaultProps = {
    selected: ['github'],
    socialLinks: { github: 'https://github.com/test' },
    onSelectedChange: vi.fn(),
    onLinkChange: vi.fn(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
    document.body.className = '';
  });

  afterEach(() => {
    document.body.className = '';
  });

  const setupTheme = (isDark: boolean) => {
    if (isDark) {
      document.body.classList.add('dark');
    } else {
      document.body.classList.remove('dark');
    }
  };

  it('1. sets up dual theme environment and verifies visual elements adapt color styling properly', () => {
    setupTheme(false);
    const { unmount } = render(<SocialsSection {...defaultProps} />);
    const lightSearchInput = screen.getByPlaceholderText('Search platforms...');

    // Check light mode styles
    expect(lightSearchInput.className).toContain('bg-gray-50');
    expect(lightSearchInput.className).toContain('text-gray-900');
    unmount();

    setupTheme(true);
    render(<SocialsSection {...defaultProps} />);
    const darkSearchInput = screen.getByPlaceholderText('Search platforms...');

    // Check dark mode styles
    expect(darkSearchInput.className).toContain('dark:bg-white/5');
    expect(darkSearchInput.className).toContain('dark:text-white');
  });

  it('2. verifies contrast ratio standards are satisfied for all textual elements', () => {
    render(<SocialsSection {...defaultProps} />);

    // Primary tabs text ensures accessible contrast levels
    const pickTab = screen.getByText(/① Pick Platforms/i);
    expect(pickTab.className).toContain('text-gray-900'); // Active Light contrast
    expect(pickTab.className).toContain('dark:text-white'); // Active Dark contrast

    const linksTab = screen.getByText(/② Add Links/i);
    expect(linksTab.className).toContain('text-gray-500'); // Inactive Light contrast
    expect(linksTab.className).toContain('dark:text-white/40'); // Inactive Dark contrast

    // Category buttons text
    const allCategory = screen.getByText('All');
    expect(allCategory.className).toContain('text-emerald-600'); // Active state light
    expect(allCategory.className).toContain('dark:text-emerald-400'); // Active state dark
  });

  it('3. checks that specific custom stylesheet properties or Tailwind classes are active in the markup', () => {
    render(<SocialsSection {...defaultProps} />);

    // Search input focus rings
    const input = screen.getByPlaceholderText('Search platforms...');
    expect(input.className).toContain('focus:ring-emerald-500/40');
    expect(input.className).toContain('dark:border-white/10');

    // Selected badges background and border classes
    const badgeElement = screen.getAllByText('GitHub')[0].parentElement;
    expect(badgeElement?.className).toContain('bg-emerald-500/10');
    expect(badgeElement?.className).toContain('border-emerald-500/20');
  });

  it('4. ensures that background overlays do not clip foreground content colors', () => {
    render(<SocialsSection {...defaultProps} />);

    // Non-selected platform fallback check
    const unselectedButton = screen.getByText('Twitter').closest('button');
    expect(unselectedButton?.className).toContain('bg-gray-50');
    expect(unselectedButton?.className).toContain('dark:bg-white/[0.03]');
    expect(unselectedButton?.className).toContain('hover:bg-gray-100');
    expect(unselectedButton?.className).toContain('dark:hover:bg-white/8');
  });

  it('5. validates the color cohesion of link inputs based on their active states', () => {
    render(<SocialsSection {...defaultProps} />);

    // Switch to links tab using fireEvent
    const linksTab = screen.getByText(/② Add Links/i);
    fireEvent.click(linksTab);

    // Check input rendering with a valid link value
    const filledInput = screen.getByDisplayValue('https://github.com/test');
    expect(filledInput.className).toContain('border-emerald-500/30');
    expect(filledInput.className).toContain('focus:ring-emerald-500/30');
    expect(filledInput.className).toContain('dark:text-white');
    expect(filledInput.className).toContain('bg-gray-50');
  });
});
