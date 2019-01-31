// OBJECTS
const Cart = {
    name: 'cart',
    getCart() {
        if (!localStorage.getItem(this.name)) {
            this.setCart({});
        }
        return JSON.parse(localStorage.getItem(this.name));
    },
    getCartItemNumbers() {
        const cartPriceArray = [];
        const itemsArray = [];
        Object.entries(this.getCart()).forEach(function(cartItem) {
            itemsArray.push(Number(cartItem[1]['quantity']));
        });
        return itemsArray.reduce(add, 0);

    },
    getCartPrice() {
        const cartPriceArray = [];
        const itemsArray = [];
        Object.entries(this.getCart()).forEach(function(cartItem) {
            let itemPrice = cartItem[1]['price'] * cartItem[1]['quantity'];
            cartPriceArray.push(Number(itemPrice));
        });
        return cartPriceArray.reduce(add, 0);
    },
    setCart(cart) {
        localStorage.setItem(this.name, JSON.stringify(cart));
    },
    removeCart() {
        localStorage.removeItem(this.name);
    },
    addOne(cartItem) {
        const cart = this.getCart();
        cartItem['id'] = 'product-' + slugify(cartItem.name, '') + '-' + slugify(cartItem.color, '');
        if(cart.hasOwnProperty(cartItem['id'])){
            cart[cartItem['id']]['quantity'] = Number(cart[cartItem['id']]['quantity']);
            cart[cartItem['id']]['quantity'] += Number(cartItem.quantity);
        } else {
            cart[cartItem['id']] = cartItem;
        }
        this.setCart(cart);
    },
    removeOne(id) {
        const cart = this.getCart();
        if(cart.hasOwnProperty(id)){
            delete cart[id];
        }
        this.setCart(cart);
    },
    updateOneQuantity(id, quantity) {
        const cart = this.getCart();
        if(cart.hasOwnProperty(id)){
            cart[id]['quantity'] = Number(quantity);
        }
        this.setCart(cart);
    }
};