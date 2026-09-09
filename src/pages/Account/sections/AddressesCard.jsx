import { Briefcase, Home, MapPin, Pencil, Plus, Trash2 } from 'lucide-react';
import { useState } from 'react';

import { Badge } from '../../../components/common/Badge/Badge';
import { Button } from '../../../components/common/Button/Button';
import { Card } from '../../../components/common/Card/Card';
import { ConfirmDialog } from '../../../components/common/ConfirmDialog/ConfirmDialog';
import { IconButton } from '../../../components/common/IconButton/IconButton';
import { Loader } from '../../../components/common/Loader/Loader';
import { AddressFormFields } from './AddressFormFields';

const LABEL_ICONS = {
  Home,
  Work: Briefcase,
};

const PAGE_SIZE = 3;

export function AddressesCard({ addresses, onAddressesChange }) {
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
  const [isFetchingMore, setIsFetchingMore] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [deletingId, setDeletingId] = useState(null);

  const visibleAddresses = addresses.slice(0, visibleCount);
  const hasMore = visibleCount < addresses.length;

  function handleShowMore() {
    setIsFetchingMore(true);
    // Addresses already live in memory, but a brief delay mirrors what
    // fetching the next page from a real address-service call would feel
    // like, instead of the list snapping in instantly.
    setTimeout(() => {
      setVisibleCount((count) => count + PAGE_SIZE);
      setIsFetchingMore(false);
    }, 400);
  }

  function openAddForm() {
    setEditingId(null);
    setIsAdding(true);
  }

  function openEditForm(addressId) {
    setIsAdding(false);
    setEditingId(addressId);
  }

  function handleAdd(address) {
    onAddressesChange((current) => [
      ...current.map((item) => (address.isDefault ? { ...item, isDefault: false } : item)),
      address,
    ]);
    setIsAdding(false);
  }

  function handleEdit(address) {
    onAddressesChange((current) =>
      current.map((item) =>
        item.id === address.id ? address : { ...item, isDefault: address.isDefault ? false : item.isDefault },
      ),
    );
    setEditingId(null);
  }

  function handleDeleteConfirmed() {
    onAddressesChange((current) => {
      const remaining = current.filter((item) => item.id !== deletingId);
      const removedWasDefault = current.find((item) => item.id === deletingId)?.isDefault;
      if (removedWasDefault && remaining.length > 0 && !remaining.some((item) => item.isDefault)) {
        remaining[0] = { ...remaining[0], isDefault: true };
      }
      return remaining;
    });
    setDeletingId(null);
  }

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <MapPin className="h-5 w-5 text-primary-600" strokeWidth={1.75} />
          <h2 className="text-lg font-semibold text-neutral-900">Saved Addresses</h2>
        </div>
        {!isAdding ? (
          <Button variant="outline" size="sm" onClick={openAddForm}>
            <Plus className="h-4 w-4" strokeWidth={1.75} />
            Add New Address
          </Button>
        ) : null}
      </div>

      {isAdding ? (
        <div className="mt-5 rounded-lg border-2 border-primary-100 bg-primary-50/30 p-5">
          <h3 className="mb-4 text-xs font-semibold tracking-wide text-primary-600 uppercase">
            Add a New Address
          </h3>
          <AddressFormFields onCancel={() => setIsAdding(false)} onSave={handleAdd} submitLabel="Save Address" />
        </div>
      ) : null}

      <div className="mt-5 flex flex-col gap-4">
        {visibleAddresses.map((address) => {
          const LabelIcon = LABEL_ICONS[address.label] ?? MapPin;
          const isEditing = editingId === address.id;
          return (
            <div key={address.id} className="overflow-hidden rounded-lg border border-neutral-100 bg-neutral-50">
              <div className="p-4">
                <div className="flex items-start justify-between gap-3">
                  <span className="flex items-center gap-1.5 text-sm font-semibold text-neutral-800">
                    <LabelIcon className="h-4 w-4 text-primary-600" strokeWidth={1.75} />
                    {address.label}
                    {address.isDefault ? <Badge variant="primary">Default</Badge> : null}
                  </span>

                  <div className="flex shrink-0 items-center gap-1">
                    <IconButton
                      icon={Pencil}
                      label="Edit address"
                      size="sm"
                      onClick={() => (isEditing ? setEditingId(null) : openEditForm(address.id))}
                    />
                    <IconButton
                      icon={Trash2}
                      label="Delete address"
                      size="sm"
                      onClick={() => setDeletingId(address.id)}
                      className="hover:bg-danger-50 hover:text-danger-600"
                    />
                  </div>
                </div>

                <p className="mt-3 text-sm font-medium text-neutral-800">{address.name}</p>
                <p className="mt-1 text-sm leading-relaxed text-neutral-500">
                  {address.line1}, {address.line2}
                  <br />
                  {address.city}, {address.state} {address.pincode}
                </p>
                <p className="mt-2 text-xs text-neutral-400">Phone: {address.phone}</p>
              </div>

              {isEditing ? (
                <div className="border-t border-neutral-200 bg-primary-50/30 p-5">
                  <h3 className="mb-4 text-xs font-semibold tracking-wide text-primary-600 uppercase">
                    Edit Address
                  </h3>
                  <AddressFormFields
                    address={address}
                    onCancel={() => setEditingId(null)}
                    onSave={handleEdit}
                    submitLabel="Save Changes"
                  />
                </div>
              ) : null}
            </div>
          );
        })}
      </div>

      {hasMore ? (
        <div className="mt-5 flex justify-center">
          <Button variant="secondary" size="sm" onClick={handleShowMore} disabled={isFetchingMore}>
            {isFetchingMore ? <Loader size="sm" /> : null}
            Show More
          </Button>
        </div>
      ) : null}

      <ConfirmDialog
        open={Boolean(deletingId)}
        onClose={() => setDeletingId(null)}
        onConfirm={handleDeleteConfirmed}
        title="Delete Address"
        description="Are you sure you want to delete this address? This action cannot be undone."
        confirmLabel="Delete"
      />
    </Card>
  );
}
