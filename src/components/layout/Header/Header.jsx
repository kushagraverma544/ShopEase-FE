import { Menu, Search, ShoppingCart, User } from 'lucide-react';
import { NavLink } from 'react-router-dom';

import { Button } from '../../../components/common/Button/Button';
import { IconButton } from '../../../components/common/IconButton/IconButton';
import { Input } from '../../../components/common/Input/Input';
import { HEADER_NAV_LINKS } from '../../../constants/nav.constants';
import { selectCurrentUser } from '../../../features/auth/authSlice';
import { selectCartItemCount } from '../../../features/cart/cartSlice';
import { mobileDrawerToggled } from '../../../features/ui/uiSlice';
import { useAppDispatch } from '../../../hooks/useAppDispatch';
import { useAppSelector } from '../../../hooks/useAppSelector';
import { ROUTE_PATHS } from '../../../routes/routePaths';
import { cn } from '../../../utils/cn';

export function Header() {
  const dispatch = useAppDispatch();
  const cartItemCount = useAppSelector(selectCartItemCount);
  const currentUser = useAppSelector(selectCurrentUser);

  return (
    <header className="fixed inset-x-0 top-0 z-(--z-header) flex h-(--header-height) items-center gap-4 border-b border-neutral-100 bg-neutral-0 px-4 md:px-6">
      <IconButton
        icon={Menu}
        label="Toggle menu"
        className="md:hidden"
        onClick={() => dispatch(mobileDrawerToggled())}
      />

      <NavLink to={ROUTE_PATHS.HOME} className="text-xl font-semibold text-primary-600 shrink-0">
        ShopEase
      </NavLink>

      <nav className="hidden md:flex items-center gap-1">
        {HEADER_NAV_LINKS.map((link) => (
          <NavLink
            key={link.id}
            to={link.path}
            className={({ isActive }) =>
              cn(
                'rounded-md px-3 py-2 text-sm font-medium text-neutral-600 hover:text-primary-600 transition-colors duration-150',
                isActive && 'text-primary-600',
              )
            }
          >
            {link.label}
          </NavLink>
        ))}
      </nav>

      <div className="ml-auto flex flex-1 items-center justify-end gap-2 md:gap-4">
        <div className="hidden sm:block max-w-sm flex-1">
          <Input size="sm" icon={Search} placeholder="Search products…" />
        </div>

        <div className="relative">
          <IconButton icon={ShoppingCart} label="Cart" />
          {cartItemCount > 0 ? (
            <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-accent-500 text-2xs font-semibold text-neutral-0">
              {cartItemCount}
            </span>
          ) : null}
        </div>

        <Button as={NavLink} to={ROUTE_PATHS.LOGIN} size="sm" variant="outline" className="hidden sm:inline-flex">
          <User className="h-4 w-4" strokeWidth={1.75} />
          {currentUser ? currentUser.name : 'Account'}
        </Button>
      </div>
    </header>
  );
}
