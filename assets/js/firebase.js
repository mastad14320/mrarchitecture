  // Import the functions you need from the SDKs you need
  import { initializeApp } from "https://www.gstatic.com/firebasejs/12.13.0/firebase-app.js";
  import { getAnalytics } from "https://www.gstatic.com/firebasejs/12.13.0/firebase-analytics.js";
  // TODO: Add SDKs for Firebase products that you want to use
  // https://firebase.google.com/docs/web/setup#available-libraries

import {
  getAuth
} from "https://www.gstatic.com/firebasejs/12.13.0/firebase-auth.js";

import {
  getFirestore
} from "https://www.gstatic.com/firebasejs/12.13.0/firebase-firestore.js";

  // Your web app's Firebase configuration
  // For Firebase JS SDK v7.20.0 and later, measurementId is optional
  const firebaseConfig = {
    apiKey: "AIzaSyALxOkoQ_78GIdsLQ9PpAArgzBNMw-HqqM",
    authDomain: "mr-achtecture.firebaseapp.com",
    projectId: "mr-achtecture",
    storageBucket: "mr-achtecture.firebasestorage.app",
    messagingSenderId: "869005151189",
    appId: "1:869005151189:web:8dc8c0f4dd647002394b5c",
    measurementId: "G-958ZRJN18B"
  };

  // Initialize Firebase
  const app = initializeApp(firebaseConfig);
  const analytics = getAnalytics(app);

//AUTH
export const auth = getAuth(app);

//FIRESTORE
export const db = getFirestore(app);