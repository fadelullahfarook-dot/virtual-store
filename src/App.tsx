import { Routes, Route } from 'react-router-dom';
import { useEffect } from 'react';
import { MainLayout } from './layouts/MainLayout';
import { HomePage } from './pages/HomePage';
import { Login } from './pages/Login';
import { Signup } from './pages/Signup';
import { VerifyOtp } from './pages/VerifyOtp';
import { StorePage } from './pages/StorePage';
import { ProtectedRoute } from './components/ProtectedRoute';
import { useStore } from './store/useStore';
import { buildStoresWithProducts } from './features/stores/storeData';

import { Checkout } from './pages/Checkout';
import { OrderSuccess } from './pages/OrderSuccess';
import { MyOrders } from './pages/MyOrders';
import { OrderDetails } from './pages/OrderDetails';
import { Cart } from './components/Cart';

function App() {
  const fetchProducts = useStore(state => state.fetchProducts);
  const fetchCart = useStore(state => state.fetchCart);
  const setStores = useStore(state => state.setStores);
  const products = useStore(state => state.products);
  const isAuthenticated = useStore(state => state.isAuthenticated);

  useEffect(() => {
    fetchProducts();
    if (isAuthenticated) {
      fetchCart();
    }
  }, [fetchProducts, fetchCart, isAuthenticated]);

  useEffect(() => {
    if (products.length > 0) {
      setStores(buildStoresWithProducts(products));
    }
  }, [products, setStores]);

  return (
    <>
      <Cart />
      <Routes>
        {/* Public Routes with Layout */}
        <Route element={<MainLayout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/verify-otp" element={<VerifyOtp />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/order-success" element={<OrderSuccess />} />
          <Route path="/orders" element={<MyOrders />} />
          <Route path="/orders/:id" element={<OrderDetails />} />
        </Route>

        {/* Protected Routes (3D Store without traditional layout wrapper, or with minimal overlay) */}
        <Route element={<ProtectedRoute />}>
          <Route path="/store" element={<StorePage />} />
        </Route>
      </Routes>
    </>
  );
}

export default App;
