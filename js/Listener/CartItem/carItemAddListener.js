import {cartUpdateEvent} from "../../Event/Cart/cartUpdateEvent";
import {addToCartFromForm} from "../../Service/addToCartFromForm";

export default () => {
    const addToCart = document.getElementsByClassName('cartItem-add');
    Array.from(addToCart).forEach(function (addToCart) {
        addToCart.addEventListener("submit", function (event) {
            event.preventDefault();
            addToCartFromForm(new FormData(addToCart));
            this.getElementsByClassName("submit-icon")[0].classList.add("icon-added");
            const thisFromSubmitContext = this;
            setTimeout(function () {
                thisFromSubmitContext.getElementsByClassName("submit-icon")[0].classList.remove("icon-added");
            }, 1000);
            window.dispatchEvent(cartUpdateEvent);
        });
    });
}