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
            <img src="" id="product-img" />
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
      let output = "";

      let colorOptions = "";
      teddy.colors.forEach(function (color) {
        colorOptions += `<option value="${color}">${color}</option>`;
      });

      output += `<div class="single-product">
        <div class="single-product-img">
          <img src="" alt="${teddy.name}" />
        </div>
        <div class="single-product-info">
          <div class="product-name">${teddy.name}</div>
          <div class="product-description">${teddy.description}</div>
          <div class="product-price">$${(teddy.price / 100).toFixed(2)}</div>
          <div class="choose-color">
            <label for="color">Choose color</label>
            <select class="form-select" aria-label="Default select example">
            ${colorOptions}             
            </select>
          </div>
          <a href="cart.html" target="_blank">
            <button class="add-to-cart" type="button">ADD TO CART</button>
          </a>
        </div>
      </div>`;
      console.log(teddy);

      document.getElementById("prod-container").innerHTML = output;
    });
}
