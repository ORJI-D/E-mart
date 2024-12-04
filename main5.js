let cart = []; // Store cart items
let totalAmount = 0; // Store total cart amount

 let cartQuantity = 0; // Total number of items in the cart

// Function to update the checkout button and cart badge
function updateCartUI() {
  const checkoutButton = document.getElementById("checkoutbtn");
  const cartBadge = document.getElementById("cart-quantity");

  checkoutButton.textContent = `Check-out (₦${totalAmount.toLocaleString()})`;
  cartBadge.textContent = cartQuantity;
}

// Function to add an item to the cart
function addToCart(id, price, name) {
  const existingItem = cart.find(item => item.id === id);

  if (existingItem) {
    existingItem.quantity++;
  } else {
    cart.push({ id, price, name, quantity: 1 });
  }

  cartQuantity++;
  totalAmount += price;

  renderCart(); // Update the cart UI
}

// Function to render cart items
function renderCart() {
  const cartItemsContainer = document.getElementById("cart-items");
  cartItemsContainer.innerHTML = ""; // Clear existing items

  cart.forEach(item => {
    const itemTotal = item.price * item.quantity;

    const cartItem = document.createElement("div");
    cartItem.classList.add("cart-item");
    cartItem.innerHTML = `
      <span>${item.name} - ₦${itemTotal.toLocaleString()} (x${item.quantity})</span>
      <div>
        <button onclick="incrementItem(${item.id})">+</button>
        <button onclick="decrementItem(${item.id})">-</button>
        <button onclick="removeItem(${item.id})">Remove</button>
      </div>
    `;

    cartItemsContainer.appendChild(cartItem);
  });

  updateCartUI(); // Update totals and badge
}

// Increment, Decrement, and Remove Functions
function incrementItem(id) {
  const item = cart.find(item => item.id === id);
  if (item) {
    item.quantity++;
    cartQuantity++;
    totalAmount += item.price;
    renderCart();
  }
}

function decrementItem(id) {
  const item = cart.find(item => item.id === id);
  if (item && item.quantity > 1) {
    item.quantity--;
    cartQuantity--;
    totalAmount -= item.price;
    renderCart();
  }
}

function removeItem(id) {
  const item = cart.find(item => item.id === id);
  if (item) {
    cartQuantity -= item.quantity;
    totalAmount -= item.price * item.quantity;
    cart = cart.filter(item => item.id !== id);
    renderCart();
  }
}

// Add to Cart Buttons
document.querySelectorAll(".add-to-cart").forEach(button => {
  button.addEventListener("click", (event) => {
    const id = parseInt(event.target.dataset.id);
    const price = parseInt(event.target.dataset.price);
    const name = event.target.dataset.name;
    addToCart(id, price, name);
  });
});

// Toggle Cart Visibility
document.getElementById("cartBtn").addEventListener("click", () => {
  const cartContainer = document.getElementById("cart-container");
  cartContainer.style.display = (cartContainer.style.display === 'none' || !cartContainer.style.display) ? 'block' : 'none';
});

// Close Cart Button
document.getElementById("closeCartBtn").addEventListener("click", () => {
  document.getElementById("cart-container").style.display = "none";
});

// Checkout with Paystack
document.getElementById("checkoutbtn").addEventListener("click", () => {
  if (totalAmount === 0) {
    alert("Your cart is empty!");
    return;
  }

  const handler = PaystackPop.setup({
    key: "pk_test_72c717f8e0f3db3bc90e57fb8ada30f00689cc3e", // Your Paystack public key
    email: "customer@example.com", // Replace with dynamic customer email if needed
    amount: totalAmount * 100, // Convert to kobo
    currency: "NGN",
    callback: function (response) {
      alert(`Payment successful! Reference: ${response.reference}`);
    },
    onClose: function () {
      alert("Payment was cancelled.");
    },
  });

  handler.openIframe();
});

// Initialize cart on page load
renderCart();
