import { Link } from "react-router-dom";
import { Minus, Plus, Trash2, ShoppingCart } from "lucide-react";
import { useCart } from "../context/CartContext";
import { formatVND } from "../data/products";

export default function Cart() {
  const {
    cart,
    total,
    updateQuantity,
    removeFromCart
  } = useCart();

  if (cart.length === 0) {
    return (
      <div className="max-w-4xl mx-auto text-center py-24 px-4">
        <ShoppingCart size={60} className="mx-auto text-slate-300" />

        <h2 className="text-2xl font-bold mt-5">
          Giỏ hàng đang trống
        </h2>

        <Link
          to="/"
          className="inline-block mt-6 bg-blue-600 text-white px-6 py-3 rounded-xl"
        >
          Tiếp tục mua sắm
        </Link>
      </div>
    );
  }

  return (
    <main className="max-w-5xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-black mb-8">
        Giỏ hàng của bạn
      </h1>

      <div className="bg-white rounded-2xl border p-5">
        {cart.map((item) => (
          <div
            key={item.id}
            className="flex flex-col sm:flex-row items-center justify-between gap-4 py-5 border-b last:border-0"
          >
            <div className="flex items-center gap-4 w-full">
              <img
                src={item.image}
                alt={item.name}
                className="w-20 h-20 object-cover rounded-xl"
              />

              <div>
                <h3 className="font-bold">{item.name}</h3>
                <p className="text-blue-600 font-semibold mt-2">
                  {formatVND(item.price)}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="flex items-center border rounded-lg">
                <button
                  onClick={() => updateQuantity(item.id, item.quantity - 1)}
                  className="p-2"
                  aria-label="Giảm số lượng"
                >
                  <Minus size={16} />
                </button>

                <span className="px-3 font-bold">
                  {item.quantity}
                </span>

                <button
                  onClick={() => updateQuantity(item.id, item.quantity + 1)}
                  className="p-2"
                  aria-label="Tăng số lượng"
                >
                  <Plus size={16} />
                </button>
              </div>

              <button
                onClick={() => removeFromCart(item.id)}
                className="text-red-500 p-2"
                aria-label="Xóa sản phẩm"
              >
                <Trash2 size={18} />
              </button>
            </div>

            <p className="font-bold min-w-32 text-right">
              {formatVND(item.price * item.quantity)}
            </p>
          </div>
        ))}

        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mt-6">
          <div>
            <p className="text-slate-500 text-sm">Tổng thanh toán</p>
            <p className="text-2xl font-black text-blue-600">
              {formatVND(total)}
            </p>
          </div>

          <Link
            to="/checkout"
            className="bg-blue-600 text-white font-bold px-8 py-3 rounded-xl hover:bg-blue-700"
          >
            Tiến hành đặt hàng
          </Link>
        </div>
      </div>
    </main>
  );
}
