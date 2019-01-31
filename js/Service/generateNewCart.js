import {formatCartItem} from "./formatCartItem";
import {animateCartItemNumbers} from "./animateCartItemNumbers";
import {add} from "./add";

function generateNewCart(cart) {
    let newCart = document.createElement("ul");
    newCart.setAttribute('id', 'cart-list');
    const cartPriceArray = [];
    const itemsArray = [];
    Object.entries(cart).forEach(function(cartItem) {
        let itemPrice = cartItem[1]['price'] * cartItem[1]['quantity'];
        cartPriceArray.push(Number(itemPrice));
        itemsArray.push(Number(cartItem[1]['quantity']));
        const node = formatCartItem(cartItem, itemPrice);
        newCart.appendChild(node);
    });
    const cartPrice = cartPriceArray.reduce(add, 0);
    document.getElementById("cart-price").textContent = cartPrice + '€';
    const items = itemsArray.reduce(add, 0);
    animateCartItemNumbers(items);
    return newCart;
}
export { generateNewCart };