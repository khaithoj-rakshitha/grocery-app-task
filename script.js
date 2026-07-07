
// PRODUCT DATA

const products = [
    {
        id: 1,
        name: "Apple",
        category: "Fruits & Vegetables",
        weight: "1 Kg",
        price: 120,
        image: "images/apple.jpg",
        quantity: 0
    },
    {
        id: 2,
        name: "Banana",
        category: "Fruits & Vegetables",
        weight: "1 Dozen",
        price: 60,
        image: "images/banana.jpg",
        quantity: 0
    },
    {
        id: 3,
        name: "Tomato",
        category: "Fruits & Vegetables",
        weight: "1 Kg",
        price: 40,
        image: "images/tomato.jpg",
        quantity: 0
    },
    {
        id: 4,
        name: "Milk",
        category: "Dairy & Eggs",
        weight: "1 Litre",
        price: 58,
        image: "images/milk.png",
        quantity: 0
    },
    {
        id: 5,
        name: "Eggs",
        category: "Dairy & Eggs",
        weight: "6 Pieces",
        price: 48,
        image: "images/eggs.jpg",
        quantity: 0
    },
    {
        id: 6,
        name: "Cheese",
        category: "Dairy & Eggs",
        weight: "200 g",
        price: 180,
        image: "images/cheese.jpg",
        quantity: 0
    },
    {
        id: 7,
        name: "Potato Chips",
        category: "Snacks",
        weight: "100 g",
        price: 35,
        image: "images/chips.jpg",
        quantity: 0
    },
    {
        id: 8,
        name: "Biscuits",
        category: "Snacks",
        weight: "250 g",
        price: 40,
        image: "images/biscuits.jpg",
        quantity: 0
    },
    {
        id: 9,
        name: "Orange Juice",
        category: "Beverages",
        weight: "1 Litre",
        price: 120,
        image: "images/juice.jpg",
        quantity: 0
    },
    {
        id: 10,
        name: "Soft Drink",
        category: "Beverages",
        weight: "750 ml",
        price: 90,
        image: "images/softdrinks.jpg",
        quantity: 0
    },
    {
        id: 11,
        name: "Bread",
        category: "Bakery",
        weight: "400 g",
        price: 45,
        image: "images/bread.jpg",
        quantity: 0
    },
    {
        id: 12,
        name: "Shampoo",
        category: "Personal Care",
        weight: "340 ml",
        price: 220,
        image: "images/shampoo.jpg",
        quantity: 0
    }
];


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
            product.name.toLowerCase().includes(searchText.toLowerCase());

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

                <h3>${product.name}</h3>

                <p class="weight">${product.weight}</p>

                <div class="price-row">

                    <span class="price">₹${product.price}</span>

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

// Initial Load

displayProducts();

// ==========================
// CART ELEMENTS
// ==========================

const cartCount = document.getElementById("cartCount");
const totalItems = document.getElementById("totalItems");
const totalPrice = document.getElementById("totalPrice");
const cartSummary = document.getElementById("cartSummary");
const checkoutBtn = document.getElementById("checkoutBtn");

// ==========================
// ADD TO CART
// ==========================

function addToCart(id){

    const product = products.find(item => item.id === id);

    product.quantity = 1;

    updateCart();

}

// ==========================
// INCREASE QUANTITY
// ==========================

function increaseQuantity(id){

    const product = products.find(item => item.id === id);

    product.quantity++;

    updateCart();

}

// ==========================
// DECREASE QUANTITY
// ==========================

function decreaseQuantity(id){

    const product = products.find(item => item.id === id);

    if(product.quantity > 0){

        product.quantity--;

    }

    updateCart();

}

// ==========================
// UPDATE CART
// ==========================

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

// ==========================
// CHECKOUT
// ==========================

checkoutBtn.addEventListener("click",function(){

    if(Number(totalItems.textContent)===0){

        alert("Your cart is empty!");

        return;

    }

    alert("Order Placed Successfully!");

    products.forEach(product=>{

        product.quantity=0;

    });

    updateCart();

});

// ==========================
// INITIAL UPDATE
// ==========================

updateCart();