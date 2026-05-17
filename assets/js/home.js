import {

db

} from "/assets/js/firebase.js";

import {

collection,
getDocs,
query,
where,
orderBy,
limit

} from "https://www.gstatic.com/firebasejs/12.13.0/firebase-firestore.js";

// ELEMENTS
const featuredPlansGrid =
document.getElementById(
"featuredPlansGrid"
);

const latestPlansGrid =
document.getElementById(
"latestPlansGrid"
);

// ============================
// CARD
// ============================

function createPlanCard(plan) {

return `

<a
  href="/plan-details.html?id=${plan.id}"
  class="group bg-white rounded-[24px] overflow-hidden shadow-sm hover:shadow-xl transition duration-300"
>

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

</a>

`;

}

// ============================
// FEATURED
// ============================

async function loadFeaturedPlans() {

try {

const featuredQuery =
  query(

    collection(db, "plans"),

    where(
      "featured",
      "==",
      true
    ),

    limit(8)

  );

const snapshot =
  await getDocs(
    featuredQuery
  );

featuredPlansGrid.innerHTML = "";

snapshot.forEach((docSnap) => {

  const plan = {

    id: docSnap.id,

    ...docSnap.data()

  };

  featuredPlansGrid.innerHTML +=
    createPlanCard(plan);

});

} catch (error) {

console.log(error);

}

}

// ============================
// LATEST
// ============================

async function loadLatestPlans() {

try {

const latestQuery =
  query(

    collection(db, "plans"),

    orderBy(
      "createdAt",
      "desc"
    ),

    limit(8)

  );

const snapshot =
  await getDocs(
    latestQuery
  );

latestPlansGrid.innerHTML = "";

snapshot.forEach((docSnap) => {

  const plan = {

    id: docSnap.id,

    ...docSnap.data()

  };

  latestPlansGrid.innerHTML +=
    createPlanCard(plan);

});

} catch (error) {

console.log(error);

}

}

// INIT
loadFeaturedPlans();

loadLatestPlans();
