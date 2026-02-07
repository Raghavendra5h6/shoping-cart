import { ShoppingCart, History, LogOut, Package } from 'lucide-react';

export default function Navbar({ onCart, onOrders, onLogout, cartCount }) {
  return (
    <nav className="bg-slate-800 text-white shadow-lg">
      <div className="max-w-6xl mx-auto px-4 flex items-center justify-between h-14">
        <div className="flex items-center gap-2 font-semibold">
          <Package size={24} />
          <span>Shop Cart</span>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={onCart}
            className="flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-slate-700 transition"
          >
            <ShoppingCart size={20} />
            Cart
            {cartCount > 0 && (
              <span className="bg-emerald-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">
                {cartCount}
              </span>
            )}
          </button>
          <button
            onClick={onOrders}
            className="flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-slate-700 transition"
          >
            <History size={20} />
            Order History
          </button>
          <button
            onClick={onLogout}
            className="flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-red-600/80 transition"
          >
            <LogOut size={20} />
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
}
