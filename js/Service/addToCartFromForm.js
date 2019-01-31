import {Cart} from "../Domain/cart";

function addToCartFromForm(form) {
    let cartItem = {};
    for(let input of form.entries()) {
        cartItem[input[0].replace('"', '')] = input[1];
    }
    Cart.addOne(cartItem);
}
export {addToCartFromForm};