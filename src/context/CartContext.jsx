
import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState
} from "react";

const CartContext = createContext();

export function CartProvider({ children }) {
  const [cart, setCart] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("shopeasy-cart")) || [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem("shopeasy-cart", JSON.stringify(cart));
  }, [cart]);

  const addToCart = (product) => {
    setCart((previous) => {
      const existing = previous.find(
        (item) => item.id === product.id
      );

      if (existing) {
        return previous.map((item) =>
          item.id === product.id
            ? {
                ...product,
                quantity: existing.quantity + 1
              }
            : item
        );
      }

      return [...previous, { ...product, quantity: 1 }];
    });
  };

  // Đồng bộ thông tin và giá sản phẩm từ API
  const syncCartProducts = (products) => {
    const productMap = new Map(
      products.map((product) => [Number(product.id), product])
    );

    setCart((previous) =>
      previous.map((item) => {
        const product = productMap.get(Number(item.id));

        // Giữ nguyên sản phẩm nếu API không trả về sản phẩm đó
        if (!product) return item;

        const originalPrice = Number(product.price);
        const discountPercent =
          Number(product.discount_percent) || 0;

        const salePrice = Math.round(
          originalPrice * (1 - discountPercent / 100) * 100
        ) / 100;

        return {
          ...product,
          originalPrice,
          price: salePrice,
          discount_percent: discountPercent,
          quantity: item.quantity
        };
      })
    );
  };

  const updateQuantity = (id, quantity) => {
    if (quantity <= 0) {
      removeFromCart(id);
      return;
    }

    setCart((previous) =>
      previous.map((item) =>
        item.id === id ? { ...item, quantity } : item
      )
    );
  };

  const removeFromCart = (id) => {
    setCart((previous) =>
      previous.filter((item) => item.id !== id)
    );
  };

  const clearCart = () => setCart([]);

  const total = useMemo(
    () =>
      cart.reduce(
        (sum, item) =>
          sum + Number(item.price) * item.quantity,
        0
      ),
    [cart]
  );

  const itemCount = useMemo(
    () =>
      cart.reduce(
        (sum, item) => sum + item.quantity,
        0
      ),
    [cart]
  );

  return (
    <CartContext.Provider
      value={{
        cart,
        total,
        itemCount,
        addToCart,
        updateQuantity,
        removeFromCart,
        clearCart,
        syncCartProducts
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  return useContext(CartContext);
}
