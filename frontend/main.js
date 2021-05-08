// displays allproduct()
const TEDDIES_API_URL = "http://localhost:3000/api/teddies/";

function displayAllProducts() {
  fetch(TEDDIES_API_URL)
    .then((response) => response.json())
    .then((data) => {
      let output = "";
      data.forEach(function (teddy) {
        output += `<div class="product">
          <a href="product.html?id=${teddy._id}"  id="prod-link">
            <img src="${teddy.imageUrl}" id="product-img" />
            <h4 class="product-name">${teddy.name}</h4>
            <p class="product-description">${teddy.description}</p>
            <p class="product-price">$${(teddy.price / 100).toFixed(2)}</p>
          </a>
        </div>`;
        console.log(teddy);
      });
      document.getElementById("prod-container").innerHTML = output;
    });
}

//display single product

function displayProduct(id) {
  fetch(TEDDIES_API_URL + id)
    .then((response) => response.json())
    .then((teddy) => {
      window.teddy = teddy;
      let output = "";
      let colorOptions = "";
      teddy.colors.forEach(function (color) {
        colorOptions += `<option value="${color}">${color}</option>`;
      });

      output += `<div class="single-product">
        <div class="single-product-img">
          <img src="${teddy.imageUrl}" alt="${teddy.name}" />
        </div>
        <div class="single-product-info">
          <div class="product-name">${teddy.name}</div>
          <div class="product-description">${teddy.description}</div>
          <div class="product-price">$${(teddy.price / 100).toFixed(2)}</div>
          <div class="choose-color">
            <label for="color">Choose color</label>
            <select class="form-select" id="select-color" aria-label="Default select example">
            ${colorOptions}             
            </select>
          </div>
              
        </div>
      </div>`;
      //console.log(teddy);

      document.getElementById("prod-container").innerHTML = output;
    });
}

//addToCart function

function addToCart(teddy) {
  let key = `${teddy._id}_${teddy.selectedColor}`;

  let cartItem = localStorage.getItem(key);
  if (cartItem === null) {
    localStorage.setItem(
      key,
      JSON.stringify({
        img: teddy.imageUrl,
        name: teddy.name,
        description: teddy.description,
        price: (teddy.price / 100).toFixed(2),
        quantity: 1,
        color: teddy.selectedColor,
      })
    );
  } else {
    let cartItem = JSON.parse(localStorage.getItem(key));
    cartItem.quantity = cartItem.quantity + 1;
    console.log(cartItem);
    localStorage.setItem(key, JSON.stringify(cartItem));
  }
  // TODO: display message to inform user
  //teddy.selectedColor
  //teddy._id ni cart local storaged uussen esehiig shalgaad hooson bwal uusgeed, ugui bol toog negeer nemne.
}
function calcTotalPrice() {
  let totalPrice = 0;
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    let cartItem = JSON.parse(localStorage.getItem(key));
    totalPrice += cartItem.price * cartItem.quantity;
  }
  return totalPrice;
}
//displayCartItems function

function displayCartItems() {
  let output = "";
  if (localStorage.length > 0) {
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      let cartItem = JSON.parse(localStorage.getItem(key));

      output += `<div class="shopping-cart">
      <div class="product">
        <img
          class="cart-product-img"
          src="${cartItem.img}"
          alt="${cartItem.name}"
          width = 150px;
          height = auto;
        />
        <label class="cart-product">${cartItem.name}</label>
      </div>
      <div class="product-color">${cartItem.color}</div>
      <div class="quantity">
        <input type="number" name="${key}" value="${
        cartItem.quantity
      }" min="1" />
      </div>
      <div class="total-price">${cartItem.price * cartItem.quantity}</div>
      <i class="fas fa-trash-alt delete-item" value="${key}"></i>
      
    </div>  
  `;
    }
  } else {
    output = "There is no item in the cart.";
  }
  document.getElementById("total-price").innerHTML =
    "TOTAL PRICE: $" + calcTotalPrice();
  document.getElementById("cart-container").innerHTML = output;

  let deleteItemsFromCart = document.getElementsByClassName("delete-item");
  for (let i = 0; i < deleteItemsFromCart.length; i++) {
    let deleteButton = deleteItemsFromCart[i];

    deleteButton.addEventListener("click", function (e) {
      deleteItem(deleteButton.getAttribute("value"));
    });
  }
}

function submitForm(e) {
  e.preventDefault();

  let firstName = document.getElementById("first-name").value;
  let lastName = document.getElementById("last-name").value;
  let email = document.getElementById("email").value;
  let city = document.getElementById("city").value;
  let address = document.getElementById("address").value;

  let products = [];
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    let productId = key.split("_")[0];
    products.push(productId);
  }

  fetch("http://localhost:3000/api/teddies/order", {
    method: "POST",
    headers: {
      Accept: "application/json, text/plain, */*",
      "Content-type": "application/json",
    },
    body: JSON.stringify({
      contact: {
        firstName: firstName,
        lastName: lastName,
        email: email,
        city: city,
        address: address,
      },
      products: products,
    }),
  })
    .then((response) => {
      return response.json();
    })
    .then((data) => {
      console.log(data);
      sessionStorage.setItem("orderId", data.orderId);
      sessionStorage.setItem("totalPrice", calcTotalPrice());
      window.location.href = "confirmation.html";
      localStorage.clear();
    });
}

// confirmation.html function

function displayConfirmationOrder() {
  document.getElementById("total-price").innerHTML =
    "Total price: $" + sessionStorage.getItem("totalPrice");
  document.getElementById("order-id").innerHTML =
    "Your order ID: " + sessionStorage.getItem("orderId");
}

//update cart function
function updateCartItems() {
  const cartForm = document.getElementById("cart-items");
  for (let i = 0; i < cartForm.elements.length; i++) {
    const element = cartForm.elements[i];

    const key = element.name;
    const qty = element.value;

    // get cart item by key
    const item = localStorage.getItem(key);
    const itemObj = JSON.parse(item);
    itemObj.quantity = qty;

    // save update cart item
    localStorage.setItem(key, JSON.stringify(itemObj));
    displayCartItems();

    informMessage();
  }
}
//delete function
function deleteItem(key) {
  console.log("Deleting..." + key);
  localStorage.removeItem(key);
  displayCartItems();
  informMessage();
}

// display message to inform user

function informMessage() {
  var toastElList = [].slice.call(document.querySelectorAll(".toast"));
  var toastList = toastElList.map(function (toastEl) {
    return new bootstrap.Toast(toastEl).show(); // No need for options; use the default options
  });
}
