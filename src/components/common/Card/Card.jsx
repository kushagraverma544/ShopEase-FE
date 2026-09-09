import { cn } from '../../../utils/cn';

export function Card({ className, children, ...rest }) {
  return (
    <div
      className={cn(
        'rounded-lg bg-neutral-0 shadow-card border border-neutral-100 overflow-hidden',
        className,
      )}
      {...rest}
    >
      {children}
    </div>
  );
}
