import { INPUT_SIZES } from '../../../constants/ui.constants';
import { cn } from '../../../utils/cn';

export function Input({ size = 'md', icon: Icon, className, ...rest }) {
  return (
    <div className="relative flex items-center w-full">
      {Icon ? (
        <Icon className="absolute left-3 h-4 w-4 text-neutral-400" strokeWidth={1.75} />
      ) : null}
      <input
        className={cn(
          'w-full rounded-md border border-neutral-200 bg-neutral-0 text-neutral-800 placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors duration-150',
          INPUT_SIZES[size],
          Icon && 'pl-9',
          className,
        )}
        {...rest}
      />
    </div>
  );
}
