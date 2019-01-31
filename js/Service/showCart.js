
import {generateNewCart} from "./generateNewCart";

function showCart(cart) {
    const newCart = generateNewCart(cart);
    const currentCart = document.getElementById("cart-list");
    document.getElementById("cart-wrapper").replaceChild(newCart, currentCart);
}
export { showCart };