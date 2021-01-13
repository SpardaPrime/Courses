/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./src/app/app.js":
/*!************************!*\
  !*** ./src/app/app.js ***!
  \************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => /* export default binding */ __WEBPACK_DEFAULT_EXPORT__
/* harmony export */ });
/* harmony default export */ function __WEBPACK_DEFAULT_EXPORT__() {
  const cartBadget = async () => {
    const elem = document.getElementById("cart-block");
    const data = await fetch("/cart/getcount");
    const count = await data.json();
    console.log(elem);
    if (!count) {
      return;
    }
    if (document.getElementById("cart")) {
      return;
    }
    elem.style.display = "block";
    document.getElementById("cart-block-text").textContent = count;
  };
  const searchPanel = () => {
    try {
      const elem = document.querySelector(".search-item-panel");
      elem.querySelector("form").addEventListener("submit", (e) => {
        const inputValue = elem.querySelector("input").value;
        if (inputValue) return;
        e.preventDefault();
      });
    } catch (e) {}
  };
  searchPanel();

  const intl = (vs) => {
    document.querySelectorAll(vs).forEach((node) => {
      node.textContent = new Intl.NumberFormat("ukl", {
        currency: "uah",
        style: "currency",
      }).format(node.textContent);
    });
  };
  const dateParser = () => {
    document.querySelectorAll(".order-date").forEach((item) => {
      let data = new Date(item.textContent);
      let options = {
        year: "2-digit",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
      };
      item.textContent = new Intl.DateTimeFormat("ukl", options).format(data);
    });
  };
  dateParser();
  intl(".price");
  intl(".span-total");
  intl(".p-span-price");
  const update = ({ cart }, scrc) => {
    let total = 0;
    const html = cart.items
      .map(({ courseId, count }) => {
        console.log(courseId);
        const { title, price, img, _id } = courseId;
        total += count * price;
        return `
              <li class="collection-item cart">
              <div><h5>${title}</h5></div>
              <div><h5 class="price">${price}</h5></div>
              <div><h5>${count}</h5></div>
              <div><img class="cart-img" src="${img}" alt="${title}"></div>
              <div>
              <button class="add" data-id="${_id}" data-csrf="${scrc}"><i class="material-icons">add</i></button>
              <button class="del" data-id="${_id}"  data-csrf="${scrc}"><i class="material-icons">remove</i></button>
              </div>
              </li>
              `;
      })
      .join("");
    $cart.querySelector(".main").innerHTML = html;

    $cart.querySelector(".total").textContent = total;
    intl(".price");
    intl(".span-total");
    intl(".p-span-price");
    if (document.getElementById("nav-cart")) {
      cartBadget();
    }
  };

  const $cart = document.querySelector("#cart");
  if ($cart) {
    $cart.addEventListener("click", (e) => {
      let targ = e.target.closest("button.del");
      if (!targ) return;
      let id = targ.dataset.id;
      const csrf = targ.dataset.csrf;

      fetch("/cart/remove/" + id, {
        method: "delete",
        headers: {
          "X-XSRF-TOKEN": csrf,
        },
      })
        .then((res) => res.json())
        .then((cart) => {
          if (cart.cart.items.length) {
            update(cart, csrf);
            intl();
          } else {
            $cart.innerHTML = "<h2>No course</h2>";
          }
        });
    });
    $cart.addEventListener("click", (e) => {
      let targ = e.target.closest("button.add");
      if (!targ) return;

      let id = targ.dataset.id;
      const csrf = targ.dataset.csrf;

      fetch("/cart/addone/" + id, {
        method: "PUT",
        headers: {
          "X-XSRF-TOKEN": csrf,
        },
      })
        .then((res) => res.json())
        .then((res) => {
          update(res, csrf);
          intl();
        });
    });
  }

  const password = "69eHnmmp1CnxGqYh";
  const url = new URL(
    "mongodb+srv://Roman:<69eHnmmp1CnxGqYh>@cluster0.zjws7.mongodb.net/<dbname>?retryWrites=true&w=majority"
  );

  M.Tabs.init(document.querySelector(".tabs"));

  if (document.getElementById("nav-cart")) {
    cartBadget();
  }

  document.addEventListener("click", (e) => {
    try {
      let targ = e.target.closest(".account");
      if (!targ) {
        if (document.querySelector(".account-div")) {
          document
            .querySelector(".account-div")
            .classList.remove("account-div-open");
          document.querySelector(".shadow-page").style.display = "none";
          document.querySelector(".account").classList.remove("zindex-102");
        }

        return;
      }
      targ.classList.add("zindex-102");
      document.querySelector(".account-div").classList.add("account-div-open");
      document.querySelector(".shadow-page").style.display = "block";
    } catch (e) {}
  });

  document.addEventListener("click", (e) => {
    let targ = e.target.closest(".catalog-navbar-li");
    let elem = document.querySelector(".catalog-navbar");
    let shadowPage = document.querySelector(".shadow-page");
    if (!targ) {
      if (elem.classList.contains("catalog-navbar-open")) {
        elem.classList.remove("catalog-navbar-open");
        document
          .querySelector(".catalog-navbar-li")
          .classList.remove("zindex-102");
        shadowPage.style.display = "none";
      }
      return;
    }
    elem.classList.add("catalog-navbar-open");
    targ.classList.add("zindex-102");
    shadowPage.style.display = "block";
  });

  if (document.querySelector(".close-course-block")) {
    document
      .querySelector(".close-course-block")
      .addEventListener("click", function (e) {
        window.close();
      });
  }
}


/***/ }),

/***/ "./src/carousel/carousel.js":
/*!**********************************!*\
  !*** ./src/carousel/carousel.js ***!
  \**********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => __WEBPACK_DEFAULT_EXPORT__
/* harmony export */ });
const carousel = async () => {
  if (!document.querySelector(".index-container-carts")) return;

  const coursesCount = async () => {
    const res = await fetch("/course");
    return await res.json();
  };
  const corseCount = await coursesCount();
  const block = document.querySelector(".index-container-carts");
  const countBlock = document.querySelector(".index-count-page");
  let blocHeight = block.scrollHeight;
  let step = blocHeight / corseCount.length;
  let index = 1;
  const maxIdnex = corseCount.length;
  countBlock.textContent = `${index}/${maxIdnex}`;

  const elements = document
    .querySelector(".index-container-carts")
    .querySelectorAll(".index-cart");
  elements.forEach((item) => item.classList.add("opacity0"));
  elements[0].classList.add("opacity1");

  let timer = setTimeout(function t() {
    dowm();
    timer = setTimeout(t, 3000);
  }, 3000);

  document
    .querySelector("#carousel-pause > i")
    .addEventListener("click", (e) => {
      clearTimeout(timer);
      document.querySelector("#carousel-pause").style.display = "none";
      document.querySelector("#carousel-play").style.display = "block";
    });

  document
    .querySelector("#carousel-play > i")
    .addEventListener("click", (e) => {
      timer = setTimeout(function t() {
        dowm();
        timer = setTimeout(t, 3000);
      }, 3000);
      document.querySelector("#carousel-play").style.display = "none";
      document.querySelector("#carousel-pause").style.display = "block";
    });

  const resize = () => {
    blocHeight = block.scrollHeight;
    step = Math.floor(blocHeight / corseCount.length);
    elements.forEach((item) => (item.style.height = step + "px"));
    elements[index - 1].classList.add("opacity1");

    block.scrollTo(0, (index - 1) * step);
    countBlock.textContent = `${index}/${maxIdnex}`;
  };

  window.addEventListener("resize", resize);

  const style = (index) => {
    elements.forEach((item) => item.classList.remove("opacity1"));
    elements[index - 1].classList.add("opacity1");
  };

  const up = () => {
    if (index === 1) {
      index = maxIdnex;
      countBlock.textContent = `${index}/${maxIdnex}`;
      style(index);
      block.scrollTo(0, step * index);
      return;
    }

    index--;
    countBlock.textContent = `${index}/${maxIdnex}`;
    style(index);
    block.scrollBy(0, -step);
  };
  const dowm = () => {
    if (index === maxIdnex) {
      index = 1;
      countBlock.textContent = `${index}/${maxIdnex}`;
      style(index);
      block.scrollTo(0, 0);
      return;
    }
    index++;
    countBlock.textContent = `${index}/${maxIdnex}`;
    style(index);
    block.scrollBy({ left: 0, top: step });
  };

  document.getElementById("carousel-btn-up").addEventListener("click", up);

  document.getElementById("carousel-btn-down").addEventListener("click", dowm);
};

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (carousel);


/***/ }),

/***/ "./src/carousel/slider.js":
/*!********************************!*\
  !*** ./src/carousel/slider.js ***!
  \********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => __WEBPACK_DEFAULT_EXPORT__
/* harmony export */ });
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (async ({ get, blockL, left, right, row }) => {
  if (!document.querySelector(".section-dev")) return;
  const res = await fetch(get);
  const lengthCourse = await res.json();

  const block = document.getElementById(blockL);
  const cards = block.querySelectorAll(".section-dev-block");
  const bloing = block.querySelectorAll(".section-dev-img");
  let btnLeft = document.getElementById(left);
  let btnRight = document.getElementById(right);

  let size = Math.round(block.offsetWidth / row);

  cards.forEach((item) => (item.style.width = size + "px"));
  bloing.forEach((item) => (item.style.width = size + "px"));

  let base = 0;
  let step = cards[0].offsetWidth;
  let end = size * lengthCourse - row * step;

  const resize = () => {
    size = Math.round(block.offsetWidth / row);
    cards.forEach((item) => (item.style.width = size + "px"));
    bloing.forEach((item) => (item.style.width = size + "px"));
    base = 0;
    step = cards[0].offsetWidth;
    end = step * lengthCourse - row * step;
    block.scrollTo(0, 0);
  };
  window.addEventListener("resize", (e) => {
    resize();
    if (base == 0) {
      btnLeft.style.display = "none";
    }

    if (size * lengthCourse == size * row) {
      btnRight.style.display = "none";
    } else {
      btnRight.style.display = "block";
    }
  });

  if (base == 0) {
    btnLeft.style.display = "none";
  }

  if (size * lengthCourse == size * row) {
    btnRight.style.display = "none";
  }

  btnLeft.addEventListener("click", () => {
    base -= step;
    if (base <= 0) {
      block.scrollTo(base, 0);
      btnLeft.style.display = "none";
    } else {
      block.scrollTo(base, 0);
      btnRight.style.display = "block";
    }
  });

  btnRight.addEventListener("click", () => {
    base += step;

    if (base >= end) {
      block.scrollTo(base, 0);
      btnRight.style.display = "none";
    } else {
      block.scrollTo(base, 0);
      btnLeft.style.display = "block";
    }
  });
});


/***/ }),

/***/ "./src/index.js":
/*!**********************!*\
  !*** ./src/index.js ***!
  \**********************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _app_app__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./app/app */ "./src/app/app.js");
/* harmony import */ var _carousel_carousel__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./carousel/carousel */ "./src/carousel/carousel.js");
/* harmony import */ var _carousel_slider__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./carousel/slider */ "./src/carousel/slider.js");




let blockDev = {
  get: "/sectionDev",
  blockL: "section-dev-id",
  left: "dev-left-btn",
  right: "dev-right-btn",
  row: 3,
};

let blockBusiness = {
  get: "/sectionBus",
  blockL: "section-Business",
  left: "busi-left-btn",
  right: "busi-right-btn",
  row: 3,
};
let blockDesign = {
  get: "/sectionDesign",
  blockL: "section-design",
  left: "design-left-btn",
  right: "design-right-btn",
  row: 3,
};
let blockMusic = {
  get: "/sectionMusic",
  blockL: "section-music",
  left: "music-left-btn",
  right: "music-right-btn",
  row: 3,
};

let blockLatest = {
  get: "/latestAded",
  blockL: "section-latest",
  left: "latest-left-btn",
  right: "latest-right-btn",
  row: 3,
};
if (document.getElementById("footer")) {
  if (document.getElementById("my-account")) {
    document.getElementById("footer").classList.add("down");
  }
  document.documentElement.clientHeight ===
    document.documentElement.scrollHeight &&
    document.getElementById("footer").classList.add("down");
}

if (document.getElementById("catalog-noauth")) {
  document.addEventListener("click", (e) => {
    let targ = e.target.closest("#catalog-noauth");
    if (!targ) {
      document.getElementById("catalog-noauth-div").style.display = "none";
      return;
    }
    document.getElementById("catalog-noauth-div").style.display = "block";
  });

  document
    .getElementById("btn-navbar-mobile")
    .addEventListener("click", function () {
      document
        .getElementById("navbar-mobile")
        .classList.toggle("navbar-mobile-open");
    });
}

(0,_app_app__WEBPACK_IMPORTED_MODULE_0__.default)();
(0,_carousel_carousel__WEBPACK_IMPORTED_MODULE_1__.default)();
(0,_carousel_slider__WEBPACK_IMPORTED_MODULE_2__.default)(blockDev);
(0,_carousel_slider__WEBPACK_IMPORTED_MODULE_2__.default)(blockBusiness);
(0,_carousel_slider__WEBPACK_IMPORTED_MODULE_2__.default)(blockDesign);
(0,_carousel_slider__WEBPACK_IMPORTED_MODULE_2__.default)(blockMusic);
(0,_carousel_slider__WEBPACK_IMPORTED_MODULE_2__.default)(blockLatest);


/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		if(__webpack_module_cache__[moduleId]) {
/******/ 			return __webpack_module_cache__[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => Object.prototype.hasOwnProperty.call(obj, prop)
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
/******/ 	// startup
/******/ 	// Load entry module
/******/ 	__webpack_require__("./src/index.js");
/******/ 	// This entry module used 'exports' so it can't be inlined
/******/ })()
;
//# sourceMappingURL=main.js.map