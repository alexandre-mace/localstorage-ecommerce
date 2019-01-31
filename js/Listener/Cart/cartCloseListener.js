export default () => {
    document.getElementById("cart-close").addEventListener("click", function () {
        document.getElementById("cart-wrapper").style.visibility = "hidden";
        document.getElementById("cart-wrapper").classList.remove("active");
        document.querySelector("body").classList.remove("overflow-hidden");
    });
}