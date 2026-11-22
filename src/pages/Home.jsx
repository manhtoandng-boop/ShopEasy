
import { useEffect, useMemo, useState } from "react";
import ProductCard from "../components/ProductCard";
import { ArrowRight, Truck, ShieldCheck, Headphones } from "lucide-react";
import { useCart } from "../context/CartContext";

const CATEGORIES = ["Tất cả", "Âm thanh", "Phụ kiện", "Máy tính"];

export default function Home({ search = "" }) {
  const { syncCartProducts } = useCart();
  const [category, setCategory] = useState("Tất cả");
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await fetch("http://localhost:3000/api/products");

        if (!response.ok) {
          throw new Error("Không thể tải danh sách sản phẩm.");
        }

        const data = await response.json();

        if (!data.success) {
          throw new Error(data.message || "Lỗi tải sản phẩm.");
        }

        const latestProducts = data.products || [];

	syncCartProducts(latestProducts);
	setProducts(latestProducts);

      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      const matchCategory =
        category === "Tất cả" || product.category === category;

      const matchSearch = product.name
        .toLowerCase()
        .includes(search.toLowerCase());

      return matchCategory && matchSearch;
    });
  }, [products, category, search]);

  return (
    <>
      <section className="bg-gradient-to-r from-blue-700 to-sky-500 text-white">
        <div className="max-w-7xl mx-auto px-4 py-20">
          <div className="max-w-2xl">
            <span className="bg-white/20 px-4 py-2 rounded-full text-sm">
              Ưu đãi đặc biệt hôm nay
            </span>

            <h1 className="text-4xl md:text-6xl font-black mt-6 leading-tight">
              Công nghệ cho cuộc sống tốt hơn
            </h1>

            <p className="text-blue-100 mt-5 text-lg">
              Sản phẩm chính hãng – Giá tốt mỗi ngày.
              Trải nghiệm mua sắm trực tuyến nhanh chóng và tiện lợi.
            </p>

            <a
              href="#products"
              className="inline-flex items-center gap-2 mt-8 bg-white text-blue-700 font-bold px-6 py-3 rounded-xl hover:bg-blue-50"
            >
              Mua ngay <ArrowRight size={18} />
            </a>
          </div>
        </div>
      </section>

      <section className="bg-white border-b">
        <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-3 gap-6 p-6 text-center">
          <div className="flex items-center justify-center gap-3">
            <Truck className="text-blue-600" />
            <span>Giao hàng nhanh chóng</span>
          </div>

          <div className="flex items-center justify-center gap-3">
            <ShieldCheck className="text-blue-600" />
            <span>Thanh toán an toàn</span>
          </div>

          <div className="flex items-center justify-center gap-3">
            <Headphones className="text-blue-600" />
            <span>Hỗ trợ khách hàng 24/7</span>
          </div>
        </div>
      </section>

      <section id="products" className="max-w-7xl mx-auto px-4 py-12">
        <div className="flex flex-col sm:flex-row justify-between gap-4 mb-8">
          <div>
            <h2 className="text-3xl font-black text-slate-900">
              Sản phẩm nổi bật
            </h2>
            <p className="text-slate-500 mt-2">
              Khám phá các sản phẩm công nghệ của ShopEasy
            </p>
          </div>

          <span className="text-sm text-slate-500">
            {filteredProducts.length} sản phẩm
          </span>
        </div>

        <div className="flex flex-wrap gap-3 mb-8">
          {CATEGORIES.map((item) => (
            <button
              key={item}
              onClick={() => setCategory(item)}
              className={`px-5 py-2 rounded-full text-sm font-semibold ${
                category === item
                  ? "bg-blue-600 text-white"
                  : "bg-white text-slate-600 border hover:bg-slate-100"
              }`}
            >
              {item}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="text-center py-16 text-blue-600">
            Đang tải sản phẩm...
          </div>
        ) : error ? (
          <div className="text-center py-16 text-red-500">
            {error}
          </div>
        ) : filteredProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16 text-slate-500">
            Không tìm thấy sản phẩm phù hợp.
          </div>
        )}
      </section>
    </>
  );
}
