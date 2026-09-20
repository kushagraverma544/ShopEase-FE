import { LayoutGrid, List } from 'lucide-react';

import { cn } from '../../../utils/cn';

const OPTIONS = [
  { value: 'grid', icon: LayoutGrid, label: 'Grid view' },
  { value: 'list', icon: List, label: 'List view' },
];

export function ViewToggle({ value, onChange, className }) {
  return (
    <div className={cn('flex items-center gap-1 rounded-md bg-neutral-100 p-1', className)}>
      {OPTIONS.map((option) => (
        <button
          key={option.value}
          type="button"
          aria-label={option.label}
          aria-pressed={value === option.value}
          onClick={() => onChange(option.value)}
          className={cn(
            'flex h-8 w-8 items-center justify-center rounded-md transition-colors duration-150',
            value === option.value
              ? 'bg-neutral-0 text-primary-600 shadow-card'
              : 'text-neutral-500 hover:text-neutral-800',
          )}
        >
          <option.icon className="h-4 w-4" strokeWidth={1.75} />
        </button>
      ))}
    </div>
  );
}
