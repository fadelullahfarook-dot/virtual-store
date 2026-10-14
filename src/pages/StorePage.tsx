
import React, { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStore } from '../store/useStore';
import { ProductInfoPanel } from '../components/ProductInfoPanel';

export const StorePage: React.FC = () => {
  const navigate = useNavigate();
  const {
    products,
    setSelectedProduct,
    addToCart,
    isAuthenticated,
  } = useStore();

  const iframeRef = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    const iframe = iframeRef.current;

    if (!iframe) return;

    const handleMessage = async (event: MessageEvent) => {
      // Accept messages only from this page's A-Frame iframe.
      if (event.source !== iframe.contentWindow) return;

      // Validate the origin of the iframe.
      const iframeUrl = new URL(iframe.src, window.location.href);

      if (event.origin !== iframeUrl.origin) return;

      if (!event.data || typeof event.data !== 'object') return;

      if (event.data.type === 'SELECT_PRODUCT') {
        const prodData = event.data.product;

        if (!prodData || typeof prodData !== 'object' || !prodData.name) {
          return;
        }

        const matched = products.find(
          (p) =>
            p.name &&
            p.name.toLowerCase() === String(prodData.name).toLowerCase()
        );

        const matchedId = matched ? matched.id || matched._id : undefined;
        const productId = prodData.id || prodData._id || matchedId;

        const selected = {
          ...prodData,
          name: String(prodData.name),
          price: Number.isFinite(Number(prodData.price))
            ? Number(prodData.price)
            : matched?.price ?? 0,
          imageUrl: prodData.imageUrl || matched?.imageUrl,
          description:
            prodData.description ||
            matched?.description ||
            'Premium item available in our 3D store.',
          category: prodData.category || matched?.category || 'general',
          id: productId,
          _id: productId,
          stock: matched?.stock ?? prodData.stock ?? 50,
          variants:
            matched?.variants && matched.variants.length > 0
              ? matched.variants
              : prodData.variants || [
                {
                  color: 'Standard',
                  additionalPrice: 0,
                  stock: 25,
                },
              ],
        };

        setSelectedProduct(selected);

        // Close the standalone HTML modal when React handles the product.
        iframe.contentWindow?.postMessage(
          { type: 'CLOSE_STANDALONE_MODAL' },
          iframeUrl.origin
        );

        return;
      }

      if (event.data.type === 'ADD_TO_CART') {
        const prodData = event.data.product;

        if (!prodData || typeof prodData !== 'object') return;

        const prodId = prodData.id || prodData._id;

        if (!prodId) {
          window.alert('Product ID is missing.');
          return;
        }

        if (!isAuthenticated) {
          if (
            window.confirm(
              'Please log in to add items to your cart. Proceed to Login page?'
            )
          ) {
            navigate('/login');
          }
          return;
        }

        try {
          await addToCart(String(prodId), 1);
          window.alert(`${prodData.name || 'Item'} added to cart!`);
        } catch (error: unknown) {
          const message =
            error instanceof Error
              ? error.message
              : 'An unexpected error occurred.';

          if (
            message.toLowerCase().includes('session has expired') ||
            message.toLowerCase().includes('please log in') ||
            message.toLowerCase().includes('not authorized') ||
            message.toLowerCase().includes('token failed')
          ) {
            if (
              window.confirm(
                'Your session has expired. Proceed to the Login page?'
              )
            ) {
              navigate('/login');
            }
          } else {
            window.alert(`Error adding item to cart: ${message}`);
          }
        }
      }
    };

    window.addEventListener('message', handleMessage);

    return () => {
      window.removeEventListener('message', handleMessage);
    };
  }, [
    products,
    setSelectedProduct,
    addToCart,
    isAuthenticated,
    navigate,
  ]);

  return (
    <div className="w-full flex flex-col items-center gap-4 py-4 h-full">
      <div className="text-center space-y-2">
        <h2 className="text-3xl font-extrabold tracking-tight text-gray-900">
          Virtual 3D Shopping Mall
        </h2>

        <p className="text-lg text-gray-500 max-w-2xl mx-auto">
          Explore individual flagship boutiques powered by A-Frame. Use WASD
          to walk, mouse to look around, and click on any wall-mounted product
          plaque to inspect and add to cart.
        </p>
      </div>

      <div className="w-full max-w-6xl h-[650px] rounded-2xl overflow-hidden shadow-2xl border border-gray-200 bg-slate-900 relative">
        <iframe
          ref={iframeRef}
          id="aframe-store-iframe"
          src="/aframe-store.html"
          title="3D Virtual Shopping Mall"
          className="w-full h-full border-0"
          allow="accelerometer; gyroscope; vr;"
        />

        {/* React Product Info Panel and Cart Integration */}
        <ProductInfoPanel />
      </div>
    </div>
  );
};
