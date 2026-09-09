import { ShoppingBag, Star } from 'lucide-react';
import { useEffect, useState } from 'react';

import { Button } from '../../../components/common/Button/Button';
import { Card } from '../../../components/common/Card/Card';
import { Loader } from '../../../components/common/Loader/Loader';
import { itemAdded } from '../../../features/cart/cartSlice';
import { useAppDispatch } from '../../../hooks/useAppDispatch';
import { getFeaturedProducts } from '../../../services/productService';

export function FeaturedProducts() {
  const dispatch = useAppDispatch();
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    getFeaturedProducts().then((data) => {
      if (isMounted) {
        setProducts(data);
        setIsLoading(false);
      }
    });
    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <section className="mx-auto max-w-6xl px-6 py-12">
      <h2 className="mb-6 text-2xl font-semibold text-neutral-800">Featured Products</h2>

      {isLoading ? (
        <Loader fullScreen />
      ) : (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
          {products.map((product) => (
            <Card key={product.id} className="flex flex-col">
              <div className="flex h-32 items-center justify-center bg-primary-50">
                <ShoppingBag className="h-10 w-10 text-primary-300" strokeWidth={1.5} />
              </div>
              <div className="flex flex-1 flex-col gap-2 p-4">
                <span className="text-xs font-medium text-neutral-400">{product.category}</span>
                <h3 className="text-sm font-medium text-neutral-800">{product.name}</h3>
                <div className="flex items-center gap-1 text-xs text-neutral-500">
                  <Star className="h-3.5 w-3.5 fill-warning-500 text-warning-500" />
                  {product.rating}
                </div>
                <div className="mt-auto flex items-center justify-between pt-2">
                  <span className="text-base font-semibold text-neutral-900">
                    ₹{product.price.toLocaleString('en-IN')}
                  </span>
                  <Button size="sm" onClick={() => dispatch(itemAdded({ id: product.id }))}>
                    Add
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </section>
  );
}
