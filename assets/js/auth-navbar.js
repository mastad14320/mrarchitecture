import {

auth,
db

} from "./firebase.js";

import {

onAuthStateChanged,
signOut

} from "https://www.gstatic.com/firebasejs/12.13.0/firebase-auth.js";

import {

doc,
getDoc

} from "https://www.gstatic.com/firebasejs/12.13.0/firebase-firestore.js";

// ELEMENTS
const loginBtn =
document.getElementById(
"loginBtn"
);

const registerBtn =
document.getElementById(
"registerBtn"
);

const profileBtn =
document.getElementById(
"profileBtn"
);

const logoutBtn =
document.getElementById(
"logoutBtn"
);

const navAvatar =
document.getElementById(
"navAvatar"
);

// ============================
// AUTH STATE
// ============================

onAuthStateChanged(
auth,
async (user) => {

// LOGGED OUT
if (!user) {

  loginBtn?.classList.remove(
    "hidden"
  );

  registerBtn?.classList.remove(
    "hidden"
  );

  profileBtn?.classList.add(
    "hidden"
  );

  logoutBtn?.classList.add(
    "hidden"
  );

  return;

}

// LOGGED IN
loginBtn?.classList.add(
  "hidden"
);

registerBtn?.classList.add(
  "hidden"
);

profileBtn?.classList.remove(
  "hidden"
);

logoutBtn?.classList.remove(
  "hidden"
);

// USER DOC
try {

  const userDoc =
    await getDoc(
      doc(
        db,
        "users",
        user.uid
      )
    );

  // EXISTS
  if (userDoc.exists()) {

    const userData =
      userDoc.data();

    // AVATAR
    if (
      userData.avatar
    ) {

      navAvatar.src =
        userData.avatar;

    }

  }

} catch (error) {

  console.log(error);

}

}
);

// ============================
// LOGOUT
// ============================

logoutBtn?.addEventListener(
"click",
async () => {

try {

  await signOut(auth);

  window.location.href =
    "../login.html";

} catch (error) {

  console.log(error);

}

}
);
