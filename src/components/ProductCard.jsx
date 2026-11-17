import { ShoppingCart, Star } from "lucide-react";
import { formatVND } from "../data/products";
import { useCart } from "../context/CartContext";

export default function ProductCard({ product }) {
  const { addToCart } = useCart();

  return (
    <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden hover:shadow-lg transition">
      <div className="relative">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-52 object-cover"
        />

        <span className="absolute top-3 left-3 bg-blue-600 text-white text-xs px-3 py-1 rounded">
          {product.tag}
        </span>
      </div>

      <div className="p-4">
        <p className="text-xs text-slate-500">
          {product.category}
        </p>

        <h3 className="font-bold mt-2 min-h-12">
          {product.name}
        </h3>

        <p className="text-sm text-slate-500 mt-2 line-clamp-2">
          {product.description}
        </p>

        <div className="flex items-center gap-1 text-amber-500 mt-3 text-sm">
          <Star size={15} fill="currentColor" />
          {product.rating}
          <span className="text-slate-400">
            ({product.reviews} đánh giá)
          </span>
        </div>

        <div className="flex justify-between items-center mt-4 gap-2">
          <span className="font-black text-blue-600">
            {formatVND(product.price)}
          </span>

          <button
            onClick={() => addToCart(product)}
            className="bg-blue-600 hover:bg-blue-700 text-white p-2.5 rounded-lg"
            aria-label="Thêm vào giỏ hàng"
          >
            <ShoppingCart size={18} />
          </button>
        </div>
      </div>
    </div>
  );
}
