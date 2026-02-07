import { useState, useEffect } from 'react';
import { ShoppingCart, Trash2, Loader2 } from 'lucide-react';
import api from '../api';

export default function Cart({ onCheckoutSuccess, onBack }) {
  const [cart, setCart] = useState({ items: [] });
  const [loading, setLoading] = useState(true);
  const [checkingOut, setCheckingOut] = useState(false);

  const fetchCart = () => {
    api.get('/carts')
      .then(({ data }) => setCart(data))
      .catch(() => setCart({ items: [] }))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchCart();
  }, []);

  const removeItem = async (itemId) => {
    try {
      await api.delete(`/carts/items/${itemId}`);
      fetchCart();
    } catch (err) {
      window.alert(err.response?.data || 'Failed to remove item');
    }
  };

  const checkout = async () => {
    if (!cart.items?.length) {
      window.alert('Your cart is empty.');
      return;
    }
    setCheckingOut(true);
    try {
      await api.post('/orders');
      window.alert('Order placed successfully!');
      onCheckoutSuccess?.();
      fetchCart();
    } catch (err) {
      window.alert(err.response?.data || 'Failed to place order');
    } finally {
      setCheckingOut(false);
    }
  };

  const total = (cart.items || []).reduce(
    (sum, ci) => sum + (ci.item?.price ?? 0) * (ci.quantity ?? 0),
    0
  );

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[40vh]">
        <Loader2 className="w-10 h-10 text-emerald-600 animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold text-slate-800 flex items-center gap-2">
          <ShoppingCart size={24} />
          Your cart
        </h2>
        <button
          onClick={onBack}
          className="text-slate-600 hover:text-slate-800 text-sm font-medium"
        >
          ← Back to shop
        </button>
      </div>
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm divide-y divide-slate-100">
        {(cart.items || []).length === 0 ? (
          <p className="p-8 text-center text-slate-500">Your cart is empty.</p>
        ) : (
          <>
            {cart.items.map((ci) => (
              <div
                key={ci.item?._id || ci.item}
                className="p-4 flex items-center justify-between gap-4"
              >
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-slate-800">{ci.item?.name}</p>
                  <p className="text-sm text-slate-500">
                    ${Number(ci.item?.price || 0).toFixed(2)} × {ci.quantity}
                  </p>
                </div>
                <p className="font-medium text-slate-800">
                  ${(Number(ci.item?.price || 0) * (ci.quantity || 0)).toFixed(2)}
                </p>
                <button
                  onClick={() => removeItem(ci.item?._id || ci.item)}
                  className="p-2 text-slate-400 hover:text-red-600 rounded-lg hover:bg-red-50 transition"
                  title="Remove"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            ))}
            <div className="p-4 flex items-center justify-between border-t border-slate-200 bg-slate-50 rounded-b-xl">
              <span className="font-semibold text-slate-800">Total</span>
              <span className="text-lg font-bold text-emerald-600">
                ${total.toFixed(2)}
              </span>
            </div>
            <div className="p-4">
              <button
                onClick={checkout}
                disabled={checkingOut || !cart.items?.length}
                className="w-full flex items-center justify-center gap-2 py-3 bg-emerald-600 text-white font-medium rounded-lg hover:bg-emerald-700 disabled:opacity-50 transition"
              >
                {checkingOut ? (
                  <Loader2 size={20} className="animate-spin" />
                ) : (
                  'Checkout'
                )}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
