import { Link, useNavigate } from "react-router-dom";
import { ShoppingCart, Search } from "lucide-react";
import { useCart } from "../context/CartContext";

export default function Header({ search, setSearch }) {
  const { itemCount } = useCart();
  const navigate = useNavigate();

  return (
    <header className="sticky top-0 z-40 bg-white shadow-sm">
      <div className="bg-blue-600 text-white text-center py-2 text-xs">
        Miễn phí vận chuyển cho đơn hàng từ 500.000đ!
      </div>

      <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between gap-4">
        <Link to="/" className="text-2xl font-black text-blue-600">
          ShopEasy
        </Link>

        <div className="hidden sm:flex flex-1 max-w-xl relative">
          <Search className="absolute left-3 top-3 text-gray-400" size={18} />

          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Tìm kiếm sản phẩm..."
            className="w-full bg-slate-100 rounded-full py-2.5 pl-10 pr-4 outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <button
          onClick={() => navigate("/cart")}
          className="relative flex items-center gap-2 bg-blue-50 text-blue-700 px-4 py-2 rounded-full"
        >
          <ShoppingCart size={20} />
          <span className="hidden sm:inline">Giỏ hàng</span>

          {itemCount > 0 && (
            <span className="bg-blue-600 text-white rounded-full px-2 text-xs">
              {itemCount}
            </span>
          )}
        </button>
      </div>

      <div className="sm:hidden px-4 pb-3">
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Tìm kiếm sản phẩm..."
          className="w-full bg-slate-100 rounded-lg py-2 px-3 outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
    </header>
  );
}
