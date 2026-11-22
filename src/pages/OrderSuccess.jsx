
import { Link, Navigate } from "react-router-dom";
import { CheckCircle2 } from "lucide-react";
import { formatVND } from "../data/products";

export default function OrderSuccess() {
  let order = null;

  try {
    order = JSON.parse(
      localStorage.getItem("shopeasy-last-order")
    );
  } catch {
    order = null;
  }

  if (!order || !order.orderCode) {
    return <Navigate to="/" replace />;
  }

  return (
    <main className="max-w-xl mx-auto px-4 py-20">
      <div className="bg-white border rounded-2xl p-8 text-center">
        <CheckCircle2
          size={65}
          className="mx-auto text-emerald-500"
        />

        <h1 className="text-3xl font-black mt-5">
          Đặt hàng thành công!
        </h1>

        <p className="text-slate-500 mt-2">
          Cảm ơn bạn đã mua sắm tại ShopEasy.
        </p>

        <div className="bg-slate-50 rounded-xl p-5 text-left mt-8 space-y-3">
          <p>
            Mã đơn hàng:
            <strong className="text-blue-600 ml-2">
              {order.orderCode}
            </strong>
          </p>

          <p>
            Người nhận: <strong>{order.name}</strong>
          </p>

          <p>
            Số điện thoại: <strong>{order.phone}</strong>
          </p>

          <p>
            Email: <strong>{order.email}</strong>
          </p>

          <p>
            Địa chỉ: <strong>{order.address}</strong>
          </p>

          <p>
            Thanh toán:{" "}
            <strong>
              {order.paymentMethod === "cod"
                ? "Thanh toán khi nhận hàng (COD)"
                : "Chuyển khoản ngân hàng"}
            </strong>
          </p>

          <p>
            Trạng thái: <strong>{order.status || "Pending"}</strong>
          </p>

          <div className="border-t pt-3 flex justify-between">
            <span>Tổng tiền</span>
            <strong className="text-blue-600">
              {formatVND(order.total)}
            </strong>
          </div>
        </div>

        <Link
          to="/"
          onClick={() =>
            localStorage.removeItem("shopeasy-last-order")
          }
          className="block bg-blue-600 text-white font-bold py-3 rounded-xl mt-6"
        >
          Tiếp tục mua sắm
        </Link>
      </div>
    </main>
  );
}
