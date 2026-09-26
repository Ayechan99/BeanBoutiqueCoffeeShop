/* =========================================
   SHARED BASE FUNCTIONS
========================================= */

// Mobile menu, newsletter and cart counter

document.addEventListener("DOMContentLoaded", function () {
  /* Mobile menu */
  var b = document.getElementById("menuBtn");
  var n = document.getElementById("nav");

  if (b && n) {
    b.onclick = function () {
      n.classList.toggle("open");
    };
  }

  /* Update cart counter */
  updateCount();

  /* Footer newsletter */
  var f = document.getElementById("footerForm");

  if (f) {
    f.onsubmit = function (e) {
      e.preventDefault();

      Swal.fire({
        icon: "success",
        title: "Welcome to BeanBoutique!",
        text: "Thanks! You joined our coffee notes.",
        confirmButtonText: "Lovely!",
        confirmButtonColor: "#472924",
        background: "#fffdf9",
        color: "#806654",
      });

      f.reset();
    };
  }
});

/* CART FUNCTIONS */

function getCart() {
  return JSON.parse(localStorage.getItem("beanCart")) || [];
}

function saveCart(c) {
  localStorage.setItem("beanCart", JSON.stringify(c));

  updateCount();
}

function updateCount() {
  var x = document.getElementById("cartCount");

  if (!x) return;

  var c = getCart();
  var n = 0;

  c.forEach(function (i) {
    n += i.quantity;
  });

  x.textContent = n;
}

/* Add coffee or subscription to cart */

function addToCart(name, price) {
  var c = getCart();

  var old = c.find(function (i) {
    return i.name === name;
  });

  if (old) {
    old.quantity++;
  } else {
    c.push({
      name: name,
      price: price,
      quantity: 1,
    });
  }

  saveCart(c);

  /* SweetAlert notification */

  Swal.fire({
    icon: "success",
    title: "Added to cart!",
    text: name + " has been added to your basket.",
    confirmButtonText: "Continue Shopping",
    confirmButtonColor: "#472924",
    background: "#fffdf9",
    color: "#806654",
  });
}

/*HOME PAGE */

var slide = 0;

function showSlide(n) {
  var s = document.querySelectorAll(".slide");

  if (!s.length) return;

  if (n >= s.length) {
    slide = 0;
  }

  if (n < 0) {
    slide = s.length - 1;
  }

  s.forEach(function (x) {
    x.classList.remove("active");
  });

  s[slide].classList.add("active");
}

document.addEventListener("DOMContentLoaded", function () {
  /* Home slider */

  var nextBtn = document.getElementById("next");
  var prevBtn = document.getElementById("prev");

  if (nextBtn && prevBtn) {
    showSlide(slide);

    nextBtn.onclick = function () {
      slide++;
      showSlide(slide);
    };

    prevBtn.onclick = function () {
      slide--;
      showSlide(slide);
    };

    setInterval(function () {
      slide++;
      showSlide(slide);
    }, 5000);
  }

  /* Welcome discount popup */

  var m = document.getElementById("modal");
  var close = document.getElementById("close");
  var form = document.getElementById("discountForm");

  /* Show popup if user has not registered */

  if (m && !localStorage.getItem("registered")) {
    window.addEventListener("scroll", function once() {
      if (window.scrollY > 150) {
        m.classList.add("show");

        window.removeEventListener("scroll", once);
      }
    });
  }

  /* Close popup */

  if (close) {
    close.onclick = function () {
      m.classList.remove("show");
    };
  }

  /* Registration / discount form */

  if (form) {
    form.onsubmit = function (e) {
      e.preventDefault();

      var discountMsg = document.getElementById("discountMsg");

      if (discountMsg) {
        discountMsg.textContent =
          "Thanks for registering! Your code is BEAN39.";
      }

      localStorage.setItem("registered", "1");

      Swal.fire({
        icon: "success",
        title: "You're all set!",
        text: "Your 50% first-order discount code is BEAN39.",
        confirmButtonText: "Start Shopping",
        confirmButtonColor: "#472924",
        background: "#fffdf9",
        color: "#806654",
      });
    };
  }

  /* Home page search */

  var q = document.getElementById("homeSearch");

  if (q) {
    q.oninput = function () {
      document.querySelectorAll("[data-search]").forEach(function (x) {
        x.classList.toggle(
          "hide",
          q.value &&
            !x.textContent.toLowerCase().includes(q.value.toLowerCase()),
        );
      });
    };
  }
});

/* COFFEE PAGE*/

document.addEventListener("DOMContentLoaded", function () {
  var q = document.getElementById("coffeeSearch");

  var p = document.querySelectorAll(".product");

  var b = document.querySelectorAll(".filter button");

  if (q && p.length) {
    function filter() {
      var t = q.value.toLowerCase();

      var activeFilter = document.querySelector(".filter .active");

      var a = activeFilter ? activeFilter.dataset.cat : "all";

      p.forEach(function (x) {
        x.classList.toggle(
          "hide",

          !(
            x.textContent.toLowerCase().includes(t) &&
            (a === "all" || x.dataset.cat === a)
          ),
        );
      });
    }

    q.oninput = filter;

    b.forEach(function (x) {
      x.onclick = function () {
        b.forEach(function (y) {
          y.classList.remove("active");
        });

        x.classList.add("active");

        filter();
      };
    });
  }
});

/* EQUIPMENT PAGE */

document.addEventListener("DOMContentLoaded", function () {
  var q = document.getElementById("equipmentSearch");

  if (q) {
    q.oninput = function () {
      document.querySelectorAll(".equipment").forEach(function (x) {
        x.classList.toggle(
          "hide",

          !x.textContent.toLowerCase().includes(q.value.toLowerCase()),
        );
      });
    };
  }
});

/* EVENTS PAGE*/

document.addEventListener("DOMContentLoaded", function () {
  var f = document.getElementById("eventForm");

  if (f) {
    f.onsubmit = function (e) {
      e.preventDefault();

      var first = document.getElementById("first").value;

      Swal.fire({
        icon: "success",
        title: "Registration saved!",
        text:
          "Thank you, " +
          first +
          "! We look forward to seeing you at the event.",
        confirmButtonText: "Great!",
        confirmButtonColor: "#472924",
        background: "#fffdf9",
        color: "#806654",
      });

      f.reset();
    };
  }
});

/*OFFERS PAGE*/

document.addEventListener("DOMContentLoaded", function () {
  /* FAQ */

  document.querySelectorAll(".question").forEach(function (q) {
    q.onclick = function () {
      q.parentElement.classList.toggle("open");
    };
  });

  /* Subscription plans */

  document.querySelectorAll(".planBtn").forEach(function (b) {
    b.onclick = function () {
      var name = b.dataset.plan;

      var price = parseFloat(b.dataset.price);

      /* Add subscription to existing cart */

      addToCart(name, price);
    };
  });
});

/* CART PAGE */

var discount = 0;

document.addEventListener("DOMContentLoaded", function () {
  var itemsBox = document.getElementById("items");

  if (itemsBox) {
    render();

    var promoBtn = document.getElementById("promo");

    var checkoutBtn = document.getElementById("checkout");

    if (promoBtn) {
      promoBtn.onclick = promo;
    }

    if (checkoutBtn) {
      checkoutBtn.onclick = checkout;
    }
  }
});

/* RENDER CART */

function render() {
  var c = getCart();

  var box = document.getElementById("items");

  var sub = 0;

  if (!box) return;

  box.innerHTML = "";

  /* Empty cart */

  if (!c.length) {
    box.innerHTML =
      '<div class="box content">' +
      "<h2>Your basket is empty</h2>" +
      '<a class="button" href="coffee.html">' +
      "Browse coffee" +
      "</a>" +
      "</div>";

    document.getElementById("sub").textContent = "$0.00";

    document.getElementById("disc").textContent = "-$0.00";

    document.getElementById("total").textContent = "$0.00";

    return;
  }

  /* Display cart items */

  c.forEach(function (i, k) {
    sub += i.price * i.quantity;

    box.innerHTML +=
      '<div class="cart-row">' +
      "<div>" +
      "<b>" +
      i.name +
      "</b>" +
      "<br>$" +
      i.price.toFixed(2) +
      "</div>" +
      '<div class="qty">' +
      '<button onclick="change(' +
      k +
      ',-1)">−</button>' +
      i.quantity +
      '<button onclick="change(' +
      k +
      ',1)">+</button>' +
      "</div>" +
      '<button class="remove" ' +
      'onclick="removeItem(' +
      k +
      ')">' +
      "Remove" +
      "</button>" +
      "</div>";
  });

  var d = sub * discount;

  document.getElementById("sub").textContent = "$" + sub.toFixed(2);

  document.getElementById("disc").textContent = "-$" + d.toFixed(2);

  document.getElementById("total").textContent = "$" + (sub - d).toFixed(2);
}

/* CHANGE QUANTITY */

function change(k, n) {
  var c = getCart();

  c[k].quantity += n;

  if (c[k].quantity < 1) {
    c.splice(k, 1);
  }

  saveCart(c);

  render();
}

/* REMOVE ITEM */

function removeItem(k) {
  var c = getCart();

  var removedItem = c[k].name;

  Swal.fire({
    title: "Remove item?",
    text: removedItem + " will be removed from your basket.",
    icon: "warning",

    showCancelButton: true,

    confirmButtonText: "Yes, remove it",
    cancelButtonText: "Keep it",

    confirmButtonColor: "#472924",
    cancelButtonColor: "#91664a",

    background: "#fffdf9",
    color: "#806654",
  }).then(function (result) {
    if (result.isConfirmed) {
      c.splice(k, 1);

      saveCart(c);

      render();

      Swal.fire({
        icon: "success",

        title: "Removed",
        text: removedItem + " has been removed from your basket.",

        confirmButtonText: "Okay",
        confirmButtonColor: "#472924",

        background: "#fffdf9",
        color: "#806654",
      });
    }
  });
}

/* PROMO CODE */

function promo() {
  var promoCode = document.getElementById("promoCode");

  if (!promoCode) return;

  var code = promoCode.value.toUpperCase();

  discount = code === "BEAN39" ? 0.5 : 0;

  if (discount) {
    document.getElementById("promoMsg").textContent =
      "BEAN39 applied: 50% off.";

    Swal.fire({
      icon: "success",

      title: "Promo applied!",

      text: "BEAN39 gives you 50% off your first order.",

      confirmButtonText: "Great!",

      confirmButtonColor: "#472924",

      background: "#fffdf9",
      color: "#806654",
    });
  } else {
    document.getElementById("promoMsg").textContent =
      "Enter BEAN39 for the first-order discount.";

    Swal.fire({
      icon: "error",

      title: "Invalid promo code",

      text: "Please enter BEAN39 for the first-order discount.",

      confirmButtonText: "Try Again",

      confirmButtonColor: "#472924",

      background: "#fffdf9",
      color: "#806654",
    });
  }

  render();
}

/* CHECKOUT*/

function checkout() {
  var c = getCart();

  /* Empty cart */

  if (!c.length) {
    Swal.fire({
      icon: "warning",

      title: "Your basket is empty",

      text: "Add some coffee or a subscription before checking out.",

      confirmButtonText: "Browse Coffee",

      confirmButtonColor: "#472924",

      background: "#fffdf9",
      color: "#806654",
    });

    return;
  }

  /* Get current total */

  var total = document.getElementById("total").textContent;

  /* Successful checkout */

  Swal.fire({
    icon: "success",

    title: "Order placed!",

    text: "Thank you for your order. Your total was " + total + ".",

    confirmButtonText: "Continue",

    confirmButtonColor: "#472924",

    background: "#fffdf9",
    color: "#806654",
  }).then(function () {
    /* Clear cart */

    localStorage.removeItem("beanCart");

    /* Reset discount */

    discount = 0;

    /* Reset promo */

    var promoCode = document.getElementById("promoCode");

    if (promoCode) {
      promoCode.value = "";
    }

    var promoMsg = document.getElementById("promoMsg");

    if (promoMsg) {
      promoMsg.textContent = "";
    }

    /* Update cart counter */

    updateCount();

    /* Re-render cart */

    render();
  });
}
