import {cartUpdateEvent} from "../../Event/Cart/cartUpdateEvent";
import {Cart} from "../../Domain/cart";

export default () => {
    const cartItemRemove = document.getElementsByClassName("cartItem-remove");
    Array.from(cartItemRemove).forEach(function (cartItemRemove) {
        cartItemRemove.addEventListener("click", function () {
            Cart.removeOne(this.dataset.id);
            window.dispatchEvent(cartUpdateEvent);
        })
    });
}