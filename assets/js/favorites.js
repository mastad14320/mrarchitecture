import {
  auth,
  db
} from "./firebase.js";

import {

  doc,

  setDoc,

  deleteDoc,

  getDoc

} from "https://www.gstatic.com/firebasejs/12.13.0/firebase-firestore.js";

import {

  onAuthStateChanged

} from "https://www.gstatic.com/firebasejs/12.13.0/firebase-auth.js";

// ============================
// CHECK FAVORITE
// ============================

export async function isFavorite(planId) {

  const user =
    auth.currentUser;

  if (!user) return false;

  try {

    const favoriteRef =
      doc(
        db,
        "users",
        user.uid,
        "favorites",
        planId
      );

    const favoriteSnap =
      await getDoc(favoriteRef);

    return favoriteSnap.exists();

  } catch (error) {

    console.log(error);

    return false;

  }

}

// ============================
// SAVE FAVORITE
// ============================

export async function toggleFavorite(planId, button) {

  // USER
  const user =
    auth.currentUser;

  // CHECK LOGIN
  if (!user) {

    alert("Please login first");

    window.location.href =
      "login.html";

    return;

  }

  // REF
  const favoriteRef =
    doc(
      db,
      "users",
      user.uid,
      "favorites",
      planId
    );

  // CHECK EXISTENCE
  const favoriteSnap =
    await getDoc(favoriteRef);

  // REMOVE
  if (favoriteSnap.exists()) {

    await deleteDoc(favoriteRef);

    button.innerHTML = "🤍";

    return;

  }

  // ADD
  // PLAN CARD
  const card =
    button.closest(".group");
  
  // IMAGE
  const image =
    card.querySelector("img")?.src || "";
  
  // NAME
  const name =
    card.querySelector("h3")?.textContent || "";
  
  // DETAILS
  const details =
    card.querySelectorAll("span");
  
  // VALUES
  const bedrooms =
    details[1]?.textContent.replace("🛏", "").trim() || "";
  
  const bathrooms =
    details[2]?.textContent.replace("🛁", "").trim() || "";
  
  const area =
    details[3]?.textContent.replace("📐", "").replace("sqm", "").trim() || "";
  
  // PRICE
  const priceText =
    card.querySelector(".text-sky-600")?.textContent || "0";
  
  const price =
    Number(
      priceText.replace(/[^\d]/g, "")
    );
  
  
  // SAVE
  await setDoc(favoriteRef, {
  
    planId,
  
    image,
  
    name,
  
    bedrooms,
  
    bathrooms,
  
    area,
  
    price,
  
    createdAt: Date.now()
  
  });

  button.innerHTML = "❤️ ";

}


// ============================
// FRONTEND FAVORITES
// ============================

function initializeFavoriteButtons() {

  const favoriteBtns =
    document.querySelectorAll(".favoriteBtn");

  favoriteBtns.forEach((button) => {

    button.addEventListener("click", (e) => {

      e.preventDefault();

      const planId =
        button.dataset.id;

      toggleFavorite(planId, button);

    });

  });

}


