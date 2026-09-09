import { ChevronDown, ChevronUp } from 'lucide-react';
import { useState } from 'react';

import { IconButton } from '../../common/IconButton/IconButton';
import { cn } from '../../../utils/cn';

const VISIBLE_THUMBNAILS = 4;

export function ImageGallery({ images, title }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [scrollStart, setScrollStart] = useState(0);

  const canScrollUp = scrollStart > 0;
  const canScrollDown = scrollStart + VISIBLE_THUMBNAILS < images.length;
  const visibleThumbnails = images.slice(scrollStart, scrollStart + VISIBLE_THUMBNAILS);

  return (
    <div className="flex gap-4">
      <div className="flex w-20 shrink-0 flex-col items-center gap-2">
        <IconButton
          icon={ChevronUp}
          label="Previous images"
          size="sm"
          disabled={!canScrollUp}
          onClick={() => setScrollStart((start) => Math.max(0, start - 1))}
        />

        <div className="flex flex-col gap-2">
          {visibleThumbnails.map((image, index) => {
            const realIndex = scrollStart + index;
            return (
              <button
                key={image}
                type="button"
                onClick={() => setActiveIndex(realIndex)}
                className={cn(
                  'h-16 w-16 overflow-hidden rounded-md border-2 bg-neutral-50 transition-colors duration-150',
                  activeIndex === realIndex
                    ? 'border-primary-600'
                    : 'border-neutral-200 hover:border-neutral-300',
                )}
              >
                <img
                  src={image}
                  alt={`${title} thumbnail ${realIndex + 1}`}
                  className="h-full w-full object-contain p-1"
                />
              </button>
            );
          })}
        </div>

        <IconButton
          icon={ChevronDown}
          label="Next images"
          size="sm"
          disabled={!canScrollDown}
          onClick={() =>
            setScrollStart((start) => Math.min(images.length - VISIBLE_THUMBNAILS, start + 1))
          }
        />
      </div>

      <div className="flex h-96 flex-1 items-center justify-center rounded-lg border border-neutral-100 bg-neutral-50 p-6">
        <img src={images[activeIndex]} alt={title} className="h-full w-full object-contain" />
      </div>
    </div>
  );
}
