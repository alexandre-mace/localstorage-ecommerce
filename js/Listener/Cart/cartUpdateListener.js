import {Cart} from "../../Domain/cart";
import {showCart} from "../../Service/showCart";

export default () => {
    window.addEventListener('onCartUpdate', function (event) {
        showCart(Cart.getCart());
    });
}