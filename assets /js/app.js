// AOS
AOS.init({
  duration: 1000,
  once: true,
});

// MOBILE MENU
const menuBtn = document.getElementById('menuBtn');
const mobileMenu = document.getElementById('mobileMenu');

menuBtn.addEventListener('click', () => {
  mobileMenu.classList.toggle('hidden');
});