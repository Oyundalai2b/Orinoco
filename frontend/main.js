(function () {
  "use strict";

  // Fetch all the forms we want to apply custom Bootstrap validation styles to
  var forms = document.querySelectorAll(".needs-validation");

  // Loop over them and prevent submission
  Array.prototype.slice.call(forms).forEach(function (form) {
    form.addEventListener(
      "submit",
      function (event) {
        if (!form.checkValidity()) {
          event.preventDefault();
          event.stopPropagation();
        }

        form.classList.add("was-validated");
      },
      false
    );
  });
})();

//pseuso code displays allproduct()
const TEDDIES_API_URL = "http://localhost:3000/api/teddies/";

function displayAllProducts() {
  fetch(TEDDIES_API_URL)
    .then((response) => response.json())
    .then((data) => {
      let output = "";
      data.forEach(function (teddy) {
        output += `<div class="product">
          <a href="product.html?id=${teddy._id}" target="_blank" id="prod-link">
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
  //teddy.selectedColor
  //teddy._id ni cart local storaged uussen esehiig shalgaad hooson bwal uusgeed, ugui bol toog negeer nemne.
}

//displayCartItems function

function displayCartItems() {
  let output = "";
  let totalPrice = 0;
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    localStorage.getItem(key);
    let cartItem = JSON.parse(localStorage.getItem(key));
    console.log(key);
    console.log(cartItem);
    totalPrice += cartItem.price * cartItem.quantity;
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
        <input type="number" value="${cartItem.quantity}" min="1" />
      </div>
      <div class="total-price">${cartItem.price * cartItem.quantity}</div>
      <div class="delete">delete</div>
      
    </div>  
  `;
  }
  document.getElementById("total-price").innerHTML =
    "TOTAL PRICE: $" + totalPrice;
  document.getElementById("cart-container").innerHTML = output;
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
      response.json();
    })
    .then((data) => {
      console.log(data);
      //TODO: sessionStorage ruu orderId, totalPrice iig hadgalaad cart aa hooslood confirmation.html ruu redirect hiih
    });
}
document.getElementById("submit-form").addEventListener("submit", submitForm);
