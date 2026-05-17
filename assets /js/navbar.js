import {

auth,
db

} from "/assets/js/firebase.js";

import {

onAuthStateChanged

} from "https://www.gstatic.com/firebasejs/12.13.0/firebase-auth.js";

import {

collection,
onSnapshot

} from "https://www.gstatic.com/firebasejs/12.13.0/firebase-firestore.js";

// ELEMENTS
const favoritesCount =
document.getElementById(
"favoritesCount"
);

const cartCount =
document.getElementById(
"cartCount"
);

// ============================
// UPDATE FAVORITES
// ============================

function updateFavoritesCount(count) {

// EXISTS
if (!favoritesCount) return;

// UPDATE
favoritesCount.textContent =
count;

// HIDE IF ZERO
favoritesCount.classList.toggle(
"hidden",
count === 0
);

}

// ============================
// UPDATE CART
// ============================

function updateCartCount(count) {

// EXISTS
if (!cartCount) return;

// UPDATE
cartCount.textContent =
count;

// HIDE IF ZERO
cartCount.classList.toggle(
"hidden",
count === 0
);

}

// ============================
// AUTH
// ============================

onAuthStateChanged(
auth,
(user) => {

// NOT LOGGED IN
if (!user) {

  updateFavoritesCount(0);

  updateCartCount(0);

  return;

}

// FAVORITES REF
const favoritesRef =
  collection(
    db,
    "users",
    user.uid,
    "favorites"
  );

// CART REF
const cartRef =
  collection(
    db,
    "users",
    user.uid,
    "cart"
  );

// FAVORITES LISTENER
onSnapshot(
  favoritesRef,
  (snapshot) => {

    updateFavoritesCount(
      snapshot.size
    );

  }
);

// CART LISTENER
onSnapshot(
  cartRef,
  (snapshot) => {

    updateCartCount(
      snapshot.size
    );

  }
);

}
);
