import {sendJsonCart} from "../../Service/sendJsonCart";

export default () => {
    document.getElementById("cart-send").addEventListener("click", function () {
        return sendJsonCart();
    });
}