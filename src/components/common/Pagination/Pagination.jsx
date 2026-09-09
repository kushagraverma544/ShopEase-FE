import { ChevronLeft, ChevronRight } from 'lucide-react';

import { cn } from '../../../utils/cn';
import { IconButton } from '../IconButton/IconButton';

export function Pagination({ currentPage, totalPages, onPageChange, className }) {
  if (!totalPages || totalPages <= 1) return null;

  return (
    <div className={cn('flex items-center justify-center gap-4', className)}>
      <IconButton
        icon={ChevronLeft}
        label="Previous page"
        disabled={currentPage <= 1}
        onClick={() => onPageChange(currentPage - 1)}
      />
      <span className="text-sm font-medium text-neutral-600">
        Page {currentPage} of {totalPages}
      </span>
      <IconButton
        icon={ChevronRight}
        label="Next page"
        disabled={currentPage >= totalPages}
        onClick={() => onPageChange(currentPage + 1)}
      />
    </div>
  );
}
