// LOGIN PAGE

const loginBtn = document.getElementById("loginBtn");

if (loginBtn) {

    loginBtn.addEventListener("click", function () {

        const email = document.getElementById("email").value.trim();
        const password = document.getElementById("password").value.trim();
        const error = document.getElementById("loginError");

        if (email === "" || password === "") {

            error.style.display = "block";
            error.textContent = "Please enter email and password";
            return;

        }

        localStorage.setItem("loggedInUser", email);

        window.location.href = "index.html";

    });

}

// ACCESS CONTROL

if (
    window.location.pathname.includes("index.html") ||
    window.location.pathname.includes("orders.html")
) {

    const loggedUser = localStorage.getItem("loggedInUser");

    if (!loggedUser) {

        window.location.href = "login.html";

    }

}
// DISPLAY LOGGED USER

const loggedUserSpan = document.getElementById("loggedUser");

if (loggedUserSpan) {

    loggedUserSpan.textContent =
        localStorage.getItem("loggedInUser");

}
// LOGOUT

const logoutBtn = document.getElementById("logoutBtn");

if (logoutBtn) {

    logoutBtn.addEventListener("click", function () {

        localStorage.removeItem("loggedInUser");

        window.location.href = "login.html";

    });

}

// PRODUCT DATA

let products = [];
// LOAD PRODUCTS FROM API

async function loadProducts() {

    showLoading();

    try {

        const response = await fetch("https://fakestoreapi.com/productssss");

        products = await response.json();

        products.forEach(product => {

            product.quantity = 0;

        });

        hideLoading();

        renderCategories();

        displayProducts();

    }

    catch (error) {

        hideLoading();

        showError();

    }

}
// SHOW LOADING

function showLoading(){

    document.getElementById("loading").style.display="block";

    productGrid.style.display="none";

    document.getElementById("errorMessage").style.display="none";

}

// HIDE LOADING

function hideLoading(){

    document.getElementById("loading").style.display="none";

    productGrid.style.display="grid";

}

// SHOW ERROR

function showError(){

    document.getElementById("errorMessage").style.display="block";

    productGrid.style.display="none";

}
// RENDER CATEGORIES

function renderCategories(){

    const categorySection = document.getElementById("categorySection");

    categorySection.innerHTML="";

    categorySection.innerHTML += `
        <button class="category-btn active" data-category="All">
            All
        </button>
    `;

    const categories = [...new Set(products.map(product => product.category))];

    categories.forEach(category=>{

        categorySection.innerHTML += `
            <button class="category-btn"
                data-category="${category}">
                ${category}
            </button>
        `;

    });

    const buttons=document.querySelectorAll(".category-btn");

    buttons.forEach(button=>{

        button.addEventListener("click",function(){

            buttons.forEach(btn=>btn.classList.remove("active"));

            this.classList.add("active");

            currentCategory=this.dataset.category;

            displayProducts();

        });

    });

}

// DOM ELEMENTS


const productGrid = document.getElementById("productGrid");
const searchInput = document.getElementById("searchInput");
const categoryButtons = document.querySelectorAll(".category-btn");
const noProducts = document.getElementById("noProducts");

let currentCategory = "All";
let searchText = "";


// DISPLAY PRODUCTS


function displayProducts() {

    let filteredProducts = products.filter(product => {

        let categoryMatch =
            currentCategory === "All" ||
            product.category === currentCategory;

        let searchMatch =
product.title.toLowerCase().includes(searchText.toLowerCase());

        return categoryMatch && searchMatch;

    });

    productGrid.innerHTML = "";

    if (filteredProducts.length === 0) {

        noProducts.style.display = "block";
        return;

    }

    noProducts.style.display = "none";

    filteredProducts.forEach(product => {

        productGrid.innerHTML += `

        <div class="product-card">

            <img src="${product.image}" alt="${product.name}">

            <div class="product-info">

               <h3>
${product.title.split(" ").slice(0,4).join(" ")}
</h3>

                <p class="weight">

${product.category}

</p>

                <div class="price-row">

                    <span class="price">$${product.price}</span>
                    <p class="rating">

★ ${product.rating.rate}

</p>

                    ${
                        product.quantity === 0
                        ?

                        `<button class="add-btn"
                            onclick="addToCart(${product.id})">
                            Add
                        </button>`

                        :

                        `<div class="quantity">

                            <button
                            onclick="decreaseQuantity(${product.id})">
                            -
                            </button>

                            <span>${product.quantity}</span>

                            <button
                            onclick="increaseQuantity(${product.id})">
                            +
                            </button>

                        </div>`
                    }

                </div>

            </div>

        </div>

        `;

    });

}


// SEARCH


searchInput.addEventListener("input", function(){

    searchText = this.value;

    displayProducts();

});


// CATEGORY FILTER


categoryButtons.forEach(button=>{

    button.addEventListener("click",function(){

        categoryButtons.forEach(btn=>{

            btn.classList.remove("active");

        });

        this.classList.add("active");

        currentCategory = this.dataset.category;

        displayProducts();

    });

});
// CART ELEMENTS

const cartCount = document.getElementById("cartCount");
const totalItems = document.getElementById("totalItems");
const totalPrice = document.getElementById("totalPrice");
const cartSummary = document.getElementById("cartSummary");

// ADD TO CART

function addToCart(id){

    const product = products.find(item => item.id === id);

    product.quantity = 1;

    updateCart();

}

// INCREASE QUANTITY

function increaseQuantity(id){

    const product = products.find(item => item.id === id);

    product.quantity++;

    updateCart();

}

// DECREASE QUANTITY

function decreaseQuantity(id){

    const product = products.find(item => item.id === id);

    if(product.quantity > 0){

        product.quantity--;

    }

    updateCart();

}

// UPDATE CART

function updateCart(){

    let items = 0;
    let amount = 0;

    products.forEach(product=>{

        items += product.quantity;

        amount += product.quantity * product.price;

    });

    cartCount.textContent = items;
    totalItems.textContent = items;
    totalPrice.textContent = amount;

    if(items > 0){

        cartSummary.style.display = "flex";

    }else{

        cartSummary.style.display = "none";

    }

    displayProducts();

}

// CHECKOUT

const checkoutBtn = document.getElementById("checkoutBtn");

if (checkoutBtn) {

    checkoutBtn.addEventListener("click", function () {

        const cartItems = products.filter(product => product.quantity > 0);

        if (cartItems.length === 0) {

            alert("Cart is empty!");

            return;

        }

        const order = {

            items: cartItems.map(product => ({

                name: product.title,

                quantity: product.quantity,

                price: product.price

            })),

            total: cartItems.reduce(

                (sum, product) => sum + (product.price * product.quantity),

                0

            ),

            date: new Date().toLocaleString()

        };

        let orders = JSON.parse(localStorage.getItem("orders")) || [];

        orders.push(order);

        localStorage.setItem("orders", JSON.stringify(orders));

const successMessage = document.getElementById("successMessage");

successMessage.style.display = "block";

setTimeout(function(){

    successMessage.style.display = "none";

},3000);
        products.forEach(product => {

            product.quantity = 0;

        });

        updateCart();

        displayProducts();

    });

}

// INITIAL UPDATE

updateCart();

loadProducts();
// ORDER HISTORY

const ordersContainer = document.getElementById("ordersContainer");

if (ordersContainer) {

    const orders = JSON.parse(localStorage.getItem("orders")) || [];

    const noOrders = document.getElementById("noOrders");

    if (orders.length === 0) {

        noOrders.style.display = "block";

    } else {

        noOrders.style.display = "none";

        orders.forEach((order, index) => {

            let itemsHTML = "";

            order.items.forEach(item => {

                itemsHTML += `

                    <div class="order-item">

                        <span>

                            ${item.name} × ${item.quantity}

                        </span>

                        <span>

                            ₹${item.price}

                        </span>

                    </div>

                `;

            });

            ordersContainer.innerHTML += `

                <div class="order-card">

                    <h3>

                        Order #${index + 1}

                    </h3>

                    <p>

                        <strong>Date:</strong>

                        ${order.date}

                    </p>

                    ${itemsHTML}

                    <p>

                        <strong>Total:</strong>

                        ₹${order.total}

                    </p>

                </div>

            `;

        });

    }

}

