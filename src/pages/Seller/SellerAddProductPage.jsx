import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { Button } from '../../components/common/Button/Button';
import { Card } from '../../components/common/Card/Card';
import { Input } from '../../components/common/Input/Input';
import { Switch } from '../../components/common/Switch/Switch';
import { SELLER_PRODUCT_STATUS } from '../../constants/sellerProducts.constants';
import { ROUTE_PATHS } from '../../routes/routePaths';
import { createSellerProduct } from '../../services/sellerService';

const PLACEHOLDER_IMAGE = 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=200&q=60';

export function SellerAddProductPage() {
  const navigate = useNavigate();

  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [stock, setStock] = useState('');
  const [active, setActive] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  async function handleSubmit(event) {
    event.preventDefault();
    setError(null);
    setSubmitting(true);

    try {
      await createSellerProduct({
        name,
        price: Number(price),
        stock: Number(stock),
        status: active ? SELLER_PRODUCT_STATUS.ACTIVE : SELLER_PRODUCT_STATUS.INACTIVE,
        imageUrl: PLACEHOLDER_IMAGE,
      });
      navigate(ROUTE_PATHS.SELLER_LISTINGS);
    } catch (err) {
      setError(err.message);
      setSubmitting(false);
    }
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-8 sm:px-6 lg:px-8">
      <h1 className="mb-6 text-2xl font-semibold text-neutral-900">Add Product</h1>

      <Card className="p-6">
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-neutral-700" htmlFor="name">
              Product name
            </label>
            <Input
              id="name"
              placeholder="Wireless Mechanical Keyboard"
              required
              value={name}
              onChange={(event) => setName(event.target.value)}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-neutral-700" htmlFor="price">
                Price (₹)
              </label>
              <Input
                id="price"
                type="number"
                min="0"
                step="0.01"
                required
                value={price}
                onChange={(event) => setPrice(event.target.value)}
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-neutral-700" htmlFor="stock">
                Stock quantity
              </label>
              <Input
                id="stock"
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

          {error ? <p className="text-sm text-danger-600">{error}</p> : null}

          <div className="mt-2 flex gap-3">
            <Button
              type="button"
              variant="secondary"
              fullWidth
              onClick={() => navigate(ROUTE_PATHS.SELLER_LISTINGS)}
            >
              Cancel
            </Button>
            <Button type="submit" fullWidth disabled={submitting}>
              {submitting ? 'Adding…' : 'Add Product'}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}

export default SellerAddProductPage;
