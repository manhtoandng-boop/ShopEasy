import { ShoppingCart } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-300 mt-16">
      <div className="max-w-7xl mx-auto px-4 py-12 grid grid-cols-1 md:grid-cols-3 gap-8">
        <div>
          <h2 className="text-white text-2xl font-black flex items-center gap-2">
            <ShoppingCart className="text-blue-500" />
            ShopEasy
          </h2>
          <p className="mt-4 text-sm">
            Mua sắm dễ dàng, quản lý tài chính thông minh.
            Nền tảng thương mại điện tử hiện đại.
          </p>
        </div>

        <div>
          <h3 className="text-white font-bold mb-4">
            Hỗ trợ khách hàng
          </h3>
          <ul className="space-y-2 text-sm">
            <li>Hướng dẫn mua hàng</li>
            <li>Chính sách thanh toán</li>
            <li>Chính sách giao hàng</li>
            <li>Chính sách đổi trả</li>
          </ul>
        </div>

        <div>
          <h3 className="text-white font-bold mb-4">
            Liên hệ
          </h3>
          <p className="text-sm">Hotline: 1900 1234</p>
          <p className="text-sm mt-2">
            Email: support@shopeasy.vn
          </p>
        </div>
      </div>

      <div className="border-t border-slate-700 text-center py-5 text-xs">
        © 2026 ShopEasy. All rights reserved.
      </div>
    </footer>
  );
}
