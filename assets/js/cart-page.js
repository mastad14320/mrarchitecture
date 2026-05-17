import {
  auth,
  db
} from "./firebase.js";

import {

  collection,

  getDocs,

  doc,

  deleteDoc,

  updateDoc

} from "https://www.gstatic.com/firebasejs/12.13.0/firebase-firestore.js";

import {

  onAuthStateChanged

} from "https://www.gstatic.com/firebasejs/12.13.0/firebase-auth.js";


// CONTAINERS
const cartItems =
  document.getElementById("cartItems");

const cartTotal =
  document.getElementById("cartTotal");


// ============================
// FORMAT PRICE
// ============================

function formatPrice(price) {

  return new Intl.NumberFormat("en-UG", {

    style: "currency",

    currency: "UGX",

    maximumFractionDigits: 0

  }).format(price);

}


// ============================
// LOAD CART
// ============================

async function loadCart(user) {

  try {

    // SNAPSHOT
    const cartSnapshot =
      await getDocs(
        collection(
          db,
          "users",
          user.uid,
          "cart"
        )
      );

    // EMPTY
    if (cartSnapshot.empty) {

      cartItems.innerHTML = `

        <div
          class="bg-white rounded-[28px] p-10 text-center shadow-sm"
        >

          <h2
            class="text-2xl font-bold"
          >
            Your Cart Is Empty
          </h2>

          <p
            class="mt-3 text-gray-500 text-sm"
          >
            Add plans to your cart to see them here.
          </p>

          <a
            href="plans.html"
            class="inline-flex mt-6 bg-sky-500 hover:bg-sky-600 text-white px-6 h-11 rounded-2xl items-center transition"
          >
            Browse Plans
          </a>

        </div>

      `;

      cartTotal.innerHTML =
        formatPrice(0);

      return;

    }

    // CLEAR
    cartItems.innerHTML = "";

    // TOTAL
    let total = 0;

    // LOOP
    cartSnapshot.forEach((docSnap) => {

      // DATA
      const item =
        docSnap.data();

      // SUBTOTAL
      const subtotal =
        item.price * item.quantity;

      // ADD TOTAL
      total += subtotal;

      // CARD
      const card =
        document.createElement("div");

      card.className =
        "bg-white rounded-[28px] p-4 md:p-5 shadow-sm";

      card.innerHTML = `

        <div
          class="flex gap-4"
        >

          <!-- IMAGE -->
          <img
            src="${item.image}"
            class="w-28 h-28 md:w-36 md:h-36 object-cover rounded-2xl"
          >

          <!-- CONTENT -->
          <div class="flex-1">

            <!-- NAME -->
            <h2
              class="font-bold text-sm md:text-xl"
            >
              ${item.name}
            </h2>

            <!-- DETAILS -->
            <div
              class="mt-3 flex flex-wrap gap-3 text-gray-500 text-[11px] md:text-sm"
            >

              <span>🛏 ${item.bedrooms}</span>

              <span>🛁 ${item.bathrooms}</span>

              <span>📐 ${item.area} sqm</span>

            </div>

            <!-- PRICE -->
            <div
              class="mt-4 font-bold text-sky-600 text-sm md:text-xl"
            >
              ${formatPrice(item.price)}
            </div>

            <!-- BOTTOM -->
            <div
              class="mt-4 flex items-center justify-between gap-4"
            >

              <!-- QUANTITY -->
              <div
                class="flex items-center border border-sky-100 rounded-2xl overflow-hidden"
              >

                <!-- MINUS -->
                <button
                  data-id="${item.planId}"
                  data-quantity="${item.quantity}"
                  class="decreaseQty w-10 h-10 hover:bg-sky-50 transition"
                >
                  -
                </button>

                <!-- VALUE -->
                <div
                  class="w-10 text-center text-sm"
                >
                  ${item.quantity}
                </div>

                <!-- PLUS -->
                <button
                  data-id="${item.planId}"
                  data-quantity="${item.quantity}"
                  class="increaseQty w-10 h-10 hover:bg-sky-50 transition"
                >
                  +
                </button>

              </div>

              <!-- REMOVE -->
              <button
                data-id="${item.planId}"
                class="removeItem text-red-500 hover:text-red-600 text-sm"
              >
                Remove
              </button>

            </div>

          </div>

        </div>

      `;

      // APPEND
      cartItems.appendChild(card);

    });

    // TOTAL
    cartTotal.innerHTML =
      formatPrice(total);

    // EVENTS
    initializeCartEvents(user);

  } catch (error) {

    console.log(error);

  }

}


// ============================
// EVENTS
// ============================

function initializeCartEvents(user) {

  // REMOVE
  const removeBtns =
    document.querySelectorAll(".removeItem");

  removeBtns.forEach((button) => {

    button.addEventListener("click", async () => {

      const planId =
        button.dataset.id;

      try {

        await deleteDoc(
          doc(
            db,
            "users",
            user.uid,
            "cart",
            planId
          )
        );

        loadCart(user);

      } catch (error) {

        console.log(error);

      }

    });

  });

  // INCREASE
  const increaseBtns =
    document.querySelectorAll(".increaseQty");

  increaseBtns.forEach((button) => {

    button.addEventListener("click", async () => {

      const planId =
        button.dataset.id;

      const quantity =
        Number(button.dataset.quantity);

      try {

        await updateDoc(
          doc(
            db,
            "users",
            user.uid,
            "cart",
            planId
          ),
          {
            quantity: quantity + 1
          }
        );

        loadCart(user);

      } catch (error) {

        console.log(error);

      }

    });

  });

  // DECREASE
  const decreaseBtns =
    document.querySelectorAll(".decreaseQty");

  decreaseBtns.forEach((button) => {

    button.addEventListener("click", async () => {

      const planId =
        button.dataset.id;

      const quantity =
        Number(button.dataset.quantity);

      // MIN LIMIT
      if (quantity <= 1) return;

      try {

        await updateDoc(
          doc(
            db,
            "users",
            user.uid,
            "cart",
            planId
          ),
          {
            quantity: quantity - 1
          }
        );

        loadCart(user);

      } catch (error) {

        console.log(error);

      }

    });

  });

}


// ============================
// AUTH
// ============================

onAuthStateChanged(auth, (user) => {

  if (!user) {

    window.location.href =
      "login.html";

    return;

  }

  loadCart(user);

});
