import { useState, useEffect, useCallback } from 'react';
import api from './api';
import Login from './components/Login';
import Navbar from './components/Navbar';
import ItemList from './components/ItemList';
import Cart from './components/Cart';
import OrderHistory from './components/OrderHistory';

const TOKEN_KEY = 'token';

export default function App() {
  const [loggedIn, setLoggedIn] = useState(!!localStorage.getItem(TOKEN_KEY));
  const [view, setView] = useState('shop'); // 'shop' | 'cart' | 'orders'
  const [cartCount, setCartCount] = useState(0);

  const refreshCartCount = useCallback(() => {
    if (!localStorage.getItem(TOKEN_KEY)) return;
    api.get('/carts')
      .then(({ data }) => {
        const count = (data.items || []).reduce((s, i) => s + (i.quantity || 0), 0);
        setCartCount(count);
      })
      .catch(() => setCartCount(0));
  }, []);

  useEffect(() => {
    if (loggedIn) refreshCartCount();
    else setCartCount(0);
  }, [loggedIn, refreshCartCount]);

  useEffect(() => {
    const onLogout = () => setLoggedIn(false);
    window.addEventListener('auth-logout', onLogout);
    return () => window.removeEventListener('auth-logout', onLogout);
  }, []);

  const handleLogout = async () => {
    try {
      await api.post('/users/logout');
    } catch (_) {}
    localStorage.removeItem(TOKEN_KEY);
    setLoggedIn(false);
    setView('shop');
  };

  if (!loggedIn) {
    return <Login onLoggedIn={setLoggedIn} />;
  }

  return (
    <div className="min-h-screen bg-slate-100">
      <Navbar
        onCart={() => setView('cart')}
        onOrders={() => setView('orders')}
        onLogout={handleLogout}
        cartCount={cartCount}
      />
      <main className="pb-12">
        {view === 'shop' && (
          <ItemList onAddToCart={refreshCartCount} />
        )}
        {view === 'cart' && (
          <Cart
            onCheckoutSuccess={() => { setView('shop'); refreshCartCount(); }}
            onBack={() => setView('shop')}
          />
        )}
        {view === 'orders' && (
          <OrderHistory onBack={() => setView('shop')} />
        )}
      </main>
    </div>
  );
}
