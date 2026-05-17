import {
  auth,
  db
} from "./firebase.js";

import {

  doc,

  getDoc

} from "https://www.gstatic.com/firebasejs/12.13.0/firebase-firestore.js";

import {

  onAuthStateChanged

} from "https://www.gstatic.com/firebasejs/12.13.0/firebase-auth.js";


// ============================
// ADMIN GUARD
// ============================

onAuthStateChanged(auth, async (user) => {

  // NOT LOGGED IN
  if (!user) {

    window.location.href =
      "../login.html";

    return;

  }

  try {

    // USER DOC
    const userDoc =
      await getDoc(
        doc(
          db,
          "users",
          user.uid
        )
      );

    // NO DOC
    if (!userDoc.exists()) {

      window.location.href =
        "../index.html";

      return;

    }

    // DATA
    const userData =
      userDoc.data();

    // NOT ADMIN
    if (!userData.isAdmin) {

      alert("Access denied");

      window.location.href =
        "../index.html";

      return;

    }

  } catch (error) {

    console.log(error);

    window.location.href =
      "../index.html";

  }

});
