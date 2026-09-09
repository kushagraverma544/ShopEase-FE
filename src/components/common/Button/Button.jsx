import { BUTTON_SIZES, BUTTON_VARIANTS } from '../../../constants/ui.constants';
import { cn } from '../../../utils/cn';

export function Button({
  as: Component = 'button',
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  className,
  children,
  ...rest
}) {
  return (
    <Component
      className={cn(
        'inline-flex items-center justify-center rounded-md font-medium transition-colors duration-150 disabled:cursor-not-allowed',
        BUTTON_SIZES[size],
        BUTTON_VARIANTS[variant],
        fullWidth && 'w-full',
        className,
      )}
      {...rest}
    >
      {children}
    </Component>
  );
}
