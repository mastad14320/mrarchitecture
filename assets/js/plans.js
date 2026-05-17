import {
  db
} from "./firebase.js";

import {
  
  collection,
  
  getDocs
  
} from "https://www.gstatic.com/firebasejs/12.13.0/firebase-firestore.js";

import {
  toggleFavorite, 
  isFavorite
} from "./favorites.js";

import {

  toggleCart,

  isInCart

} from "./cart.js";

// GRID
const plansGrid =
  document.getElementById("plansGrid");

// FILTERS
const searchInput =
  document.getElementById(
    "searchInput"
  );

const minPrice =
  document.getElementById(
    "minPrice"
  );

const maxPrice =
  document.getElementById(
    "maxPrice"
  );

const bedroomsFilter =
  document.getElementById(
    "bedroomsFilter"
  );

const featuredFilter =
  document.getElementById(
    "featuredFilter"
  );

const sortFilter =
  document.getElementById(
    "sortFilter"
  );

// STORE ALL PLANS
let plans = [];

// ============================
// LOAD PLANS
// ============================

async function loadPlans() {

try {


// GET DATA
const querySnapshot =
  await getDocs(
    collection(db, "plans")
  );

// RESET
plans = [];

// LOOP
querySnapshot.forEach((docSnap) => {

  plans.push({

    id: docSnap.id,

    ...docSnap.data()

  });

});

// INITIAL RENDER
renderPlans(plans);


} catch (error) {


console.log(error);


}

}

function renderPlans(data) {

// CLEAR GRID
plansGrid.innerHTML = "";

// EMPTY
if (!data.length) {


plansGrid.innerHTML = `

  <div
    class="col-span-full bg-white rounded-[28px] p-10 text-center"
  >

    <h2
      class="text-xl font-bold"
    >
      No plans found
    </h2>

  </div>

`;

return;


}

// LOOP
data.forEach((plan) => {


// CARD
const card =
  document.createElement("a");

card.href =
  `plan-details.html?id=${plan.id}`;

card.className =
  "group bg-white rounded-[24px] overflow-hidden shadow-sm hover:shadow-xl transition duration-300";

card.innerHTML = `

  <!-- IMAGE -->
  <div class="relative overflow-hidden">

    <img
      src="${plan.images?.[0] || ''}"
      class="h-44 md:h-52 w-full object-cover group-hover:scale-105 transition duration-500"
    >

    ${
      plan.featured
      ? `
        <span
          class="absolute top-3 left-3 bg-sky-500 text-white text-[10px] md:text-xs px-3 py-1 rounded-full"
        >
          Featured
        </span>
      `
      : ""
    }

  </div>

  <!-- CONTENT -->
  <div class="p-3 md:p-4">

    <h3
      class="font-semibold text-[13px] md:text-base line-clamp-1"
    >
      ${plan.name}
    </h3>

    <div
      class="mt-3 flex items-center justify-between text-gray-500 text-[11px] md:text-sm"
    >

      <span>🛏 ${plan.bedrooms}</span>

      <span>🛁 ${plan.bathrooms}</span>

      <span>📐 ${plan.area} sqm</span>

    </div>

    <div class="mt-4">

      <span
        class="font-bold text-sky-600 text-[13px] md:text-lg"
      >
        UGX ${plan.price.toLocaleString()}
      </span>

    </div>

  </div>

`;

plansGrid.appendChild(card);


});

}

function applyFilters() {

// SEARCH
const search =
searchInput.value
.toLowerCase();

// PRICE
const min =
Number(minPrice.value) || 0;

const max =
Number(maxPrice.value) || Infinity;

// FILTERS
const bedrooms =
bedroomsFilter.value;

const featured =
featuredFilter.value;

const sort =
sortFilter.value;

// FILTER DATA
let filtered =
plans.filter((plan) => {


  const matchesSearch =
    plan.name
      .toLowerCase()
      .includes(search);

  const matchesPrice =
    plan.price >= min
    && plan.price <= max;

  let matchesBedrooms =
    true;

  if (bedrooms) {

    if (bedrooms === "5") {

      matchesBedrooms =
        plan.bedrooms >= 5;

    } else {

      matchesBedrooms =
        plan.bedrooms === Number(bedrooms);

    }

  }

  const matchesFeatured =
    featured === "featured"
      ? plan.featured
      : true;

  return (

    matchesSearch
    && matchesPrice
    && matchesBedrooms
    && matchesFeatured

  );

});


// SORT
if (sort === "cheap") {


filtered.sort(
  (a, b) => a.price - b.price
);


}

if (sort === "expensive") {


filtered.sort(
  (a, b) => b.price - a.price
);


}

if (sort === "newest") {

filtered.reverse();


}

// RENDER
renderPlans(filtered);

}

// FILTER EVENTS
[
  searchInput,
  minPrice,
  maxPrice,
  bedroomsFilter,
  featuredFilter,
  sortFilter

].forEach((element) => {

  element.addEventListener(
    "input",
    applyFilters
  );

  element.addEventListener(
    "change",
    applyFilters
  );

});

// LOAD
loadPlans();
