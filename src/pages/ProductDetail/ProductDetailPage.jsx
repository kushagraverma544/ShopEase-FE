import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

import { ErrorState } from '../../components/common/ErrorState/ErrorState';
import { ImageGallery } from '../../components/product/ImageGallery/ImageGallery';
import { getProductById } from '../../services/productService';
import { ProductDetailSkeleton } from './sections/ProductDetailSkeleton';
import { ProductInfoSection } from './sections/ProductInfoSection';
import { ReviewsSection } from './sections/ReviewsSection';

export function ProductDetailPage() {
  const { productId } = useParams();
  const [product, setProduct] = useState(null);
  const [status, setStatus] = useState('loading');
  const [retryKey, setRetryKey] = useState(0);

  useEffect(() => {
    let isMounted = true;
    // eslint-disable-next-line react-hooks/set-state-in-effect -- refetch on productId/retry change (navigating between two product pages, or manual retry), see ProductListingPage for the same pattern
    setStatus('loading');

    getProductById(productId)
      .then((data) => {
        if (!isMounted) return;
        setProduct(data);
        setStatus('success');
      })
      .catch(() => {
        if (isMounted) setStatus('error');
      });

    return () => {
      isMounted = false;
    };
  }, [productId, retryKey]);

  return (
    <section className="mx-auto max-w-6xl px-6 py-8">
      {status === 'loading' ? <ProductDetailSkeleton /> : null}

      {status === 'error' ? (
        <ErrorState
          title="Couldn't load this product"
          message="Something went wrong while fetching this product's details."
          onRetry={() => setRetryKey((key) => key + 1)}
        />
      ) : null}

      {status === 'success' && product ? (
        <>
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
            <ImageGallery
              images={product.images?.length ? product.images : [product.thumbnail]}
              title={product.title}
            />
            <ProductInfoSection product={product} />
          </div>

          <div className="mt-10">
            <ReviewsSection product={product} />
          </div>
        </>
      ) : null}
    </section>
  );
}

export default ProductDetailPage;
