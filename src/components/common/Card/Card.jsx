import { cn } from '../../../utils/cn';

export function Card({ className, children, ...rest }) {
  return (
    <div
      className={cn(
        'rounded-lg bg-neutral-0 shadow-card border border-neutral-100 overflow-hidden dark:bg-neutral-800 dark:border-neutral-700',
        className,
      )}
      {...rest}
    >
      {children}
    </div>
  );
}
