import {cartItemUpdateEvent, cartItemUpdateEventConfig, cartList} from "../../Event/CartItem/cartItemUpdateEvent";

export default () => {
    cartItemUpdateEvent.observe(cartList, cartItemUpdateEventConfig);
}