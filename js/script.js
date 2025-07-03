let cart = JSON.parse(localStorage.getItem('cart')) || [];

function saveCart() {
    localStorage.setItem('cart', JSON.stringify(cart));
}

async function fetchProducts() {
    try {
        const response = await fetch('https://dummyjson.com/products');
        const data = await response.json();
        displayProducts(data.products);
    } catch (error) {
        console.error('Error al cargar productos:', error);
    }
}

function displayProducts(products) {
    const productsDiv = document.getElementById('products');
    if (!productsDiv) return;

    productsDiv.innerHTML = '';
    products.forEach(product => {
        const productCard = document.createElement('div');
        productCard.className = 'product-card';
        productCard.innerHTML = `
            <img src="${product.thumbnail || 'img/placeholder.png'}" alt="${product.title}">
            <h3>${product.title}</h3>
            <p>$${product.price}</p>
            <button onclick="window.location.href='product.html?id=${product.id}'">Ver Detalle</button>
            <button onclick="addToCart(${product.id}, '${product.title}', ${product.price}, '${product.thumbnail}')">Agregar al Carrito</button>
        `;
        productsDiv.appendChild(productCard);
    });
}


async function showProductDetail(productId) {
    try {
        const response = await fetch(`https://dummyjson.com/products/${productId}`);
        const product = await response.json();
        const productDetail = document.getElementById('product-detail');
        if (!productDetail) return;

        productDetail.innerHTML = `
            <h2>${product.title}</h2>
            <img src="${product.thumbnail || 'img/placeholder.png'}" alt="${product.title}" style="max-width: 300px;">
            <p>${product.description}</p>
            <p>Precio: $${product.price}</p>
            <p>Stock: ${product.stock}</p>
            <button onclick="addToCart(${product.id}, '${product.title}', ${product.price}, '${product.thumbnail}')">Agregar al Carrito</button>
        `;
    } catch (error) {
        console.error('Error al cargar detalle del producto:', error);
    }
}


function addToCart(id, title, price, thumbnail) {
    const existingItem = cart.find(item => item.id === id);
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({ id, title, price, quantity: 1, thumbnail });
    }

    saveCart();

    const cartItems = document.getElementById('cart-items');
    if (cartItems) updateCart();

    alert(`${title} agregado al carrito.`);
    updateCartCount();
}


function updateCart() {
    const cartItems = document.getElementById('cart-items');
    const cartEmpty = document.getElementById('cart-empty');
    let totalContainer = document.getElementById('cart-total');

    if (!totalContainer) {
        totalContainer = document.createElement('p');
        totalContainer.id = 'cart-total';
        cartItems?.parentElement?.appendChild(totalContainer);
    }

    if (!cartItems || !cartEmpty) return;

    cartItems.innerHTML = '';
    let totalGeneral = 0;

    if (cart.length === 0) {
        cartEmpty.style.display = 'block';
        totalContainer.textContent = 'Total: $0';
    } else {
        cartEmpty.style.display = 'none';

        cart.forEach(item => {
            const subtotal = item.price * item.quantity;
            totalGeneral += subtotal;

            const cartItem = document.createElement('div');
            cartItem.className = 'cart-item';
            cartItem.innerHTML = `
                <img src="${item.thumbnail || 'img/placeholder.png'}" alt="${item.title}" width="100">
                <div class="cart-info">
                    <strong>${item.title}</strong>
                    <p>Precio: $${item.price}</p>
                    <div class="quantity-controls">
                        <button onclick="updateQuantity(${item.id}, -1)">-</button>
                        <span>${item.quantity}</span>
                        <button onclick="updateQuantity(${item.id}, 1)">+</button>
                    </div>
                    <p>Subtotal: $${subtotal}</p>
                </div>
            `;
            cartItems.appendChild(cartItem);
        });

        totalContainer.textContent = `Total: $${totalGeneral}`;
    }

    saveCart();
}


function updateQuantity(id, change) {
    const item = cart.find(item => item.id === id);
    if (item) {
        item.quantity += change;
        if (item.quantity <= 0) {
            cart = cart.filter(i => i.id !== id);
        }
        updateCart();
    }
}


function clearCart() {
    cart = [];
    updateCart();
}

function finalizarCompra() {
    if (cart.length === 0) {
        alert("El carrito está vacío.");
        return;
    }

    alert("¡Gracias por su compra!");
    cart = [];
    updateCart();
}

function updateCartCount() {
    const countElement = document.getElementById('cart-count');
    if (!countElement) return;

    const total = cart.reduce((acc, item) => acc + item.quantity, 0);
    countElement.textContent = `(${total})`;
}
