import {
  auth,
  db
} from "/assets/js/firebase.js";

import {

  collection,

  query,

  where,

  getDocs

} from "https://www.gstatic.com/firebasejs/12.13.0/firebase-firestore.js";

import {

  onAuthStateChanged

} from "https://www.gstatic.com/firebasejs/12.13.0/firebase-auth.js";

// CONTAINER
const ordersContainer =
  document.getElementById("ordersContainer");


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
// STATUS COLORS
// ============================

function getStatusClass(status) {

  switch (status) {

    case "pending":
      return "bg-yellow-100 text-yellow-700";

    case "paid":
      return "bg-sky-100 text-sky-700";

    case "completed":
      return "bg-green-100 text-green-700";

    case "failed":
      return "bg-red-100 text-red-700";

    default:
      return "bg-gray-100 text-gray-700";

  }

}


// ============================
// LOAD ORDERS
// ============================

async function loadOrders(user) {

  try {

    // QUERY
    const ordersQuery =
      query(
    
        collection(db, "orders"),
    
        where("userId", "==", user.uid)
    
      );

    // SNAPSHOT
    const ordersSnapshot =
      await getDocs(ordersQuery);

    // EMPTY
    if (ordersSnapshot.empty) {

      ordersContainer.innerHTML = `

        <div
          class="bg-white rounded-[28px] p-10 text-center shadow-sm"
        >

          <h2
            class="text-2xl font-bold"
          >
            No Orders Yet
          </h2>

          <p
            class="mt-3 text-gray-500 text-sm"
          >
            Your orders will appear here.
          </p>

          <a
            href="plans.html"
            class="inline-flex mt-6 bg-sky-500 hover:bg-sky-600 text-white px-6 h-11 rounded-2xl items-center transition"
          >
            Browse Plans
          </a>

        </div>

      `;

      return;

    }

    // CLEAR
    ordersContainer.innerHTML = "";

    // LOOP
    ordersSnapshot.forEach((docSnap) => {

      // DATA
      const order =
        docSnap.data();

      // ITEMS
      const items =
        order.items.map((item) => {

          return `

            <div
              class="flex items-center gap-3"
            >

              <img
                src="${item.image}"
                class="w-14 h-14 rounded-2xl object-cover"
              >

              <div class="flex-1">

                <h3
                  class="font-medium text-sm"
                >
                  ${item.name}
                </h3>

                <p
                  class="text-[11px] text-gray-500"
                >
                  Qty: ${item.quantity}
                </p>

              </div>

            </div>
            ${
              order.status === "completed"
              ? `
            
                <a
                  href="${item.downloadUrl}"
                  target="_blank"
                  class="mt-3 inline-flex items-center justify-center h-10 px-5 rounded-xl bg-sky-500 hover:bg-sky-600 text-white text-sm transition"
                >
                  Download Plan
                </a>
            
              `
              : `
            
                <div
                  class="mt-3 inline-flex items-center justify-center h-10 px-5 rounded-xl bg-gray-200 text-gray-500 text-sm"
                >
                  Awaiting Approval
                </div>
            
              `
            }
          `;

        }).join("");

      // CARD
      const card =
        document.createElement("div");

      card.className =
        "bg-white rounded-[28px] p-5 md:p-6 shadow-sm";

      card.innerHTML = `

        <!-- TOP -->
        <div
          class="flex flex-wrap items-center justify-between gap-4"
        >

          <!-- LEFT -->
          <div>

            <h2
              class="font-bold text-lg"
            >
              Order
            </h2>

            <p
              class="mt-1 text-sm text-gray-500"
            >
              ${order.customerPhone}
            </p>

          </div>

          <!-- STATUS -->
          <div
            class="px-4 py-2 rounded-full text-sm font-medium ${getStatusClass(order.status)}"
          >
            ${order.status}
          </div>

        </div>

        <!-- ITEMS -->
        <div
          class="mt-6 space-y-4"
        >
          ${items}
        </div>

        <!-- BOTTOM -->
        <div
          class="mt-6 pt-6 border-t border-sky-100 flex items-center justify-between"
        >

          <div>

            <p
              class="text-sm text-gray-500"
            >
              Payment Method
            </p>

            <h3
              class="font-semibold"
            >
              ${order.paymentMethod}
            </h3>

          </div>

          <div class="text-right">

            <p
              class="text-sm text-gray-500"
            >
              Total
            </p>

            <h3
              class="font-bold text-sky-600 text-xl"
            >
              ${formatPrice(order.total)}
            </h3>

          </div>

        </div>

      `;

      // APPEND
      ordersContainer.appendChild(card);

    });

  } catch (error) {

    console.log(error);

  }

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

  loadOrders(user);

});