import { cartUpdateEvent } from "../../Event/Cart/cartUpdateEvent";
import {Cart} from "../../Domain/cart";

export default () => {
    const cartClear = document.getElementById("cart-clear");
    cartClear.addEventListener("click", function () {
        Cart.removeCart();
        window.dispatchEvent(cartUpdateEvent);
    });
}
