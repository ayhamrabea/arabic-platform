// tailwind.config.ts
import type { Config } from 'tailwindcss';
import { theme } from './lib/theme';

const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: theme.primary,
        secondary: theme.secondary,
        accent: theme.accent,
        success: theme.success,
        error: theme.error,
        warning: theme.warning,
        info: theme.info,
        muted: theme.muted,
        highlight: theme.highlight,
        cardBg: theme.cardBg,
        background: theme.background,
        surface: theme.surface,
        textPrimary: theme.textPrimary,
        textSecondary: theme.textSecondary,
        textMuted: theme.textMuted,
        border: theme.border,
      },
      boxShadow: {
        light: theme.shadowLight,
        medium: theme.shadowMedium,
        heavy: theme.shadowHeavy,
      },
      borderRadius: {
        sm: theme.radius.sm,
        DEFAULT: theme.radius.DEFAULT,
        md: theme.radius.md,
        lg: theme.radius.lg,
        full: theme.radius.full,
      },
      fontFamily: {
        sans: theme.font.sans,
        heading: theme.font.heading,
        mono: theme.font.mono,
      },
    },
  },
  plugins: [],
};

export default config;
