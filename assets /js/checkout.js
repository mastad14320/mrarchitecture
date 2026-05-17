import {
  auth,
  db
} from "/assets/js/firebase.js";

import {

  collection,

  getDocs,

  addDoc,

  serverTimestamp

} from "https://www.gstatic.com/firebasejs/12.13.0/firebase-firestore.js";

import {

  onAuthStateChanged

} from "https://www.gstatic.com/firebasejs/12.13.0/firebase-auth.js";

import {

  openWhatsAppOrder

} from "/assets/js/whatsapp.js";

// ELEMENTS
const checkoutItems =
  document.getElementById("checkoutItems");

const checkoutTotal =
  document.getElementById("checkoutTotal");

// BUTTON
const placeOrderBtn =
  document.getElementById("placeOrderBtn");

// PAYMENT PROOF
const paymentProof =
  document.getElementById(
    "paymentProof"
  );

const paymentPreview =
  document.getElementById(
    "paymentPreview"
  );

const paymentPreviewImage =
  document.getElementById(
    "paymentPreviewImage"
  );
  
// ============================
// PREVIEW PAYMENT IMAGE
// ============================

paymentProof.addEventListener(
  "change",
  () => {

    // FILE
    const file =
      paymentProof.files[0];

    // NONE
    if (!file) {

      paymentPreview.classList.add(
        "hidden"
      );

      return;

    }

    // READER
    const reader =
      new FileReader();

    reader.onload = (e) => {

      paymentPreviewImage.src =
        e.target.result;

      paymentPreview.classList.remove(
        "hidden"
      );

    };

    reader.readAsDataURL(file);

  }
);

// ============================
// UPLOAD PAYMENT PROOF
// ============================

async function uploadPaymentProof(file) {

  try {

    // FORM DATA
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

    // REQUEST
    const response =
      await fetch(

        "https://api.cloudinary.com/v1_1/da4on0kvp/image/upload",

        {
          method: "POST",
          body: formData
        }

      );

    // DATA
    const data =
      await response.json();

    return data.secure_url;

  } catch (error) {

    console.log(error);

    return "";

  }

}

// TOTAL
let grandTotal = 0;

// CART ITEMS
let cartProducts = [];


// ============================
// FORMAT PRICE
// ============================

function formatPrice(price) {

  return new Intl.NumberFormat("en-UG", {

    style: "currency",

    currency: "UGX",

    maximumFractionDigits: 0

  }).format(price);

}


// ============================
// LOAD CHECKOUT
// ============================

async function loadCheckout(user) {

  try {

    // SNAPSHOT
    const cartSnapshot =
      await getDocs(
        collection(
          db,
          "users",
          user.uid,
          "cart"
        )
      );

    // EMPTY
    if (cartSnapshot.empty) {

      checkoutItems.innerHTML = `

        <p class="text-sm text-gray-500">
          No cart items found.
        </p>

      `;

      return;

    }

    // CLEAR
    checkoutItems.innerHTML = "";

    // RESET
    grandTotal = 0;

    cartProducts = [];

    // LOOP
    cartSnapshot.forEach((docSnap) => {

      const item =
        docSnap.data();

      // PUSH
      cartProducts.push(item);

      // TOTAL
      grandTotal +=
        item.price * item.quantity;

      // ITEM
      const div =
        document.createElement("div");

      div.className =
        "flex items-center gap-3";

      div.innerHTML = `

        <!-- IMAGE -->
        <img
          src="${item.image}"
          class="w-16 h-16 rounded-2xl object-cover"
        >

        <!-- CONTENT -->
        <div class="flex-1">

          <h3
            class="font-medium text-sm"
          >
            ${item.name}
          </h3>

          <p
            class="mt-1 text-[11px] text-gray-500"
          >
            Qty: ${item.quantity}
          </p>

        </div>

        <!-- PRICE -->
        <div
          class="font-semibold text-sm"
        >
          ${formatPrice(item.price * item.quantity)}
        </div>

      `;

      // APPEND
      checkoutItems.appendChild(div);

    });

    // TOTAL
    checkoutTotal.innerHTML =
      formatPrice(grandTotal);

  } catch (error) {

    console.log(error);

  }

}

// PAYMENT IMAGE
let paymentProofUrl = "";

// EXISTS
if (paymentProof.files[0]) {

  paymentProofUrl =
    await uploadPaymentProof(
      paymentProof.files[0]
    );

}

// ============================
// CREATE ORDER
// ============================

async function createOrder(user) {

  try {

    // VALUES
    const name =
      document.getElementById("customerName").value;

    const phone =
      document.getElementById("customerPhone").value;

    const transactionId =
      document.getElementById("transactionId").value;

    // VALIDATION
    if (
      !name ||
      !phone ||
      !transactionId
    ) {

      alert("Please fill all fields");

      return;

    }

    // ORDER
    const order = {

      userId: user.uid,

      customerName: name,

      customerPhone: phone,

      transactionId,

      items: cartProducts,

      total: grandTotal,

      paymentMethod: "Mobile Money",

      status: "pending",
      
      paymentProofUrl,
      
      createdAt: serverTimestamp()

    };

    // SAVE
    await addDoc(
      collection(db, "orders"),
      order
    );

    // PRODUCTS
    const products =
      cartProducts.map((item) => {

        return `
• ${item.name}
Qty: ${item.quantity}
`;

      }).join("\n");

    // MESSAGE
    const message = `Hello MR Architecture,

I have placed an order.

NAME:
${name}

PHONE:
${phone}

TRANSACTION ID:
${transactionId}

ORDER:
${products}

TOTAL:
${formatPrice(grandTotal)}
`;

    // WHATSAPP
    const whatsappUrl =
      `https://wa.me/256769370218?text=${encodeURIComponent(message)}`;

    // OPEN
    window.open(
      whatsappUrl,
      "_blank"
    );

  // WHATSAPP
  openWhatsAppOrder({
  
    customerName,
  
    customerPhone,
  
    transactionId,
  
    paymentMethod,
  
    total,
  
    items: cartItems
  
  });
  
  
  // SUCCESS
  alert(
    "Order placed successfully. WhatsApp will now open."
  );

  } catch (error) {

    console.log(error);

    alert("Something went wrong");

  }

}

// ============================
// AUTH
// ============================

onAuthStateChanged(auth, (user) => {

  if (!user) {

    window.location.href =
      "login.html";

    return;

  }

  loadCheckout(user);

  // PLACE ORDER
  placeOrderBtn.addEventListener("click", () => {
  createOrder(user);

});

});