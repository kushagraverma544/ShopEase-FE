import { RefreshCw } from 'lucide-react';
import { useCallback, useEffect, useRef, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';

import { Skeleton } from '../../../components/common/Skeleton/Skeleton';
import { getCategoryIcon } from '../../../constants/categoryIcons';
import { SIDEBAR_BOTTOM_NAV_ITEMS, SIDEBAR_TOP_NAV_ITEMS } from '../../../constants/nav.constants';
import { SIDEBAR_CATEGORIES_SKELETON_COUNT } from '../../../constants/product.constants';
import {
  mobileDrawerClosed,
  selectMobileDrawerOpen,
  selectSidebarHovered,
  sidebarHoverEnded,
  sidebarHoverStarted,
} from '../../../features/ui/uiSlice';
import { useAppDispatch } from '../../../hooks/useAppDispatch';
import { useAppSelector } from '../../../hooks/useAppSelector';
import { ROUTE_PATHS } from '../../../routes/routePaths';
import { getCategories } from '../../../services/productService';
import { cn } from '../../../utils/cn';

function SidebarItemSkeleton({ expanded }) {
  return (
    <div className="mx-2 flex h-11 items-center gap-3 px-3.5">
      <Skeleton className="h-5 w-5 shrink-0 rounded-full" />
      {expanded ? <Skeleton className="h-4 w-24" /> : null}
    </div>
  );
}

function SidebarRetry({ expanded, onRetry }) {
  return (
    <button
      type="button"
      onClick={onRetry}
      title="Retry loading categories"
      className="mx-2 flex h-11 items-center gap-3 rounded-md px-3.5 text-sm font-medium text-danger-600 transition-colors duration-150 hover:bg-danger-50"
    >
      <RefreshCw className="h-5 w-5 shrink-0" strokeWidth={1.75} />
      <span
        className={cn(
          'whitespace-nowrap transition-opacity duration-150',
          expanded ? 'opacity-100' : 'opacity-0',
        )}
      >
        Retry
      </span>
    </button>
  );
}

function SidebarNavLink({ to, icon: Icon, label, expanded, onNavigate, active }) {
  return (
    <Link
      to={to}
      onClick={onNavigate}
      className={cn(
        'mx-2 flex h-11 items-center gap-3 rounded-md px-3.5 text-sm font-medium text-neutral-600 hover:bg-primary-50 hover:text-primary-700 transition-colors duration-150',
        active && 'bg-primary-50 text-primary-700',
      )}
    >
      <Icon className="h-5 w-5 shrink-0" strokeWidth={1.75} />
      <span
        className={cn(
          'whitespace-nowrap transition-opacity duration-150',
          expanded ? 'opacity-100' : 'opacity-0',
        )}
      >
        {label}
      </span>
    </Link>
  );
}

export function Sidebar() {
  const dispatch = useAppDispatch();
  const expanded = useAppSelector(selectSidebarHovered);
  const mobileOpen = useAppSelector(selectMobileDrawerOpen);
  const [categories, setCategories] = useState([]);
  const [categoriesStatus, setCategoriesStatus] = useState('loading');
  const isMountedRef = useRef(false);

  const fetchCategories = useCallback(() => {
    getCategories()
      .then((data) => {
        if (isMountedRef.current) {
          setCategories(data ?? []);
          setCategoriesStatus('success');
        }
      })
      .catch(() => {
        if (isMountedRef.current) setCategoriesStatus('error');
      });
  }, []);

  useEffect(() => {
    isMountedRef.current = true;
    fetchCategories();
    return () => {
      isMountedRef.current = false;
    };
  }, [fetchCategories]);

  const retryCategories = useCallback(() => {
    setCategoriesStatus('loading');
    fetchCategories();
  }, [fetchCategories]);

  const showExpandedLabel = expanded || mobileOpen;
  const closeMobileDrawer = () => dispatch(mobileDrawerClosed());

  const location = useLocation();
  const isProductsPath = location.pathname === ROUTE_PATHS.PRODUCTS;
  const activeCategorySlug = new URLSearchParams(location.search).get('category');

  function isTopItemActive(item) {
    if (item.id === 'categories') return isProductsPath && !activeCategorySlug;
    return location.pathname === item.path;
  }

  return (
    <>
      {mobileOpen ? (
        <button
          type="button"
          aria-label="Close menu"
          onClick={closeMobileDrawer}
          className="fixed inset-0 z-(--z-drawer-backdrop) bg-neutral-900/40 md:hidden"
        />
      ) : null}

      <aside
        onMouseEnter={() => dispatch(sidebarHoverStarted())}
        onMouseLeave={() => dispatch(sidebarHoverEnded())}
        className={cn(
          'fixed top-(--header-height) bottom-0 left-0 z-(--z-sidebar) flex flex-col overflow-hidden bg-neutral-0 py-3 shadow-drawer transition-[width,transform] duration-(--sidebar-transition-duration) ease-(--sidebar-transition-ease)',
          expanded ? 'w-(--sidebar-width-expanded)' : 'w-(--sidebar-width-collapsed)',
          mobileOpen
            ? 'translate-x-0 w-(--sidebar-width-expanded)'
            : '-translate-x-full md:translate-x-0',
        )}
      >
        <div className="flex flex-1 flex-col overflow-x-hidden overflow-y-auto">
          <nav className="flex flex-col gap-1">
            {SIDEBAR_TOP_NAV_ITEMS.map((item) => (
              <SidebarNavLink
                key={item.id}
                to={item.path}
                icon={item.icon}
                label={item.label}
                expanded={showExpandedLabel}
                onNavigate={closeMobileDrawer}
                active={isTopItemActive(item)}
              />
            ))}
          </nav>

          <div className="my-2 border-t border-neutral-100" />

          <nav className="flex flex-col gap-1">
            {categoriesStatus === 'loading'
              ? Array.from({ length: SIDEBAR_CATEGORIES_SKELETON_COUNT }).map((_, index) => (
                  <SidebarItemSkeleton key={index} expanded={showExpandedLabel} />
                ))
              : null}

            {categoriesStatus === 'error' ? (
              <SidebarRetry expanded={showExpandedLabel} onRetry={retryCategories} />
            ) : null}

            {categories.map((category) => (
              <SidebarNavLink
                key={category.slug}
                to={`${ROUTE_PATHS.PRODUCTS}?category=${category.slug}`}
                icon={getCategoryIcon(category.slug)}
                label={category.name}
                expanded={showExpandedLabel}
                onNavigate={closeMobileDrawer}
                active={isProductsPath && activeCategorySlug === category.slug}
              />
            ))}
          </nav>
        </div>

        <div className="border-t border-neutral-100 pt-2 shrink-0">
          <nav className="flex flex-col gap-1">
            {SIDEBAR_BOTTOM_NAV_ITEMS.map((item) => (
              <SidebarNavLink
                key={item.id}
                to={item.path}
                icon={item.icon}
                label={item.label}
                expanded={showExpandedLabel}
                onNavigate={closeMobileDrawer}
                active={location.pathname === item.path}
              />
            ))}
          </nav>
        </div>
      </aside>
    </>
  );
}
