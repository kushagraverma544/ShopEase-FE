import { Pencil, Trash2 } from 'lucide-react';
import { useCallback, useEffect, useRef, useState } from 'react';
import { NavLink } from 'react-router-dom';

import { Badge } from '../../components/common/Badge/Badge';
import { Button } from '../../components/common/Button/Button';
import { Card } from '../../components/common/Card/Card';
import { ConfirmDialog } from '../../components/common/ConfirmDialog/ConfirmDialog';
import { ErrorState } from '../../components/common/ErrorState/ErrorState';
import { IconButton } from '../../components/common/IconButton/IconButton';
import { Pagination } from '../../components/common/Pagination/Pagination';
import { Skeleton } from '../../components/common/Skeleton/Skeleton';
import { SELLER_PRODUCTS_PAGE_SIZE } from '../../constants/sellerProducts.constants';
import { ROUTE_PATHS } from '../../routes/routePaths';
import { deleteSellerProduct, getSellerProducts } from '../../services/sellerService';

export function SellerListingsPage() {
  const [products, setProducts] = useState([]);
  const [status, setStatus] = useState('loading');
  const [page, setPage] = useState(1);
  const [pendingDeleteId, setPendingDeleteId] = useState(null);
  const isMountedRef = useRef(false);

  const loadProducts = useCallback(() => {
    getSellerProducts()
      .then((data) => {
        if (isMountedRef.current) {
          setProducts(data);
          setStatus('success');
        }
      })
      .catch(() => {
        if (isMountedRef.current) setStatus('error');
      });
  }, []);

  useEffect(() => {
    isMountedRef.current = true;
    loadProducts();
    return () => {
      isMountedRef.current = false;
    };
  }, [loadProducts]);

  const retryProducts = useCallback(() => {
    setStatus('loading');
    loadProducts();
  }, [loadProducts]);

  async function confirmDelete() {
    const id = pendingDeleteId;
    setPendingDeleteId(null);
    await deleteSellerProduct(id);
    setProducts((current) => current.filter((product) => product.id !== id));
  }

  if (status === 'loading') {
    return (
      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
        <Skeleton className="mb-6 h-8 w-48" />
        <div className="flex flex-col gap-3">
          {Array.from({ length: 4 }).map((_, index) => (
            <Skeleton key={index} className="h-20 rounded-lg" />
          ))}
        </div>
      </div>
    );
  }

  if (status === 'error') {
    return (
      <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8">
        <ErrorState
          title="Couldn't load your listings"
          message="Something went wrong while fetching your products."
          onRetry={retryProducts}
        />
      </div>
    );
  }

  const totalPages = Math.ceil(products.length / SELLER_PRODUCTS_PAGE_SIZE) || 1;
  const pageProducts = products.slice(
    (page - 1) * SELLER_PRODUCTS_PAGE_SIZE,
    page * SELLER_PRODUCTS_PAGE_SIZE,
  );

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-neutral-900">My Listings</h1>
        <Button as={NavLink} to={ROUTE_PATHS.SELLER_ADD_PRODUCT}>
          Add Product
        </Button>
      </div>

      {products.length === 0 ? (
        <Card className="flex flex-col items-center gap-2 px-6 py-14 text-center">
          <p className="text-sm text-neutral-500">You haven't listed any products yet.</p>
          <Button as={NavLink} to={ROUTE_PATHS.SELLER_ADD_PRODUCT} className="mt-2">
            Add your first product
          </Button>
        </Card>
      ) : (
        <>
          <div className="flex flex-col gap-3">
            {pageProducts.map((product) => (
              <Card key={product.id} className="flex items-center gap-4 px-4 py-3">
                <img
                  src={product.imageUrl}
                  alt=""
                  className="h-14 w-14 shrink-0 rounded-md bg-neutral-100 object-cover"
                />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium text-neutral-900">{product.name}</p>
                  <p className="text-sm text-neutral-500">
                    ₹{product.price.toLocaleString('en-IN')} · Stock: {product.stock}
                  </p>
                </div>
                <Badge variant={product.status === 'active' ? 'success' : 'neutral'}>
                  {product.status === 'active' ? 'Active' : 'Inactive'}
                </Badge>
                <IconButton icon={Pencil} label="Edit" tooltip />
                <IconButton
                  icon={Trash2}
                  label="Delete"
                  tooltip
                  onClick={() => setPendingDeleteId(product.id)}
                />
              </Card>
            ))}
          </div>

          <Pagination
            currentPage={page}
            totalPages={totalPages}
            onPageChange={setPage}
            className="mt-6"
          />
        </>
      )}

      <ConfirmDialog
        open={Boolean(pendingDeleteId)}
        onClose={() => setPendingDeleteId(null)}
        onConfirm={confirmDelete}
        title="Delete this listing?"
        description="This will remove the product from your storefront. This action can't be undone."
        confirmLabel="Delete"
      />
    </div>
  );
}

export default SellerListingsPage;
