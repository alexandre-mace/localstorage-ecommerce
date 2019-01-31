function animateCartItemNumbers(items) {
    const cartItemsNumber = document.getElementById("cartItemsNumber");
    cartItemsNumber.textContent = items;
    if (typeof time !== 'undefined') {
        clearTimeout(time);
    }
    if(cartItemsNumber.classList.contains('update')){
        cartItemsNumber.classList.remove('update');
        cartItemsNumber.classList.add('updateQuantity');
        let time = setTimeout(function(){
            cartItemsNumber.classList.remove('updateQuantity');
            cartItemsNumber.classList.add('update');
        }, 700);
    } else {
        cartItemsNumber.classList.add('update');
    }
}
export {animateCartItemNumbers};