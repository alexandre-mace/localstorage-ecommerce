(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Cart = void 0;

var _slugify = require("./../Service/slugify");

// OBJECTS
var Cart = {
  name: 'cart',
  getCart: function getCart() {
    if (!localStorage.getItem(this.name)) {
      this.setCart({});
    }

    return JSON.parse(localStorage.getItem(this.name));
  },
  getCartItemNumbers: function getCartItemNumbers() {
    var cartPriceArray = [];
    var itemsArray = [];
    Object.entries(this.getCart()).forEach(function (cartItem) {
      itemsArray.push(Number(cartItem[1]['quantity']));
    });
    return itemsArray.reduce(add, 0);
  },
  getCartPrice: function getCartPrice() {
    var cartPriceArray = [];
    var itemsArray = [];
    Object.entries(this.getCart()).forEach(function (cartItem) {
      var itemPrice = cartItem[1]['price'] * cartItem[1]['quantity'];
      cartPriceArray.push(Number(itemPrice));
    });
    return cartPriceArray.reduce(add, 0);
  },
  setCart: function setCart(cart) {
    localStorage.setItem(this.name, JSON.stringify(cart));
  },
  removeCart: function removeCart() {
    localStorage.removeItem(this.name);
  },
  addOne: function addOne(cartItem) {
    var cart = this.getCart();
    cartItem['id'] = 'product-' + (0, _slugify.slugify)(cartItem.name, '') + '-' + (0, _slugify.slugify)(cartItem.color, '');

    if (cart.hasOwnProperty(cartItem['id'])) {
      cart[cartItem['id']]['quantity'] = Number(cart[cartItem['id']]['quantity']);
      cart[cartItem['id']]['quantity'] += Number(cartItem.quantity);
    } else {
      cart[cartItem['id']] = cartItem;
    }

    this.setCart(cart);
  },
  removeOne: function removeOne(id) {
    var cart = this.getCart();

    if (cart.hasOwnProperty(id)) {
      delete cart[id];
    }

    this.setCart(cart);
  },
  updateOneQuantity: function updateOneQuantity(id, quantity) {
    var cart = this.getCart();

    if (cart.hasOwnProperty(id)) {
      cart[id]['quantity'] = Number(quantity);
    }

    this.setCart(cart);
  }
};
exports.Cart = Cart;

},{"./../Service/slugify":19}],2:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.cartUpdateEvent = void 0;
var cartUpdateEvent = new CustomEvent('onCartUpdate');
exports.cartUpdateEvent = cartUpdateEvent;

},{}],3:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.cartItemUpdateEventConfig = exports.cartItemUpdateEvent = exports.cartList = void 0;

var _cart = require("../../Domain/cart");

var _cartUpdateEvent = require("../Cart/cartUpdateEvent");

var cartList = document.getElementById('cart-wrapper');
exports.cartList = cartList;
var cartItemUpdateEventConfig = {
  attributes: true,
  childList: true,
  subtree: true,
  characterData: true
}; // Fonction callback à éxécuter quand une mutation est observée

exports.cartItemUpdateEventConfig = cartItemUpdateEventConfig;

var callback = function callback(mutationsList) {
  var _iteratorNormalCompletion = true;
  var _didIteratorError = false;
  var _iteratorError = undefined;

  try {
    for (var _iterator = mutationsList[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
      var mutation = _step.value;

      if (mutation.type == 'childList') {
        if (typeof mutation.addedNodes[0].children !== 'undefined') {
          Array.from(mutation.addedNodes[0].children).forEach(function (cartItem) {
            cartItem.children.item(0).getElementsByClassName("cartItem-remove").item(0).addEventListener("click", function () {
              _cart.Cart.removeOne(this.dataset.id);

              window.dispatchEvent(_cartUpdateEvent.cartUpdateEvent);
            });
            cartItem.children.item(0).getElementsByClassName("cartItem-quantity").item(0).addEventListener("change", function () {
              _cart.Cart.updateOneQuantity(this.dataset.id, this.value);

              window.dispatchEvent(_cartUpdateEvent.cartUpdateEvent);
            });
          });
        }
      }
    }
  } catch (err) {
    _didIteratorError = true;
    _iteratorError = err;
  } finally {
    try {
      if (!_iteratorNormalCompletion && _iterator.return != null) {
        _iterator.return();
      }
    } finally {
      if (_didIteratorError) {
        throw _iteratorError;
      }
    }
  }
};

var cartItemUpdateEvent = new MutationObserver(callback);
exports.cartItemUpdateEvent = cartItemUpdateEvent;

},{"../../Domain/cart":1,"../Cart/cartUpdateEvent":2}],4:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _cartUpdateEvent = require("../../Event/Cart/cartUpdateEvent");

var _cart = require("../../Domain/cart");

var _default = function _default() {
  var cartClear = document.getElementById("cart-clear");
  cartClear.addEventListener("click", function () {
    _cart.Cart.removeCart();

    window.dispatchEvent(_cartUpdateEvent.cartUpdateEvent);
  });
};

exports.default = _default;

},{"../../Domain/cart":1,"../../Event/Cart/cartUpdateEvent":2}],5:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _default = function _default() {
  document.getElementById("cart-close").addEventListener("click", function () {
    document.getElementById("cart-wrapper").style.visibility = "hidden";
    document.getElementById("cart-wrapper").classList.remove("active");
    document.querySelector("body").classList.remove("overflow-hidden");
  });
};

exports.default = _default;

},{}],6:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _default = function _default() {
  document.getElementById("cart-logo").addEventListener("click", function () {
    document.getElementById("cart-wrapper").style.visibility = "visible";
    document.getElementById("cart-wrapper").classList.add("active");
    document.querySelector("body").classList.add("overflow-hidden");
  });
};

exports.default = _default;

},{}],7:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _cart = require("../../Domain/cart");

var _showCart = require("../../Service/showCart");

var _default = function _default() {
  window.addEventListener('onCartUpdate', function (event) {
    (0, _showCart.showCart)(_cart.Cart.getCart());
  });
};

exports.default = _default;

},{"../../Domain/cart":1,"../../Service/showCart":18}],8:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _cartUpdateEvent = require("../../Event/Cart/cartUpdateEvent");

var _addToCartFromForm = require("../../Service/addToCartFromForm");

var _default = function _default() {
  var addToCart = document.getElementsByClassName('cartItem-add');
  Array.from(addToCart).forEach(function (addToCart) {
    addToCart.addEventListener("submit", function (event) {
      event.preventDefault();
      (0, _addToCartFromForm.addToCartFromForm)(new FormData(addToCart));
      this.getElementsByClassName("submit-icon")[0].classList.add("icon-added");
      var thisFromSubmitContext = this;
      setTimeout(function () {
        thisFromSubmitContext.getElementsByClassName("submit-icon")[0].classList.remove("icon-added");
      }, 1000);
      window.dispatchEvent(_cartUpdateEvent.cartUpdateEvent);
    });
  });
};

exports.default = _default;

},{"../../Event/Cart/cartUpdateEvent":2,"../../Service/addToCartFromForm":13}],9:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _cartUpdateEvent = require("../../Event/Cart/cartUpdateEvent");

var _default = function _default() {
  var cartItemQuantityInputs = document.getElementsByClassName("cartItem-quantity");
  Array.from(cartItemQuantityInputs).forEach(function (cartQuantityInput) {
    cartQuantityInput.addEventListener("change", function () {
      Cart.updateOneQuantity(this.dataset.id, this.value);
      window.dispatchEvent(_cartUpdateEvent.cartUpdateEvent);
    });
  });
};

exports.default = _default;

},{"../../Event/Cart/cartUpdateEvent":2}],10:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _cartUpdateEvent = require("../../Event/Cart/cartUpdateEvent");

var _cart = require("../../Domain/cart");

var _default = function _default() {
  var cartItemRemove = document.getElementsByClassName("cartItem-remove");
  Array.from(cartItemRemove).forEach(function (cartItemRemove) {
    cartItemRemove.addEventListener("click", function () {
      _cart.Cart.removeOne(this.dataset.id);

      window.dispatchEvent(_cartUpdateEvent.cartUpdateEvent);
    });
  });
};

exports.default = _default;

},{"../../Domain/cart":1,"../../Event/Cart/cartUpdateEvent":2}],11:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _cartItemUpdateEvent = require("../../Event/CartItem/cartItemUpdateEvent");

var _default = function _default() {
  _cartItemUpdateEvent.cartItemUpdateEvent.observe(_cartItemUpdateEvent.cartList, _cartItemUpdateEvent.cartItemUpdateEventConfig);
};

exports.default = _default;

},{"../../Event/CartItem/cartItemUpdateEvent":3}],12:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.add = add;

function add(a, b) {
  return a + b;
}

},{}],13:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.addToCartFromForm = addToCartFromForm;

var _cart = require("../Domain/cart");

function addToCartFromForm(form) {
  var cartItem = {};
  var _iteratorNormalCompletion = true;
  var _didIteratorError = false;
  var _iteratorError = undefined;

  try {
    for (var _iterator = form.entries()[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
      var input = _step.value;
      cartItem[input[0].replace('"', '')] = input[1];
    }
  } catch (err) {
    _didIteratorError = true;
    _iteratorError = err;
  } finally {
    try {
      if (!_iteratorNormalCompletion && _iterator.return != null) {
        _iterator.return();
      }
    } finally {
      if (_didIteratorError) {
        throw _iteratorError;
      }
    }
  }

  _cart.Cart.addOne(cartItem);
}

},{"../Domain/cart":1}],14:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.animateCartItemNumbers = animateCartItemNumbers;

function animateCartItemNumbers(items) {
  var cartItemsNumber = document.getElementById("cartItemsNumber");
  cartItemsNumber.textContent = items;

  if (typeof time !== 'undefined') {
    clearTimeout(time);
  }

  if (cartItemsNumber.classList.contains('update')) {
    cartItemsNumber.classList.remove('update');
    cartItemsNumber.classList.add('updateQuantity');

    var _time = setTimeout(function () {
      cartItemsNumber.classList.remove('updateQuantity');
      cartItemsNumber.classList.add('update');
    }, 700);
  } else {
    cartItemsNumber.classList.add('update');
  }
}

},{}],15:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.f = f;

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance"); }

function _iterableToArray(iter) { if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } }

// FACON
function f(strings) {
  var result = "";

  for (var i = 0; i < (arguments.length <= 1 ? 0 : arguments.length - 1); i++) {
    result += strings[i] + (i + 1 < 1 || arguments.length <= i + 1 ? undefined : arguments[i + 1]);
  }

  result += strings[strings.length - 1];
  var template = document.createElement("template");
  template.innerHTML = result;
  var content = template.content;

  content.collect = function () {
    var _ref = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
        _ref$attr = _ref.attr,
        attr = _ref$attr === void 0 ? 'ref' : _ref$attr,
        keepAttribute = _ref.keepAttribute,
        _ref$to = _ref.to,
        to = _ref$to === void 0 ? {} : _ref$to;

    var refElements = content.querySelectorAll("[".concat(attr, "]"));
    return _toConsumableArray(refElements).reduce(function (acc, element) {
      var propName = element.getAttribute(attr).trim();
      !keepAttribute && element.removeAttribute(attr);
      acc[propName] = acc[propName] ? Array.isArray(acc[propName]) ? [].concat(_toConsumableArray(acc[propName]), [element]) : [acc[propName], element] : element;
      return acc;
    }, to);
  };

  return content;
}

},{}],16:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.formatCartItem = formatCartItem;

var _facon = require("./facon");

function _templateObject() {
  var data = _taggedTemplateLiteral(["\n            <li ref=\"items\">\n                <span class=\"d-flex\">\n                    <section>\n                        <img src=\"", "\" alt=\"Image d'un meme\">                 \n                    </section>\n                    <section class=\"d-flex flex-column\">\n                        <span class=\"cartItem-price\">", "  \u20AC</span>\n                        <span>", "</span>\n                        <span>", "</span>\n                        <form action=\"\">\n                        <input data-id=\"", "\" class=\"cartItem-quantity\" name=\"quantity\" type=\"number\" min=\"0\" step=\"1\" value=", ">\n                        </form>\n                        <span data-id=\"", "\" class=\"cartItem-remove\"><i class=\"far fa-trash-alt fa-2x\"></i></span>\n                    </section>\n                </span>\n            </li>\n        "]);

  _templateObject = function _templateObject() {
    return data;
  };

  return data;
}

function _taggedTemplateLiteral(strings, raw) { if (!raw) { raw = strings.slice(0); } return Object.freeze(Object.defineProperties(strings, { raw: { value: Object.freeze(raw) } })); }

function formatCartItem(cartItem, itemPrice) {
  return (0, _facon.f)(_templateObject(), cartItem[1]['image'], itemPrice, cartItem[1]['name'], cartItem[1]['color'], cartItem[1]['id'], cartItem[1]['quantity'], cartItem[1]['id']);
}

},{"./facon":15}],17:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.generateNewCart = generateNewCart;

var _formatCartItem = require("./formatCartItem");

var _animateCartItemNumbers = require("./animateCartItemNumbers");

var _add = require("./add");

function generateNewCart(cart) {
  var newCart = document.createElement("ul");
  newCart.setAttribute('id', 'cart-list');
  var cartPriceArray = [];
  var itemsArray = [];
  Object.entries(cart).forEach(function (cartItem) {
    var itemPrice = cartItem[1]['price'] * cartItem[1]['quantity'];
    cartPriceArray.push(Number(itemPrice));
    itemsArray.push(Number(cartItem[1]['quantity']));
    var node = (0, _formatCartItem.formatCartItem)(cartItem, itemPrice);
    newCart.appendChild(node);
  });
  var cartPrice = cartPriceArray.reduce(_add.add, 0);
  document.getElementById("cart-price").textContent = cartPrice + '€';
  var items = itemsArray.reduce(_add.add, 0);
  (0, _animateCartItemNumbers.animateCartItemNumbers)(items);
  return newCart;
}

},{"./add":12,"./animateCartItemNumbers":14,"./formatCartItem":16}],18:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.showCart = showCart;

var _generateNewCart = require("./generateNewCart");

function showCart(cart) {
  var newCart = (0, _generateNewCart.generateNewCart)(cart);
  var currentCart = document.getElementById("cart-list");
  document.getElementById("cart-wrapper").replaceChild(newCart, currentCart);
}

},{"./generateNewCart":17}],19:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.slugify = slugify;

function slugify(text, separator) {
  return text.toString().toLowerCase().replace(/\s+/g, separator) // Replace spaces with -
  .replace(/[^a-z0-9]/gi, '') // Remove all non-word chars
  .replace(/\-\-+/g, separator) // Replace multiple - with single -
  .replace(/^-+/, '') // Trim - from start of text
  .replace(/-+$/, ''); // Trim - from end of text
}

},{}],20:[function(require,module,exports){
"use strict";

var _cart = require("./Domain/cart");

var _showCart = require("./Service/showCart");

var _cartClearListener = _interopRequireDefault(require("./Listener/Cart/cartClearListener"));

var _cartCloseListener = _interopRequireDefault(require("./Listener/Cart/cartCloseListener"));

var _cartOpenListener = _interopRequireDefault(require("./Listener/Cart/cartOpenListener"));

var _cartUpdateListener = _interopRequireDefault(require("./Listener/Cart/cartUpdateListener"));

var _cartItemRemoveListener = _interopRequireDefault(require("./Listener/CartItem/cartItemRemoveListener"));

var _cartItemQuantityListener = _interopRequireDefault(require("./Listener/CartItem/cartItemQuantityListener"));

var _cartItemUpdateListener = _interopRequireDefault(require("./Listener/CartItem/cartItemUpdateListener"));

var _carItemAddListener = _interopRequireDefault(require("./Listener/CartItem/carItemAddListener"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

(0, _cartItemQuantityListener.default)();
(0, _carItemAddListener.default)();
(0, _cartItemRemoveListener.default)();
(0, _cartItemUpdateListener.default)();
(0, _cartUpdateListener.default)();
(0, _cartOpenListener.default)();
(0, _cartClearListener.default)();
(0, _cartCloseListener.default)();
(0, _showCart.showCart)(_cart.Cart.getCart());

},{"./Domain/cart":1,"./Listener/Cart/cartClearListener":4,"./Listener/Cart/cartCloseListener":5,"./Listener/Cart/cartOpenListener":6,"./Listener/Cart/cartUpdateListener":7,"./Listener/CartItem/carItemAddListener":8,"./Listener/CartItem/cartItemQuantityListener":9,"./Listener/CartItem/cartItemRemoveListener":10,"./Listener/CartItem/cartItemUpdateListener":11,"./Service/showCart":18}]},{},[20])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3Vzci9sb2NhbC9saWIvbm9kZV9tb2R1bGVzL3dhdGNoaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJqcy9Eb21haW4vY2FydC5qcyIsImpzL0V2ZW50L0NhcnQvY2FydFVwZGF0ZUV2ZW50LmpzIiwianMvRXZlbnQvQ2FydEl0ZW0vY2FydEl0ZW1VcGRhdGVFdmVudC5qcyIsImpzL0xpc3RlbmVyL0NhcnQvY2FydENsZWFyTGlzdGVuZXIuanMiLCJqcy9MaXN0ZW5lci9DYXJ0L2NhcnRDbG9zZUxpc3RlbmVyLmpzIiwianMvTGlzdGVuZXIvQ2FydC9jYXJ0T3Blbkxpc3RlbmVyLmpzIiwianMvTGlzdGVuZXIvQ2FydC9jYXJ0VXBkYXRlTGlzdGVuZXIuanMiLCJqcy9MaXN0ZW5lci9DYXJ0SXRlbS9jYXJJdGVtQWRkTGlzdGVuZXIuanMiLCJqcy9MaXN0ZW5lci9DYXJ0SXRlbS9jYXJ0SXRlbVF1YW50aXR5TGlzdGVuZXIuanMiLCJqcy9MaXN0ZW5lci9DYXJ0SXRlbS9jYXJ0SXRlbVJlbW92ZUxpc3RlbmVyLmpzIiwianMvTGlzdGVuZXIvQ2FydEl0ZW0vY2FydEl0ZW1VcGRhdGVMaXN0ZW5lci5qcyIsImpzL1NlcnZpY2UvYWRkLmpzIiwianMvU2VydmljZS9hZGRUb0NhcnRGcm9tRm9ybS5qcyIsImpzL1NlcnZpY2UvYW5pbWF0ZUNhcnRJdGVtTnVtYmVycy5qcyIsImpzL1NlcnZpY2UvZmFjb24uanMiLCJqcy9TZXJ2aWNlL2Zvcm1hdENhcnRJdGVtLmpzIiwianMvU2VydmljZS9nZW5lcmF0ZU5ld0NhcnQuanMiLCJqcy9TZXJ2aWNlL3Nob3dDYXJ0LmpzIiwianMvU2VydmljZS9zbHVnaWZ5LmpzIiwianMvbWFpbi5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7Ozs7QUNBQTs7QUFFQTtBQUNBLElBQU0sSUFBSSxHQUFHO0FBQ1QsRUFBQSxJQUFJLEVBQUUsTUFERztBQUVU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LEdBQWhFO0FBQ0EsTUFBTSxLQUFLLEdBQUcsVUFBVSxDQUFDLE1BQVgsQ0FBa0IsUUFBbEIsRUFBdUIsQ0FBdkIsQ0FBZDtBQUNBLHNEQUF1QixLQUF2QjtBQUNBLFNBQU8sT0FBUDtBQUNIOzs7Ozs7Ozs7O0FDcEJEOztBQUVBLFNBQVMsUUFBVCxDQUFrQixJQUFsQixFQUF3QjtBQUNwQixNQUFNLE9BQU8sR0FBRyxzQ0FBZ0IsSUFBaEIsQ0FBaEI7QUFDQSxNQUFNLFdBQVcsR0FBRyxRQUFRLENBQUMsY0FBVCxDQUF3QixXQUF4QixDQUFwQjtBQUNBLEVBQUEsUUFBUSxDQUFDLGNBQVQsQ0FBd0IsY0FBeEIsRUFBd0MsWUFBeEMsQ0FBcUQsT0FBckQsRUFBOEQsV0FBOUQ7QUFDSDs7Ozs7Ozs7OztBQ1BELFNBQVMsT0FBVCxDQUFpQixJQUFqQixFQUF1QixTQUF2QixFQUFpQztBQUM3QixTQUFPLElBQUksQ0FBQyxRQUFMLEdBQWdCLFdBQWhCLEdBQ0YsT0FERSxDQUNNLE1BRE4sRUFDYyxTQURkLEVBQ21DO0FBRG5DLEdBRUYsT0FGRSxDQUVNLGFBRk4sRUFFcUIsRUFGckIsRUFFK0I7QUFGL0IsR0FHRixPQUhFLENBR00sUUFITixFQUdnQixTQUhoQixFQUdtQztBQUhuQyxHQUlGLE9BSkUsQ0FJTSxLQUpOLEVBSWEsRUFKYixFQUk2QjtBQUo3QixHQUtGLE9BTEUsQ0FLTSxLQUxOLEVBS2EsRUFMYixDQUFQLENBRDZCLENBTU87QUFDdkM7Ozs7O0FDUEQ7O0FBQ0E7O0FBQ0E7O0FBQ0E7O0FBQ0E7O0FBQ0E7O0FBQ0E7O0FBQ0E7O0FBQ0E7O0FBQ0E7Ozs7QUFHQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUEsd0JBQVMsV0FBSyxPQUFMLEVBQVQiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbigpe2Z1bmN0aW9uIHIoZSxuLHQpe2Z1bmN0aW9uIG8oaSxmKXtpZighbltpXSl7aWYoIWVbaV0pe3ZhciBjPVwiZnVuY3Rpb25cIj09dHlwZW9mIHJlcXVpcmUmJnJlcXVpcmU7aWYoIWYmJmMpcmV0dXJuIGMoaSwhMCk7aWYodSlyZXR1cm4gdShpLCEwKTt2YXIgYT1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK2krXCInXCIpO3Rocm93IGEuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixhfXZhciBwPW5baV09e2V4cG9ydHM6e319O2VbaV1bMF0uY2FsbChwLmV4cG9ydHMsZnVuY3Rpb24ocil7dmFyIG49ZVtpXVsxXVtyXTtyZXR1cm4gbyhufHxyKX0scCxwLmV4cG9ydHMscixlLG4sdCl9cmV0dXJuIG5baV0uZXhwb3J0c31mb3IodmFyIHU9XCJmdW5jdGlvblwiPT10eXBlb2YgcmVxdWlyZSYmcmVxdWlyZSxpPTA7aTx0Lmxlbmd0aDtpKyspbyh0W2ldKTtyZXR1cm4gb31yZXR1cm4gcn0pKCkiLCJpbXBvcnQgeyBzbHVnaWZ5IH0gZnJvbSAnLi8uLi9TZXJ2aWNlL3NsdWdpZnknO1xuXG4vLyBPQkpFQ1RTXG5jb25zdCBDYXJ0ID0ge1xuICAgIG5hbWU6ICdjYXJ0JyxcbiAgICBnZXRDYXJ0KCkge1xuICAgICAgICBpZiAoIWxvY2FsU3RvcmFnZS5nZXRJdGVtKHRoaXMubmFtZSkpIHtcbiAgICAgICAgICAgIHRoaXMuc2V0Q2FydCh7fSk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIEpTT04ucGFyc2UobG9jYWxTdG9yYWdlLmdldEl0ZW0odGhpcy5uYW1lKSk7XG4gICAgfSxcbiAgICBnZXRDYXJ0SXRlbU51bWJlcnMoKSB7XG4gICAgICAgIGNvbnN0IGNhcnRQcmljZUFycmF5ID0gW107XG4gICAgICAgIGNvbnN0IGl0ZW1zQXJyYXkgPSBbXTtcbiAgICAgICAgT2JqZWN0LmVudHJpZXModGhpcy5nZXRDYXJ0KCkpLmZvckVhY2goZnVuY3Rpb24oY2FydEl0ZW0pIHtcbiAgICAgICAgICAgIGl0ZW1zQXJyYXkucHVzaChOdW1iZXIoY2FydEl0ZW1bMV1bJ3F1YW50aXR5J10pKTtcbiAgICAgICAgfSk7XG4gICAgICAgIHJldHVybiBpdGVtc0FycmF5LnJlZHVjZShhZGQsIDApO1xuXG4gICAgfSxcbiAgICBnZXRDYXJ0UHJpY2UoKSB7XG4gICAgICAgIGNvbnN0IGNhcnRQcmljZUFycmF5ID0gW107XG4gICAgICAgIGNvbnN0IGl0ZW1zQXJyYXkgPSBbXTtcbiAgICAgICAgT2JqZWN0LmVudHJpZXModGhpcy5nZXRDYXJ0KCkpLmZvckVhY2goZnVuY3Rpb24oY2FydEl0ZW0pIHtcbiAgICAgICAgICAgIGxldCBpdGVtUHJpY2UgPSBjYXJ0SXRlbVsxXVsncHJpY2UnXSAqIGNhcnRJdGVtWzFdWydxdWFudGl0eSddO1xuICAgICAgICAgICAgY2FydFByaWNlQXJyYXkucHVzaChOdW1iZXIoaXRlbVByaWNlKSk7XG4gICAgICAgIH0pO1xuICAgICAgICByZXR1cm4gY2FydFByaWNlQXJyYXkucmVkdWNlKGFkZCwgMCk7XG4gICAgfSxcbiAgICBzZXRDYXJ0KGNhcnQpIHtcbiAgICAgICAgbG9jYWxTdG9yYWdlLnNldEl0ZW0odGhpcy5uYW1lLCBKU09OLnN0cmluZ2lmeShjYXJ0KSk7XG4gICAgfSxcbiAgICByZW1vdmVDYXJ0KCkge1xuICAgICAgICBsb2NhbFN0b3JhZ2UucmVtb3ZlSXRlbSh0aGlzLm5hbWUpO1xuICAgIH0sXG4gICAgYWRkT25lKGNhcnRJdGVtKSB7XG4gICAgICAgIGNvbnN0IGNhcnQgPSB0aGlzLmdldENhcnQoKTtcbiAgICAgICAgY2FydEl0ZW1bJ2lkJ10gPSAncHJvZHVjdC0nICsgc2x1Z2lmeShjYXJ0SXRlbS5uYW1lLCAnJykgKyAnLScgKyBzbHVnaWZ5KGNhcnRJdGVtLmNvbG9yLCAnJyk7XG4gICAgICAgIGlmKGNhcnQuaGFzT3duUHJvcGVydHkoY2FydEl0ZW1bJ2lkJ10pKXtcbiAgICAgICAgICAgIGNhcnRbY2FydEl0ZW1bJ2lkJ11dWydxdWFudGl0eSddID0gTnVtYmVyKGNhcnRbY2FydEl0ZW1bJ2lkJ11dWydxdWFudGl0eSddKTtcbiAgICAgICAgICAgIGNhcnRbY2FydEl0ZW1bJ2lkJ11dWydxdWFudGl0eSddICs9IE51bWJlcihjYXJ0SXRlbS5xdWFudGl0eSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBjYXJ0W2NhcnRJdGVtWydpZCddXSA9IGNhcnRJdGVtO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMuc2V0Q2FydChjYXJ0KTtcbiAgICB9LFxuICAgIHJlbW92ZU9uZShpZCkge1xuICAgICAgICBjb25zdCBjYXJ0ID0gdGhpcy5nZXRDYXJ0KCk7XG4gICAgICAgIGlmKGNhcnQuaGFzT3duUHJvcGVydHkoaWQpKXtcbiAgICAgICAgICAgIGRlbGV0ZSBjYXJ0W2lkXTtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLnNldENhcnQoY2FydCk7XG4gICAgfSxcbiAgICB1cGRhdGVPbmVRdWFudGl0eShpZCwgcXVhbnRpdHkpIHtcbiAgICAgICAgY29uc3QgY2FydCA9IHRoaXMuZ2V0Q2FydCgpO1xuICAgICAgICBpZihjYXJ0Lmhhc093blByb3BlcnR5KGlkKSl7XG4gICAgICAgICAgICBjYXJ0W2lkXVsncXVhbnRpdHknXSA9IE51bWJlcihxdWFudGl0eSk7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5zZXRDYXJ0KGNhcnQpO1xuICAgIH1cbn07XG5leHBvcnQgeyBDYXJ0IH07IiwiY29uc3QgY2FydFVwZGF0ZUV2ZW50ID0gbmV3IEN1c3RvbUV2ZW50KCdvbkNhcnRVcGRhdGUnKTtcbmV4cG9ydCB7IGNhcnRVcGRhdGVFdmVudCB9O1xuIiwiaW1wb3J0IHsgQ2FydCB9IGZyb20gXCIuLi8uLi9Eb21haW4vY2FydFwiO1xuaW1wb3J0IHsgY2FydFVwZGF0ZUV2ZW50IH0gZnJvbSBcIi4uL0NhcnQvY2FydFVwZGF0ZUV2ZW50XCI7XG5cbmNvbnN0IGNhcnRMaXN0ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2NhcnQtd3JhcHBlcicpO1xubGV0IGNhcnRJdGVtVXBkYXRlRXZlbnRDb25maWcgPSB7XG4gICAgYXR0cmlidXRlczogdHJ1ZSxcbiAgICBjaGlsZExpc3Q6IHRydWUsXG4gICAgc3VidHJlZTogdHJ1ZSxcbiAgICBjaGFyYWN0ZXJEYXRhOiB0cnVlXG59O1xuLy8gRm9uY3Rpb24gY2FsbGJhY2sgw6Agw6l4w6ljdXRlciBxdWFuZCB1bmUgbXV0YXRpb24gZXN0IG9ic2VydsOpZVxuY29uc3QgY2FsbGJhY2sgPSBmdW5jdGlvbihtdXRhdGlvbnNMaXN0KSB7XG4gICAgZm9yKGxldCBtdXRhdGlvbiBvZiBtdXRhdGlvbnNMaXN0KSB7XG4gICAgICAgIGlmIChtdXRhdGlvbi50eXBlID09ICdjaGlsZExpc3QnKSB7XG4gICAgICAgICAgICBpZiAodHlwZW9mIG11dGF0aW9uLmFkZGVkTm9kZXNbMF0uY2hpbGRyZW4gIT09ICd1bmRlZmluZWQnKSB7XG4gICAgICAgICAgICAgICAgQXJyYXkuZnJvbShtdXRhdGlvbi5hZGRlZE5vZGVzWzBdLmNoaWxkcmVuKS5mb3JFYWNoKGZ1bmN0aW9uIChjYXJ0SXRlbSkge1xuICAgICAgICAgICAgICAgICAgICBjYXJ0SXRlbS5jaGlsZHJlbi5pdGVtKDApLmdldEVsZW1lbnRzQnlDbGFzc05hbWUoXCJjYXJ0SXRlbS1yZW1vdmVcIikuaXRlbSgwKS5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgQ2FydC5yZW1vdmVPbmUodGhpcy5kYXRhc2V0LmlkKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHdpbmRvdy5kaXNwYXRjaEV2ZW50KGNhcnRVcGRhdGVFdmVudCk7XG4gICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgICAgICBjYXJ0SXRlbS5jaGlsZHJlbi5pdGVtKDApLmdldEVsZW1lbnRzQnlDbGFzc05hbWUoXCJjYXJ0SXRlbS1xdWFudGl0eVwiKS5pdGVtKDApLmFkZEV2ZW50TGlzdGVuZXIoXCJjaGFuZ2VcIiwgZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgQ2FydC51cGRhdGVPbmVRdWFudGl0eSh0aGlzLmRhdGFzZXQuaWQsIHRoaXMudmFsdWUpO1xuICAgICAgICAgICAgICAgICAgICAgICAgd2luZG93LmRpc3BhdGNoRXZlbnQoY2FydFVwZGF0ZUV2ZW50KTtcbiAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG59O1xubGV0IGNhcnRJdGVtVXBkYXRlRXZlbnQgPSBuZXcgTXV0YXRpb25PYnNlcnZlcihjYWxsYmFjayk7XG5cbmV4cG9ydCB7IGNhcnRMaXN0LCBjYXJ0SXRlbVVwZGF0ZUV2ZW50LCBjYXJ0SXRlbVVwZGF0ZUV2ZW50Q29uZmlnIH07XG4iLCJpbXBvcnQgeyBjYXJ0VXBkYXRlRXZlbnQgfSBmcm9tIFwiLi4vLi4vRXZlbnQvQ2FydC9jYXJ0VXBkYXRlRXZlbnRcIjtcbmltcG9ydCB7Q2FydH0gZnJvbSBcIi4uLy4uL0RvbWFpbi9jYXJ0XCI7XG5cbmV4cG9ydCBkZWZhdWx0ICgpID0+IHtcbiAgICBjb25zdCBjYXJ0Q2xlYXIgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImNhcnQtY2xlYXJcIik7XG4gICAgY2FydENsZWFyLmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgIENhcnQucmVtb3ZlQ2FydCgpO1xuICAgICAgICB3aW5kb3cuZGlzcGF0Y2hFdmVudChjYXJ0VXBkYXRlRXZlbnQpO1xuICAgIH0pO1xufVxuIiwiZXhwb3J0IGRlZmF1bHQgKCkgPT4ge1xuICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiY2FydC1jbG9zZVwiKS5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgZnVuY3Rpb24gKCkge1xuICAgICAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImNhcnQtd3JhcHBlclwiKS5zdHlsZS52aXNpYmlsaXR5ID0gXCJoaWRkZW5cIjtcbiAgICAgICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJjYXJ0LXdyYXBwZXJcIikuY2xhc3NMaXN0LnJlbW92ZShcImFjdGl2ZVwiKTtcbiAgICAgICAgZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcImJvZHlcIikuY2xhc3NMaXN0LnJlbW92ZShcIm92ZXJmbG93LWhpZGRlblwiKTtcbiAgICB9KTtcbn0iLCJleHBvcnQgZGVmYXVsdCAoKSA9PiB7XG4gICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJjYXJ0LWxvZ29cIikuYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJjYXJ0LXdyYXBwZXJcIikuc3R5bGUudmlzaWJpbGl0eSA9IFwidmlzaWJsZVwiO1xuICAgICAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImNhcnQtd3JhcHBlclwiKS5jbGFzc0xpc3QuYWRkKFwiYWN0aXZlXCIpO1xuICAgICAgICBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiYm9keVwiKS5jbGFzc0xpc3QuYWRkKFwib3ZlcmZsb3ctaGlkZGVuXCIpO1xuICAgIH0pO1xufSIsImltcG9ydCB7Q2FydH0gZnJvbSBcIi4uLy4uL0RvbWFpbi9jYXJ0XCI7XG5pbXBvcnQge3Nob3dDYXJ0fSBmcm9tIFwiLi4vLi4vU2VydmljZS9zaG93Q2FydFwiO1xuXG5leHBvcnQgZGVmYXVsdCAoKSA9PiB7XG4gICAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ29uQ2FydFVwZGF0ZScsIGZ1bmN0aW9uIChldmVudCkge1xuICAgICAgICBzaG93Q2FydChDYXJ0LmdldENhcnQoKSk7XG4gICAgfSk7XG59IiwiaW1wb3J0IHtjYXJ0VXBkYXRlRXZlbnR9IGZyb20gXCIuLi8uLi9FdmVudC9DYXJ0L2NhcnRVcGRhdGVFdmVudFwiO1xuaW1wb3J0IHthZGRUb0NhcnRGcm9tRm9ybX0gZnJvbSBcIi4uLy4uL1NlcnZpY2UvYWRkVG9DYXJ0RnJvbUZvcm1cIjtcblxuZXhwb3J0IGRlZmF1bHQgKCkgPT4ge1xuICAgIGNvbnN0IGFkZFRvQ2FydCA9IGRvY3VtZW50LmdldEVsZW1lbnRzQnlDbGFzc05hbWUoJ2NhcnRJdGVtLWFkZCcpO1xuICAgIEFycmF5LmZyb20oYWRkVG9DYXJ0KS5mb3JFYWNoKGZ1bmN0aW9uIChhZGRUb0NhcnQpIHtcbiAgICAgICAgYWRkVG9DYXJ0LmFkZEV2ZW50TGlzdGVuZXIoXCJzdWJtaXRcIiwgZnVuY3Rpb24gKGV2ZW50KSB7XG4gICAgICAgICAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICAgICAgYWRkVG9DYXJ0RnJvbUZvcm0obmV3IEZvcm1EYXRhKGFkZFRvQ2FydCkpO1xuICAgICAgICAgICAgdGhpcy5nZXRFbGVtZW50c0J5Q2xhc3NOYW1lKFwic3VibWl0LWljb25cIilbMF0uY2xhc3NMaXN0LmFkZChcImljb24tYWRkZWRcIik7XG4gICAgICAgICAgICBjb25zdCB0aGlzRnJvbVN1Ym1pdENvbnRleHQgPSB0aGlzO1xuICAgICAgICAgICAgc2V0VGltZW91dChmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgdGhpc0Zyb21TdWJtaXRDb250ZXh0LmdldEVsZW1lbnRzQnlDbGFzc05hbWUoXCJzdWJtaXQtaWNvblwiKVswXS5jbGFzc0xpc3QucmVtb3ZlKFwiaWNvbi1hZGRlZFwiKTtcbiAgICAgICAgICAgIH0sIDEwMDApO1xuICAgICAgICAgICAgd2luZG93LmRpc3BhdGNoRXZlbnQoY2FydFVwZGF0ZUV2ZW50KTtcbiAgICAgICAgfSk7XG4gICAgfSk7XG59IiwiaW1wb3J0IHtjYXJ0VXBkYXRlRXZlbnR9IGZyb20gXCIuLi8uLi9FdmVudC9DYXJ0L2NhcnRVcGRhdGVFdmVudFwiO1xuXG5leHBvcnQgZGVmYXVsdCAoKSA9PiB7XG4gICAgY29uc3QgY2FydEl0ZW1RdWFudGl0eUlucHV0cyA9IGRvY3VtZW50LmdldEVsZW1lbnRzQnlDbGFzc05hbWUoXCJjYXJ0SXRlbS1xdWFudGl0eVwiKTtcbiAgICBBcnJheS5mcm9tKGNhcnRJdGVtUXVhbnRpdHlJbnB1dHMpLmZvckVhY2goZnVuY3Rpb24gKGNhcnRRdWFudGl0eUlucHV0KSB7XG4gICAgICAgIGNhcnRRdWFudGl0eUlucHV0LmFkZEV2ZW50TGlzdGVuZXIoXCJjaGFuZ2VcIiwgZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgQ2FydC51cGRhdGVPbmVRdWFudGl0eSh0aGlzLmRhdGFzZXQuaWQsIHRoaXMudmFsdWUpO1xuICAgICAgICAgICAgd2luZG93LmRpc3BhdGNoRXZlbnQoY2FydFVwZGF0ZUV2ZW50KTtcbiAgICAgICAgfSlcbiAgICB9KTtcbn0iLCJpbXBvcnQge2NhcnRVcGRhdGVFdmVudH0gZnJvbSBcIi4uLy4uL0V2ZW50L0NhcnQvY2FydFVwZGF0ZUV2ZW50XCI7XG5pbXBvcnQge0NhcnR9IGZyb20gXCIuLi8uLi9Eb21haW4vY2FydFwiO1xuXG5leHBvcnQgZGVmYXVsdCAoKSA9PiB7XG4gICAgY29uc3QgY2FydEl0ZW1SZW1vdmUgPSBkb2N1bWVudC5nZXRFbGVtZW50c0J5Q2xhc3NOYW1lKFwiY2FydEl0ZW0tcmVtb3ZlXCIpO1xuICAgIEFycmF5LmZyb20oY2FydEl0ZW1SZW1vdmUpLmZvckVhY2goZnVuY3Rpb24gKGNhcnRJdGVtUmVtb3ZlKSB7XG4gICAgICAgIGNhcnRJdGVtUmVtb3ZlLmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICBDYXJ0LnJlbW92ZU9uZSh0aGlzLmRhdGFzZXQuaWQpO1xuICAgICAgICAgICAgd2luZG93LmRpc3BhdGNoRXZlbnQoY2FydFVwZGF0ZUV2ZW50KTtcbiAgICAgICAgfSlcbiAgICB9KTtcbn0iLCJpbXBvcnQge2NhcnRJdGVtVXBkYXRlRXZlbnQsIGNhcnRJdGVtVXBkYXRlRXZlbnRDb25maWcsIGNhcnRMaXN0fSBmcm9tIFwiLi4vLi4vRXZlbnQvQ2FydEl0ZW0vY2FydEl0ZW1VcGRhdGVFdmVudFwiO1xuXG5leHBvcnQgZGVmYXVsdCAoKSA9PiB7XG4gICAgY2FydEl0ZW1VcGRhdGVFdmVudC5vYnNlcnZlKGNhcnRMaXN0LCBjYXJ0SXRlbVVwZGF0ZUV2ZW50Q29uZmlnKTtcbn0iLCJmdW5jdGlvbiBhZGQoYSwgYikge1xuICAgIHJldHVybiBhICsgYjtcbn1cbmV4cG9ydCB7YWRkfTsiLCJpbXBvcnQge0NhcnR9IGZyb20gXCIuLi9Eb21haW4vY2FydFwiO1xuXG5mdW5jdGlvbiBhZGRUb0NhcnRGcm9tRm9ybShmb3JtKSB7XG4gICAgbGV0IGNhcnRJdGVtID0ge307XG4gICAgZm9yKGxldCBpbnB1dCBvZiBmb3JtLmVudHJpZXMoKSkge1xuICAgICAgICBjYXJ0SXRlbVtpbnB1dFswXS5yZXBsYWNlKCdcIicsICcnKV0gPSBpbnB1dFsxXTtcbiAgICB9XG4gICAgQ2FydC5hZGRPbmUoY2FydEl0ZW0pO1xufVxuZXhwb3J0IHthZGRUb0NhcnRGcm9tRm9ybX07IiwiZnVuY3Rpb24gYW5pbWF0ZUNhcnRJdGVtTnVtYmVycyhpdGVtcykge1xuICAgIGNvbnN0IGNhcnRJdGVtc051bWJlciA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiY2FydEl0ZW1zTnVtYmVyXCIpO1xuICAgIGNhcnRJdGVtc051bWJlci50ZXh0Q29udGVudCA9IGl0ZW1zO1xuICAgIGlmICh0eXBlb2YgdGltZSAhPT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgICAgY2xlYXJUaW1lb3V0KHRpbWUpO1xuICAgIH1cbiAgICBpZihjYXJ0SXRlbXNOdW1iZXIuY2xhc3NMaXN0LmNvbnRhaW5zKCd1cGRhdGUnKSl7XG4gICAgICAgIGNhcnRJdGVtc051bWJlci5jbGFzc0xpc3QucmVtb3ZlKCd1cGRhdGUnKTtcbiAgICAgICAgY2FydEl0ZW1zTnVtYmVyLmNsYXNzTGlzdC5hZGQoJ3VwZGF0ZVF1YW50aXR5Jyk7XG4gICAgICAgIGxldCB0aW1lID0gc2V0VGltZW91dChmdW5jdGlvbigpe1xuICAgICAgICAgICAgY2FydEl0ZW1zTnVtYmVyLmNsYXNzTGlzdC5yZW1vdmUoJ3VwZGF0ZVF1YW50aXR5Jyk7XG4gICAgICAgICAgICBjYXJ0SXRlbXNOdW1iZXIuY2xhc3NMaXN0LmFkZCgndXBkYXRlJyk7XG4gICAgICAgIH0sIDcwMCk7XG4gICAgfSBlbHNlIHtcbiAgICAgICAgY2FydEl0ZW1zTnVtYmVyLmNsYXNzTGlzdC5hZGQoJ3VwZGF0ZScpO1xuICAgIH1cbn1cbmV4cG9ydCB7YW5pbWF0ZUNhcnRJdGVtTnVtYmVyc307IiwiLy8gRkFDT05cbmZ1bmN0aW9uIGYoc3RyaW5ncywgLi4uYXJncykge1xuICAgIGxldCByZXN1bHQgPSBgYDtcbiAgICBmb3IobGV0IGkgPSAwOyBpIDwgYXJncy5sZW5ndGg7IGkrKykgcmVzdWx0ICs9IHN0cmluZ3NbaV0gKyBhcmdzW2ldXG4gICAgcmVzdWx0ICs9IHN0cmluZ3Nbc3RyaW5ncy5sZW5ndGggLSAxXVxuXG4gICAgY29uc3QgdGVtcGxhdGUgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KGB0ZW1wbGF0ZWApO1xuICAgIHRlbXBsYXRlLmlubmVySFRNTCA9IHJlc3VsdDtcblxuICAgIGNvbnN0IGNvbnRlbnQgPSB0ZW1wbGF0ZS5jb250ZW50O1xuXG4gICAgY29udGVudC5jb2xsZWN0ID0gKHthdHRyID0gJ3JlZicsIGtlZXBBdHRyaWJ1dGUsIHRvID0ge319ID0ge30pID0+IHtcbiAgICAgICAgY29uc3QgcmVmRWxlbWVudHMgPSBjb250ZW50LnF1ZXJ5U2VsZWN0b3JBbGwoYFske2F0dHJ9XWApO1xuICAgICAgICByZXR1cm4gWy4uLnJlZkVsZW1lbnRzXS5yZWR1Y2UoKGFjYywgZWxlbWVudCkgPT4ge1xuICAgICAgICAgICAgY29uc3QgcHJvcE5hbWUgPSBlbGVtZW50LmdldEF0dHJpYnV0ZShhdHRyKS50cmltKCk7XG4gICAgICAgICAgICAha2VlcEF0dHJpYnV0ZSAmJiAoZWxlbWVudC5yZW1vdmVBdHRyaWJ1dGUoYXR0cikpO1xuICAgICAgICAgICAgYWNjW3Byb3BOYW1lXSA9IGFjY1twcm9wTmFtZV1cbiAgICAgICAgICAgICAgICA/IEFycmF5LmlzQXJyYXkoYWNjW3Byb3BOYW1lXSlcbiAgICAgICAgICAgICAgICAgICAgPyBbLi4uYWNjW3Byb3BOYW1lXSwgZWxlbWVudF1cbiAgICAgICAgICAgICAgICAgICAgOiBbYWNjW3Byb3BOYW1lXSwgZWxlbWVudF1cbiAgICAgICAgICAgICAgICA6IGVsZW1lbnQ7XG4gICAgICAgICAgICByZXR1cm4gYWNjO1xuICAgICAgICB9LCB0byk7XG4gICAgfTtcbiAgICByZXR1cm4gY29udGVudDtcbn1cbmV4cG9ydCB7Zn07IiwiaW1wb3J0IHtmfSBmcm9tIFwiLi9mYWNvblwiO1xuXG5mdW5jdGlvbiBmb3JtYXRDYXJ0SXRlbShjYXJ0SXRlbSwgaXRlbVByaWNlKSB7XG4gICAgcmV0dXJuIGZgXG4gICAgICAgICAgICA8bGkgcmVmPVwiaXRlbXNcIj5cbiAgICAgICAgICAgICAgICA8c3BhbiBjbGFzcz1cImQtZmxleFwiPlxuICAgICAgICAgICAgICAgICAgICA8c2VjdGlvbj5cbiAgICAgICAgICAgICAgICAgICAgICAgIDxpbWcgc3JjPVwiJHtjYXJ0SXRlbVsxXVsnaW1hZ2UnXX1cIiBhbHQ9XCJJbWFnZSBkJ3VuIG1lbWVcIj4gICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgICAgICA8L3NlY3Rpb24+XG4gICAgICAgICAgICAgICAgICAgIDxzZWN0aW9uIGNsYXNzPVwiZC1mbGV4IGZsZXgtY29sdW1uXCI+XG4gICAgICAgICAgICAgICAgICAgICAgICA8c3BhbiBjbGFzcz1cImNhcnRJdGVtLXByaWNlXCI+JHtpdGVtUHJpY2V9ICDigqw8L3NwYW4+XG4gICAgICAgICAgICAgICAgICAgICAgICA8c3Bhbj4ke2NhcnRJdGVtWzFdWyduYW1lJ119PC9zcGFuPlxuICAgICAgICAgICAgICAgICAgICAgICAgPHNwYW4+JHtjYXJ0SXRlbVsxXVsnY29sb3InXX08L3NwYW4+XG4gICAgICAgICAgICAgICAgICAgICAgICA8Zm9ybSBhY3Rpb249XCJcIj5cbiAgICAgICAgICAgICAgICAgICAgICAgIDxpbnB1dCBkYXRhLWlkPVwiJHtjYXJ0SXRlbVsxXVsnaWQnXX1cIiBjbGFzcz1cImNhcnRJdGVtLXF1YW50aXR5XCIgbmFtZT1cInF1YW50aXR5XCIgdHlwZT1cIm51bWJlclwiIG1pbj1cIjBcIiBzdGVwPVwiMVwiIHZhbHVlPSR7Y2FydEl0ZW1bMV1bJ3F1YW50aXR5J119PlxuICAgICAgICAgICAgICAgICAgICAgICAgPC9mb3JtPlxuICAgICAgICAgICAgICAgICAgICAgICAgPHNwYW4gZGF0YS1pZD1cIiR7Y2FydEl0ZW1bMV1bJ2lkJ119XCIgY2xhc3M9XCJjYXJ0SXRlbS1yZW1vdmVcIj48aSBjbGFzcz1cImZhciBmYS10cmFzaC1hbHQgZmEtMnhcIj48L2k+PC9zcGFuPlxuICAgICAgICAgICAgICAgICAgICA8L3NlY3Rpb24+XG4gICAgICAgICAgICAgICAgPC9zcGFuPlxuICAgICAgICAgICAgPC9saT5cbiAgICAgICAgYDtcbn1cbmV4cG9ydCB7Zm9ybWF0Q2FydEl0ZW19OyIsImltcG9ydCB7Zm9ybWF0Q2FydEl0ZW19IGZyb20gXCIuL2Zvcm1hdENhcnRJdGVtXCI7XG5pbXBvcnQge2FuaW1hdGVDYXJ0SXRlbU51bWJlcnN9IGZyb20gXCIuL2FuaW1hdGVDYXJ0SXRlbU51bWJlcnNcIjtcbmltcG9ydCB7YWRkfSBmcm9tIFwiLi9hZGRcIjtcblxuZnVuY3Rpb24gZ2VuZXJhdGVOZXdDYXJ0KGNhcnQpIHtcbiAgICBsZXQgbmV3Q2FydCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJ1bFwiKTtcbiAgICBuZXdDYXJ0LnNldEF0dHJpYnV0ZSgnaWQnLCAnY2FydC1saXN0Jyk7XG4gICAgY29uc3QgY2FydFByaWNlQXJyYXkgPSBbXTtcbiAgICBjb25zdCBpdGVtc0FycmF5ID0gW107XG4gICAgT2JqZWN0LmVudHJpZXMoY2FydCkuZm9yRWFjaChmdW5jdGlvbihjYXJ0SXRlbSkge1xuICAgICAgICBsZXQgaXRlbVByaWNlID0gY2FydEl0ZW1bMV1bJ3ByaWNlJ10gKiBjYXJ0SXRlbVsxXVsncXVhbnRpdHknXTtcbiAgICAgICAgY2FydFByaWNlQXJyYXkucHVzaChOdW1iZXIoaXRlbVByaWNlKSk7XG4gICAgICAgIGl0ZW1zQXJyYXkucHVzaChOdW1iZXIoY2FydEl0ZW1bMV1bJ3F1YW50aXR5J10pKTtcbiAgICAgICAgY29uc3Qgbm9kZSA9IGZvcm1hdENhcnRJdGVtKGNhcnRJdGVtLCBpdGVtUHJpY2UpO1xuICAgICAgICBuZXdDYXJ0LmFwcGVuZENoaWxkKG5vZGUpO1xuICAgIH0pO1xuICAgIGNvbnN0IGNhcnRQcmljZSA9IGNhcnRQcmljZUFycmF5LnJlZHVjZShhZGQsIDApO1xuICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiY2FydC1wcmljZVwiKS50ZXh0Q29udGVudCA9IGNhcnRQcmljZSArICfigqwnO1xuICAgIGNvbnN0IGl0ZW1zID0gaXRlbXNBcnJheS5yZWR1Y2UoYWRkLCAwKTtcbiAgICBhbmltYXRlQ2FydEl0ZW1OdW1iZXJzKGl0ZW1zKTtcbiAgICByZXR1cm4gbmV3Q2FydDtcbn1cbmV4cG9ydCB7IGdlbmVyYXRlTmV3Q2FydCB9OyIsIlxuaW1wb3J0IHtnZW5lcmF0ZU5ld0NhcnR9IGZyb20gXCIuL2dlbmVyYXRlTmV3Q2FydFwiO1xuXG5mdW5jdGlvbiBzaG93Q2FydChjYXJ0KSB7XG4gICAgY29uc3QgbmV3Q2FydCA9IGdlbmVyYXRlTmV3Q2FydChjYXJ0KTtcbiAgICBjb25zdCBjdXJyZW50Q2FydCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiY2FydC1saXN0XCIpO1xuICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiY2FydC13cmFwcGVyXCIpLnJlcGxhY2VDaGlsZChuZXdDYXJ0LCBjdXJyZW50Q2FydCk7XG59XG5leHBvcnQgeyBzaG93Q2FydCB9OyIsImZ1bmN0aW9uIHNsdWdpZnkodGV4dCwgc2VwYXJhdG9yKXtcbiAgICByZXR1cm4gdGV4dC50b1N0cmluZygpLnRvTG93ZXJDYXNlKClcbiAgICAgICAgLnJlcGxhY2UoL1xccysvZywgc2VwYXJhdG9yKSAgICAgICAgICAgLy8gUmVwbGFjZSBzcGFjZXMgd2l0aCAtXG4gICAgICAgIC5yZXBsYWNlKC9bXmEtejAtOV0vZ2ksICcnKSAgICAgICAvLyBSZW1vdmUgYWxsIG5vbi13b3JkIGNoYXJzXG4gICAgICAgIC5yZXBsYWNlKC9cXC1cXC0rL2csIHNlcGFyYXRvcikgICAgICAgICAvLyBSZXBsYWNlIG11bHRpcGxlIC0gd2l0aCBzaW5nbGUgLVxuICAgICAgICAucmVwbGFjZSgvXi0rLywgJycpICAgICAgICAgICAgIC8vIFRyaW0gLSBmcm9tIHN0YXJ0IG9mIHRleHRcbiAgICAgICAgLnJlcGxhY2UoLy0rJC8sICcnKTsgICAgICAgICAgICAvLyBUcmltIC0gZnJvbSBlbmQgb2YgdGV4dFxufVxuZXhwb3J0IHtzbHVnaWZ5fTsiLCJpbXBvcnQgeyBDYXJ0IH0gZnJvbSBcIi4vRG9tYWluL2NhcnRcIjtcbmltcG9ydCB7IHNob3dDYXJ0IH0gZnJvbSBcIi4vU2VydmljZS9zaG93Q2FydFwiO1xuaW1wb3J0IGNhcnRDbGVhckxpc3RlbmVyIGZyb20gXCIuL0xpc3RlbmVyL0NhcnQvY2FydENsZWFyTGlzdGVuZXJcIjtcbmltcG9ydCBjYXJ0Q2xvc2VMaXN0ZW5lciBmcm9tIFwiLi9MaXN0ZW5lci9DYXJ0L2NhcnRDbG9zZUxpc3RlbmVyXCI7XG5pbXBvcnQgY2FydE9wZW5MaXN0ZW5lciBmcm9tIFwiLi9MaXN0ZW5lci9DYXJ0L2NhcnRPcGVuTGlzdGVuZXJcIjtcbmltcG9ydCBjYXJ0VXBkYXRlTGlzdGVuZXIgZnJvbSBcIi4vTGlzdGVuZXIvQ2FydC9jYXJ0VXBkYXRlTGlzdGVuZXJcIjtcbmltcG9ydCBjYXJ0SXRlbVJlbW92ZUxpc3RlbmVyIGZyb20gXCIuL0xpc3RlbmVyL0NhcnRJdGVtL2NhcnRJdGVtUmVtb3ZlTGlzdGVuZXJcIjtcbmltcG9ydCBjYXJ0SXRlbVF1YW50aXR5TGlzdGVuZXIgZnJvbSBcIi4vTGlzdGVuZXIvQ2FydEl0ZW0vY2FydEl0ZW1RdWFudGl0eUxpc3RlbmVyXCI7XG5pbXBvcnQgY2FydEl0ZW1VcGRhdGVMaXN0ZW5lciBmcm9tIFwiLi9MaXN0ZW5lci9DYXJ0SXRlbS9jYXJ0SXRlbVVwZGF0ZUxpc3RlbmVyXCI7XG5pbXBvcnQgY2FySXRlbUFkZExpc3RlbmVyIGZyb20gXCIuL0xpc3RlbmVyL0NhcnRJdGVtL2Nhckl0ZW1BZGRMaXN0ZW5lclwiO1xuXG5cbmNhcnRJdGVtUXVhbnRpdHlMaXN0ZW5lcigpO1xuY2FySXRlbUFkZExpc3RlbmVyKCk7XG5jYXJ0SXRlbVJlbW92ZUxpc3RlbmVyKCk7XG5jYXJ0SXRlbVVwZGF0ZUxpc3RlbmVyKClcbmNhcnRVcGRhdGVMaXN0ZW5lcigpO1xuY2FydE9wZW5MaXN0ZW5lcigpO1xuY2FydENsZWFyTGlzdGVuZXIoKTtcbmNhcnRDbG9zZUxpc3RlbmVyKCk7XG5cbnNob3dDYXJ0KENhcnQuZ2V0Q2FydCgpKTtcblxuXG4iXX0=
