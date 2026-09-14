import { Briefcase, Home, MapPin, Pencil, Plus, Trash2 } from 'lucide-react';
import { useState } from 'react';

import { Badge } from '../../../components/common/Badge/Badge';
import { Banner } from '../../../components/common/Banner/Banner';
import { Button } from '../../../components/common/Button/Button';
import { Card } from '../../../components/common/Card/Card';
import { ConfirmDialog } from '../../../components/common/ConfirmDialog/ConfirmDialog';
import { IconButton } from '../../../components/common/IconButton/IconButton';
import { createAddress, deleteAddress, listAddresses, updateAddress } from '../../../services/meService';
import { AddressFormFields } from './AddressFormFields';

const TYPE_ICONS = { HOME: Home, WORK: Briefcase };
const TYPE_LABELS = { HOME: 'Home', WORK: 'Work', OTHER: 'Other' };

const PAGE_SIZE = 3;

export function AddressesCard({ addresses, onAddressesChange }) {
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [deletingId, setDeletingId] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [banner, setBanner] = useState(null);

  const visibleAddresses = addresses.slice(0, visibleCount);
  const hasMore = visibleCount < addresses.length;

  function openAddForm() {
    setEditingId(null);
    setIsAdding(true);
  }

  function openEditForm(addressId) {
    setIsAdding(false);
    setEditingId(addressId);
  }

  async function refresh() {
    const list = await listAddresses();
    onAddressesChange(list);
  }

  async function handleAdd(form) {
    try {
      await createAddress(form);
      await refresh();
      setIsAdding(false);
      setBanner({ variant: 'success', message: 'Address added.' });
    } catch (err) {
      setBanner({ variant: 'error', message: err.message });
    }
  }

  async function handleEdit(form) {
    try {
      await updateAddress(form.id, form);
      await refresh();
      setEditingId(null);
      setBanner({ variant: 'success', message: 'Address updated.' });
    } catch (err) {
      setBanner({ variant: 'error', message: err.message });
    }
  }

  async function handleDeleteConfirmed() {
    setIsDeleting(true);
    try {
      await deleteAddress(deletingId);
      await refresh();
      setDeletingId(null);
      setBanner({ variant: 'success', message: 'Address deleted.' });
    } catch (err) {
      setBanner({ variant: 'error', message: err.message });
    } finally {
      setIsDeleting(false);
    }
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

      {banner ? (
        <Banner
          variant={banner.variant}
          message={banner.message}
          onDismiss={() => setBanner(null)}
          className="mt-5"
        />
      ) : null}

      {isAdding ? (
        <div className="mt-5 rounded-lg border-2 border-primary-100 bg-primary-50/30 p-5">
          <h3 className="mb-4 text-xs font-semibold tracking-wide text-primary-600 uppercase">
            Add a New Address
          </h3>
          <AddressFormFields onCancel={() => setIsAdding(false)} onSave={handleAdd} submitLabel="Save Address" />
        </div>
      ) : null}

      {addresses.length === 0 && !isAdding ? (
        <p className="mt-5 text-sm text-neutral-500">No saved addresses yet — add one to speed up checkout.</p>
      ) : null}

      <div className="mt-5 flex flex-col gap-4">
        {visibleAddresses.map((address) => {
          const TypeIcon = TYPE_ICONS[address.type] ?? MapPin;
          const isEditing = editingId === address.id;
          return (
            <div key={address.id} className="overflow-hidden rounded-lg border border-neutral-100 bg-neutral-50">
              <div className="p-4">
                <div className="flex items-start justify-between gap-3">
                  <span className="flex items-center gap-1.5 text-sm font-semibold text-neutral-800">
                    <TypeIcon className="h-4 w-4 text-primary-600" strokeWidth={1.75} />
                    {TYPE_LABELS[address.type] ?? address.type}
                    {address.defaultAddress ? <Badge variant="primary">Default</Badge> : null}
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

                <p className="mt-3 text-sm font-medium text-neutral-800">{address.recipientName}</p>
                <p className="mt-1 text-sm leading-relaxed text-neutral-500">
                  {address.addressLine1}
                  {address.addressLine2 ? `, ${address.addressLine2}` : ''}
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
          <Button variant="secondary" size="sm" onClick={() => setVisibleCount((count) => count + PAGE_SIZE)}>
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
        confirmLabel={isDeleting ? 'Deleting…' : 'Delete'}
      />
    </Card>
  );
}
