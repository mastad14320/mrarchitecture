import {
  auth,
  db
} from "/assets/js/firebase.js";

import {

  collection,

  getDocs,

  doc,

  deleteDoc

} from "https://www.gstatic.com/firebasejs/12.13.0/firebase-firestore.js";

import {

  onAuthStateChanged

} from "https://www.gstatic.com/firebasejs/12.13.0/firebase-auth.js";


// GRID
const favoritesGrid =
  document.getElementById("favoritesGrid");


// ============================
// LOAD FAVORITES
// ============================

async function loadFavorites(user) {

  try {

    // GET FAVORITES
    const favoritesSnapshot =
      await getDocs(
        collection(
          db,
          "users",
          user.uid,
          "favorites"
        )
      );

    // EMPTY
    if (favoritesSnapshot.empty) {

      favoritesGrid.innerHTML = `

        <div
          class="col-span-full bg-white rounded-[28px] p-10 text-center shadow-sm"
        >

          <h2
            class="text-2xl font-bold"
          >
            No Favorites Yet
          </h2>

          <p
            class="mt-3 text-gray-500 text-sm"
          >
            Save plans you like to see them here.
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
    favoritesGrid.innerHTML = "";

    // LOOP
    favoritesSnapshot.forEach((docSnap) => {

      const favorite =
        docSnap.data();

      const planId =
        favorite.planId;

      // CARD
      const card =
        document.createElement("a");

      card.href =
        `plan-details.html?id=${planId}`;

      card.className =
        "group bg-white rounded-[24px] overflow-hidden shadow-sm hover:shadow-xl transition duration-300";

      card.innerHTML = `

        <!-- IMAGE -->
        <div class="relative overflow-hidden">

          <img
            src="${favorite.image}"
            class="h-44 md:h-52 w-full object-cover group-hover:scale-105 transition duration-500"
          >

          <!-- REMOVE -->
          <button
            data-id="${planId}"
            class="removeFavorite absolute top-3 right-3 w-10 h-10 bg-white/90 backdrop-blur-md rounded-full flex items-center justify-center"
          >
            💙
          </button>

        </div>

        <!-- CONTENT -->
        <div class="p-3 md:p-4">

          <!-- NAME -->
          <h3
            class="font-semibold text-[13px] md:text-base line-clamp-1"
          >
            ${favorite.name}
          </h3>

          <!-- DETAILS -->
          <div
            class="mt-3 flex items-center justify-between text-gray-500 text-[11px] md:text-sm"
          >

            <span>🛏️ ${favorite.bedrooms}</span>

            <span>🛁 ${favorite.bathrooms}</span>

            <span>📐 ${favorite.area} sqm</span>

          </div>

          <!-- PRICE -->
          <div
            class="mt-4 font-bold text-sky-600 text-[13px] md:text-lg"
          >
            ${new Intl.NumberFormat("en-UG", {

              style: "currency",

              currency: "UGX",

              maximumFractionDigits: 0

            }).format(favorite.price)}
          </div>

        </div>

      `;

      // APPEND
      favoritesGrid.appendChild(card);

    });

    // REMOVE EVENTS
    initializeRemoveButtons(user);

  } catch (error) {

    console.log(error);

  }

}


// ============================
// REMOVE FAVORITE
// ============================

function initializeRemoveButtons(user) {

  const buttons =
    document.querySelectorAll(".removeFavorite");

  buttons.forEach((button) => {

    button.addEventListener("click", async (e) => {

      e.preventDefault();

      const planId =
        button.dataset.id;

      try {

        await deleteDoc(
          doc(
            db,
            "users",
            user.uid,
            "favorites",
            planId
          )
        );

        loadFavorites(user);

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
      "/login.html";

    return;

  }

  loadFavorites(user);

});