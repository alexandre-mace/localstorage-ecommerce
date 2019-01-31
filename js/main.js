import { Cart } from "./Domain/cart";
import { showCart } from "./Service/showCart";
import cartClearListener from "./Listener/Cart/cartClearListener";
import cartCloseListener from "./Listener/Cart/cartCloseListener";
import cartOpenListener from "./Listener/Cart/cartOpenListener";
import cartUpdateListener from "./Listener/Cart/cartUpdateListener";
import cartItemRemoveListener from "./Listener/CartItem/cartItemRemoveListener";
import cartItemQuantityListener from "./Listener/CartItem/cartItemQuantityListener";
import cartItemUpdateListener from "./Listener/CartItem/cartItemUpdateListener";
import carItemAddListener from "./Listener/CartItem/carItemAddListener";
import cartSendListener from "./Listener/Cart/cartSendListener";


cartItemQuantityListener();
carItemAddListener();
cartItemRemoveListener();
cartItemUpdateListener()
cartUpdateListener();
cartOpenListener();
cartClearListener();
cartCloseListener();
cartSendListener();

showCart(Cart.getCart());


