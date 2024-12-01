document.addEventListener("DOMContentLoaded", function () {
  const startButton = document.getElementById("startButton");
  const stopButton = document.getElementById("stopButton");
  const cryScoreDisplay = document.getElementById("cryScoreDisplay");
  const audioPlayer = document.getElementById("audioPlayer");
  const recommendationsSection = document.getElementById("recommendations");
  const productList = document.getElementById("product-list");

  localStorage.removeItem("cart"); // Removes the cart from localStorage on page refresh

  // Initialize cart array and cart display elements
  let cart = JSON.parse(localStorage.getItem("cart")) || []; // Load cart from localStorage
  const cartItems = document.getElementById("cart-items");
  const cartTotal = document.getElementById("cart-total");
  const cartContainer = document.getElementById("cart-container"); // Cart container element

  // checkout
  const checkoutItems = document.getElementById("checkout-items");
  const checkoutTotal = document.getElementById("checkout-total");

  // Check if cart container exists
  if (!cartContainer) {
    console.error("Cart container not found!");
    return;
  }

  // Update cart display immediately on page load
  updateCart();

  // Handle add-to-cart button click (Add items in real time)
  document.body.addEventListener("click", (event) => {
    if (event.target.classList.contains("add-to-cart")) {
      const button = event.target;
      const itemName = button.getAttribute("data-name");
      const itemPrice = parseInt(button.getAttribute("data-price"));

      // Add item to cart
      cart.push({ name: itemName, price: itemPrice });
      updateCart();

      // Save the cart to localStorage
      localStorage.setItem("cart", JSON.stringify(cart));
    }
  });

  // Update cart display function
  function updateCart() {
    cartItems.innerHTML = "";
    let total = 0;

    // Update cart with items and calculate the total price
    cart.forEach((item) => {
      const li = document.createElement("li");
      li.textContent = `${item.name} - $${item.price}`;
      cartItems.appendChild(li);
      total += item.price;
    });

    // Update total price in the cart
    cartTotal.textContent = total;
  }

  cartContainer.addEventListener("click", () => {
    if (cart.length > 0) {
      window.location.href = "checkout.html"; // Redirect to checkout page
    } else {
      alert("Your cart is empty. Add items to your cart before checking out.");
    }
  });

  updateCart();

  // Handle start recording button
  let mediaRecorder;
  let audioChunks = [];

  startButton.addEventListener("click", () => {
    navigator.mediaDevices
      .getUserMedia({ audio: true })
      .then((stream) => {
        mediaRecorder = new MediaRecorder(stream);

        mediaRecorder.ondataavailable = (event) => {
          audioChunks.push(event.data);
        };

        mediaRecorder.onstop = () => {
          const audioBlob = new Blob(audioChunks, { type: "audio/webm" });
          const audioUrl = URL.createObjectURL(audioBlob);
          audioPlayer.src = audioUrl;
          cryScoreDisplay.textContent = "Recording stopped!";
          displayCryScore();
        };

        mediaRecorder.start();
        cryScoreDisplay.textContent = "Recording...";
        startButton.disabled = true;
        stopButton.disabled = false;
      })
      .catch((err) => {
        console.error("Microphone access denied:", err);
        cryScoreDisplay.textContent = "Microphone access denied!";
      });
  });

  // Stop recording button action
  stopButton.addEventListener("click", () => {
    if (mediaRecorder) {
      mediaRecorder.stop();
      startButton.disabled = false;
      stopButton.disabled = true;
    }
  });

  // Generate and display cry score based on recording
  function displayCryScore() {
    const cryScore = Math.floor(Math.random() * 100); // Random score between 0 and 100
    cryScoreDisplay.textContent = `Your cry score is: ${cryScore}`;
    displayRecommendations(cryScore);
  }

  // Display real-time product recommendations based on cry score
  function displayRecommendations(score) {
    recommendationsSection.style.display = "block";

    const recommendationsData = [
      {
        category: "low",
        name: "Soft Blanket",
        price: 25,
        description: "A cozy blanket to comfort you.",
        image: "public/images/soft_blanket.jpg",
      },
      {
        category: "medium",
        name: "Stress Relief Ball",
        price: 15,
        description: "Squeeze away the stress.",
        image: "public/images/stress_ball.jpg",
      },
      {
        category: "high",
        name: "Therapy Journal",
        price: 20,
        description: "A guided journal for self-reflection.",
        image: "public/images/therapy_journal.jpg",
      },
    ];

    // Find the appropriate product based on the cry score
    const recommendedProduct = recommendationsData.find((product) => {
      if (score <= 33) return product.category === "low";
      if (score > 33 && score <= 66) return product.category === "medium";
      return product.category === "high";
    });

    // Display the recommended product in real-time
    productList.innerHTML = ""; // Clear existing products
    if (recommendedProduct) {
      const productItem = document.createElement("li");
      productItem.innerHTML = `
        <img src="${recommendedProduct.image}" alt="${recommendedProduct.name}" style="width: 100px; height: auto" />
        <strong>${recommendedProduct.name}</strong><br />
        Price: $${recommendedProduct.price}<br />
        <em>${recommendedProduct.description}</em><br />
        <button class="add-to-cart" data-name="${recommendedProduct.name}" data-price="${recommendedProduct.price}">
          Add to Cart
        </button>
      `;
      productList.appendChild(productItem);
    }
  }
});
