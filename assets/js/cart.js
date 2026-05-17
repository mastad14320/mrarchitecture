import {
  auth,
  db
} from "/assets/js/firebase.js";

import {

  doc,

  setDoc,

  deleteDoc,

  getDoc

} from "https://www.gstatic.com/firebasejs/12.13.0/firebase-firestore.js";


// ============================
// ADD TO CART
// ============================

export async function toggleCart(plan, button) {

  // USER
  const user =
    auth.currentUser;

  // LOGIN CHECK
  if (!user) {

    alert("Please login first");

    window.location.href =
      "login.html";

    return;

  }

  try {

    // REF
    const cartRef =
      doc(
        db,
        "users",
        user.uid,
        "cart",
        plan.planId
      );

    // CHECK
    const cartSnap =
      await getDoc(cartRef);

    // REMOVE
    if (cartSnap.exists()) {

      await deleteDoc(cartRef);

      button.innerHTML =
        "Add To Cart";

      return;

    }

    // SAVE
    await setDoc(cartRef, {

      ...plan,

      quantity: 1,
      downloadUrl:  plan.downloadUrl || "",
      createdAt: Date.now()

    });

    button.innerHTML =
      "Added ✓";

  } catch (error) {

    console.log(error);

  }

}


// ============================
// CHECK CART
// ============================

export async function isInCart(planId) {

  const user =
    auth.currentUser;

  if (!user) return false;

  try {

    const cartRef =
      doc(
        db,
        "users",
        user.uid,
        "cart",
        planId
      );

    const cartSnap =
      await getDoc(cartRef);

    return cartSnap.exists();

  } catch (error) {

    console.log(error);

    return false;

  }

}