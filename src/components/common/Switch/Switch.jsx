import { cn } from '../../../utils/cn';

export function Switch({ checked, onChange, label, className }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      onClick={() => onChange(!checked)}
      className={cn(
        'relative inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2',
        checked ? 'bg-primary-600' : 'bg-neutral-300',
        className,
      )}
    >
      <span
        className={cn(
          'inline-block h-4 w-4 transform rounded-full bg-neutral-0 shadow-card transition-transform duration-150',
          checked ? 'translate-x-6' : 'translate-x-1',
        )}
      />
    </button>
  );
}
