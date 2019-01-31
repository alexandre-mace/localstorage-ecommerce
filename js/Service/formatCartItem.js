import {f} from "./facon";

function formatCartItem(cartItem, itemPrice) {
    return f`
            <li ref="items">
                <span class="d-flex">
                    <section>
                        <img src="${cartItem[1]['image']}" alt="Image d'un meme">                 
                    </section>
                    <section class="d-flex flex-column">
                        <span class="cartItem-price">${itemPrice}  €</span>
                        <span>${cartItem[1]['name']}</span>
                        <span>${cartItem[1]['color']}</span>
                        <form action="">
                        <input data-id="${cartItem[1]['id']}" class="cartItem-quantity" name="quantity" type="number" min="0" step="1" value=${cartItem[1]['quantity']}>
                        </form>
                        <span data-id="${cartItem[1]['id']}" class="cartItem-remove"><i class="far fa-trash-alt fa-2x"></i></span>
                    </section>
                </span>
            </li>
        `;
}
export {formatCartItem};