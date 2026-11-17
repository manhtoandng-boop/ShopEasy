import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { formatVND } from "../data/products";

export default function Checkout() {
  const { cart, total, clearCart } = useCart();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    phone: "",
    address: "",
    paymentMethod: "cod"
  });

  const [error, setError] = useState("");

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (cart.length === 0) {
      setError("Giỏ hàng đang trống.");
      return;
    }

    if (!/^(0|\+84)[0-9]{9,10}$/.test(form.phone.trim())) {
      setError("Số điện thoại không hợp lệ.");
      return;
    }

    if (form.name.trim().length < 2 || !form.address.trim()) {
      setError("Vui lòng nhập đầy đủ thông tin.");
      return;
    }

    const order = {
      ...form,
      items: cart,
      total,
      orderCode: "SE" + Date.now()
    };

    // Demo: lưu đơn hàng trong trình duyệt.
    // Sẽ thay bằng API Backend ở giai đoạn tiếp theo.
    localStorage.setItem("shopeasy-last-order", JSON.stringify(order));

    clearCart();
    navigate("/success");
  };

  if (cart.length === 0) {
    return (
      <div className="text-center py-24">
        <h2 className="text-2xl font-bold">
          Bạn chưa có sản phẩm để thanh toán.
        </h2>
        <Link to="/" className="text-blue-600 mt-4 inline-block">
          Quay lại mua sắm
        </Link>
      </div>
    );
  }

  return (
    <main className="max-w-3xl mx-auto px-4 py-12">
      <div className="bg-white rounded-2xl border p-6 sm:p-8">
        <h1 className="text-2xl font-black mb-6">
          Thông tin giao hàng
        </h1>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-semibold mb-2">
              Họ và tên *
            </label>
            <input
              name="name"
              value={form.name}
              onChange={handleChange}
              required
              className="w-full border rounded-xl p-3 outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Nguyễn Văn A"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold mb-2">
              Số điện thoại *
            </label>
            <input
              name="phone"
              type="tel"
              value={form.phone}
              onChange={handleChange}
              required
              className="w-full border rounded-xl p-3 outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="0912345678"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold mb-2">
              Địa chỉ nhận hàng *
            </label>
            <textarea
              name="address"
              value={form.address}
              onChange={handleChange}
              required
              rows="3"
              className="w-full border rounded-xl p-3 outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Nhập địa chỉ nhận hàng"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold mb-3">
              Phương thức thanh toán
            </label>

            <label className="flex gap-3 items-center border rounded-xl p-4 mb-3 cursor-pointer">
              <input
                type="radio"
                name="paymentMethod"
                value="cod"
                checked={form.paymentMethod === "cod"}
                onChange={handleChange}
              />
              Thanh toán khi nhận hàng (COD)
            </label>

            <label className="flex gap-3 items-center border rounded-xl p-4 cursor-pointer">
              <input
                type="radio"
                name="paymentMethod"
                value="bank"
                checked={form.paymentMethod === "bank"}
                onChange={handleChange}
              />
              Chuyển khoản / Mã QR
            </label>
          </div>

          {error && (
            <p className="text-red-600 text-sm">{error}</p>
          )}

          <div className="border-t pt-5">
            <div className="flex justify-between font-bold mb-5">
              <span>Tổng thanh toán</span>
              <span className="text-blue-600 text-xl">
                {formatVND(total)}
              </span>
            </div>

            <button
              type="submit"
              className="w-full bg-blue-600 text-white font-bold py-3 rounded-xl hover:bg-blue-700"
            >
              Xác nhận đặt hàng
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}
