export default () => {
    document.getElementById("cart-send").addEventListener("click", function () {
        return sendJsonCart();
    });
}