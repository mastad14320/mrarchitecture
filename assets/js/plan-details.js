import {
  db
} from "./firebase.js";

import {

  doc,

  getDoc

} from "https://www.gstatic.com/firebasejs/12.13.0/firebase-firestore.js";

import {
  toggleFavorite, 
  isFavorite
} from "./favorites.js";

import {
  toggleCart,
  isInCart
} from "./cart.js";

// CONTAINER
const planDetails =
  document.getElementById("planDetails");


// URL PARAMS
const params =
  new URLSearchParams(
    window.location.search
  );

const planId =
  params.get("id");

// ============================
// LOAD PLAN
// ============================

async function loadPlan() {

  try {

    // GET PLAN
    const planRef =
      doc(db, "plans", planId);

    const planSnap =
      await getDoc(planRef);

    // CHECK
    if (!planSnap.exists()) {

      planDetails.innerHTML = `

        <div
          class="bg-white rounded-[32px] p-10 text-center"
        >

          <h2
            class="text-2xl font-bold"
          >
            Plan Not Found
          </h2>

        </div>

      `;

      return;

    }

    // DATA
    const plan =
      planSnap.data();

    // GALLERY
    const gallerySlides =
      plan.images.map((image) => {
    
        return `
    
          <div class="swiper-slide">
    
            <img
              src="${image}"
              class="w-full h-[260px] md:h-[500px] object-cover"
            >
    
          </div>
    
        `;
    
      }).join("");
      
    // THUMBNAILS
    const thumbnailSlides =
      plan.images.map((image) => {
    
        return `
    
          <div class="swiper-slide !w-auto">
    
            <img
              src="${image}"
              class="w-20 md:w-24 h-20 md:h-24 object-cover rounded-2xl border-2 border-transparent"
            >
    
          </div>
    
        `;
    
      }).join("");
      
    // RENDER
    planDetails.innerHTML = `
    
      <div
        class="grid lg:grid-cols-2 gap-8 items-start"
      >
    
        <!-- LEFT -->
        <div class="w-full overflow-hidden">
    
          <!-- BACK -->
          <a
            href="plans.html"
            class="inline-flex items-center gap-2 text-sky-600 text-sm hover:text-sky-700 mb-4"
          >
            ← Back To Plans
          </a>
    
          <!-- MAIN IMAGE -->
          <div
            class="swiper mainSwiper rounded-[24px] overflow-hidden bg-white shadow-sm"
          >
    
            <div class="swiper-wrapper">
    
              ${gallerySlides}
    
            </div>
    
          </div>
    
          <!-- THUMBNAILS -->
          <div
            class="swiper thumbSwiper mt-4"
          >
    
            <div class="swiper-wrapper">
    
              ${thumbnailSlides}
    
            </div>
    
          </div>
    
        </div>
    
        <!-- RIGHT -->
        <div class="pb-10">
    
          <!-- BADGE -->
          ${
            plan.featured
            ? `
              <span
                class="inline-flex bg-sky-500 text-white px-4 py-2 rounded-full text-xs"
              >
                Featured
              </span>
            `
            : ""
          }
    
          <!-- NAME -->
          <h1
            class="mt-4 text-2xl md:text-4xl font-bold leading-tight"
          >
            ${plan.name}
          </h1>
    
          <!-- PRICE -->
          <div
            class="mt-4 text-sky-600 text-3xl md:text-4xl font-bold"
          >
            UGX ${plan.price.toLocaleString()}
          </div>
    
          <!-- SPECS -->
          <div
            class="mt-6 grid grid-cols-3 gap-3"
          >
    
            <!-- ITEM -->
            <div
              class="bg-white rounded-2xl p-4 text-center shadow-sm"
            >
    
              <div class="text-xl">
                🛏
              </div>
    
              <h3
                class="mt-2 font-bold"
              >
                ${plan.bedrooms}
              </h3>
    
              <p
                class="text-[11px] text-gray-500"
              >
                Bedrooms
              </p>
    
            </div>
    
            <!-- ITEM -->
            <div
              class="bg-white rounded-2xl p-4 text-center shadow-sm"
            >
    
              <div class="text-xl">
                🛁
              </div>
    
              <h3
                class="mt-2 font-bold"
              >
                ${plan.bathrooms}
              </h3>
    
              <p
                class="text-[11px] text-gray-500"
              >
                Baths
              </p>
    
            </div>
    
            <!-- ITEM -->
            <div
              class="bg-white rounded-2xl p-4 text-center shadow-sm"
            >
    
              <div class="text-xl">
                📐
              </div>
    
              <h3
                class="mt-2 font-bold"
              >
                ${plan.area}
              </h3>
    
              <p
                class="text-[11px] text-gray-500"
              >
                sqm
              </p>
    
            </div>
    
          </div>
    
          <!-- DESCRIPTION -->
          <div
            class="mt-6 bg-white rounded-[24px] p-5 shadow-sm"
          >
    
            <h2
              class="font-bold text-lg"
            >
              Description
            </h2>
    
            <p
              class="mt-3 text-gray-600 text-[13px] md:text-sm leading-relaxed"
            >
              ${plan.description}
            </p>
    
          </div>
    
          <!-- CONTACT -->
          <div
            class="mt-6 grid grid-cols-2 gap-3"
          >
    
            <!-- WHATSAPP -->
            <a
              href="https://wa.me/256769370218?text=Hello, I am interested in ${plan.name}"
              target="_blank"
              class="bg-green-500 hover:bg-green-600 text-white h-11 rounded-2xl flex items-center justify-center text-sm transition"
            >
              WhatsApp
            </a>
    
            <!-- CALL -->
            <a
              href="tel:+256769370218"
              class="border border-sky-200 hover:bg-sky-50 h-11 rounded-2xl flex items-center justify-center text-sm transition"
            >
              Call
            </a>
    
          </div>
    
          <!-- ACTIONS -->
          <div
            class="mt-3 grid grid-cols-[1fr_52px] gap-3"
          >
    
            <!-- CART -->
            <button
              id="addToCartBtn"
              class="bg-sky-500 hover:bg-sky-600 text-white h-11 rounded-2xl text-sm transition"
            >
              Add To Cart
            </button>
    
            <!-- FAVORITE -->
            <button
              id="favoriteBtn"
              class="border border-sky-200 hover:bg-sky-50 rounded-2xl transition"
            >
              🤍
            </button>
    
          </div>
    
        </div>
    
      </div>
      
      <!-- MOBILE BOTTOM BAR -->
      <div
        class="fixed bottom-0 left-0 w-full bg-white border-t border-sky-100 p-4 lg:hidden z-50"
      >

        <div
          class="flex items-center justify-between gap-4"
        >

          <!-- PRICE -->
          <div>

            <p
              class="text-[11px] text-gray-500"
            >
              Price
            </p>

            <h3
              class="text-lg font-bold text-sky-600"
            >
              ${new Intl.NumberFormat("en-UG", {

                style: "currency",

                currency: "UGX",

                maximumFractionDigits: 0

              }).format(plan.price)}
            </h3>

          </div>



        </div>

      </div>
    
    `;
    
      // CART BUTTON
      const cartBtn =
        document.getElementById("addToCartBtn");
      
      if (cartBtn) {
      
        // PLAN DATA
        const planData = {
      
          planId,
      
          image: plan.images[0],
      
          name: plan.name,
      
          bedrooms: plan.bedrooms,
      
          bathrooms: plan.bathrooms,
      
          area: plan.area,

          downloadUrl:  plan.downloadUrl || "",
          
          price: plan.price
      
        };
      
        // CHECK
        isInCart(planId)
          .then((inCart) => {
      
            if (inCart) {
      
              cartBtn.innerHTML =
                "Added ✓";
      
            }
      
          });
      
        // TOGGLE
        cartBtn.addEventListener("click", () => {
      
          toggleCart(
            planData,
            cartBtn
          );
      
        });
      
      }
      // FAVORITE BUTTON
      const favoriteBtn =
        document.getElementById("favoriteBtn");
      
      if (favoriteBtn) {
      
        // CHECK STATE
        isFavorite(planId)
          .then((favorite) => {
      
            if (favorite) {
      
              favoriteBtn.innerHTML = "❤️ ";
      
            }
      
          });
      
        // TOGGLE
        favoriteBtn.addEventListener("click", () => {
      
          toggleFavorite(
            planId,
            favoriteBtn
          );
      
        });
      
      }

    // SWIPER
    const thumbsSwiper =
      new Swiper(".thumbSwiper", {

        slidesPerView: 4,
        spaceBetween: 12,

        breakpoints: {

          768: {
            slidesPerView: 5
          }

        }

      });

    new Swiper(".mainSwiper", {

      spaceBetween: 12,

      thumbs: {
        swiper: thumbsSwiper
      }

    });

  } catch (error) {

    console.log(error);

  }

}


// LOAD
loadPlan();
