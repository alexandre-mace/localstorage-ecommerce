import {Cart} from "../Domain/cart";

function sendJsonCart() {
    console.log(JSON.stringify({ cartItems: Cart.getCart(), cartPrice: Cart.getCartPrice() }));
    return JSON.stringify({ cartItems: Cart.getCart(), cartPrice: Cart.getCartPrice() });
}
export {sendJsonCart};