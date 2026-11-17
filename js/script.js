
// ========================================
// 1. CONFIGURATION
// ========================================

// Backend API
const API_URL = "/api";

// Danh sách sản phẩm lấy từ MySQL
let products = [];

// Giỏ hàng được lưu trong LocalStorage
let cart = JSON.parse(localStorage.getItem("shopeasy_cart")) || [];

// Danh mục đang chọn
let currentCategory = "Tất cả";

// ========================================
// 2. HELPER FUNCTIONS
// ========================================

// Định dạng tiền Việt Nam
function formatPrice(price) {
    return new Intl.NumberFormat("vi-VN", {
        style: "currency",
        currency: "VND"
    }).format(Number(price) || 0);
}

// Chuyển dữ liệu thành chuỗi an toàn khi hiển thị HTML
function escapeHTML(value) {
    return String(value ?? "").replace(/[&<>"']/g, char => ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#39;"
    })[char]);
}

// Lưu giỏ hàng
function saveCart() {
    localStorage.setItem("shopeasy_cart", JSON.stringify(cart));
    updateCartCount();
}

// Cập nhật số lượng trên thanh điều hướng
function updateCartCount() {
    const countElement = document.getElementById("cart-count");

    if (!countElement) return;

    const totalQuantity = cart.reduce(
        (total, item) => total + item.quantity,
        0
    );

    countElement.textContent = totalQuantity;
}

// ========================================
// 3. LOAD PRODUCTS FROM MYSQL
// ========================================

async function loadProducts() {
    const productList = document.getElementById("product-list");

    productList.innerHTML = "<p>Đang tải sản phẩm...</p>";

    try {
        const response = await fetch(`${API_URL}/products`);
        const data = await response.json();

        if (!response.ok || !data.success) {
            throw new Error(data.message || "Không thể tải sản phẩm.");
        }

        // Chuyển dữ liệu từ MySQL sang JavaScript
        products = data.products.map(product => ({
            id: Number(product.id),
            name: product.name,
            category: product.category,
            price: Number(product.price),
            rating: Number(product.rating),
            reviews: Number(product.reviews),
            image: product.image,
            tag: product.tag,
            stock: Number(product.stock),
            description: product.description
        }));

        renderProducts();

        // Kiểm tra lại số lượng sản phẩm trong giỏ
        updateCartCount();

    } catch (error) {
        console.error("Load products error:", error);

        productList.innerHTML = `
            <p>Không thể tải sản phẩm.
            Vui lòng kiểm tra Backend và MySQL.</p>
        `;
    }
}

// ========================================
// 4. DISPLAY PRODUCTS
// ========================================

function renderProducts() {
    const productList = document.getElementById("product-list");

    if (!productList) return;

    const keyword = document
        .getElementById("search-input")
        .value
        .trim()
        .toLowerCase();

    const filteredProducts = products.filter(product => {
        const matchName = product.name.toLowerCase().includes(keyword);

        const matchCategory =
            currentCategory === "Tất cả" ||
            product.category === currentCategory;

        return matchName && matchCategory;
    });

    if (filteredProducts.length === 0) {
        productList.innerHTML = "<p>Không tìm thấy sản phẩm phù hợp.</p>";
        return;
    }

    productList.innerHTML = filteredProducts.map(product => `
        <div class="product-card">
            <img
                src="${escapeHTML(product.image || "")}"
                alt="${escapeHTML(product.name)}"
                onerror="this.src='https://placehold.co/400x300?text=ShopEasy'"
            >

            <div class="product-info">
                <p class="product-category">
                    ${escapeHTML(product.category)}
                </p>

                <h3>${escapeHTML(product.name)}</h3>

                <p>⭐ ${product.rating} (${product.reviews} đánh giá)</p>

                <p class="product-price">
                    ${formatPrice(product.price)}
                </p>

                <p class="product-stock">
                    Còn lại: ${product.stock} sản phẩm
                </p>

                <button
                    class="add-to-cart"
                    data-action="add"
                    data-id="${product.id}"
                    ${product.stock <= 0 ? "disabled" : ""}
                >
                    ${product.stock <= 0 ? "Hết hàng" : "Thêm vào giỏ"}
                </button>
            </div>
        </div>
    `).join("");
}

// ========================================
// 5. SEARCH PRODUCTS
// ========================================

document.getElementById("search-input").addEventListener("input", () => {
    renderProducts();
});

// ========================================
// 6. FILTER PRODUCTS BY CATEGORY
// ========================================

function filterProducts(category) {
    currentCategory = category;
    renderProducts();

    document.getElementById("products").scrollIntoView({
        behavior: "smooth"
    });
}

// Cho phép gọi filterProducts từ HTML
window.filterProducts = filterProducts;

// ========================================
// 7. ADD PRODUCT TO CART
// ========================================

function addToCart(productId) {
    const product = products.find(item => item.id === Number(productId));

    if (!product) {
        alert("Không tìm thấy sản phẩm.");
        return;
    }

    if (product.stock <= 0) {
        alert("Sản phẩm đã hết hàng.");
        return;
    }

    const existingItem = cart.find(item => item.id === product.id);

    if (existingItem) {
        if (existingItem.quantity >= product.stock) {
            alert(`Chỉ còn ${product.stock} sản phẩm trong kho.`);
            return;
        }

        existingItem.quantity++;
    } else {
        cart.push({
            id: product.id,
            quantity: 1
        });
    }

    saveCart();
    alert("Đã thêm sản phẩm vào giỏ hàng!");
}

// ========================================
// 8. DISPLAY CART
// ========================================

function renderCart() {
    const cartItems = document.getElementById("cart-items");
    const cartTotal = document.getElementById("cart-total");

    if (!cartItems || !cartTotal) return;

    let total = 0;

    if (cart.length === 0) {
        cartItems.innerHTML = "<p>Giỏ hàng của bạn đang trống.</p>";
        cartTotal.textContent = formatPrice(0);
        return;
    }

    cartItems.innerHTML = cart.map(item => {
        const product = products.find(p => p.id === item.id);

        if (!product) return "";

        const subtotal = product.price * item.quantity;
        total += subtotal;

        return `
            <div class="cart-item">
                <div class="cart-item-info">
                    <h3>${escapeHTML(product.name)}</h3>

                    <p class="cart-item-price">
                        ${formatPrice(product.price)}
                    </p>

                    <p>Còn lại trong kho: ${product.stock}</p>
                </div>

                <div class="cart-item-actions">
                    <button
                        data-action="decrease"
                        data-id="${product.id}"
                    >-</button>

                    <span>${item.quantity}</span>

                    <button
                        data-action="increase"
                        data-id="${product.id}"
                    >+</button>

                    <button
                        class="remove-button"
                        data-action="remove"
                        data-id="${product.id}"
                    >Xóa</button>
                </div>

                <strong>${formatPrice(subtotal)}</strong>
            </div>
        `;
    }).join("");

    cartTotal.textContent = formatPrice(total);
}

// ========================================
// 9. UPDATE CART QUANTITY
// ========================================

function updateCart(productId, action) {
    const item = cart.find(item => item.id === Number(productId));
    const product = products.find(p => p.id === Number(productId));

    if (!item) return;

    if (action === "increase") {
        if (!product || item.quantity >= product.stock) {
            alert(`Số lượng tối đa hiện có: ${product?.stock || 0}`);
            return;
        }

        item.quantity++;
    }

    if (action === "decrease") {
        item.quantity--;

        if (item.quantity <= 0) {
            cart = cart.filter(item => item.id !== Number(productId));
        }
    }

    if (action === "remove") {
        cart = cart.filter(item => item.id !== Number(productId));
    }

    saveCart();
    renderCart();
}

// ========================================
// 10. HANDLE BUTTON CLICKS
// ========================================

document.addEventListener("click", event => {
    const button = event.target.closest("button[data-action]");

    if (!button) return;

    const action = button.dataset.action;
    const productId = Number(button.dataset.id);

    if (action === "add") {
        addToCart(productId);
    }

    if (["increase", "decrease", "remove"].includes(action)) {
        updateCart(productId, action);
    }
});

// ========================================
// 11. NAVIGATION BETWEEN PAGES
// ========================================

function showPage(pageName) {
    const pages = {
        home: "home-page",
        cart: "cart-page",
        checkout: "checkout-page",
        success: "success-page"
    };

    Object.values(pages).forEach(id => {
        document.getElementById(id).hidden = true;
    });

    const selectedPage = pages[pageName];

    if (!selectedPage) return;

    document.getElementById(selectedPage).hidden = false;

    if (pageName === "cart") {
        renderCart();
    }

    if (pageName === "checkout") {
        document.getElementById("checkout-message").textContent = "";
    }

    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });
}

// Cho phép gọi showPage từ HTML
window.showPage = showPage;

// ========================================
// 12. CHECKOUT AND CREATE ORDER
// ========================================

document.getElementById("checkout-form").addEventListener(
    "submit",
    async function(event) {
        event.preventDefault();

        const message = document.getElementById("checkout-message");
        const submitButton = document.getElementById("place-order-button");

        if (cart.length === 0) {
            message.textContent = "Giỏ hàng đang trống.";
            return;
        }

        const customerName = document.getElementById("customer-name").value.trim();
        const phone = document.getElementById("customer-phone").value.trim();
        const email = document.getElementById("customer-email").value.trim();
        const address = document.getElementById("customer-address").value.trim();
        const paymentMethod = document.getElementById("payment-method").value;

        const orderData = {
            customer_name: customerName,
            phone: phone,
            email: email,
            address: address,
            payment_method: paymentMethod,

            // Backend sẽ tự lấy giá từ MySQL
            items: cart.map(item => ({
                product_id: item.id,
                quantity: item.quantity
            }))
        };

        submitButton.disabled = true;
        submitButton.textContent = "Đang xử lý...";
        message.textContent = "";

        try {
            const response = await fetch(`${API_URL}/orders`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(orderData)
            });

            const result = await response.json();

            if (!response.ok || !result.success) {
                // Xử lý trường hợp hết hàng
                if (response.status === 409) {
                    await loadProducts();
                    renderCart();
                }

                throw new Error(
                    result.message || "Không thể tạo đơn hàng."
                );
            }

            // Lấy mã đơn hàng từ Backend
            const orderCode =
                result.orderCode ||
                result.order_code ||
                result.order?.order_code ||
                result.order?.orderCode ||
                "Đã tạo thành công";

            // Xóa giỏ hàng sau khi đặt hàng thành công
            cart = [];
            saveCart();

            // Hiển thị trang thành công
            document.getElementById("success-order-code").textContent =
                orderCode;

            await loadProducts();

            document.getElementById("checkout-form").reset();

            showPage("success");

        } catch (error) {
            console.error("Checkout error:", error);
            message.textContent = error.message;

        } finally {
            submitButton.disabled = false;
            submitButton.textContent = "Đặt hàng";
        }
    }
);

// ========================================
// 13. INITIALIZE SHOP EASY
// ========================================

document.addEventListener("DOMContentLoaded", async () => {
    updateCartCount();
    await loadProducts();
});
