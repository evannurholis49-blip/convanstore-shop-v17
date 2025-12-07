let cart = [];
let currentProduct = {};
let isLoggedIn = false;
let currentUser = null;

// Fitur pencarian
const searchInput = document.getElementById('search');
const products = document.querySelectorAll('.product');
searchInput.addEventListener('input', function() {
    const query = this.value.toLowerCase();
    products.forEach(product => {
        const name = product.getAttribute('data-name').toLowerCase();
        product.style.display = name.includes(query) ? 'inline-block' : 'none';
    });
});

// Buka modal produk
function openProductModal(name, img, desc, price) {
    currentProduct = { name, img, desc, price };
    document.getElementById('product-title').textContent = name;
    document.getElementById('product-img').src = img;
    document.getElementById('product-desc').textContent = desc;
    document.getElementById('product-price').textContent = price.toLocaleString();
    document.getElementById('size-select').value = ''; // Reset ukuran
    document.getElementById('product-modal').style.display = 'block';
}

// Tambah ke keranjang dari modal
function addToCartFromModal() {
    const size = document.getElementById('size-select').value;
    if (!size) {
        alert('Silakan pilih ukuran terlebih dahulu.');
        return;
    }
    addToCart(currentProduct.name, currentProduct.price, currentProduct.img, size);
    closeModal('product-modal');
}

// Tambah ke keranjang
function addToCart(name, price, img, size) {
    const existing = cart.find(item => item.name === name && item.size === size);
    if (existing) {
        existing.quantity++;
    } else {
        cart.push({ name, price, img, size, quantity: 1 });
    }
    updateCartCount();
    showNotification();
}

// Update jumlah keranjang
function updateCartCount() {
    document.getElementById('cart-count').textContent = cart.reduce((sum, item) => sum + item.quantity, 0);
}

// Buka modal keranjang
function openCartModal() {
    const cartItems = document.getElementById('cart-items');
    cartItems.innerHTML = '';
    let total = 0;
    cart.forEach((item, index) => {
        total += item.price * item.quantity;
        cartItems.innerHTML += `
            <div class="cart-item">
                <img src="${item.img}" alt="${item.name}">
                <div>
                    <h4>${item.name} (Ukuran: ${item.size})</h4>
                    <p>Rp ${item.price.toLocaleString()} x ${item.quantity}</p>
                </div>
                <button onclick="removeFromCart(${index})">Hapus</button>
            </div>
        `;
    });
    document.getElementById('cart-total').textContent = total.toLocaleString();
    document.getElementById('cart-modal').style.display = 'block';
}

// Hapus dari keranjang
function removeFromCart(index) {
    cart.splice(index, 1);
    updateCartCount();
    openCartModal(); // Refresh modal
}

// Checkout (simulasi)
function checkout() {
    closeModal('cart-modal');
    openOrderModal();
}

// Tutup modal
function closeModal(modalId) {
    document.getElementById(modalId).style.display = 'none';
}

// Tampilkan notifikasi
function showNotification() {
    const notif = document.getElementById('notification');
    notif.style.display = 'block';
    setTimeout(() => notif.style.display = 'none', 2000);
}

// Buka modal login
function openLoginModal() {
    document.getElementById('login-modal').style.display = 'block';
}

// Buka modal register
function openRegisterModal() {
    closeModal('login-modal');
    document.getElementById('register-modal').style.display = 'block';
}

// Buka modal pemesanan
function openOrderModal() {
    if (!isLoggedIn) {
        alert('Silakan login terlebih dahulu.');
        openLoginModal();
        return;
    }
    document.getElementById('order-modal').style.display = 'block';
}

// Buka modal pembayaran
function openPaymentModal(orderData) {
    document.getElementById('payment-modal').style.display = 'block';
    // Simpan data pemesanan untuk pembayaran
    window.currentOrder = orderData;
}

// Handle login form
document.getElementById('login-form').addEventListener('submit', function(e) {
    e.preventDefault();
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    // Simulasi login (dalam aplikasi nyata, ini akan kirim ke server)
    if (username && password) {
        isLoggedIn = true;
        currentUser = username;
        document.getElementById('login-link').textContent = 'Logout';
        document.getElementById('login-link').onclick = logout;
        closeModal('login-modal');
        showNotification('Login berhasil!');
    }
});

// Handle register form
document.getElementById('register-form').addEventListener('submit', function(e) {
    e.preventDefault();
    const username = document.getElementById('reg-username').value;
    const password = document.getElementById('reg-password').value;
    const email = document.getElementById('reg-email').value;
    // Simulasi register (dalam aplikasi nyata, ini akan kirim ke server)
    if (username && password && email) {
        alert('Pendaftaran berhasil! Silakan login.');
        closeModal('register-modal');
        openLoginModal();
    }
});

// Handle order form
document.getElementById('order-form').addEventListener('submit', function(e) {
    e.preventDefault();
    const name = document.getElementById('order-name').value;
    const address = document.getElementById('order-address').value;
    const phone = document.getElementById('order-phone').value;
    const orderData = { name, address, phone, items: cart, total: cart.reduce((sum, item) => sum + item.price * item.quantity, 0) };
    closeModal('order-modal');
    openPaymentModal(orderData);
});

// Handle payment form
document.getElementById('payment-form').addEventListener('submit', function(e) {
    e.preventDefault();
    const method = document.getElementById('payment-method').value;
    if (method) {
        // Simulasi pembayaran berhasil
        alert('Pembayaran berhasil! Pesanan Anda sedang diproses.');
        cart = [];
        updateCartCount();
        closeModal('payment-modal');
        showNotification('Pesanan berhasil!');
    }
});

// Logout
function logout() {
    isLoggedIn = false;
    currentUser = null;
    document.getElementById('login-link').textContent = 'Login';
    document.getElementById('login-link').onclick = openLoginModal;
    showNotification('Logout berhasil!');
}
