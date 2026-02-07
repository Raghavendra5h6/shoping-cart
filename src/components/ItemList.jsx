import { useState, useEffect } from 'react';
import { ShoppingBag, Loader2 } from 'lucide-react';
import api from '../api';

export default function ItemList({ onAddToCart }) {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [addingId, setAddingId] = useState(null);

  useEffect(() => {
    api.get('/items')
      .then(({ data }) => setItems(data))
      .catch(() => setItems([]))
      .finally(() => setLoading(false));
  }, []);

  const handleAdd = async (item) => {
    setAddingId(item._id);
    try {
      await api.post('/carts', { itemId: item._id, quantity: 1 });
      onAddToCart?.();
    } catch (err) {
      window.alert(err.response?.data || 'Failed to add to cart');
    } finally {
      setAddingId(null);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[40vh]">
        <Loader2 className="w-10 h-10 text-emerald-600 animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-6">
      <h2 className="text-xl font-semibold text-slate-800 mb-4">All items</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {items.map((item) => (
          <div
            key={item._id}
            className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden hover:shadow-md transition"
          >
            <div className="p-4">
              <h3 className="font-medium text-slate-800">{item.name}</h3>
              {item.description && (
                <p className="text-sm text-slate-500 mt-1">{item.description}</p>
              )}
              <p className="mt-2 text-lg font-semibold text-emerald-600">
                ${Number(item.price).toFixed(2)}
              </p>
            </div>
            <button
              onClick={() => handleAdd(item)}
              disabled={addingId === item._id}
              className="w-full flex items-center justify-center gap-2 py-3 bg-slate-100 hover:bg-emerald-100 text-slate-700 hover:text-emerald-700 font-medium transition disabled:opacity-50"
            >
              {addingId === item._id ? (
                <Loader2 size={18} className="animate-spin" />
              ) : (
                <ShoppingBag size={18} />
              )}
              Add to cart
            </button>
          </div>
        ))}
      </div>
      {items.length === 0 && (
        <p className="text-center text-slate-500 py-8">No items available.</p>
      )}
    </div>
  );
}
