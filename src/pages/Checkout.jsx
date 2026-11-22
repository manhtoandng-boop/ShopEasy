
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { formatVND } from "../data/products";

const API_URL = "http://localhost:3000/api";

export default function Checkout() {
  const { cart, total, clearCart } = useCart();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    phone: "",
    email: "",
    address: "",
    paymentMethod: "cod"
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (cart.length === 0) {
      setError("Giỏ hàng đang trống.");
      return;
    }

    if (!/^[0-9]{10,11}$/.test(form.phone.trim())) {
      setError("Số điện thoại phải có 10 hoặc 11 chữ số.");
      return;
    }

    if (form.name.trim().length < 2 || !form.address.trim()) {
      setError("Vui lòng nhập đầy đủ thông tin.");
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) {
      setError("Email không hợp lệ.");
      return;
    }

    const orderData = {
      customer_name: form.name.trim(),
      phone: form.phone.trim(),
      email: form.email.trim(),
      address: form.address.trim(),
      payment_method:
        form.paymentMethod === "cod"
          ? "Thanh toán khi nhận hàng"
          : "Chuyển khoản ngân hàng",
      items: cart.map((item) => ({
        product_id: item.id,
        quantity: item.quantity
      }))
    };

    try {
      setLoading(true);

      const response = await fetch(`${API_URL}/orders`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(orderData)
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(
          data.message || "Không thể tạo đơn hàng."
        );
      }

      const order = {
        orderCode: data.order.order_code,
        name: form.name.trim(),
        phone: form.phone.trim(),
        email: form.email.trim(),
        address: form.address.trim(),
        paymentMethod: form.paymentMethod,
        total: Number(data.order.total_amount),
        status: data.order.status
      };

      localStorage.setItem(
        "shopeasy-last-order",
        JSON.stringify(order)
      );

      clearCart();
      navigate("/success");

    } catch (err) {
      setError(
        err.message || "Không thể kết nối đến máy chủ."
      );
    } finally {
      setLoading(false);
    }
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
              Email *
            </label>

            <input
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              required
              className="w-full border rounded-xl p-3 outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="example@gmail.com"
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
            <div className="bg-red-50 border border-red-200 text-red-600 rounded-xl p-3 text-sm">
              {error}
            </div>
          )}

          <div className="border-t pt-5">
            <div className="flex justify-between font-bold mb-5">
              <span>Tổng thanh toán tạm tính</span>

              <span className="text-blue-600 text-xl">
                {formatVND(total)}
              </span>
            </div>

            <p className="text-sm text-slate-500 mb-4">
              Tổng tiền chính thức sẽ được Backend tính lại
              dựa trên giá và tồn kho trong cơ sở dữ liệu.
            </p>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 text-white font-bold py-3 rounded-xl hover:bg-blue-700 disabled:bg-slate-400 disabled:cursor-not-allowed"
            >
              {loading ? "Đang xử lý đơn hàng..." : "Xác nhận đặt hàng"}
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}
