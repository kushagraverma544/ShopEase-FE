import { Mail } from 'lucide-react';
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
    <section className="bg-neutral-800 px-6 py-12">
      <form
        onSubmit={handleSubmit}
        className="mx-auto flex max-w-2xl flex-col items-center gap-4 text-center"
      >
        <h3 className="text-xl font-semibold text-neutral-0">Stay in the loop</h3>
        <p className="text-sm text-neutral-300">
          Subscribe for exclusive deals and new arrivals, straight to your inbox.
        </p>
        <div className="flex w-full max-w-md flex-col gap-2 sm:flex-row">
          <Input
            type="email"
            required
            icon={Mail}
            placeholder="you@example.com"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
          />
          <Button type="submit" variant="accent">
            Subscribe
          </Button>
        </div>
        {submitted ? (
          <p className="text-sm text-success-500">Thanks for subscribing!</p>
        ) : null}
      </form>
    </section>
  );
}
