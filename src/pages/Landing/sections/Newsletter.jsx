import { CheckCircle2, Mail } from 'lucide-react';
import { useState } from 'react';

import { Button } from '../../../components/common/Button/Button';
import { Input } from '../../../components/common/Input/Input';

export function Newsletter() {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  function handleSubmit(event) {
    event.preventDefault();
    setSubmitted(true);
  }

  return (
    <section className="mx-auto max-w-6xl px-6 py-4">
      <div className="overflow-hidden rounded-xl bg-gradient-to-br from-neutral-900 to-primary-900 px-6 py-12 shadow-elevated md:px-16 md:py-16">
        <div className="mx-auto flex max-w-xl flex-col items-center gap-4 text-center">
          <span className="flex h-12 w-12 items-center justify-center rounded-full bg-neutral-0/10 text-accent-400">
            <Mail className="h-6 w-6" strokeWidth={1.75} />
          </span>

          <h3 className="text-2xl font-semibold text-neutral-0">Stay in the loop</h3>
          <p className="text-sm text-neutral-300">
            Subscribe for exclusive deals and new arrivals, straight to your inbox.
          </p>

          {submitted ? (
            <div className="flex items-center gap-2 rounded-lg bg-success-500/10 px-4 py-3 text-sm font-medium text-success-500">
              <CheckCircle2 className="h-5 w-5" strokeWidth={1.75} />
              Thanks for subscribing! Check your inbox soon.
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="flex w-full max-w-md flex-col gap-3 sm:flex-row">
              <Input
                type="email"
                required
                icon={Mail}
                placeholder="you@example.com"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
              />
              <Button type="submit" variant="accent" className="shrink-0">
                Subscribe
              </Button>
            </form>
          )}

          <p className="text-xs text-neutral-400">No spam. Unsubscribe anytime.</p>
        </div>
      </div>
    </section>
  );
}
