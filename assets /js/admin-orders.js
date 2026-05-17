import {
  auth,
  db
} from "/assets/js/firebase.js";

import {

  collection,

  getDocs,

  doc,

  updateDoc

} from "https://www.gstatic.com/firebasejs/12.13.0/firebase-firestore.js";

import {

  onAuthStateChanged

} from "https://www.gstatic.com/firebasejs/12.13.0/firebase-auth.js";


// CONTAINER
const adminOrdersContainer =
  document.getElementById("adminOrdersContainer");


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
// STATUS CLASS
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

async function loadOrders() {

  try {

    // SNAPSHOT
    const ordersSnapshot =
      await getDocs(
        collection(db, "orders")
      );

    // EMPTY
    if (ordersSnapshot.empty) {

      adminOrdersContainer.innerHTML = `

        <div
          class="bg-white rounded-[28px] p-10 text-center shadow-sm"
        >

          <h2
            class="text-2xl font-bold"
          >
            No Orders Found
          </h2>

        </div>

      `;

      return;

    }

    // CLEAR
    adminOrdersContainer.innerHTML = "";

    // LOOP
    ordersSnapshot.forEach((docSnap) => {

      // DATA
      const order =
        docSnap.data();

      const orderId =
        docSnap.id;

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
              ${order.customerName}
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

        <!-- INFO -->
        <div
          class="mt-6 grid md:grid-cols-3 gap-4"
        >

          <!-- TRANSACTION -->
          <div
            class="bg-sky-50 rounded-2xl p-4"
          >

            <p
              class="text-sm text-gray-500"
            >
              Transaction ID
            </p>

            <h3
              class="mt-2 font-semibold break-all"
            >
              ${order.transactionId}
            </h3>

          </div>

          ${
            order.paymentProofUrl
            ? `
              <div
                class="mt-5"
              >
          
                <p
                  class="text-sm text-gray-500"
                >
                  Payment Proof
                </p>
          
                <a
                  href="${order.paymentProofUrl}"
                  target="_blank"
                >
          
                  <img
                    src="${order.paymentProofUrl}"
                    class="mt-3 w-32 h-32 object-cover rounded-2xl border border-sky-100"
                  >
          
                </a>
          
              </div>
            `
            : ""
          }

          <!-- METHOD -->
          <div
            class="bg-sky-50 rounded-2xl p-4"
          >

            <p
              class="text-sm text-gray-500"
            >
              Payment Method
            </p>

            <h3
              class="mt-2 font-semibold"
            >
              ${order.paymentMethod}
            </h3>

          </div>

          <!-- TOTAL -->
          <div
            class="bg-sky-50 rounded-2xl p-4"
          >

            <p
              class="text-sm text-gray-500"
            >
              Total
            </p>

            <h3
              class="mt-2 font-bold text-sky-600 text-xl"
            >
              ${formatPrice(order.total)}
            </h3>

          </div>

        </div>

        <!-- ITEMS -->
        <div
          class="mt-6 space-y-4"
        >
          ${items}
        </div>

        <!-- ACTIONS -->
        <div
          class="mt-6 pt-6 border-t border-sky-100 flex flex-wrap items-center justify-between gap-4"
        >

          <!-- STATUS SELECT -->
          <select
            data-id="${orderId}"
            class="statusSelect h-11 px-4 rounded-2xl border border-sky-100 outline-none"
          >

            <option value="pending" ${order.status === "pending" ? "selected" : ""}>
              Pending
            </option>

            <option value="paid" ${order.status === "paid" ? "selected" : ""}>
              Paid
            </option>

            <option value="completed" ${order.status === "completed" ? "selected" : ""}>
              Completed
            </option>

            <option value="failed" ${order.status === "failed" ? "selected" : ""}>
              Failed
            </option>

          </select>

        </div>

      `;

      // APPEND
      adminOrdersContainer.appendChild(card);

    });

    // INIT
    initializeStatusUpdates();

  } catch (error) {

    console.log(error);

  }

}


// ============================
// STATUS UPDATE
// ============================

function initializeStatusUpdates() {

  const selects =
    document.querySelectorAll(".statusSelect");

  selects.forEach((select) => {

    select.addEventListener("change", async () => {

      const orderId =
        select.dataset.id;

      const status =
        select.value;

      try {

        await updateDoc(
          doc(
            db,
            "orders",
            orderId
          ),
          {
            status
          }
        );

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
      "../login.html";

    return;

  }

  loadOrders();

});