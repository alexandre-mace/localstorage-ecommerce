// Variables initalization
const addToCart = document.getElementsByClassName('cartItem-add');
const cartQuantityInputs = document.getElementsByClassName("cartItem-quantity");
const cartItemRemove = document.getElementsByClassName("cartItem-remove");
const cartClear = document.getElementById("cart-clear");
const cartItemsNumber = document.getElementById("cartItemsNumber");
// Get cart
showCart(Cart.getCart());


