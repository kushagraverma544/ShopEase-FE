import { cn } from '../../../utils/cn';

const SIZE_CLASSES = {
  sm: 'h-8 w-8',
  md: 'h-10 w-10',
  lg: 'h-12 w-12',
};

export function IconButton({ icon: Icon, size = 'md', label, className, ...rest }) {
  return (
    <button
      type="button"
      aria-label={label}
      className={cn(
        'inline-flex items-center justify-center rounded-full text-neutral-600 hover:bg-neutral-100 hover:text-neutral-900 transition-colors duration-150',
        SIZE_CLASSES[size],
        className,
      )}
      {...rest}
    >
      <Icon className="h-5 w-5" strokeWidth={1.75} />
    </button>
  );
}
