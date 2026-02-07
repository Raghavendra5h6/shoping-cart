import { useState, useEffect } from 'react';
import { History, Loader2, ChevronLeft } from 'lucide-react';
import api from '../api';

export default function OrderHistory({ onBack }) {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/orders')
      .then(({ data }) => setOrders(data))
      .catch(() => setOrders([]))
      .finally(() => setLoading(false));
  }, []);

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
          <History size={24} />
          Order history
        </h2>
        <button
          onClick={onBack}
          className="text-slate-600 hover:text-slate-800 text-sm font-medium flex items-center gap-1"
        >
          <ChevronLeft size={18} /> Back to shop
        </button>
      </div>
      <div className="space-y-4">
        {orders.length === 0 ? (
          <div className="bg-white rounded-xl border border-slate-200 p-8 text-center text-slate-500">
            No orders yet.
          </div>
        ) : (
          orders.map((order) => (
            <div
              key={order._id}
              className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden"
            >
              <div className="px-4 py-3 bg-slate-50 border-b border-slate-100 flex justify-between items-center">
                <span className="text-sm text-slate-500">
                  {new Date(order.createdAt).toLocaleString()}
                </span>
                <span className="font-bold text-emerald-600">
                  ${Number(order.total).toFixed(2)}
                </span>
              </div>
              <ul className="divide-y divide-slate-100">
                {order.items?.map((oi, i) => (
                  <li key={i} className="px-4 py-2 flex justify-between text-sm">
                    <span>{oi.name} × {oi.quantity}</span>
                    <span className="text-slate-600">
                      ${(Number(oi.priceAtOrder) * (oi.quantity || 0)).toFixed(2)}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
