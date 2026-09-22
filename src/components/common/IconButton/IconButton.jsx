import { cn } from '../../../utils/cn';

const SIZE_CLASSES = {
  sm: 'h-8 w-8',
  md: 'h-10 w-10',
  lg: 'h-12 w-12',
};

export function IconButton({
  as: Component = 'button',
  icon: Icon,
  size = 'md',
  label,
  className,
  tooltip = false,
  ...rest
}) {
  const button = (
    <Component
      {...(Component === 'button' ? { type: 'button' } : null)}
      aria-label={label}
      className={cn(
        'inline-flex items-center justify-center rounded-full text-neutral-600 hover:bg-neutral-100 hover:text-neutral-900 transition-colors duration-150 disabled:pointer-events-none disabled:opacity-40 dark:text-neutral-300 dark:hover:bg-neutral-700 dark:hover:text-neutral-50',
        SIZE_CLASSES[size],
        className,
      )}
      {...rest}
    >
      <Icon className="h-5 w-5" strokeWidth={1.75} />
    </Component>
  );

  if (!tooltip || !label) return button;

  return (
    <span className="group/tooltip relative inline-flex">
      {button}
      <span className="pointer-events-none absolute top-full left-1/2 z-20 mt-2 hidden -translate-x-1/2 rounded-md bg-neutral-900 px-2 py-1 text-xs font-medium whitespace-nowrap text-neutral-0 group-hover/tooltip:block">
        {label}
      </span>
    </span>
  );
}
