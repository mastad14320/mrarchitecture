import {

auth,
db

} from "/assets/js/firebase.js";

import {

onAuthStateChanged

} from "https://www.gstatic.com/firebasejs/12.13.0/firebase-auth.js";

import {

doc,
getDoc,
updateDoc,
collection,
getDocs,
query,
where

} from "https://www.gstatic.com/firebasejs/12.13.0/firebase-firestore.js";

// ELEMENTS
const profileAvatar =
document.getElementById(
"profileAvatar"
);

const profileName =
document.getElementById(
"profileName"
);

const profileEmail =
document.getElementById(
"profileEmail"
);

const profilePhone =
document.getElementById(
"profilePhone"
);

const ordersCount =
document.getElementById(
"ordersCount"
);

const favoritesCountProfile =
document.getElementById(
"favoritesCountProfile"
);

const cartCountProfile =
document.getElementById(
"cartCountProfile"
);

const profileForm =
document.getElementById(
"profileForm"
);

const fullNameInput =
document.getElementById(
"fullName"
);

const phoneInput =
document.getElementById(
"phone"
);

const avatarInput =
document.getElementById(
"avatarInput"
);

// USER
let currentUser = null;

// ============================
// CLOUDINARY
// ============================

async function uploadAvatar(file) {

if (!file) return "";

try {

const formData =
  new FormData();

formData.append(
  "file",
  file
);

formData.append(
  "upload_preset",
  "mr_architecture_upload"
);

const response =
  await fetch(

    "https://api.cloudinary.com/v1_1/da4on0kvp/image/upload",

    {
      method: "POST",
      body: formData
    }

  );

const data =
  await response.json();

return data.secure_url || "";

} catch (error) {

console.log(error);

return "";

}

}

// ============================
// LOAD PROFILE
// ============================

onAuthStateChanged(
auth,
async (user) => {

// NOT LOGGED IN
if (!user) {

  window.location.href =
    "/login.html";

  return;

}

currentUser = user;

// USER DOC
const userRef =
  doc(
    db,
    "users",
    user.uid
  );

const userSnap =
  await getDoc(userRef);

// EXISTS
if (userSnap.exists()) {

  const data =
    userSnap.data();

  // INFO
  profileName.textContent =
    data.name || "User";

  profileEmail.textContent =
    data.email || "";

  profilePhone.textContent =
    data.phone || "";

  // FORM
  fullNameInput.value =
    data.fullName || "";

  phoneInput.value =
    data.phone || "";

  // AVATAR
  if (data.avatar) {

    profileAvatar.src =
      data.avatar;

  }

}

// FAVORITES
const favoritesSnap =
  await getDocs(
    collection(
      db,
      "users",
      user.uid,
      "favorites"
    )
  );

favoritesCountProfile.textContent =
  favoritesSnap.size;

// CART
const cartSnap =
  await getDocs(
    collection(
      db,
      "users",
      user.uid,
      "cart"
    )
  );

cartCountProfile.textContent =
  cartSnap.size;

// ORDERS
const ordersSnap =
  await getDocs(

    query(

      collection(
        db,
        "orders"
      ),

      where(
        "userId",
        "==",
        user.uid
      )

    )

  );

ordersCount.textContent =
  ordersSnap.size;

}
);

// ============================
// SAVE PROFILE
// ============================

profileForm.addEventListener(
"submit",
async (e) => {

e.preventDefault();

try {

  // AVATAR
  let avatarUrl = "";

  if (
    avatarInput.files[0]
  ) {

    avatarUrl =
      await uploadAvatar(
        avatarInput.files[0]
      );

  }

  // UPDATE
  const updateData = {

    fullName:
      fullNameInput.value.trim(),

    phone:
      phoneInput.value.trim()

  };

  // AVATAR
  if (avatarUrl) {

    updateData.avatar =
      avatarUrl;

  }

  // SAVE
  await updateDoc(

    doc(
      db,
      "users",
      currentUser.uid
    ),

    updateData

  );

  alert(
    "Profile updated"
  );

  window.location.reload();

} catch (error) {

  console.log(error);

  alert(
    "Update failed"
  );

}

}
);
