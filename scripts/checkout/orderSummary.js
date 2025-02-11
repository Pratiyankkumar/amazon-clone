import {cart, removeFromCart,updateQuantity, updateDeliveryOption} from '../../data/cart.js';
import{products, getProduct} from '../../data/products.js';
import {formatCurrency} from '../utils/money.js';
import {deliveryOptions, getDeliveryOption} from '../../data/deliveryOptions.js';
import {renderPaymentSummary} from './paymentSummary.js';
import { calculateDeliveryDate } from '../../data/deliveryOptions.js';


export function renderOrderSummary() {
  let cartSummaryHTML = '';
  cart.forEach((cartItem) => {

    const productId = cartItem.productId;
    const matchingProduct = getProduct(productId);

    const deliveryOptionId = cartItem.deliveryOptionId;
    const deliveryOption = getDeliveryOption(deliveryOptionId);

    let dateString = calculateDeliveryDate(deliveryOption);

    cartSummaryHTML += `
      <div class="cart-item-container js-cart-item-container-${matchingProduct.id} js-cart-item-container">
                <div class="delivery-date">
                  Delivery date: ${dateString}
                </div>

                <div class="cart-item-details-grid">
                  <img class="product-image"
                    src="${matchingProduct.image}">

                  <div class="cart-item-details">
                    <div class="product-name js-product-name-${matchingProduct.id}">
                      ${matchingProduct.name}
                    </div>
                    <div class="product-price js-product-price-${matchingProduct.id}">
                      ${matchingProduct.getPrice()}
                    </div>
                    <div class="product-quantity js-product-quantity-${matchingProduct.id}">
                      <span class="js-quantity2">
                        Quantity: <span class="quantity-label current-quantity2-${matchingProduct.id} current-quantity">${cartItem.quantity}</span>
                      </span>
                      <span class="update-quantity-link link-primary js-update-link js-update-link2-${matchingProduct.id}" data-product-id = "${matchingProduct.id}">
                        Update
                      </span>
                        <input class="quantity-input visible js-quantity js-update-${matchingProduct.id} js-input-${matchingProduct.id}" data-product-id = "${matchingProduct.id}">
                        <span class="save-quantity-link link-primary visible js-update js-update-${matchingProduct.id}" data-product-id = "${matchingProduct.id}">Save</span>
                        
                      <span class="delete-quantity-link link-primary js-delete-link js-delete-link-${matchingProduct.id}" data-product-id = "${matchingProduct.id}">
                        Delete
                      </span>
                    </div>
                  </div>

                  <div class="delivery-options">
                    <div class="delivery-options-title">
                      Choose a delivery option:
                    </div>
                    ${deliveryOptionsHTML(matchingProduct, cartItem)}
                  </div>
                </div>
              </div>
    `;
    
  })

  function deliveryOptionsHTML(matchingProduct, cartItem) {
    let html = '';
    deliveryOptions.forEach((deliveryOption) => {
      
      const dateString = calculateDeliveryDate(deliveryOption);
      const priceString = deliveryOption.priceCents === 0
        ? 'FREE'
        : `$${formatCurrency(deliveryOption.priceCents)} -`;

      const isChecked = deliveryOption.id  === cartItem.deliveryOptionId
    html += `
        <div class="delivery-option js-delivery-option js-delivery-option-${matchingProduct.id}-${deliveryOption.id}"
        data-product-id="${matchingProduct.id}"
        data-delivery-option-id="${deliveryOption.id}">
          <input type="radio"
          ${isChecked ? 'checked' : ''}
          class="delivery-option-input js-delivery-option-input-${matchingProduct.id}-${deliveryOption.id}"
            name="delivery-option-${matchingProduct.id}">
          <div>
            <div class="delivery-option-date">
              ${dateString}
            </div>
            <div class="delivery-option-price">
              ${priceString}  Shipping
            </div>
          </div>
        </div>
      `
    })
    return html;
  }

  document.querySelector('.js-order-summary')
    .innerHTML = cartSummaryHTML;

  document.querySelectorAll('.js-delete-link')
    .forEach((link) => {
      link.addEventListener('click', () => {
        const productId = link.dataset.productId;
        removeFromCart(productId);

        const container = document.querySelector(`.js-cart-item-container-${productId}`);
        container.remove()
        renderPaymentSummary();
        updateCartQuantity();
      });
    })

  document.querySelectorAll('.js-delivery-option')
  .forEach((element) => {
    element.addEventListener('click', () => {
      const {productId, deliveryOptionId} = element.dataset;
      console.log(productId)
      console.log(deliveryOptionId);
      updateDeliveryOption(productId, deliveryOptionId);
      renderOrderSummary();
      renderPaymentSummary();
    })
  })

  document.querySelectorAll('.js-update-link').forEach((update) => {
    update.addEventListener('click', () => {
      const productId = update.dataset.productId;
      console.log(productId);

      document.querySelectorAll(`.js-update-${productId}`).forEach((button) => {
        button.classList.remove('visible')
      })

      document.querySelectorAll(`.js-update-link2-${productId}`)
        .forEach((button) => {
          button.classList.add('visible')
        })
      document.querySelectorAll(`.current-quantity2-${productId}`)
        .forEach((button) => {
          button.classList.add('visible')
        })

      

      

    })
  });


  document.querySelectorAll('.js-update')
    .forEach((button) => {

      button.addEventListener('click', () => {
        const productId = button.dataset.productId;
        console.log(productId);

        const newQuantity = Number(document.querySelector(`.js-input-${productId}`).value);

        updateQuantity(productId, newQuantity)
        

        document.querySelectorAll(`.js-update-link2-${productId}`)
        .forEach((button) => {
          button.classList.remove('visible')
        })
      document.querySelectorAll(`.current-quantity2-${productId}`)
        .forEach((button) => {
          button.classList.remove('visible')
          button.innerHTML = newQuantity;
          renderPaymentSummary();
        })

        document.querySelectorAll(`.js-update-${productId}`).forEach((button) => {
          button.classList.add('visible')
        })
      })
    })
}

export function updateCartQuantity() {
  let cartQuantity = 0;

  cart.forEach((cartItem) => {
    cartQuantity+=cartItem.quantity;
  });

  renderOrderSummary();


  document.querySelector('.itemcount').innerHTML = `
    Checkout (<a class="return-to-home-link"
    href="amazon.html">${cartQuantity} items</a>)
  `
}
  



