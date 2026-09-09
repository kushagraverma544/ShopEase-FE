import { useEffect, useState } from 'react';

import { Badge } from '../../../components/common/Badge/Badge';
import { Button } from '../../../components/common/Button/Button';
import { Card } from '../../../components/common/Card/Card';
import { Loader } from '../../../components/common/Loader/Loader';
import { itemAdded } from '../../../features/cart/cartSlice';
import { useAppDispatch } from '../../../hooks/useAppDispatch';
import { getProducts } from '../../../services/productService';

function getStockBadge(stock) {
  if (stock <= 0) return { variant: 'danger', label: 'Out of stock' };
  if (stock <= 5) return { variant: 'warning', label: `Only ${stock} left` };
  return { variant: 'success', label: 'In stock' };
}

export function FeaturedProducts() {
  const dispatch = useAppDispatch();
  const [products, setProducts] = useState([]);
  const [status, setStatus] = useState('loading');

  useEffect(() => {
    let isMounted = true;
    getProducts({ limit: 8 })
      .then((data) => {
        if (!isMounted) return;
        setProducts(data.content ?? []);
        setStatus('success');
      })
      .catch(() => {
        if (isMounted) setStatus('error');
      });
    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <section className="mx-auto max-w-6xl px-6 py-12">
      <h2 className="mb-6 text-2xl font-semibold text-neutral-800">Featured Products</h2>

      {status === 'loading' ? <Loader fullScreen /> : null}

      {status === 'error' ? (
        <p className="rounded-md bg-danger-50 px-4 py-3 text-sm text-danger-600">
          Couldn&apos;t load products right now. Please try again later.
        </p>
      ) : null}

      {status === 'success' ? (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
          {products.map((product) => {
            const stockBadge = getStockBadge(product.stock);
            return (
              <Card key={product.id} className="flex flex-col">
                <div className="flex h-32 items-center justify-center bg-neutral-50">
                  <img
                    src={product.thumbnail}
                    alt={product.title}
                    className="h-full w-full object-contain p-3"
                  />
                </div>
                <div className="flex flex-1 flex-col gap-2 p-4">
                  <span className="text-xs font-medium text-neutral-400 capitalize">
                    {product.category}
                  </span>
                  <h3 className="line-clamp-2 text-sm font-medium text-neutral-800">
                    {product.title}
                  </h3>
                  <Badge variant={stockBadge.variant} className="w-fit">
                    {stockBadge.label}
                  </Badge>
                  <div className="mt-auto flex items-center justify-between pt-2">
                    <span className="text-base font-semibold text-neutral-900">
                      ${product.price.toFixed(2)}
                    </span>
                    <Button
                      size="sm"
                      disabled={product.stock <= 0}
                      onClick={() => dispatch(itemAdded({ id: product.id }))}
                    >
                      Add
                    </Button>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      ) : null}
    </section>
  );
}
