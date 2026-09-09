import { useEffect, useState } from 'react';
import { NavLink } from 'react-router-dom';

import { Button } from '../../../components/common/Button/Button';
import { HERO_ROTATION_INTERVAL_MS, HERO_SLIDES_CONTENT } from '../../../constants/heroSlides.constants';
import { getRandomPhoto } from '../../../services/unsplashService';
import { cn } from '../../../utils/cn';
import { HeroFallback } from './HeroFallback';
import { HeroSkeleton } from './HeroSkeleton';

export function HeroSection() {
  const [slides, setSlides] = useState([]);
  const [status, setStatus] = useState('loading');
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    let isMounted = true;

    Promise.all(
      HERO_SLIDES_CONTENT.map((slide) =>
        getRandomPhoto(slide.unsplashQuery).then((photo) => ({
          ...slide,
          imageUrl: photo.urls.regular,
          imageAlt: photo.alt_description ?? slide.title,
        })),
      ),
    )
      .then((resolvedSlides) => {
        if (!isMounted) return;
        setSlides(resolvedSlides);
        setStatus('success');
      })
      .catch(() => {
        if (isMounted) setStatus('error');
      });

    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    if (status !== 'success' || slides.length <= 1 || isPaused) return undefined;
    const intervalId = setInterval(() => {
      setActiveIndex((current) => (current + 1) % slides.length);
    }, HERO_ROTATION_INTERVAL_MS);
    return () => clearInterval(intervalId);
  }, [status, slides.length, isPaused]);

  if (status === 'loading') return <HeroSkeleton />;
  if (status === 'error') return <HeroFallback />;

  const activeSlide = slides[activeIndex];

  function goToSlide(index) {
    setActiveIndex((index + slides.length) % slides.length);
  }

  return (
    <div className="px-6 py-6">
      <div
        className="relative h-(--hero-height) w-full overflow-hidden rounded-xl shadow-elevated"
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
      >
        {slides.map((slide, index) => (
          <img
            key={slide.id}
            src={slide.imageUrl}
            alt={slide.imageAlt}
            className={cn(
              'absolute inset-0 h-full w-full object-cover transition-opacity duration-(--hero-transition-duration)',
              index === activeIndex ? 'opacity-100' : 'opacity-0',
            )}
          />
        ))}

        <div className="absolute inset-0 bg-gradient-to-r from-neutral-900/35 via-neutral-900/10 to-transparent" />

        <div className="absolute left-6 top-1/2 max-w-md -translate-y-1/2 rounded-xl border border-neutral-0/30 bg-neutral-0/45 p-6 shadow-elevated backdrop-blur-md md:left-10 md:p-8">
          <span className="text-xs font-semibold uppercase tracking-wide text-accent-600">
            {activeSlide.badge}
          </span>
          <h2 className="mt-2 text-xl font-semibold text-neutral-900 md:text-2xl">
            {activeSlide.title}
          </h2>
          <p className="mt-2 text-sm text-neutral-700">{activeSlide.description}</p>
          <Button as={NavLink} to={activeSlide.ctaPath} variant="accent" className="mt-4">
            {activeSlide.ctaLabel}
          </Button>
        </div>

        {slides.length > 1 ? (
          <div className="absolute inset-x-0 bottom-4 flex items-center justify-center gap-2 md:bottom-6">
            {slides.map((slide, index) => (
              <button
                key={slide.id}
                type="button"
                aria-label={`Go to slide ${index + 1}`}
                onClick={() => goToSlide(index)}
                className={cn(
                  'h-2 rounded-full transition-all duration-150',
                  index === activeIndex ? 'w-6 bg-neutral-0' : 'w-2 bg-neutral-0/50',
                )}
              />
            ))}
          </div>
        ) : null}
      </div>
    </div>
  );
}
