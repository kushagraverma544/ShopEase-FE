import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react';

import { cn } from '../../../utils/cn';
import { IconButton } from '../IconButton/IconButton';

export function Pagination({ currentPage, totalPages, onPageChange, className }) {
  if (!totalPages || totalPages <= 1) return null;

  const isFirstPage = currentPage <= 1;
  const isLastPage = currentPage >= totalPages;

  return (
    <div className={cn('flex items-center justify-center gap-2', className)}>
      <IconButton
        icon={ChevronsLeft}
        label="First page"
        disabled={isFirstPage}
        onClick={() => onPageChange(1)}
      />
      <IconButton
        icon={ChevronLeft}
        label="Previous page"
        disabled={isFirstPage}
        onClick={() => onPageChange(currentPage - 1)}
      />
      <span className="px-2 text-sm font-medium text-neutral-600">
        Page {currentPage} of {totalPages}
      </span>
      <IconButton
        icon={ChevronRight}
        label="Next page"
        disabled={isLastPage}
        onClick={() => onPageChange(currentPage + 1)}
      />
      <IconButton
        icon={ChevronsRight}
        label="Last page"
        disabled={isLastPage}
        onClick={() => onPageChange(totalPages)}
      />
    </div>
  );
}
