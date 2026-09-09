import { cn } from '../../../utils/cn';

const SIZE_CLASSES = {
  sm: 'h-4 w-4 border-2',
  md: 'h-8 w-8 border-2',
  lg: 'h-12 w-12 border-4',
};

export function Loader({ size = 'md', fullScreen = false, className }) {
  const spinner = (
    <span
      role="status"
      aria-label="Loading"
      className={cn(
        'inline-block animate-spin rounded-full border-primary-200 border-t-primary-600',
        SIZE_CLASSES[size],
        className,
      )}
    />
  );

  if (!fullScreen) return spinner;

  return (
    <div className="flex h-full min-h-40 w-full items-center justify-center">{spinner}</div>
  );
}
