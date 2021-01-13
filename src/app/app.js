export default function () {
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
