import { CreditCard, Plus, Trash2, Wifi, X } from 'lucide-react';
import { useState } from 'react';

import { Badge } from '../../../components/common/Badge/Badge';
import { Button } from '../../../components/common/Button/Button';
import { Card } from '../../../components/common/Card/Card';
import { ConfirmDialog } from '../../../components/common/ConfirmDialog/ConfirmDialog';
import { IconButton } from '../../../components/common/IconButton/IconButton';
import { Input } from '../../../components/common/Input/Input';
import { cn } from '../../../utils/cn';

const NETWORKS = [
  { label: 'Visa', gradient: 'from-primary-600 to-primary-900' },
  { label: 'Mastercard', gradient: 'from-neutral-800 to-neutral-900' },
  { label: 'Other', gradient: 'from-accent-600 to-accent-800' },
];

const EMPTY_FORM = { network: 'Visa', number: '', holder: '', expiry: '', isDefault: false };

function CardVisual({ card, onDelete }) {
  return (
    <div
      className={cn(
        'relative flex h-44 w-full flex-col justify-between overflow-hidden rounded-xl bg-gradient-to-br p-5 text-neutral-0 shadow-elevated',
        card.gradient,
      )}
    >
      <CreditCard
        className="absolute -right-4 -bottom-4 h-32 w-32 text-neutral-0/10"
        strokeWidth={1}
      />

      <div className="flex items-start justify-between">
        <div className="h-8 w-11 rounded-md bg-gradient-to-br from-accent-400/80 to-accent-600/80" />
        <div className="flex items-center gap-2">
          {card.isDefault ? (
            <Badge variant="neutral" className="bg-neutral-0/20 text-neutral-0">
              Default
            </Badge>
          ) : null}
          <Wifi className="h-5 w-5 rotate-90 text-neutral-0/80" strokeWidth={1.75} />
          <button
            type="button"
            aria-label="Delete card"
            onClick={onDelete}
            className="relative flex h-7 w-7 items-center justify-center rounded-full text-neutral-0/80 transition-colors duration-150 hover:bg-neutral-0/20 hover:text-neutral-0"
          >
            <Trash2 className="h-4 w-4" strokeWidth={1.75} />
          </button>
        </div>
      </div>

      <div className="relative">
        <p className="text-lg font-medium tracking-[0.2em]">•••• •••• •••• {card.last4}</p>
        <div className="mt-3 flex items-end justify-between">
          <div>
            <p className="text-2xs text-neutral-0/60 uppercase">Card Holder</p>
            <p className="text-sm font-medium">{card.holder}</p>
          </div>
          <div className="text-right">
            <p className="text-2xs text-neutral-0/60 uppercase">Expires</p>
            <p className="text-sm font-medium">{card.expiry}</p>
          </div>
          <p className="text-sm font-semibold italic">{card.network}</p>
        </div>
      </div>
    </div>
  );
}

function AddCardForm({ onCancel, onSave }) {
  const [form, setForm] = useState(EMPTY_FORM);

  function updateField(field, value) {
    setForm((current) => ({ ...current, [field]: value }));
  }

  function handleSubmit(event) {
    event.preventDefault();
    const gradient = NETWORKS.find((n) => n.label === form.network).gradient;
    onSave({
      id: `card-${Date.now()}`,
      network: form.network,
      gradient,
      last4: form.number.replace(/\D/g, '').slice(-4).padStart(4, '0'),
      holder: form.holder.toUpperCase(),
      expiry: form.expiry,
      isDefault: form.isDefault,
    });
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="col-span-1 flex flex-col gap-4 rounded-xl border-2 border-dashed border-primary-200 bg-primary-50/40 p-5 sm:col-span-2"
    >
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-neutral-800">New Card Details</h3>
        <IconButton icon={X} label="Cancel" size="sm" onClick={onCancel} />
      </div>

      <div className="flex gap-2">
        {NETWORKS.map((network) => (
          <button
            key={network.label}
            type="button"
            onClick={() => updateField('network', network.label)}
            className={cn(
              'flex-1 rounded-md border px-3 py-2 text-sm font-medium transition-colors duration-150',
              form.network === network.label
                ? 'border-primary-600 bg-primary-100 text-primary-700'
                : 'border-neutral-200 bg-neutral-0 text-neutral-600 hover:bg-neutral-50',
            )}
          >
            {network.label}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="flex flex-col gap-1.5 sm:col-span-2">
          <label className="text-sm font-medium text-neutral-700" htmlFor="card-number">
            Card Number
          </label>
          <Input
            id="card-number"
            inputMode="numeric"
            placeholder="1234 5678 9012 3456"
            maxLength={19}
            required
            value={form.number}
            onChange={(event) => updateField('number', event.target.value)}
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-neutral-700" htmlFor="card-holder">
            Cardholder Name
          </label>
          <Input
            id="card-holder"
            placeholder="ROHAN VERMA"
            required
            value={form.holder}
            onChange={(event) => updateField('holder', event.target.value)}
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-neutral-700" htmlFor="card-expiry">
            Expiry (MM/YY)
          </label>
          <Input
            id="card-expiry"
            placeholder="08/29"
            maxLength={5}
            required
            value={form.expiry}
            onChange={(event) => updateField('expiry', event.target.value)}
          />
        </div>
      </div>

      <label className="flex items-center gap-2 text-sm text-neutral-700">
        <input
          type="checkbox"
          checked={form.isDefault}
          onChange={(event) => updateField('isDefault', event.target.checked)}
          className="h-4 w-4 rounded border-neutral-300 text-primary-600 focus:ring-primary-500"
        />
        Make this my default card
      </label>

      <div className="flex gap-3">
        <Button type="button" variant="secondary" fullWidth onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" fullWidth>
          Save Card
        </Button>
      </div>
    </form>
  );
}

export function PaymentCardsCard({ cards, onCardsChange }) {
  const [deletingId, setDeletingId] = useState(null);
  const [isAdding, setIsAdding] = useState(false);

  function handleDeleteConfirmed() {
    onCardsChange((current) => current.filter((card) => card.id !== deletingId));
    setDeletingId(null);
  }

  function handleAddCard(newCard) {
    onCardsChange((current) => [
      newCard,
      ...current.map((card) => (newCard.isDefault ? { ...card, isDefault: false } : card)),
    ]);
    setIsAdding(false);
  }

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <CreditCard className="h-5 w-5 text-primary-600" strokeWidth={1.75} />
          <h2 className="text-lg font-semibold text-neutral-900">Saved Credit/Debit Cards</h2>
        </div>
        {!isAdding ? (
          <Button variant="outline" size="sm" onClick={() => setIsAdding(true)}>
            <Plus className="h-4 w-4" strokeWidth={1.75} />
            Add New Card
          </Button>
        ) : null}
      </div>

      <div className="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-2">
        {isAdding ? (
          <AddCardForm onCancel={() => setIsAdding(false)} onSave={handleAddCard} />
        ) : null}

        {cards.map((card) => (
          <CardVisual key={card.id} card={card} onDelete={() => setDeletingId(card.id)} />
        ))}
      </div>

      <ConfirmDialog
        open={Boolean(deletingId)}
        onClose={() => setDeletingId(null)}
        onConfirm={handleDeleteConfirmed}
        title="Remove Card"
        description="Are you sure you want to remove this card? This action cannot be undone."
        confirmLabel="Remove"
      />
    </Card>
  );
}
