import {
  db
} from "./firebase.js";

import {

  collection,

  getDocs,

  deleteDoc,

  doc

} from "https://www.gstatic.com/firebasejs/12.13.0/firebase-firestore.js";


// ELEMENTS
const adminPlansContainer =
  document.getElementById(
    "adminPlansContainer"
  );

const searchPlans =
  document.getElementById(
    "searchPlans"
  );


// DATA
let plans = [];


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
// LOAD PLANS
// ============================

async function loadPlans() {

  try {

    // SNAPSHOT
    const snapshot =
      await getDocs(
        collection(db, "plans")
      );

    // RESET
    plans = [];

    // LOOP
    snapshot.forEach((docSnap) => {

      plans.push({

        id: docSnap.id,

        ...docSnap.data()

      });

    });

    // RENDER
    renderPlans(plans);

  } catch (error) {

    console.log(error);

  }

}


// ============================
// RENDER PLANS
// ============================

function renderPlans(data) {

  // EMPTY
  if (!data.length) {

    adminPlansContainer.innerHTML = `

      <div
        class="col-span-full bg-white rounded-[28px] p-10 text-center shadow-sm"
      >

        <h2
          class="text-2xl font-bold"
        >
          No Plans Found
        </h2>

      </div>

    `;

    return;

  }

  // CLEAR
  adminPlansContainer.innerHTML = "";

  // LOOP
  data.forEach((plan) => {

    // CARD
    const card =
      document.createElement("div");

    card.className =
      "bg-white rounded-[28px] overflow-hidden shadow-sm";

    card.innerHTML = `

      <!-- IMAGE -->
      <div class="relative">

        <img
          src="${plan.images?.[0] || ''}"
          class="w-full aspect-square object-cover"
        >

        ${
          plan.featured
          ? `
            <div
              class="absolute top-3 left-3 bg-sky-500 text-white px-3 py-1 rounded-full text-[11px]"
            >
              Featured
            </div>
          `
          : ""
        }

      </div>

      <!-- CONTENT -->
      <div class="p-4">

        <h3
          class="font-bold text-sm line-clamp-1"
        >
          ${plan.name}
        </h3>

        <div
          class="mt-3 flex items-center justify-between text-[11px] text-gray-500"
        >

          <span>
            🛏 ${plan.bedrooms}
          </span>

          <span>
            🛁 ${plan.bathrooms}
          </span>

          <span>
            📐 ${plan.area} sqm
          </span>

        </div>

        <!-- PRICE -->
        <div
          class="mt-4 text-sky-600 font-bold"
        >
          ${formatPrice(plan.price)}
        </div>

        <!-- ACTIONS -->
        <div
          class="mt-4 grid grid-cols-2 gap-2"
        >

          <!-- EDIT -->
          <a
            href="edit-plan.html?id=${plan.id}"
            class="h-10 rounded-xl bg-sky-500 hover:bg-sky-600 text-white flex items-center justify-center text-[12px] transition"
          >
            Edit
          </a>

          <!-- DELETE -->
          <button
            data-id="${plan.id}"
            class="deleteBtn h-10 rounded-xl bg-red-500 hover:bg-red-600 text-white text-[12px] transition"
          >
            Delete
          </button>

        </div>

      </div>

    `;

    // APPEND
    adminPlansContainer.appendChild(card);

  });

  // INIT DELETE
  initializeDelete();

}


// ============================
// DELETE PLAN
// ============================

function initializeDelete() {

  const deleteBtns =
    document.querySelectorAll(
      ".deleteBtn"
    );

  deleteBtns.forEach((btn) => {

    btn.addEventListener("click", async () => {

      // ID
      const id =
        btn.dataset.id;

      // CONFIRM
      const confirmDelete =
        confirm(
          "Delete this plan?"
        );

      // CANCEL
      if (!confirmDelete) return;

      try {

        // DELETE
        await deleteDoc(
          doc(
            db,
            "plans",
            id
          )
        );

        // RELOAD
        loadPlans();

      } catch (error) {

        console.log(error);

      }

    });

  });

}


// ============================
// SEARCH
// ============================

searchPlans.addEventListener(
  "input",
  () => {

    // VALUE
    const value =
      searchPlans.value
        .toLowerCase();

    // FILTER
    const filtered =
      plans.filter((plan) => {

        return (
          plan.name
            .toLowerCase()
            .includes(value)
        );

      });

    // RENDER
    renderPlans(filtered);

  }
);


// ============================
// INIT
// ============================

loadPlans();
