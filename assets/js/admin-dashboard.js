import {

auth,
db

} from "/assets/js/firebase.js";

import {

onAuthStateChanged

} from "https://www.gstatic.com/firebasejs/12.13.0/firebase-auth.js";

import {

collection,
getDocs,
query,
orderBy,
limit,
doc,
getDoc

} from "https://www.gstatic.com/firebasejs/12.13.0/firebase-firestore.js";

// ELEMENTS
const totalPlans =
document.getElementById(
"totalPlans"
);

const totalOrders =
document.getElementById(
"totalOrders"
);

const totalFavorites =
document.getElementById(
"totalFavorites"
);

const totalUsers =
document.getElementById(
"totalUsers"
);

const recentPlansTable =
document.getElementById(
"recentPlansTable"
);

const adminAvatar =
document.getElementById(
"adminAvatar"
);

// ============================
// LOAD STATS
// ============================

async function loadStats() {

try {

// PLANS
const plansSnap =
  await getDocs(
    collection(db, "plans")
  );

totalPlans.textContent =
  plansSnap.size;

// ORDERS
const ordersSnap =
  await getDocs(
    collection(db, "orders")
  );

totalOrders.textContent =
  ordersSnap.size;

// USERS
const usersSnap =
  await getDocs(
    collection(db, "users")
  );

totalUsers.textContent =
  usersSnap.size;

// FAVORITES
let favoritesCount = 0;

for (const userDoc of usersSnap.docs) {

  const favoritesSnap =
    await getDocs(

      collection(
        db,
        "users",
        userDoc.id,
        "favorites"
      )

    );

  favoritesCount +=
    favoritesSnap.size;

}

totalFavorites.textContent =
  favoritesCount;

} catch (error) {

console.log(error);

}

}

// ============================
// RECENT PLANS
// ============================

async function loadRecentPlans() {

try {

const plansQuery =
  query(

    collection(db, "plans"),

    orderBy(
      "createdAt",
      "desc"
    ),

    limit(5)

  );

const snapshot =
  await getDocs(
    plansQuery
  );

recentPlansTable.innerHTML =
  "";

snapshot.forEach((docSnap) => {

  const plan = {

    id: docSnap.id,

    ...docSnap.data()

  };

  recentPlansTable.innerHTML += `

    <tr
      class="border-b border-sky-50"
    >

      <td class="py-4">

        <div
          class="flex items-center gap-3"
        >

          <img
            src="${plan.images?.[0] || ''}"
            class="w-14 h-14 rounded-2xl object-cover"
          >

          <div>

            <h3 class="font-medium">
              ${plan.name}
            </h3>

            <p class="text-gray-500 text-sm">
              ${plan.bedrooms} Bedrooms
            </p>

          </div>

        </div>

      </td>

      <td>
        UGX ${Number(plan.price).toLocaleString()}
      </td>

      <td>

        <span
          class="bg-green-100 text-green-600 px-3 py-1 rounded-full text-xs"
        >
          Active
        </span>

      </td>

    </tr>

  `;

});

} catch (error) {

console.log(error);

}

}

// ============================
// ADMIN PROFILE
// ============================

onAuthStateChanged(
auth,
async (user) => {

if (!user) return;

try {

  const userSnap =
    await getDoc(

      doc(
        db,
        "users",
        user.uid
      )

    );

  if (userSnap.exists()) {

    const userData =
      userSnap.data();

    if (
      userData.avatar
    ) {

      adminAvatar.src =
        userData.avatar;

    }

  }

} catch (error) {

  console.log(error);

}

}
);

// INIT
loadStats();

loadRecentPlans();
