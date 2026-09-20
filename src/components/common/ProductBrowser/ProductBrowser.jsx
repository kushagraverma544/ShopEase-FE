import { Search, SearchX, X } from 'lucide-react';
import { useMemo, useState } from 'react';

import { useDebouncedValue } from '../../../hooks/useDebouncedValue';
import { cn } from '../../../utils/cn';
import { Card } from '../Card/Card';
import { Dropdown } from '../Dropdown/Dropdown';
import { Input } from '../Input/Input';
import { Pagination } from '../Pagination/Pagination';
import { Table } from '../Table/Table';
import { ViewToggle } from '../ViewToggle/ViewToggle';

const DEFAULT_GET_SEARCH_TEXT = (product) => product.name;
const DEFAULT_GET_STATUS = (product) => product.status;
const DEFAULT_GET_CATEGORY = (product) => product.category;

// Generic, data-agnostic browsing UI: search + status/category filters +
// grid/list toggle + pagination, all owned internally. A parent just feeds
// the full item array plus render props for how each item looks — so this
// same component can back both the Seller listings page and (later) an
// Admin products page without any changes here.
export function ProductBrowser({
  products,
  pageSize = 12,
  statusOptions = [],
  searchPlaceholder = 'Search…',
  getSearchText = DEFAULT_GET_SEARCH_TEXT,
  getStatus = DEFAULT_GET_STATUS,
  getCategory = DEFAULT_GET_CATEGORY,
  getItemKey = (item) => item.id,
  renderGridItem,
  listColumns,
  emptyState,
  className,
}) {
  const [searchInput, setSearchInput] = useState('');
  const [status, setStatus] = useState('');
  const [category, setCategory] = useState('');
  const [view, setView] = useState('grid');
  const [page, setPage] = useState(1);

  const debouncedSearch = useDebouncedValue(searchInput, 300);

  const categoryOptions = useMemo(() => {
    const distinct = [...new Set(products.map(getCategory).filter(Boolean))];
    return distinct.sort().map((value) => ({ value, label: value }));
  }, [products, getCategory]);

  const statusOption = statusOptions.find((option) => option.value === status);

  const filtered = useMemo(() => {
    const query = debouncedSearch.trim().toLowerCase();
    return products.filter((product) => {
      const matchesSearch = !query || getSearchText(product).toLowerCase().includes(query);
      // A status option can define its own `predicate` (e.g. "Out of Stock"
      // derived from stock count) instead of matching `getStatus` by value —
      // status and stock are independent dimensions, a product can be both
      // Active and Out of Stock at once.
      const matchesStatus =
        !status || (statusOption?.predicate ? statusOption.predicate(product) : getStatus(product) === status);
      const matchesCategory = !category || getCategory(product) === category;
      return matchesSearch && matchesStatus && matchesCategory;
    });
  }, [products, debouncedSearch, status, statusOption, category, getSearchText, getStatus, getCategory]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));

  // Reset to page 1 when the active filters change, and otherwise clamp to
  // the current filtered result's page count (e.g. after a delete shrinks
  // it) — computed during render per React's "adjust state while rendering"
  // pattern rather than an effect, so there's no extra commit/flicker.
  const filterKey = `${debouncedSearch}|${status}|${category}`;
  const [previousFilterKey, setPreviousFilterKey] = useState(filterKey);
  if (filterKey !== previousFilterKey) {
    setPreviousFilterKey(filterKey);
    setPage(1);
  } else if (page > totalPages) {
    setPage(totalPages);
  }

  const pageItems = filtered.slice((page - 1) * pageSize, page * pageSize);

  return (
    <div className={cn('flex flex-col gap-5', className)}>
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-1 flex-col gap-3 sm:flex-row sm:items-center">
          <div className="relative flex-1 sm:max-w-xs">
            <Input
              icon={Search}
              placeholder={searchPlaceholder}
              value={searchInput}
              onChange={(event) => setSearchInput(event.target.value)}
            />
            {searchInput ? (
              <button
                type="button"
                aria-label="Clear search"
                onClick={() => setSearchInput('')}
                className="absolute top-1/2 right-3 -translate-y-1/2 text-neutral-400 transition-colors duration-150 hover:text-neutral-600"
              >
                <X className="h-4 w-4" strokeWidth={1.75} />
              </button>
            ) : null}
          </div>

          {statusOptions.length > 0 ? (
            <div className="sm:w-40">
              <Dropdown placeholder="All statuses" value={status} onChange={setStatus} options={statusOptions} />
            </div>
          ) : null}

          {categoryOptions.length > 0 ? (
            <div className="sm:w-40">
              <Dropdown
                placeholder="All categories"
                value={category}
                onChange={setCategory}
                options={categoryOptions}
              />
            </div>
          ) : null}
        </div>

        <ViewToggle value={view} onChange={setView} className="self-end sm:self-auto" />
      </div>

      {pageItems.length === 0 ? (
        emptyState ?? (
          <Card className="flex flex-col items-center gap-3 px-6 py-14 text-center">
            <span className="flex h-14 w-14 items-center justify-center rounded-full bg-neutral-100 text-neutral-400">
              <SearchX className="h-7 w-7" strokeWidth={1.5} />
            </span>
            <p className="text-sm text-neutral-500">No results.</p>
          </Card>
        )
      ) : view === 'grid' ? (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {pageItems.map(renderGridItem)}
        </div>
      ) : (
        <Table columns={listColumns} data={pageItems} getRowKey={getItemKey} />
      )}

      <Pagination currentPage={page} totalPages={totalPages} onPageChange={setPage} className="mt-1" />
    </div>
  );
}
