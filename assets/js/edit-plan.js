import {
  db
} from "./firebase.js";

import {

  doc,

  getDoc,

  updateDoc

} from "https://www.gstatic.com/firebasejs/12.13.0/firebase-firestore.js";


// FORM
const editPlanForm =
  document.getElementById(
    "editPlanForm"
  );


// ELEMENTS
const nameInput =
  document.getElementById("name");

const priceInput =
  document.getElementById("price");

const bedroomsInput =
  document.getElementById("bedrooms");

const bathroomsInput =
  document.getElementById("bathrooms");

const areaInput =
  document.getElementById("area");

const descriptionInput =
  document.getElementById("description");

const featuredInput =
  document.getElementById("featured");

const currentImages =
  document.getElementById(
    "currentImages"
  );

const planImages =
  document.getElementById(
    "planImages"
  );

const planFile =
  document.getElementById(
    "planFile"
  );


// PARAMS
const params =
  new URLSearchParams(
    window.location.search
  );

const id =
  params.get("id");


// DATA
let existingImages = [];

let existingDownloadUrl = "";


// ============================
// CLOUDINARY IMAGE
// ============================

async function uploadImage(file) {

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

  return data.secure_url;

}


// ============================
// CLOUDINARY FILE
// ============================

async function uploadPlanFile(file) {

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

      "https://api.cloudinary.com/v1_1/da4on0kvp/raw/upload",

      {
        method: "POST",
        body: formData
      }

    );

  const data =
    await response.json();

  return data.secure_url;

}


// ============================
// LOAD PLAN
// ============================

async function loadPlan() {

  try {

    const planDoc =
      await getDoc(
        doc(
          db,
          "plans",
          id
        )
      );

    // NOT FOUND
    if (!planDoc.exists()) {

      alert("Plan not found");

      window.location.href =
        "manage-plans.html";

      return;

    }

    // DATA
    const plan =
      planDoc.data();

    // SAVE
    existingImages =
      plan.images || [];

    existingDownloadUrl =
      plan.downloadUrl || "";

    // SET VALUES
    nameInput.value =
      plan.name || "";

    priceInput.value =
      plan.price || "";

    bedroomsInput.value =
      plan.bedrooms || "";

    bathroomsInput.value =
      plan.bathrooms || "";

    areaInput.value =
      plan.area || "";

    descriptionInput.value =
      plan.description || "";

    featuredInput.checked =
      plan.featured || false;

    // RENDER IMAGES
    renderImages();

  } catch (error) {

    console.log(error);

  }

}


// ============================
// RENDER IMAGES
// ============================

function renderImages() {

  currentImages.innerHTML = "";

  existingImages.forEach((image, index) => {

    const div =
      document.createElement("div");

    div.className =
      "relative rounded-2xl overflow-hidden aspect-square";

    div.innerHTML = `

      <img
        src="${image}"
        class="w-full h-full object-cover"
      >

      <button
        type="button"
        data-index="${index}"
        class="removeImage absolute top-2 right-2 w-8 h-8 rounded-full bg-red-500 text-white"
      >
        ✕
      </button>

    `;

    currentImages.appendChild(div);

  });

  initializeRemoveImage();

}


// ============================
// REMOVE IMAGE
// ============================

function initializeRemoveImage() {

  const removeBtns =
    document.querySelectorAll(
      ".removeImage"
    );

  removeBtns.forEach((btn) => {

    btn.addEventListener("click", () => {

      const index =
        Number(
          btn.dataset.index
        );

      existingImages.splice(
        index,
        1
      );

      renderImages();

    });

  });

}


// ============================
// SUBMIT
// ============================

editPlanForm.addEventListener(
  "submit",
  async (e) => {

    e.preventDefault();

    try {

      // IMAGES
      let imageUrls =
        [...existingImages];

      // NEW IMAGES
      if (planImages.files.length) {

        imageUrls = [];

        for (const file of planImages.files) {

          const url =
            await uploadImage(file);

          imageUrls.push(url);

        }

      }

      // DOWNLOAD
      let downloadUrl =
        existingDownloadUrl;

      // NEW FILE
      if (planFile.files[0]) {

        downloadUrl =
          await uploadPlanFile(
            planFile.files[0]
          );

      }

      // UPDATE
      await updateDoc(
        doc(
          db,
          "plans",
          id
        ),
        {

          name:
            nameInput.value,

          price:
            Number(
              priceInput.value
            ),

          bedrooms:
            Number(
              bedroomsInput.value
            ),

          bathrooms:
            Number(
              bathroomsInput.value
            ),

          area:
            Number(
              areaInput.value
            ),

          description:
            descriptionInput.value,

          featured:
            featuredInput.checked,

          images:
            imageUrls,

          downloadUrl

        }
      );

      alert(
        "Plan updated successfully"
      );

      window.location.href =
        "manage-plans.html";

    } catch (error) {

      console.log(error);

      alert(error.message);

    }

  }
);


// INIT
loadPlan();
