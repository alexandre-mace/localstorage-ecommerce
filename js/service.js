// SERVICES
function storageAvailable(type) {
    try {
        var storage = window[type],
            x = '__storage_test__';
        storage.setItem(x, x);
        storage.removeItem(x);
        return true;
    }
    catch(e) {
        return e instanceof DOMException && (
                // everything except Firefox
            e.code === 22 ||
            // Firefox
            e.code === 1014 ||
            // test name field too, because code might not be present
            // everything except Firefox
            e.name === 'QuotaExceededError' ||
            // Firefox
            e.name === 'NS_ERROR_DOM_QUOTA_REACHED') &&
            // acknowledge QuotaExceededError only if there's something already stored
            storage.length !== 0;
    }
}
if (storageAvailable('localStorage')) {
    // Yippee! We can use localStorage awesomeness
}
else {
    console.log("LocalStorage's usage is impossible.")
}
// FACON
function f(strings, ...args) {
    let result = ``;
    for(let i = 0; i < args.length; i++) result += strings[i] + args[i]
    result += strings[strings.length - 1]

    const template = document.createElement(`template`);
    template.innerHTML = result;

    const content = template.content;

    content.collect = ({attr = 'ref', keepAttribute, to = {}} = {}) => {
        const refElements = content.querySelectorAll(`[${attr}]`);
        return [...refElements].reduce((acc, element) => {
            const propName = element.getAttribute(attr).trim();
            !keepAttribute && (element.removeAttribute(attr));
            acc[propName] = acc[propName]
                ? Array.isArray(acc[propName])
                    ? [...acc[propName], element]
                    : [acc[propName], element]
                : element;
            return acc;
        }, to);
    };
    return content;
}
function slugify(text, separator){
    return text.toString().toLowerCase()
        .replace(/\s+/g, separator)           // Replace spaces with -
        .replace(/[^a-z0-9]/gi, '')       // Remove all non-word chars
        .replace(/\-\-+/g, separator)         // Replace multiple - with single -
        .replace(/^-+/, '')             // Trim - from start of text
        .replace(/-+$/, '');            // Trim - from end of text
}
function add(a, b) {
    return a + b;
}
function addToCartFromForm(form) {
    let cartItem = {};
    for(let input of form.entries()) {
        cartItem[input[0].replace('"', '')] = input[1];
    }
    Cart.addOne(cartItem);
}
function animateCartItemNumbers(items) {
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
function generateNewCart(cart) {
    let newCart = document.createElement("ul");
    newCart.setAttribute('id', 'cart-list');
    const cartPriceArray = [];
    const itemsArray = [];
    Object.entries(cart).forEach(function(cartItem) {
        let itemPrice = cartItem[1]['price'] * cartItem[1]['quantity'];
        cartPriceArray.push(Number(itemPrice));
        itemsArray.push(Number(cartItem[1]['quantity']));
        const node = getCartItem(cartItem, itemPrice);
        newCart.appendChild(node);
    });
    const cartPrice = cartPriceArray.reduce(add, 0);
    document.getElementById("cart-price").textContent = cartPrice + '€';
    const items = itemsArray.reduce(add, 0);
    animateCartItemNumbers(items);
    return newCart;
}
function sendCart() {
    console.log(JSON.stringify({ cartItems: Cart.getCart(), cartPrice: Cart.getCartPrice() }));
    return JSON.stringify({ cartItems: Cart.getCart(), cartPrice: Cart.getCartPrice() });
}