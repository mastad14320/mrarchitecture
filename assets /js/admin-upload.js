import {
  db
} from "/assets/js/firebase.js";

import {

  collection,

  addDoc

} from "https://www.gstatic.com/firebasejs/12.13.0/firebase-firestore.js";

// FORM
const uploadPlanForm =
  document.getElementById("uploadPlanForm");

const planFile =
  document.getElementById("planFile");
  
// ============================
// UPLOAD FILE
// ============================

async function uploadPlanFile(file) {

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

    // REQUEST
    const response =
      await fetch(

        "https://api.cloudinary.com/v1_1/da4on0kvp/raw/upload",

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

    return null;

  }

}

// PREVIEW
const imagePreviewContainer =
  document.getElementById(
    "imagePreviewContainer"
  );

// LOADER
const uploadLoader =
  document.getElementById(
    "uploadLoader"
  );

const uploadProgress =
  document.getElementById(
    "uploadProgress"
  );

const uploadText =
  document.getElementById(
    "uploadText"
  );

// ============================
// IMAGE PREVIEW
// ============================

const planImagesInput =
  document.getElementById(
    "planImages"
  );


// CHANGE
planImagesInput.addEventListener(
  "change",
  () => {

    // CLEAR
    imagePreviewContainer.innerHTML = "";

    // FILES
    const files =
      planImagesInput.files;

    // LOOP
    for (const file of files) {

      // READER
      const reader =
        new FileReader();

      reader.onload = (e) => {

        // CARD
        const div =
          document.createElement("div");

        div.className =
          "relative rounded-2xl overflow-hidden aspect-square bg-white shadow-sm";

        div.innerHTML = `

          <img
            src="${e.target.result}"
            class="w-full h-full object-cover"
          >

        `;

        imagePreviewContainer.appendChild(div);

      };

      reader.readAsDataURL(file);

    }

  }
);

// ============================
// UPLOAD PLAN
// ============================

if (uploadPlanForm) {

  uploadPlanForm.addEventListener("submit", async (e) => {

    e.preventDefault();
    
    // SHOW LOADER
    uploadLoader.classList.remove(
      "hidden"
    );
    
    // BUTTON
    const submitBtn =
      uploadPlanForm.querySelector(
        "button[type='submit']"
      );
    
    // DISABLE
    submitBtn.disabled = true;
    
    submitBtn.innerHTML =
      "Uploading...";

    try {

      // DATA
      const name =
        document.getElementById("planName").value;

      const price =
        Number(
          document.getElementById("planPrice").value
        );

      const bedrooms =
        Number(
          document.getElementById("planBedrooms").value
        );

      const bathrooms =
        Number(
          document.getElementById("planBathrooms").value
        );

      const area =
        Number(
          document.getElementById("planArea").value
        );

      const description =
        document.getElementById("planDescription").value;

      const featured =
        document.getElementById("planFeatured").checked;

      const imageFiles =
        document.getElementById("planImages").files;

      
      // IMAGE URLS
      const imageUrls = [];


      // UPLOAD EACH IMAGE
      for (const file of imageFiles) {

        const formData = new FormData();

        formData.append("file", file);

        formData.append(
          "upload_preset",
          "mr_architecture_upload"
        );

        // CLOUDINARY
        const response = await fetch(

          "https://api.cloudinary.com/v1_1/da4on0kvp/image/upload",

          {
            method: "POST",
            body: formData,
          }

        );

        const data =
          await response.json();

        imageUrls.push(
          data.secure_url
        );

      }

        // PLAN FILE URL
        let downloadUrl = "";
        
        // FILE EXISTS
        if (planFile.files[0]) {
        
          downloadUrl =
            await uploadPlanFile(
              planFile.files[0]
            );
        
        }

      // SAVE FIRESTORE
      await addDoc(

        collection(db, "plans"),

        {

          name,
          price,
          bedrooms,
          bathrooms,
          area,
          description,
          featured,
          images: imageUrls,
          downloadUrl, 

          createdAt:
            new Date(),

        }

      );

      // PROGRESS
      const progress =
        Math.round(
      
          (
            imageUrls.length
            / imageFiles.length
          ) * 100
      
        );
      
      // UI
      uploadProgress.style.width =
        `${progress}%`;
      
      uploadText.innerHTML =
        `Uploading ${progress}%`;

      alert("Plan uploaded successfully!");

      // RESET LOADER
      uploadProgress.style.width =
        "0%";
      
      uploadText.innerHTML =
        "Uploading...";
      
      uploadLoader.classList.add(
        "hidden"
      );
      
      // ENABLE BUTTON
      submitBtn.disabled = false;
      
      submitBtn.innerHTML =
        "Upload Plan";
      
      // CLEAR PREVIEW
      imagePreviewContainer.innerHTML = "";

      uploadPlanForm.reset();

    } catch (error) {
      
      console.log(error);

      // HIDE LOADER
      uploadLoader.classList.add(
        "hidden"
      );
      
      // ENABLE BUTTON
      submitBtn.disabled = false;
      
      submitBtn.innerHTML =
        "Upload Plan";

      alert("Upload failed");

    }

  });

}
