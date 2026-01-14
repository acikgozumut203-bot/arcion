const menuBtn = document.getElementById("menuBtn");
const sidebar = document.getElementById("sidebar");

// Menü aç / kapa
menuBtn.addEventListener("click", () => {
  sidebar.classList.toggle("hidden");
});

// Dışarı tıklanınca menüyü kapat
document.addEventListener("click", e => {
  if (
    !sidebar.contains(e.target) &&
    !menuBtn.contains(e.target)
  ) {
    sidebar.classList.add("hidden");
  }
});
