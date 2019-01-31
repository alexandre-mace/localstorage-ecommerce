(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Cart = void 0;

var _slugify = require("./../Service/slugify");

var _add = require("../Service/add");

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
    return itemsArray.reduce(_add.add, 0);
  },
  getCartPrice: function getCartPrice() {
    var cartPriceArray = [];
    var itemsArray = [];
    Object.entries(this.getCart()).forEach(function (cartItem) {
      var itemPrice = cartItem[1]['price'] * cartItem[1]['quantity'];
      cartPriceArray.push(Number(itemPrice));
    });
    return cartPriceArray.reduce(_add.add, 0);
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

},{"../Service/add":13,"./../Service/slugify":21}],2:[function(require,module,exports){
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

var _sendJsonCart = require("../../Service/sendJsonCart");

var _default = function _default() {
  document.getElementById("cart-send").addEventListener("click", function () {
    return (0, _sendJsonCart.sendJsonCart)();
  });
};

exports.default = _default;

},{"../../Service/sendJsonCart":19}],8:[function(require,module,exports){
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

},{"../../Domain/cart":1,"../../Service/showCart":20}],9:[function(require,module,exports){
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

},{"../../Event/Cart/cartUpdateEvent":2,"../../Service/addToCartFromForm":14}],10:[function(require,module,exports){
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

},{"../../Event/Cart/cartUpdateEvent":2}],11:[function(require,module,exports){
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

},{"../../Domain/cart":1,"../../Event/Cart/cartUpdateEvent":2}],12:[function(require,module,exports){
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

},{"../../Event/CartItem/cartItemUpdateEvent":3}],13:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.add = add;

function add(a, b) {
  return a + b;
}

},{}],14:[function(require,module,exports){
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

},{"../Domain/cart":1}],15:[function(require,module,exports){
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

},{}],16:[function(require,module,exports){
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

},{}],17:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.formatCartItem = formatCartItem;

var _facon = require("./facon");

function _templateObject() {
  var data = _taggedTemplateLiteral(["\n            <li ref=\"items\">\n                <span class=\"d-flex\">\n                    <section>\n                        <img src=\"", "\" alt=\"Image d'un meme\">                 \n                    </section>\n                    <section class=\"d-flex flex-column\">\n                        <span class=\"cartItem-price\">", "  \u20AC</span>\n                        <span>", "</span>\n                        <span>", "</span>\n                        <form action=\"\">\n                        <input data-id=\"", "\" class=\"cartItem-quantity\" name=\"quantity\" type=\"number\" min=\"1\" step=\"1\" value=", ">\n                        </form>\n                        <span data-id=\"", "\" class=\"cartItem-remove\"><i class=\"far fa-trash-alt fa-2x\"></i></span>\n                    </section>\n                </span>\n            </li>\n        "]);

  _templateObject = function _templateObject() {
    return data;
  };

  return data;
}

function _taggedTemplateLiteral(strings, raw) { if (!raw) { raw = strings.slice(0); } return Object.freeze(Object.defineProperties(strings, { raw: { value: Object.freeze(raw) } })); }

function formatCartItem(cartItem, itemPrice) {
  return (0, _facon.f)(_templateObject(), cartItem[1]['image'], itemPrice, cartItem[1]['name'], cartItem[1]['color'], cartItem[1]['id'], cartItem[1]['quantity'], cartItem[1]['id']);
}

},{"./facon":16}],18:[function(require,module,exports){
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

},{"./add":13,"./animateCartItemNumbers":15,"./formatCartItem":17}],19:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.sendJsonCart = sendJsonCart;

var _cart = require("../Domain/cart");

function sendJsonCart() {
  console.log(JSON.stringify({
    cartItems: _cart.Cart.getCart(),
    cartPrice: _cart.Cart.getCartPrice()
  }));
  return JSON.stringify({
    cartItems: _cart.Cart.getCart(),
    cartPrice: _cart.Cart.getCartPrice()
  });
}

},{"../Domain/cart":1}],20:[function(require,module,exports){
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

},{"./generateNewCart":18}],21:[function(require,module,exports){
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

},{}],22:[function(require,module,exports){
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

var _cartSendListener = _interopRequireDefault(require("./Listener/Cart/cartSendListener"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

(0, _cartItemQuantityListener.default)();
(0, _carItemAddListener.default)();
(0, _cartItemRemoveListener.default)();
(0, _cartItemUpdateListener.default)();
(0, _cartUpdateListener.default)();
(0, _cartOpenListener.default)();
(0, _cartClearListener.default)();
(0, _cartCloseListener.default)();
(0, _cartSendListener.default)();
(0, _showCart.showCart)(_cart.Cart.getCart());

},{"./Domain/cart":1,"./Listener/Cart/cartClearListener":4,"./Listener/Cart/cartCloseListener":5,"./Listener/Cart/cartOpenListener":6,"./Listener/Cart/cartSendListener":7,"./Listener/Cart/cartUpdateListener":8,"./Listener/CartItem/carItemAddListener":9,"./Listener/CartItem/cartItemQuantityListener":10,"./Listener/CartItem/cartItemRemoveListener":11,"./Listener/CartItem/cartItemUpdateListener":12,"./Service/showCart":20}]},{},[22])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3Vzci9sb2NhbC9saWIvbm9kZV9tb2R1bGVzL3dhdGNoaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJqcy9Eb21haW4vY2FydC5qcyIsImpzL0V2ZW50L0NhcnQvY2FydFVwZGF0ZUV2ZW50LmpzIiwianMvRXZlbnQvQ2FydEl0ZW0vY2FydEl0ZW1VcGRhdGVFdmVudC5qcyIsImpzL0xpc3RlbmVyL0NhcnQvY2FydENsZWFyTGlzdGVuZXIuanMiLCJqcy9MaXN0ZW5lci9DYXJ0L2NhcnRDbG9zZUxpc3RlbmVyLmpzIiwianMvTGlzdGVuZXIvQ2FydC9jYXJ0T3Blbkxpc3RlbmVyLmpzIiwianMvTGlzdGVuZXIvQ2FydC9jYXJ0U2VuZExpc3RlbmVyLmpzIiwianMvTGlzdGVuZXIvQ2FydC9jYXJ0VXBkYXRlTGlzdGVuZXIuanMiLCJqcy9MaXN0ZW5lci9DYXJ0SXRlbS9jYXJJdGVtQWRkTGlzdGVuZXIuanMiLCJqcy9MaXN0ZW5lci9DYXJ0SXRlbS9jYXJ0SXRlbVF1YW50aXR5TGlzdGVuZXIuanMiLCJqcy9MaXN0ZW5lci9DYXJ0SXRlbS9jYXJ0SXRlbVJlbW92ZUxpc3RlbmVyLmpzIiwianMvTGlzdGVuZXIvQ2FydEl0ZW0vY2FydEl0ZW1VcGRhdGVMaXN0ZW5lci5qcyIsImpzL1NlcnZpY2UvYWRkLmpzIiwianMvU2VydmljZS9hZGRUb0NhcnRGcm9tRm9ybS5qcyIsImpzL1NlcnZpY2UvYW5pbWF0ZUNhcnRJdGVtTnVtYmVycy5qcyIsImpzL1NlcnZpY2UvZmFjb24uanMiLCJqcy9TZXJ2aWNlL2Zvcm1hdENhcnRJdGVtLmpzIiwianMvU2VydmljZS9nZW5lcmF0ZU5ld0NhcnQuanMiLCJqcy9TZXJ2aWNlL3NlbmRKc29uQ2FydC5qcyIsImpzL1NlcnZpY2Uvc2hvd0NhcnQuanMiLCJqcy9TZXJ2aWNlL3NsdWdpZnkuanMiLCJqcy9tYWluLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFB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UUFBTCxHQUFnQixXQUFoQixHQUNGLE9BREUsQ0FDTSxNQUROLEVBQ2MsU0FEZCxFQUNtQztBQURuQyxHQUVGLE9BRkUsQ0FFTSxhQUZOLEVBRXFCLEVBRnJCLEVBRStCO0FBRi9CLEdBR0YsT0FIRSxDQUdNLFFBSE4sRUFHZ0IsU0FIaEIsRUFHbUM7QUFIbkMsR0FJRixPQUpFLENBSU0sS0FKTixFQUlhLEVBSmIsRUFJNkI7QUFKN0IsR0FLRixPQUxFLENBS00sS0FMTixFQUthLEVBTGIsQ0FBUCxDQUQ2QixDQU1PO0FBQ3ZDOzs7OztBQ1BEOztBQUNBOztBQUNBOztBQUNBOztBQUNBOztBQUNBOztBQUNBOztBQUNBOztBQUNBOztBQUNBOztBQUNBOzs7O0FBR0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUEsd0JBQVMsV0FBSyxPQUFMLEVBQVQiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbigpe2Z1bmN0aW9uIHIoZSxuLHQpe2Z1bmN0aW9uIG8oaSxmKXtpZighbltpXSl7aWYoIWVbaV0pe3ZhciBjPVwiZnVuY3Rpb25cIj09dHlwZW9mIHJlcXVpcmUmJnJlcXVpcmU7aWYoIWYmJmMpcmV0dXJuIGMoaSwhMCk7aWYodSlyZXR1cm4gdShpLCEwKTt2YXIgYT1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK2krXCInXCIpO3Rocm93IGEuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixhfXZhciBwPW5baV09e2V4cG9ydHM6e319O2VbaV1bMF0uY2FsbChwLmV4cG9ydHMsZnVuY3Rpb24ocil7dmFyIG49ZVtpXVsxXVtyXTtyZXR1cm4gbyhufHxyKX0scCxwLmV4cG9ydHMscixlLG4sdCl9cmV0dXJuIG5baV0uZXhwb3J0c31mb3IodmFyIHU9XCJmdW5jdGlvblwiPT10eXBlb2YgcmVxdWlyZSYmcmVxdWlyZSxpPTA7aTx0Lmxlbmd0aDtpKyspbyh0W2ldKTtyZXR1cm4gb31yZXR1cm4gcn0pKCkiLCJpbXBvcnQgeyBzbHVnaWZ5IH0gZnJvbSAnLi8uLi9TZXJ2aWNlL3NsdWdpZnknO1xuaW1wb3J0IHthZGR9IGZyb20gXCIuLi9TZXJ2aWNlL2FkZFwiO1xuXG4vLyBPQkpFQ1RTXG5jb25zdCBDYXJ0ID0ge1xuICAgIG5hbWU6ICdjYXJ0JyxcbiAgICBnZXRDYXJ0KCkge1xuICAgICAgICBpZiAoIWxvY2FsU3RvcmFnZS5nZXRJdGVtKHRoaXMubmFtZSkpIHtcbiAgICAgICAgICAgIHRoaXMuc2V0Q2FydCh7fSk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIEpTT04ucGFyc2UobG9jYWxTdG9yYWdlLmdldEl0ZW0odGhpcy5uYW1lKSk7XG4gICAgfSxcbiAgICBnZXRDYXJ0SXRlbU51bWJlcnMoKSB7XG4gICAgICAgIGNvbnN0IGNhcnRQcmljZUFycmF5ID0gW107XG4gICAgICAgIGNvbnN0IGl0ZW1zQXJyYXkgPSBbXTtcbiAgICAgICAgT2JqZWN0LmVudHJpZXModGhpcy5nZXRDYXJ0KCkpLmZvckVhY2goZnVuY3Rpb24oY2FydEl0ZW0pIHtcbiAgICAgICAgICAgIGl0ZW1zQXJyYXkucHVzaChOdW1iZXIoY2FydEl0ZW1bMV1bJ3F1YW50aXR5J10pKTtcbiAgICAgICAgfSk7XG4gICAgICAgIHJldHVybiBpdGVtc0FycmF5LnJlZHVjZShhZGQsIDApO1xuXG4gICAgfSxcbiAgICBnZXRDYXJ0UHJpY2UoKSB7XG4gICAgICAgIGNvbnN0IGNhcnRQcmljZUFycmF5ID0gW107XG4gICAgICAgIGNvbnN0IGl0ZW1zQXJyYXkgPSBbXTtcbiAgICAgICAgT2JqZWN0LmVudHJpZXModGhpcy5nZXRDYXJ0KCkpLmZvckVhY2goZnVuY3Rpb24oY2FydEl0ZW0pIHtcbiAgICAgICAgICAgIGxldCBpdGVtUHJpY2UgPSBjYXJ0SXRlbVsxXVsncHJpY2UnXSAqIGNhcnRJdGVtWzFdWydxdWFudGl0eSddO1xuICAgICAgICAgICAgY2FydFByaWNlQXJyYXkucHVzaChOdW1iZXIoaXRlbVByaWNlKSk7XG4gICAgICAgIH0pO1xuICAgICAgICByZXR1cm4gY2FydFByaWNlQXJyYXkucmVkdWNlKGFkZCwgMCk7XG4gICAgfSxcbiAgICBzZXRDYXJ0KGNhcnQpIHtcbiAgICAgICAgbG9jYWxTdG9yYWdlLnNldEl0ZW0odGhpcy5uYW1lLCBKU09OLnN0cmluZ2lmeShjYXJ0KSk7XG4gICAgfSxcbiAgICByZW1vdmVDYXJ0KCkge1xuICAgICAgICBsb2NhbFN0b3JhZ2UucmVtb3ZlSXRlbSh0aGlzLm5hbWUpO1xuICAgIH0sXG4gICAgYWRkT25lKGNhcnRJdGVtKSB7XG4gICAgICAgIGNvbnN0IGNhcnQgPSB0aGlzLmdldENhcnQoKTtcbiAgICAgICAgY2FydEl0ZW1bJ2lkJ10gPSAncHJvZHVjdC0nICsgc2x1Z2lmeShjYXJ0SXRlbS5uYW1lLCAnJykgKyAnLScgKyBzbHVnaWZ5KGNhcnRJdGVtLmNvbG9yLCAnJyk7XG4gICAgICAgIGlmKGNhcnQuaGFzT3duUHJvcGVydHkoY2FydEl0ZW1bJ2lkJ10pKXtcbiAgICAgICAgICAgIGNhcnRbY2FydEl0ZW1bJ2lkJ11dWydxdWFudGl0eSddID0gTnVtYmVyKGNhcnRbY2FydEl0ZW1bJ2lkJ11dWydxdWFudGl0eSddKTtcbiAgICAgICAgICAgIGNhcnRbY2FydEl0ZW1bJ2lkJ11dWydxdWFudGl0eSddICs9IE51bWJlcihjYXJ0SXRlbS5xdWFudGl0eSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBjYXJ0W2NhcnRJdGVtWydpZCddXSA9IGNhcnRJdGVtO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMuc2V0Q2FydChjYXJ0KTtcbiAgICB9LFxuICAgIHJlbW92ZU9uZShpZCkge1xuICAgICAgICBjb25zdCBjYXJ0ID0gdGhpcy5nZXRDYXJ0KCk7XG4gICAgICAgIGlmKGNhcnQuaGFzT3duUHJvcGVydHkoaWQpKXtcbiAgICAgICAgICAgIGRlbGV0ZSBjYXJ0W2lkXTtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLnNldENhcnQoY2FydCk7XG4gICAgfSxcbiAgICB1cGRhdGVPbmVRdWFudGl0eShpZCwgcXVhbnRpdHkpIHtcbiAgICAgICAgY29uc3QgY2FydCA9IHRoaXMuZ2V0Q2FydCgpO1xuICAgICAgICBpZihjYXJ0Lmhhc093blByb3BlcnR5KGlkKSl7XG4gICAgICAgICAgICBjYXJ0W2lkXVsncXVhbnRpdHknXSA9IE51bWJlcihxdWFudGl0eSk7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5zZXRDYXJ0KGNhcnQpO1xuICAgIH1cbn07XG5leHBvcnQgeyBDYXJ0IH07IiwiY29uc3QgY2FydFVwZGF0ZUV2ZW50ID0gbmV3IEN1c3RvbUV2ZW50KCdvbkNhcnRVcGRhdGUnKTtcbmV4cG9ydCB7IGNhcnRVcGRhdGVFdmVudCB9O1xuIiwiaW1wb3J0IHsgQ2FydCB9IGZyb20gXCIuLi8uLi9Eb21haW4vY2FydFwiO1xuaW1wb3J0IHsgY2FydFVwZGF0ZUV2ZW50IH0gZnJvbSBcIi4uL0NhcnQvY2FydFVwZGF0ZUV2ZW50XCI7XG5cbmNvbnN0IGNhcnRMaXN0ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2NhcnQtd3JhcHBlcicpO1xubGV0IGNhcnRJdGVtVXBkYXRlRXZlbnRDb25maWcgPSB7XG4gICAgYXR0cmlidXRlczogdHJ1ZSxcbiAgICBjaGlsZExpc3Q6IHRydWUsXG4gICAgc3VidHJlZTogdHJ1ZSxcbiAgICBjaGFyYWN0ZXJEYXRhOiB0cnVlXG59O1xuLy8gRm9uY3Rpb24gY2FsbGJhY2sgw6Agw6l4w6ljdXRlciBxdWFuZCB1bmUgbXV0YXRpb24gZXN0IG9ic2VydsOpZVxuY29uc3QgY2FsbGJhY2sgPSBmdW5jdGlvbihtdXRhdGlvbnNMaXN0KSB7XG4gICAgZm9yKGxldCBtdXRhdGlvbiBvZiBtdXRhdGlvbnNMaXN0KSB7XG4gICAgICAgIGlmIChtdXRhdGlvbi50eXBlID09ICdjaGlsZExpc3QnKSB7XG4gICAgICAgICAgICBpZiAodHlwZW9mIG11dGF0aW9uLmFkZGVkTm9kZXNbMF0uY2hpbGRyZW4gIT09ICd1bmRlZmluZWQnKSB7XG4gICAgICAgICAgICAgICAgQXJyYXkuZnJvbShtdXRhdGlvbi5hZGRlZE5vZGVzWzBdLmNoaWxkcmVuKS5mb3JFYWNoKGZ1bmN0aW9uIChjYXJ0SXRlbSkge1xuICAgICAgICAgICAgICAgICAgICBjYXJ0SXRlbS5jaGlsZHJlbi5pdGVtKDApLmdldEVsZW1lbnRzQnlDbGFzc05hbWUoXCJjYXJ0SXRlbS1yZW1vdmVcIikuaXRlbSgwKS5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgQ2FydC5yZW1vdmVPbmUodGhpcy5kYXRhc2V0LmlkKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHdpbmRvdy5kaXNwYXRjaEV2ZW50KGNhcnRVcGRhdGVFdmVudCk7XG4gICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgICAgICBjYXJ0SXRlbS5jaGlsZHJlbi5pdGVtKDApLmdldEVsZW1lbnRzQnlDbGFzc05hbWUoXCJjYXJ0SXRlbS1xdWFudGl0eVwiKS5pdGVtKDApLmFkZEV2ZW50TGlzdGVuZXIoXCJjaGFuZ2VcIiwgZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgQ2FydC51cGRhdGVPbmVRdWFudGl0eSh0aGlzLmRhdGFzZXQuaWQsIHRoaXMudmFsdWUpO1xuICAgICAgICAgICAgICAgICAgICAgICAgd2luZG93LmRpc3BhdGNoRXZlbnQoY2FydFVwZGF0ZUV2ZW50KTtcbiAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG59O1xubGV0IGNhcnRJdGVtVXBkYXRlRXZlbnQgPSBuZXcgTXV0YXRpb25PYnNlcnZlcihjYWxsYmFjayk7XG5cbmV4cG9ydCB7IGNhcnRMaXN0LCBjYXJ0SXRlbVVwZGF0ZUV2ZW50LCBjYXJ0SXRlbVVwZGF0ZUV2ZW50Q29uZmlnIH07XG4iLCJpbXBvcnQgeyBjYXJ0VXBkYXRlRXZlbnQgfSBmcm9tIFwiLi4vLi4vRXZlbnQvQ2FydC9jYXJ0VXBkYXRlRXZlbnRcIjtcbmltcG9ydCB7Q2FydH0gZnJvbSBcIi4uLy4uL0RvbWFpbi9jYXJ0XCI7XG5cbmV4cG9ydCBkZWZhdWx0ICgpID0+IHtcbiAgICBjb25zdCBjYXJ0Q2xlYXIgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImNhcnQtY2xlYXJcIik7XG4gICAgY2FydENsZWFyLmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgIENhcnQucmVtb3ZlQ2FydCgpO1xuICAgICAgICB3aW5kb3cuZGlzcGF0Y2hFdmVudChjYXJ0VXBkYXRlRXZlbnQpO1xuICAgIH0pO1xufVxuIiwiZXhwb3J0IGRlZmF1bHQgKCkgPT4ge1xuICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiY2FydC1jbG9zZVwiKS5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgZnVuY3Rpb24gKCkge1xuICAgICAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImNhcnQtd3JhcHBlclwiKS5zdHlsZS52aXNpYmlsaXR5ID0gXCJoaWRkZW5cIjtcbiAgICAgICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJjYXJ0LXdyYXBwZXJcIikuY2xhc3NMaXN0LnJlbW92ZShcImFjdGl2ZVwiKTtcbiAgICAgICAgZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcImJvZHlcIikuY2xhc3NMaXN0LnJlbW92ZShcIm92ZXJmbG93LWhpZGRlblwiKTtcbiAgICB9KTtcbn0iLCJleHBvcnQgZGVmYXVsdCAoKSA9PiB7XG4gICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJjYXJ0LWxvZ29cIikuYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJjYXJ0LXdyYXBwZXJcIikuc3R5bGUudmlzaWJpbGl0eSA9IFwidmlzaWJsZVwiO1xuICAgICAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImNhcnQtd3JhcHBlclwiKS5jbGFzc0xpc3QuYWRkKFwiYWN0aXZlXCIpO1xuICAgICAgICBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiYm9keVwiKS5jbGFzc0xpc3QuYWRkKFwib3ZlcmZsb3ctaGlkZGVuXCIpO1xuICAgIH0pO1xufSIsImltcG9ydCB7c2VuZEpzb25DYXJ0fSBmcm9tIFwiLi4vLi4vU2VydmljZS9zZW5kSnNvbkNhcnRcIjtcblxuZXhwb3J0IGRlZmF1bHQgKCkgPT4ge1xuICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiY2FydC1zZW5kXCIpLmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHJldHVybiBzZW5kSnNvbkNhcnQoKTtcbiAgICB9KTtcbn0iLCJpbXBvcnQge0NhcnR9IGZyb20gXCIuLi8uLi9Eb21haW4vY2FydFwiO1xuaW1wb3J0IHtzaG93Q2FydH0gZnJvbSBcIi4uLy4uL1NlcnZpY2Uvc2hvd0NhcnRcIjtcblxuZXhwb3J0IGRlZmF1bHQgKCkgPT4ge1xuICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdvbkNhcnRVcGRhdGUnLCBmdW5jdGlvbiAoZXZlbnQpIHtcbiAgICAgICAgc2hvd0NhcnQoQ2FydC5nZXRDYXJ0KCkpO1xuICAgIH0pO1xufSIsImltcG9ydCB7Y2FydFVwZGF0ZUV2ZW50fSBmcm9tIFwiLi4vLi4vRXZlbnQvQ2FydC9jYXJ0VXBkYXRlRXZlbnRcIjtcbmltcG9ydCB7YWRkVG9DYXJ0RnJvbUZvcm19IGZyb20gXCIuLi8uLi9TZXJ2aWNlL2FkZFRvQ2FydEZyb21Gb3JtXCI7XG5cbmV4cG9ydCBkZWZhdWx0ICgpID0+IHtcbiAgICBjb25zdCBhZGRUb0NhcnQgPSBkb2N1bWVudC5nZXRFbGVtZW50c0J5Q2xhc3NOYW1lKCdjYXJ0SXRlbS1hZGQnKTtcbiAgICBBcnJheS5mcm9tKGFkZFRvQ2FydCkuZm9yRWFjaChmdW5jdGlvbiAoYWRkVG9DYXJ0KSB7XG4gICAgICAgIGFkZFRvQ2FydC5hZGRFdmVudExpc3RlbmVyKFwic3VibWl0XCIsIGZ1bmN0aW9uIChldmVudCkge1xuICAgICAgICAgICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgICAgIGFkZFRvQ2FydEZyb21Gb3JtKG5ldyBGb3JtRGF0YShhZGRUb0NhcnQpKTtcbiAgICAgICAgICAgIHRoaXMuZ2V0RWxlbWVudHNCeUNsYXNzTmFtZShcInN1Ym1pdC1pY29uXCIpWzBdLmNsYXNzTGlzdC5hZGQoXCJpY29uLWFkZGVkXCIpO1xuICAgICAgICAgICAgY29uc3QgdGhpc0Zyb21TdWJtaXRDb250ZXh0ID0gdGhpcztcbiAgICAgICAgICAgIHNldFRpbWVvdXQoZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgIHRoaXNGcm9tU3VibWl0Q29udGV4dC5nZXRFbGVtZW50c0J5Q2xhc3NOYW1lKFwic3VibWl0LWljb25cIilbMF0uY2xhc3NMaXN0LnJlbW92ZShcImljb24tYWRkZWRcIik7XG4gICAgICAgICAgICB9LCAxMDAwKTtcbiAgICAgICAgICAgIHdpbmRvdy5kaXNwYXRjaEV2ZW50KGNhcnRVcGRhdGVFdmVudCk7XG4gICAgICAgIH0pO1xuICAgIH0pO1xufSIsImltcG9ydCB7Y2FydFVwZGF0ZUV2ZW50fSBmcm9tIFwiLi4vLi4vRXZlbnQvQ2FydC9jYXJ0VXBkYXRlRXZlbnRcIjtcblxuZXhwb3J0IGRlZmF1bHQgKCkgPT4ge1xuICAgIGNvbnN0IGNhcnRJdGVtUXVhbnRpdHlJbnB1dHMgPSBkb2N1bWVudC5nZXRFbGVtZW50c0J5Q2xhc3NOYW1lKFwiY2FydEl0ZW0tcXVhbnRpdHlcIik7XG4gICAgQXJyYXkuZnJvbShjYXJ0SXRlbVF1YW50aXR5SW5wdXRzKS5mb3JFYWNoKGZ1bmN0aW9uIChjYXJ0UXVhbnRpdHlJbnB1dCkge1xuICAgICAgICBjYXJ0UXVhbnRpdHlJbnB1dC5hZGRFdmVudExpc3RlbmVyKFwiY2hhbmdlXCIsIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIENhcnQudXBkYXRlT25lUXVhbnRpdHkodGhpcy5kYXRhc2V0LmlkLCB0aGlzLnZhbHVlKTtcbiAgICAgICAgICAgIHdpbmRvdy5kaXNwYXRjaEV2ZW50KGNhcnRVcGRhdGVFdmVudCk7XG4gICAgICAgIH0pXG4gICAgfSk7XG59IiwiaW1wb3J0IHtjYXJ0VXBkYXRlRXZlbnR9IGZyb20gXCIuLi8uLi9FdmVudC9DYXJ0L2NhcnRVcGRhdGVFdmVudFwiO1xuaW1wb3J0IHtDYXJ0fSBmcm9tIFwiLi4vLi4vRG9tYWluL2NhcnRcIjtcblxuZXhwb3J0IGRlZmF1bHQgKCkgPT4ge1xuICAgIGNvbnN0IGNhcnRJdGVtUmVtb3ZlID0gZG9jdW1lbnQuZ2V0RWxlbWVudHNCeUNsYXNzTmFtZShcImNhcnRJdGVtLXJlbW92ZVwiKTtcbiAgICBBcnJheS5mcm9tKGNhcnRJdGVtUmVtb3ZlKS5mb3JFYWNoKGZ1bmN0aW9uIChjYXJ0SXRlbVJlbW92ZSkge1xuICAgICAgICBjYXJ0SXRlbVJlbW92ZS5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgQ2FydC5yZW1vdmVPbmUodGhpcy5kYXRhc2V0LmlkKTtcbiAgICAgICAgICAgIHdpbmRvdy5kaXNwYXRjaEV2ZW50KGNhcnRVcGRhdGVFdmVudCk7XG4gICAgICAgIH0pXG4gICAgfSk7XG59IiwiaW1wb3J0IHtjYXJ0SXRlbVVwZGF0ZUV2ZW50LCBjYXJ0SXRlbVVwZGF0ZUV2ZW50Q29uZmlnLCBjYXJ0TGlzdH0gZnJvbSBcIi4uLy4uL0V2ZW50L0NhcnRJdGVtL2NhcnRJdGVtVXBkYXRlRXZlbnRcIjtcblxuZXhwb3J0IGRlZmF1bHQgKCkgPT4ge1xuICAgIGNhcnRJdGVtVXBkYXRlRXZlbnQub2JzZXJ2ZShjYXJ0TGlzdCwgY2FydEl0ZW1VcGRhdGVFdmVudENvbmZpZyk7XG59IiwiZnVuY3Rpb24gYWRkKGEsIGIpIHtcbiAgICByZXR1cm4gYSArIGI7XG59XG5leHBvcnQge2FkZH07IiwiaW1wb3J0IHtDYXJ0fSBmcm9tIFwiLi4vRG9tYWluL2NhcnRcIjtcblxuZnVuY3Rpb24gYWRkVG9DYXJ0RnJvbUZvcm0oZm9ybSkge1xuICAgIGxldCBjYXJ0SXRlbSA9IHt9O1xuICAgIGZvcihsZXQgaW5wdXQgb2YgZm9ybS5lbnRyaWVzKCkpIHtcbiAgICAgICAgY2FydEl0ZW1baW5wdXRbMF0ucmVwbGFjZSgnXCInLCAnJyldID0gaW5wdXRbMV07XG4gICAgfVxuICAgIENhcnQuYWRkT25lKGNhcnRJdGVtKTtcbn1cbmV4cG9ydCB7YWRkVG9DYXJ0RnJvbUZvcm19OyIsImZ1bmN0aW9uIGFuaW1hdGVDYXJ0SXRlbU51bWJlcnMoaXRlbXMpIHtcbiAgICBjb25zdCBjYXJ0SXRlbXNOdW1iZXIgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImNhcnRJdGVtc051bWJlclwiKTtcbiAgICBjYXJ0SXRlbXNOdW1iZXIudGV4dENvbnRlbnQgPSBpdGVtcztcbiAgICBpZiAodHlwZW9mIHRpbWUgIT09ICd1bmRlZmluZWQnKSB7XG4gICAgICAgIGNsZWFyVGltZW91dCh0aW1lKTtcbiAgICB9XG4gICAgaWYoY2FydEl0ZW1zTnVtYmVyLmNsYXNzTGlzdC5jb250YWlucygndXBkYXRlJykpe1xuICAgICAgICBjYXJ0SXRlbXNOdW1iZXIuY2xhc3NMaXN0LnJlbW92ZSgndXBkYXRlJyk7XG4gICAgICAgIGNhcnRJdGVtc051bWJlci5jbGFzc0xpc3QuYWRkKCd1cGRhdGVRdWFudGl0eScpO1xuICAgICAgICBsZXQgdGltZSA9IHNldFRpbWVvdXQoZnVuY3Rpb24oKXtcbiAgICAgICAgICAgIGNhcnRJdGVtc051bWJlci5jbGFzc0xpc3QucmVtb3ZlKCd1cGRhdGVRdWFudGl0eScpO1xuICAgICAgICAgICAgY2FydEl0ZW1zTnVtYmVyLmNsYXNzTGlzdC5hZGQoJ3VwZGF0ZScpO1xuICAgICAgICB9LCA3MDApO1xuICAgIH0gZWxzZSB7XG4gICAgICAgIGNhcnRJdGVtc051bWJlci5jbGFzc0xpc3QuYWRkKCd1cGRhdGUnKTtcbiAgICB9XG59XG5leHBvcnQge2FuaW1hdGVDYXJ0SXRlbU51bWJlcnN9OyIsIi8vIEZBQ09OXG5mdW5jdGlvbiBmKHN0cmluZ3MsIC4uLmFyZ3MpIHtcbiAgICBsZXQgcmVzdWx0ID0gYGA7XG4gICAgZm9yKGxldCBpID0gMDsgaSA8IGFyZ3MubGVuZ3RoOyBpKyspIHJlc3VsdCArPSBzdHJpbmdzW2ldICsgYXJnc1tpXVxuICAgIHJlc3VsdCArPSBzdHJpbmdzW3N0cmluZ3MubGVuZ3RoIC0gMV1cblxuICAgIGNvbnN0IHRlbXBsYXRlID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChgdGVtcGxhdGVgKTtcbiAgICB0ZW1wbGF0ZS5pbm5lckhUTUwgPSByZXN1bHQ7XG5cbiAgICBjb25zdCBjb250ZW50ID0gdGVtcGxhdGUuY29udGVudDtcblxuICAgIGNvbnRlbnQuY29sbGVjdCA9ICh7YXR0ciA9ICdyZWYnLCBrZWVwQXR0cmlidXRlLCB0byA9IHt9fSA9IHt9KSA9PiB7XG4gICAgICAgIGNvbnN0IHJlZkVsZW1lbnRzID0gY29udGVudC5xdWVyeVNlbGVjdG9yQWxsKGBbJHthdHRyfV1gKTtcbiAgICAgICAgcmV0dXJuIFsuLi5yZWZFbGVtZW50c10ucmVkdWNlKChhY2MsIGVsZW1lbnQpID0+IHtcbiAgICAgICAgICAgIGNvbnN0IHByb3BOYW1lID0gZWxlbWVudC5nZXRBdHRyaWJ1dGUoYXR0cikudHJpbSgpO1xuICAgICAgICAgICAgIWtlZXBBdHRyaWJ1dGUgJiYgKGVsZW1lbnQucmVtb3ZlQXR0cmlidXRlKGF0dHIpKTtcbiAgICAgICAgICAgIGFjY1twcm9wTmFtZV0gPSBhY2NbcHJvcE5hbWVdXG4gICAgICAgICAgICAgICAgPyBBcnJheS5pc0FycmF5KGFjY1twcm9wTmFtZV0pXG4gICAgICAgICAgICAgICAgICAgID8gWy4uLmFjY1twcm9wTmFtZV0sIGVsZW1lbnRdXG4gICAgICAgICAgICAgICAgICAgIDogW2FjY1twcm9wTmFtZV0sIGVsZW1lbnRdXG4gICAgICAgICAgICAgICAgOiBlbGVtZW50O1xuICAgICAgICAgICAgcmV0dXJuIGFjYztcbiAgICAgICAgfSwgdG8pO1xuICAgIH07XG4gICAgcmV0dXJuIGNvbnRlbnQ7XG59XG5leHBvcnQge2Z9OyIsImltcG9ydCB7Zn0gZnJvbSBcIi4vZmFjb25cIjtcblxuZnVuY3Rpb24gZm9ybWF0Q2FydEl0ZW0oY2FydEl0ZW0sIGl0ZW1QcmljZSkge1xuICAgIHJldHVybiBmYFxuICAgICAgICAgICAgPGxpIHJlZj1cIml0ZW1zXCI+XG4gICAgICAgICAgICAgICAgPHNwYW4gY2xhc3M9XCJkLWZsZXhcIj5cbiAgICAgICAgICAgICAgICAgICAgPHNlY3Rpb24+XG4gICAgICAgICAgICAgICAgICAgICAgICA8aW1nIHNyYz1cIiR7Y2FydEl0ZW1bMV1bJ2ltYWdlJ119XCIgYWx0PVwiSW1hZ2UgZCd1biBtZW1lXCI+ICAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgICAgICAgPC9zZWN0aW9uPlxuICAgICAgICAgICAgICAgICAgICA8c2VjdGlvbiBjbGFzcz1cImQtZmxleCBmbGV4LWNvbHVtblwiPlxuICAgICAgICAgICAgICAgICAgICAgICAgPHNwYW4gY2xhc3M9XCJjYXJ0SXRlbS1wcmljZVwiPiR7aXRlbVByaWNlfSAg4oKsPC9zcGFuPlxuICAgICAgICAgICAgICAgICAgICAgICAgPHNwYW4+JHtjYXJ0SXRlbVsxXVsnbmFtZSddfTwvc3Bhbj5cbiAgICAgICAgICAgICAgICAgICAgICAgIDxzcGFuPiR7Y2FydEl0ZW1bMV1bJ2NvbG9yJ119PC9zcGFuPlxuICAgICAgICAgICAgICAgICAgICAgICAgPGZvcm0gYWN0aW9uPVwiXCI+XG4gICAgICAgICAgICAgICAgICAgICAgICA8aW5wdXQgZGF0YS1pZD1cIiR7Y2FydEl0ZW1bMV1bJ2lkJ119XCIgY2xhc3M9XCJjYXJ0SXRlbS1xdWFudGl0eVwiIG5hbWU9XCJxdWFudGl0eVwiIHR5cGU9XCJudW1iZXJcIiBtaW49XCIxXCIgc3RlcD1cIjFcIiB2YWx1ZT0ke2NhcnRJdGVtWzFdWydxdWFudGl0eSddfT5cbiAgICAgICAgICAgICAgICAgICAgICAgIDwvZm9ybT5cbiAgICAgICAgICAgICAgICAgICAgICAgIDxzcGFuIGRhdGEtaWQ9XCIke2NhcnRJdGVtWzFdWydpZCddfVwiIGNsYXNzPVwiY2FydEl0ZW0tcmVtb3ZlXCI+PGkgY2xhc3M9XCJmYXIgZmEtdHJhc2gtYWx0IGZhLTJ4XCI+PC9pPjwvc3Bhbj5cbiAgICAgICAgICAgICAgICAgICAgPC9zZWN0aW9uPlxuICAgICAgICAgICAgICAgIDwvc3Bhbj5cbiAgICAgICAgICAgIDwvbGk+XG4gICAgICAgIGA7XG59XG5leHBvcnQge2Zvcm1hdENhcnRJdGVtfTsiLCJpbXBvcnQge2Zvcm1hdENhcnRJdGVtfSBmcm9tIFwiLi9mb3JtYXRDYXJ0SXRlbVwiO1xuaW1wb3J0IHthbmltYXRlQ2FydEl0ZW1OdW1iZXJzfSBmcm9tIFwiLi9hbmltYXRlQ2FydEl0ZW1OdW1iZXJzXCI7XG5pbXBvcnQge2FkZH0gZnJvbSBcIi4vYWRkXCI7XG5cbmZ1bmN0aW9uIGdlbmVyYXRlTmV3Q2FydChjYXJ0KSB7XG4gICAgbGV0IG5ld0NhcnQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwidWxcIik7XG4gICAgbmV3Q2FydC5zZXRBdHRyaWJ1dGUoJ2lkJywgJ2NhcnQtbGlzdCcpO1xuICAgIGNvbnN0IGNhcnRQcmljZUFycmF5ID0gW107XG4gICAgY29uc3QgaXRlbXNBcnJheSA9IFtdO1xuICAgIE9iamVjdC5lbnRyaWVzKGNhcnQpLmZvckVhY2goZnVuY3Rpb24oY2FydEl0ZW0pIHtcbiAgICAgICAgbGV0IGl0ZW1QcmljZSA9IGNhcnRJdGVtWzFdWydwcmljZSddICogY2FydEl0ZW1bMV1bJ3F1YW50aXR5J107XG4gICAgICAgIGNhcnRQcmljZUFycmF5LnB1c2goTnVtYmVyKGl0ZW1QcmljZSkpO1xuICAgICAgICBpdGVtc0FycmF5LnB1c2goTnVtYmVyKGNhcnRJdGVtWzFdWydxdWFudGl0eSddKSk7XG4gICAgICAgIGNvbnN0IG5vZGUgPSBmb3JtYXRDYXJ0SXRlbShjYXJ0SXRlbSwgaXRlbVByaWNlKTtcbiAgICAgICAgbmV3Q2FydC5hcHBlbmRDaGlsZChub2RlKTtcbiAgICB9KTtcbiAgICBjb25zdCBjYXJ0UHJpY2UgPSBjYXJ0UHJpY2VBcnJheS5yZWR1Y2UoYWRkLCAwKTtcbiAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImNhcnQtcHJpY2VcIikudGV4dENvbnRlbnQgPSBjYXJ0UHJpY2UgKyAn4oKsJztcbiAgICBjb25zdCBpdGVtcyA9IGl0ZW1zQXJyYXkucmVkdWNlKGFkZCwgMCk7XG4gICAgYW5pbWF0ZUNhcnRJdGVtTnVtYmVycyhpdGVtcyk7XG4gICAgcmV0dXJuIG5ld0NhcnQ7XG59XG5leHBvcnQgeyBnZW5lcmF0ZU5ld0NhcnQgfTsiLCJpbXBvcnQge0NhcnR9IGZyb20gXCIuLi9Eb21haW4vY2FydFwiO1xuXG5mdW5jdGlvbiBzZW5kSnNvbkNhcnQoKSB7XG4gICAgY29uc29sZS5sb2coSlNPTi5zdHJpbmdpZnkoeyBjYXJ0SXRlbXM6IENhcnQuZ2V0Q2FydCgpLCBjYXJ0UHJpY2U6IENhcnQuZ2V0Q2FydFByaWNlKCkgfSkpO1xuICAgIHJldHVybiBKU09OLnN0cmluZ2lmeSh7IGNhcnRJdGVtczogQ2FydC5nZXRDYXJ0KCksIGNhcnRQcmljZTogQ2FydC5nZXRDYXJ0UHJpY2UoKSB9KTtcbn1cbmV4cG9ydCB7c2VuZEpzb25DYXJ0fTsiLCJcbmltcG9ydCB7Z2VuZXJhdGVOZXdDYXJ0fSBmcm9tIFwiLi9nZW5lcmF0ZU5ld0NhcnRcIjtcblxuZnVuY3Rpb24gc2hvd0NhcnQoY2FydCkge1xuICAgIGNvbnN0IG5ld0NhcnQgPSBnZW5lcmF0ZU5ld0NhcnQoY2FydCk7XG4gICAgY29uc3QgY3VycmVudENhcnQgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImNhcnQtbGlzdFwiKTtcbiAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImNhcnQtd3JhcHBlclwiKS5yZXBsYWNlQ2hpbGQobmV3Q2FydCwgY3VycmVudENhcnQpO1xufVxuZXhwb3J0IHsgc2hvd0NhcnQgfTsiLCJmdW5jdGlvbiBzbHVnaWZ5KHRleHQsIHNlcGFyYXRvcil7XG4gICAgcmV0dXJuIHRleHQudG9TdHJpbmcoKS50b0xvd2VyQ2FzZSgpXG4gICAgICAgIC5yZXBsYWNlKC9cXHMrL2csIHNlcGFyYXRvcikgICAgICAgICAgIC8vIFJlcGxhY2Ugc3BhY2VzIHdpdGggLVxuICAgICAgICAucmVwbGFjZSgvW15hLXowLTldL2dpLCAnJykgICAgICAgLy8gUmVtb3ZlIGFsbCBub24td29yZCBjaGFyc1xuICAgICAgICAucmVwbGFjZSgvXFwtXFwtKy9nLCBzZXBhcmF0b3IpICAgICAgICAgLy8gUmVwbGFjZSBtdWx0aXBsZSAtIHdpdGggc2luZ2xlIC1cbiAgICAgICAgLnJlcGxhY2UoL14tKy8sICcnKSAgICAgICAgICAgICAvLyBUcmltIC0gZnJvbSBzdGFydCBvZiB0ZXh0XG4gICAgICAgIC5yZXBsYWNlKC8tKyQvLCAnJyk7ICAgICAgICAgICAgLy8gVHJpbSAtIGZyb20gZW5kIG9mIHRleHRcbn1cbmV4cG9ydCB7c2x1Z2lmeX07IiwiaW1wb3J0IHsgQ2FydCB9IGZyb20gXCIuL0RvbWFpbi9jYXJ0XCI7XG5pbXBvcnQgeyBzaG93Q2FydCB9IGZyb20gXCIuL1NlcnZpY2Uvc2hvd0NhcnRcIjtcbmltcG9ydCBjYXJ0Q2xlYXJMaXN0ZW5lciBmcm9tIFwiLi9MaXN0ZW5lci9DYXJ0L2NhcnRDbGVhckxpc3RlbmVyXCI7XG5pbXBvcnQgY2FydENsb3NlTGlzdGVuZXIgZnJvbSBcIi4vTGlzdGVuZXIvQ2FydC9jYXJ0Q2xvc2VMaXN0ZW5lclwiO1xuaW1wb3J0IGNhcnRPcGVuTGlzdGVuZXIgZnJvbSBcIi4vTGlzdGVuZXIvQ2FydC9jYXJ0T3Blbkxpc3RlbmVyXCI7XG5pbXBvcnQgY2FydFVwZGF0ZUxpc3RlbmVyIGZyb20gXCIuL0xpc3RlbmVyL0NhcnQvY2FydFVwZGF0ZUxpc3RlbmVyXCI7XG5pbXBvcnQgY2FydEl0ZW1SZW1vdmVMaXN0ZW5lciBmcm9tIFwiLi9MaXN0ZW5lci9DYXJ0SXRlbS9jYXJ0SXRlbVJlbW92ZUxpc3RlbmVyXCI7XG5pbXBvcnQgY2FydEl0ZW1RdWFudGl0eUxpc3RlbmVyIGZyb20gXCIuL0xpc3RlbmVyL0NhcnRJdGVtL2NhcnRJdGVtUXVhbnRpdHlMaXN0ZW5lclwiO1xuaW1wb3J0IGNhcnRJdGVtVXBkYXRlTGlzdGVuZXIgZnJvbSBcIi4vTGlzdGVuZXIvQ2FydEl0ZW0vY2FydEl0ZW1VcGRhdGVMaXN0ZW5lclwiO1xuaW1wb3J0IGNhckl0ZW1BZGRMaXN0ZW5lciBmcm9tIFwiLi9MaXN0ZW5lci9DYXJ0SXRlbS9jYXJJdGVtQWRkTGlzdGVuZXJcIjtcbmltcG9ydCBjYXJ0U2VuZExpc3RlbmVyIGZyb20gXCIuL0xpc3RlbmVyL0NhcnQvY2FydFNlbmRMaXN0ZW5lclwiO1xuXG5cbmNhcnRJdGVtUXVhbnRpdHlMaXN0ZW5lcigpO1xuY2FySXRlbUFkZExpc3RlbmVyKCk7XG5jYXJ0SXRlbVJlbW92ZUxpc3RlbmVyKCk7XG5jYXJ0SXRlbVVwZGF0ZUxpc3RlbmVyKClcbmNhcnRVcGRhdGVMaXN0ZW5lcigpO1xuY2FydE9wZW5MaXN0ZW5lcigpO1xuY2FydENsZWFyTGlzdGVuZXIoKTtcbmNhcnRDbG9zZUxpc3RlbmVyKCk7XG5jYXJ0U2VuZExpc3RlbmVyKCk7XG5cbnNob3dDYXJ0KENhcnQuZ2V0Q2FydCgpKTtcblxuXG4iXX0=
