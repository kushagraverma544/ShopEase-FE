import { Check, ChevronDown } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

import { INPUT_SIZES } from '../../../constants/ui.constants';
import { cn } from '../../../utils/cn';

// Custom-styled dropdown (button + floating listbox) instead of a native
// <select> — meant to be the one dropdown component used throughout the
// app, so it stays generic: value/onChange/options, nothing product-specific.
export function Dropdown({ value, onChange, options, placeholder = 'Select…', size = 'md', className }) {
  const [open, setOpen] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const containerRef = useRef(null);

  const selectedOption = options.find((option) => option.value === value);

  useEffect(() => {
    if (!open) return undefined;

    function handlePointerDown(event) {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setOpen(false);
      }
    }

    document.addEventListener('mousedown', handlePointerDown);
    return () => document.removeEventListener('mousedown', handlePointerDown);
  }, [open]);

  function openMenu() {
    setOpen(true);
    setHighlightedIndex(Math.max(0, options.findIndex((option) => option.value === value)));
  }

  function selectValue(nextValue) {
    onChange(nextValue);
    setOpen(false);
  }

  function handleKeyDown(event) {
    if (!open) {
      if (event.key === 'Enter' || event.key === ' ' || event.key === 'ArrowDown') {
        event.preventDefault();
        openMenu();
      }
      return;
    }

    if (event.key === 'Escape') {
      event.preventDefault();
      setOpen(false);
    } else if (event.key === 'ArrowDown') {
      event.preventDefault();
      setHighlightedIndex((index) => Math.min(index + 1, options.length - 1));
    } else if (event.key === 'ArrowUp') {
      event.preventDefault();
      setHighlightedIndex((index) => Math.max(index - 1, 0));
    } else if (event.key === 'Enter') {
      event.preventDefault();
      const option = options[highlightedIndex];
      if (option) selectValue(option.value);
    }
  }

  return (
    <div ref={containerRef} className={cn('relative', className)}>
      <button
        type="button"
        onClick={() => (open ? setOpen(false) : openMenu())}
        onKeyDown={handleKeyDown}
        aria-haspopup="listbox"
        aria-expanded={open}
        className={cn(
          'flex w-full items-center justify-between gap-2 rounded-md border border-neutral-200 bg-neutral-0 text-left text-neutral-800 transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500',
          INPUT_SIZES[size],
        )}
      >
        <span className={cn('truncate', !selectedOption && 'text-neutral-400')}>
          {selectedOption ? selectedOption.label : placeholder}
        </span>
        <ChevronDown
          className={cn('h-4 w-4 shrink-0 text-neutral-400 transition-transform duration-150', open && 'rotate-180')}
          strokeWidth={1.75}
        />
      </button>

      {open ? (
        <ul
          role="listbox"
          className="absolute z-20 mt-1.5 max-h-60 w-full overflow-auto rounded-md border border-neutral-100 bg-neutral-0 py-1 shadow-drawer"
        >
          <li
            role="option"
            aria-selected={!value}
            onClick={() => selectValue('')}
            className="cursor-pointer px-3 py-2 text-sm text-neutral-400 hover:bg-neutral-50"
          >
            {placeholder}
          </li>
          {options.map((option, index) => (
            <li
              key={option.value}
              role="option"
              aria-selected={option.value === value}
              onMouseEnter={() => setHighlightedIndex(index)}
              onClick={() => selectValue(option.value)}
              className={cn(
                'flex cursor-pointer items-center justify-between gap-2 px-3 py-2 text-sm text-neutral-700 transition-colors duration-100 hover:bg-primary-50 hover:text-primary-700',
                index === highlightedIndex && 'bg-primary-50 text-primary-700',
              )}
            >
              {option.label}
              {option.value === value ? <Check className="h-4 w-4" strokeWidth={2} /> : null}
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}
