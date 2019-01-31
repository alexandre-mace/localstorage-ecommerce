import {cartUpdateEvent} from "../../Event/Cart/cartUpdateEvent";

export default () => {
    const cartItemQuantityInputs = document.getElementsByClassName("cartItem-quantity");
    Array.from(cartItemQuantityInputs).forEach(function (cartQuantityInput) {
        cartQuantityInput.addEventListener("change", function () {
            Cart.updateOneQuantity(this.dataset.id, this.value);
            window.dispatchEvent(cartUpdateEvent);
        })
    });
}