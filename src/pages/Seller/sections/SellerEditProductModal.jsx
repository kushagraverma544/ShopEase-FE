import { useState } from 'react';

import { Button } from '../../../components/common/Button/Button';
import { Input } from '../../../components/common/Input/Input';
import { Modal } from '../../../components/common/Modal/Modal';
import { Switch } from '../../../components/common/Switch/Switch';
import { SELLER_PRODUCT_STATUS } from '../../../constants/sellerProducts.constants';

// Split out so it only mounts while a product is being edited — its local
// state can then just initialize from `product` directly (no effect needed
// to "sync" it, since a fresh mount already starts from the right values).
function EditProductForm({ product, onClose, onSave }) {
  const [name, setName] = useState(product.name);
  const [price, setPrice] = useState(String(product.price));
  const [stock, setStock] = useState(String(product.stock));
  const [active, setActive] = useState(product.status === SELLER_PRODUCT_STATUS.ACTIVE);
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();
    setSubmitting(true);
    try {
      await onSave(product.id, {
        name,
        price: Number(price),
        stock: Number(stock),
        status: active ? SELLER_PRODUCT_STATUS.ACTIVE : SELLER_PRODUCT_STATUS.INACTIVE,
      });
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <div className="flex flex-col gap-1.5">
        <label className="text-sm font-medium text-neutral-700" htmlFor="edit-name">
          Product name
        </label>
        <Input id="edit-name" required value={name} onChange={(event) => setName(event.target.value)} />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-neutral-700" htmlFor="edit-price">
            Price (₹)
          </label>
          <Input
            id="edit-price"
            type="number"
            min="0"
            step="0.01"
            required
            value={price}
            onChange={(event) => setPrice(event.target.value)}
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-neutral-700" htmlFor="edit-stock">
            Stock quantity
          </label>
          <Input
            id="edit-stock"
            type="number"
            min="0"
            required
            value={stock}
            onChange={(event) => setStock(event.target.value)}
          />
        </div>
      </div>

      <div className="flex items-center justify-between rounded-md border border-neutral-200 px-4 py-3">
        <div>
          <p className="text-sm font-medium text-neutral-800">Active</p>
          <p className="text-xs text-neutral-500">Visible to customers once listed.</p>
        </div>
        <Switch checked={active} onChange={setActive} label="Active" />
      </div>

      <div className="mt-2 flex gap-3">
        <Button type="button" variant="secondary" fullWidth onClick={onClose}>
          Cancel
        </Button>
        <Button type="submit" fullWidth disabled={submitting}>
          {submitting ? 'Saving…' : 'Save Changes'}
        </Button>
      </div>
    </form>
  );
}

export function SellerEditProductModal({ product, onClose, onSave }) {
  return (
    <Modal open={Boolean(product)} onClose={onClose} title="Edit Product">
      {product ? (
        <EditProductForm key={product.id} product={product} onClose={onClose} onSave={onSave} />
      ) : null}
    </Modal>
  );
}
