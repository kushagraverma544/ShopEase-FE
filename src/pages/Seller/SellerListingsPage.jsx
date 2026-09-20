import { Pencil, SearchX, Trash2 } from 'lucide-react';
import { useCallback, useEffect, useRef, useState } from 'react';
import { NavLink } from 'react-router-dom';

import { Badge } from '../../components/common/Badge/Badge';
import { Button } from '../../components/common/Button/Button';
import { Card } from '../../components/common/Card/Card';
import { ConfirmDialog } from '../../components/common/ConfirmDialog/ConfirmDialog';
import { ErrorState } from '../../components/common/ErrorState/ErrorState';
import { IconButton } from '../../components/common/IconButton/IconButton';
import { ProductBrowser } from '../../components/common/ProductBrowser/ProductBrowser';
import { Skeleton } from '../../components/common/Skeleton/Skeleton';
import { SELLER_PRODUCTS_PAGE_SIZE, SELLER_PRODUCT_STATUS } from '../../constants/sellerProducts.constants';
import { ROUTE_PATHS } from '../../routes/routePaths';
import { deleteSellerProduct, getSellerProducts, updateSellerProduct } from '../../services/sellerService';
import { formatInr } from '../../utils/formatCurrency';
import { SellerEditProductModal } from './sections/SellerEditProductModal';
import { SellerProductGridCard } from './sections/SellerProductGridCard';

const STATUS_OPTIONS = [
  { value: SELLER_PRODUCT_STATUS.ACTIVE, label: 'Active' },
  { value: SELLER_PRODUCT_STATUS.INACTIVE, label: 'Inactive' },
  // Independent of the active/inactive status field — a product can be
  // Active and still be out of stock, so this filters on `stock` instead.
  { value: 'out_of_stock', label: 'Out of Stock', predicate: (product) => product.stock === 0 },
];

// Column config for the list view's Table (a reusable common component —
// see src/components/common/Table/Table.jsx). Any page can build its own
// column set the same way, so an Admin products table would just pass a
// different array here, not touch Table or ProductBrowser.
function buildListColumns({ onEdit, onDelete }) {
  return [
    {
      key: 'product',
      header: 'Product',
      render: (product) => (
        <div className="flex items-center gap-3">
          <img
            src={product.imageUrl}
            alt=""
            className="h-10 w-10 shrink-0 rounded-md bg-neutral-100 object-cover"
          />
          <span className="font-medium text-neutral-900">{product.name}</span>
        </div>
      ),
    },
    {
      key: 'category',
      header: 'Category',
      render: (product) => <span className="text-neutral-500">{product.category}</span>,
    },
    { key: 'price', header: 'Price', align: 'right', render: (product) => formatInr(product.price) },
    { key: 'stock', header: 'Stock', align: 'right', render: (product) => product.stock },
    {
      key: 'status',
      header: 'Status',
      render: (product) => (
        <Badge variant={product.status === SELLER_PRODUCT_STATUS.ACTIVE ? 'success' : 'neutral'}>
          {product.status === SELLER_PRODUCT_STATUS.ACTIVE ? 'Active' : 'Inactive'}
        </Badge>
      ),
    },
    {
      key: 'actions',
      header: '',
      align: 'right',
      render: (product) => (
        <div className="flex items-center justify-end gap-1">
          <IconButton icon={Pencil} label="Edit" size="sm" tooltip onClick={() => onEdit(product)} />
          <IconButton icon={Trash2} label="Delete" size="sm" tooltip onClick={() => onDelete(product)} />
        </div>
      ),
    },
  ];
}

export function SellerListingsPage() {
  const [products, setProducts] = useState([]);
  const [status, setStatus] = useState('loading');
  const [pendingDeleteId, setPendingDeleteId] = useState(null);
  const [editingProduct, setEditingProduct] = useState(null);
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

  async function saveEdit(id, data) {
    const updated = await updateSellerProduct(id, data);
    setProducts((current) => current.map((product) => (product.id === id ? updated : product)));
    setEditingProduct(null);
  }

  if (status === 'loading') {
    return (
      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
        <Skeleton className="mb-6 h-8 w-48" />
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {Array.from({ length: 8 }).map((_, index) => (
            <Skeleton key={index} className="h-56 rounded-lg" />
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
        <ProductBrowser
          products={products}
          pageSize={SELLER_PRODUCTS_PAGE_SIZE}
          statusOptions={STATUS_OPTIONS}
          searchPlaceholder="Search your listings…"
          emptyState={
            <Card className="flex flex-col items-center gap-3 px-6 py-14 text-center">
              <span className="flex h-14 w-14 items-center justify-center rounded-full bg-neutral-100 text-neutral-400">
                <SearchX className="h-7 w-7" strokeWidth={1.5} />
              </span>
              <p className="text-sm text-neutral-500">No products match your filters.</p>
            </Card>
          }
          renderGridItem={(product) => (
            <SellerProductGridCard
              key={product.id}
              product={product}
              onEdit={setEditingProduct}
              onDelete={(item) => setPendingDeleteId(item.id)}
            />
          )}
          listColumns={buildListColumns({
            onEdit: setEditingProduct,
            onDelete: (item) => setPendingDeleteId(item.id),
          })}
        />
      )}

      <SellerEditProductModal
        product={editingProduct}
        onClose={() => setEditingProduct(null)}
        onSave={saveEdit}
      />

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
