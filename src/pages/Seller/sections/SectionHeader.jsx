import { cn } from '../../../utils/cn';
import { CHIP_COLOR_CLASSES } from './chipColors';

const SIZE_CLASSES = {
  sm: 'h-8 w-8 rounded-lg',
  md: 'h-9 w-9 rounded-lg',
  lg: 'h-12 w-12 rounded-xl',
};

const ICON_SIZE_CLASSES = {
  sm: 'h-4 w-4',
  md: 'h-5 w-5',
  lg: 'h-6 w-6',
};

export function IconChip({ icon: Icon, color = 'primary', variant = 'soft', size = 'md', className }) {
  return (
    <span
      className={cn(
        'flex shrink-0 items-center justify-center',
        SIZE_CLASSES[size],
        CHIP_COLOR_CLASSES[variant][color],
        className,
      )}
    >
      <Icon className={ICON_SIZE_CLASSES[size]} strokeWidth={2} />
    </span>
  );
}

export function SectionHeader({ icon, color = 'primary', title, subtitle }) {
  return (
    <div className="mb-4 flex items-center gap-3">
      <IconChip icon={icon} color={color} />
      <div>
        <h2 className="text-base font-semibold text-neutral-900">{title}</h2>
        {subtitle ? <p className="text-xs text-neutral-500">{subtitle}</p> : null}
      </div>
    </div>
  );
}
