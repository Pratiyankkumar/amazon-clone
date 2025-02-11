import {cart, addToCart} from '../data/cart.js';
import {products, loadProductsFetch} from '../data/products.js';
import {formatCurrency} from '../scripts/utils/money.js';
updateCartQuantity();

async function renderProducts() {
  await loadProductsFetch();

  document.querySelector('.js-search-button')
    .addEventListener('click', () => {
        // Get the value from the input box dynamically when the button is clicked
        let value = document.querySelector('.js-search-bar').value.toLowerCase();

        // Get the current URL
        let currentUrl = window.location.href;

        // Create a new URL object
        let url = new URL(currentUrl);

        // Set or update the 'search' parameter
        url.searchParams.set('search', value);

        // Update the page URL with the new parameter
        window.location.href = url.toString();
    });

  const url = new URL(window.location.href);
  let search = url.searchParams.get('search');

  let filteredArray = [];

  products.forEach(product => {
    if (search) {
      if (product.keywords.includes(search)) {
        filteredArray.push(product);
      }
    }
  })

  console.log(filteredArray);

  if (search) {
    renderProductsGrid(filteredArray);
  } else {
    renderProductsGrid(products);
  }
}

renderProducts();




function renderProductsGrid(productsArray) {

  let productsHTML = '';

  productsArray.forEach((product) => {
    productsHTML += `
    <div class="product-container">
      <div class="product-image-container">
        <img class="product-image"
          src= "${product.image}">
      </div>

      <div class="product-name limit-text-to-2-lines">
        ${product.name}
      </div>

      <div class="product-rating-container">
        <img class="product-rating-stars"
          src="${product.getStarsUrl()}">
        <div class="product-rating-count link-primary">
          ${product.rating.count}
        </div>
      </div>

      <div class="product-price">
        ${product.getPrice()}
      </div>

      <div class="product-quantity-container">
        <select class="js-quantity-selector-${product.id}">
          <option selected value="1">1</option>
          <option value="2">2</option>
          <option value="3">3</option>
          <option value="4">4</option>
          <option value="5">5</option>
          <option value="6">6</option>
          <option value="7">7</option>
          <option value="8">8</option>
          <option value="9">9</option>
          <option value="10">10</option>
        </select>
      </div>

      ${product.extraInfoHTML()}

      <div class="product-spacer"></div>

      <div class="added-to-cart added-to-cart-${product.id}">
        <img src="images/icons/checkmark.png">
        Added
      </div>

      <button class="add-to-cart-button button-primary js-add-to-cart" data-product-id="${product.id}">
        Add to Cart
      </button>
    </div>`;
  })

  document.querySelector('.js-products-grid')
    .innerHTML = productsHTML;

  function showMessage(productId) {
    document.querySelector(`.added-to-cart-${productId}`).classList.add('clicked')
        
    setTimeout(() => {
      document.querySelector(`.added-to-cart-${productId}`).classList.remove('clicked')
    },2000)
  }

  document.querySelectorAll('.js-add-to-cart')
    .forEach((button) => {
      button.addEventListener('click', () => {

        const productId = button.dataset.productId;

        let selectElementValue = Number(document.querySelector(`.js-quantity-selector-${productId}`).value);

        addToCart(productId,selectElementValue);
        showMessage(productId);
        updateCartQuantity();
      })
    });

}

export function updateCartQuantity() {
  let cartQuantity = 0;

  cart.forEach((cartItem) => {
    cartQuantity+=cartItem.quantity;
  });

  document.querySelector('.js-cart-quantity')
    .innerHTML = cartQuantity;
}
