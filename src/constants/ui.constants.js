/*
  Central variant → className maps for common components.
  Components must import from here instead of hand-writing utility classes,
  so every Button/Badge/etc. across the app stays visually consistent and
  every size/spacing/color change happens in exactly one place.
*/

export const BUTTON_SIZES = {
  sm: 'h-8 px-3 text-sm gap-1.5',
  md: 'h-10 px-4 text-base gap-2',
  lg: 'h-12 px-6 text-lg gap-2.5',
};

export const BUTTON_VARIANTS = {
  primary:
    'bg-primary-600 text-neutral-0 hover:bg-primary-700 active:bg-primary-800 disabled:bg-neutral-200 disabled:text-neutral-400 dark:disabled:bg-neutral-700 dark:disabled:text-neutral-500',
  secondary:
    'bg-neutral-100 text-neutral-800 hover:bg-neutral-200 active:bg-neutral-300 disabled:bg-neutral-50 disabled:text-neutral-300 dark:bg-neutral-700 dark:text-neutral-100 dark:hover:bg-neutral-600 dark:active:bg-neutral-500 dark:disabled:bg-neutral-800 dark:disabled:text-neutral-600',
  outline:
    'bg-transparent text-primary-600 border border-primary-600 hover:bg-primary-50 disabled:border-neutral-200 disabled:text-neutral-300 dark:text-primary-400 dark:border-primary-400 dark:hover:bg-primary-500/10 dark:disabled:border-neutral-700 dark:disabled:text-neutral-600',
  ghost:
    'bg-transparent text-neutral-700 hover:bg-neutral-100 disabled:text-neutral-300 dark:text-neutral-200 dark:hover:bg-neutral-700 dark:disabled:text-neutral-600',
  danger:
    'bg-danger-600 text-neutral-0 hover:bg-danger-500 disabled:bg-neutral-200 disabled:text-neutral-400 dark:disabled:bg-neutral-700 dark:disabled:text-neutral-500',
  accent:
    'bg-accent-500 text-neutral-0 hover:bg-accent-600 disabled:bg-neutral-200 disabled:text-neutral-400 dark:disabled:bg-neutral-700 dark:disabled:text-neutral-500',
};

export const BADGE_VARIANTS = {
  primary: 'bg-primary-50 text-primary-700 dark:bg-primary-500/15 dark:text-primary-300',
  success: 'bg-success-50 text-success-600 dark:bg-success-500/15 dark:text-success-400',
  warning: 'bg-warning-50 text-warning-600 dark:bg-warning-500/15 dark:text-warning-400',
  danger: 'bg-danger-50 text-danger-600 dark:bg-danger-500/15 dark:text-danger-400',
  neutral: 'bg-neutral-100 text-neutral-600 dark:bg-neutral-700 dark:text-neutral-300',
};

export const INPUT_SIZES = {
  sm: 'h-8 px-3 text-sm',
  md: 'h-10 px-4 text-base',
  lg: 'h-12 px-4 text-lg',
};
