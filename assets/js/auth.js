import { auth, db } from "/assets/js/firebase.js";

import {

  createUserWithEmailAndPassword,

  signInWithEmailAndPassword,

  signOut,

  onAuthStateChanged

} from "https://www.gstatic.com/firebasejs/12.13.0/firebase-auth.js";

import {

  doc,

  setDoc,

  getDoc,

  updateDoc

} from "https://www.gstatic.com/firebasejs/12.13.0/firebase-firestore.js";


// ============================
// REGISTER
// ============================

const registerForm = document.getElementById("registerForm");

if (registerForm) {

  registerForm.addEventListener("submit", async (e) => {

    e.preventDefault();

    const email =
      document.getElementById("registerEmail").value;

    const password =
      document.getElementById("registerPassword").value;

    try {

      const userCredential =
        await createUserWithEmailAndPassword(
          auth,
          email,
          password
        );
      
      const user = userCredential.user;
      
      const name =
        document.getElementById("registerName").value;
      
      
      // SAVE USER
      await setDoc(
      
        doc(db, "users", user.uid),
      
        {
      
          name,
      
          email,
      
          isAdmin: false,
          
          avatar:
            `https://ui-avatars.com/api/?name=${name}&background=0ea5e9&color=fff`,
      
          createdAt: new Date(),
      
        }
      
      );

      alert("Account created successfully!");

      window.location.href = "/profile.html";

    } catch (error) {

      alert(error.message);

    }

  });

}


// ============================
// LOGIN
// ============================

const loginForm = document.getElementById("loginForm");

if (loginForm) {

  loginForm.addEventListener("submit", async (e) => {

    e.preventDefault();

    const email =
      document.getElementById("loginEmail").value;

    const password =
      document.getElementById("loginPassword").value;

    try {

      await signInWithEmailAndPassword(
        auth,
        email,
        password
      );

      alert("Login successful!");

      window.location.href = "profile.html";

    } catch (error) {

      alert(error.message);

    }

  });

}


// ============================
// LOGOUT
// ============================

const logoutBtn = document.getElementById("logoutBtn");

if (logoutBtn) {

  logoutBtn.addEventListener("click", async () => {

    await signOut(auth);

    window.location.href = "login.html";

  });

}


// ============================
// AUTH STATE
// ============================

onAuthStateChanged(auth, async (user) => {

  const profileName =
    document.getElementById("profileName");

  const profileEmail =
    document.getElementById("profileEmail");

  const profileAvatar =
    document.getElementById("profileAvatar");


  if (user) {

    // GET USER DOC
    const userRef =
      doc(db, "users", user.uid);

    const userSnap =
      await getDoc(userRef);


    if (userSnap.exists()) {

      const userData =
        userSnap.data();

      // NAME
      if (profileName) {

        profileName.textContent =
          userData.name;

      }

      // EMAIL
      if (profileEmail) {

        profileEmail.textContent =
          userData.email;

      }

      // AVATAR
      if (profileAvatar) {

        profileAvatar.src =
          userData.avatar;

      }

    }

  }

});