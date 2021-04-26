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

// fetch data from API

fetch("http://localhost:3000/api/teddies")
  .then((response) => response.json())
  .then((data) => {
    for (let i = 0; i < data.length; i++) {
      const teddy = data[i];
      console.log(teddy);

      let teddiesContainer = document.getElementById("prod-container");

      // create html element for current teddy and add it to div.product-container
      let divTeddy = document.createElement("div");
      divTeddy.className = "product";
      let teddyLink = document.createElement("a");
      let teddyName = document.createElement("div");
      teddyName.textContent = teddy.name;

      divTeddy.appendChild(teddyLink);
      divTeddy.appendChild(teddyName);

      teddiesContainer.appendChild(divTeddy);
    }
  });

//displayAllProducts() in index.html

// const api_url = "http://localhost:3000/api/teddies";
// async function getTeddies() {
//   const response = await fetch(api_url);
//   const data = await response.json();
//   const { name, description, price } = data;

//   document.getElementsByClassName("product-name").textContent = name;
//   document.getElementsByClassName(
//     "product-description"
//   ).textContent = description;
//   document.getElementsByClassName("product-price").textContent = price;
// }
// getTeddies();

//showing imgages
// console.log("fetch a image");
// fetch("teddy_1.jpg")
//   .then((response) => {
//     console.log(response);
//     return response.blob();
//   })
//   .then((blob) => {
//     console.log(blob);
//     document.getElementsByClassName("product-img").src = URL.createObjectURL(
//       blob
//     );
//   });

//showing images in another way
// console.log("fatching an image");
// catchImage();
// async function catchImage() {
//   const response = await fetch("teddy_1.jpg");
//   const blob = await response.blob();
//   document.getElementById("product-img").src = URL.createObjectURL(blob);
// }
