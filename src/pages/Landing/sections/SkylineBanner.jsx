import { Button } from '../../../components/common/Button/Button';
import { SKYLINE_BANNER_CONTENT } from '../../../constants/skylineBanner.constants';

export function SkylineBanner() {
  return (
    <section className="mx-auto max-w-6xl px-6 py-4">
      <div className="relative h-64 w-full overflow-hidden rounded-xl shadow-elevated md:h-72">
        <img src={SKYLINE_BANNER_CONTENT.imageUrl} alt="" className="h-full w-full object-cover" />
        {/* Blurred copy of the same image, masked to fade out by the time it
            reaches the sharp right side — softens just the area behind the
            text instead of blurring the whole banner. */}
        <img
          src={SKYLINE_BANNER_CONTENT.imageUrl}
          alt=""
          aria-hidden="true"
          className="absolute inset-0 h-full w-full object-cover blur-[2px]"
          style={{
            maskImage: 'linear-gradient(to right, black 0%, black 20%, transparent 40%)',
            WebkitMaskImage: 'linear-gradient(to right, black 0%, black 20%, transparent 40%)',
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-neutral-900/80 via-neutral-900/40 to-transparent" />

        <div className="absolute inset-0 flex flex-col items-start justify-center gap-3 px-8 md:px-12">
          <span className="text-xs font-semibold uppercase tracking-wide text-primary-300">
            {SKYLINE_BANNER_CONTENT.badge}
          </span>
          <h3 className="text-2xl font-semibold text-neutral-0 md:text-3xl">
            {SKYLINE_BANNER_CONTENT.title}
          </h3>
          <p className="max-w-md text-sm text-neutral-100">{SKYLINE_BANNER_CONTENT.description}</p>
          {/* No redirect target yet — this links out to a separate product. */}
          <Button variant="primary" className="mt-2">
            {SKYLINE_BANNER_CONTENT.ctaLabel}
          </Button>
        </div>
      </div>
    </section>
  );
}
