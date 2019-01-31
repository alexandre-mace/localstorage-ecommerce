//EVENTS
const cartUpdateEvent = new CustomEvent('onCartUpdate');

// DOM EVENT
const cartList = document.getElementById('cart-wrapper');
let config = {
    attributes: true,
    childList: true,
    subtree: true,
    characterData: true
};
// Fonction callback à éxécuter quand une mutation est observée
const callback = function(mutationsList) {
    for(let mutation of mutationsList) {
        if (mutation.type == 'childList') {
            if (typeof mutation.addedNodes[0].children !== 'undefined') {
                Array.from(mutation.addedNodes[0].children).forEach(function (cartItem) {
                    cartItem.children.item(0).getElementsByClassName("cartItem-remove").item(0).addEventListener("click", function () {
                        Cart.removeOne(this.dataset.id);
                        window.dispatchEvent(cartUpdateEvent);
                    });
                    cartItem.children.item(0).getElementsByClassName("cartItem-quantity").item(0).addEventListener("change", function () {
                        Cart.updateOneQuantity(this.dataset.id, this.value);
                        window.dispatchEvent(cartUpdateEvent);
                    });
                });
            }
        }
    }
};
let observer = new MutationObserver(callback);
