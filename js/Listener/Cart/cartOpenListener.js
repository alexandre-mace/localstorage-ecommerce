export default () => {
    document.getElementById("cart-logo").addEventListener("click", function () {
        document.getElementById("cart-wrapper").style.visibility = "visible";
        document.getElementById("cart-wrapper").classList.add("active");
        document.querySelector("body").classList.add("overflow-hidden");
    });
}