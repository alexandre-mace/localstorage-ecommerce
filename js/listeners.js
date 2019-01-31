// LISTENERS
window.addEventListener('onCartUpdate', function (event) {
    showCart(Cart.getCart());
});

observer.observe(cartList, config);

document.getElementById("cart-logo").addEventListener("click", function () {
    document.getElementById("cart-wrapper").style.visibility = "visible";
    document.getElementById("cart-wrapper").classList.add("active");
    document.querySelector("body").classList.add("overflow-hidden");
});

document.getElementById("cart-close").addEventListener("click", function () {
    document.getElementById("cart-wrapper").style.visibility = "hidden";
    document.getElementById("cart-wrapper").classList.remove("active");
    document.querySelector("body").classList.remove("overflow-hidden");
});

Array.from(cartQuantityInputs).forEach(function (cartQuantityInput) {
    cartQuantityInput.addEventListener("change", function () {
        Cart.updateOneQuantity(this.dataset.id, this.value);
        window.dispatchEvent(cartUpdateEvent);
    })
});

Array.from(cartItemRemove).forEach(function (cartItemRemove) {
    cartItemRemove.addEventListener("click", function () {
        Cart.removeOne(this.dataset.id);
        window.dispatchEvent(cartUpdateEvent);
    })
});

cartClear.addEventListener("click", function () {
    Cart.removeCart();
    window.dispatchEvent(cartUpdateEvent);
});

Array.from(addToCart).forEach(function (addToCart) {
    addToCart.addEventListener("submit", function (event){
        event.preventDefault();
        addToCartFromForm(new FormData(addToCart));
        this.getElementsByClassName("submit-icon")[0].classList.add("icon-added");
        const thisFromSubmitContext = this;
        setTimeout(function(){
            thisFromSubmitContext.getElementsByClassName("submit-icon")[0].classList.remove("icon-added");
        }, 1000);
        window.dispatchEvent(cartUpdateEvent);
    });
});

document.getElementById("cart-send").addEventListener("click", function () {
    return sendCart();
});