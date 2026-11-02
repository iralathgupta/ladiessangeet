// Buttons with a data-href open that link in a new tab
document.querySelectorAll("button[data-href]").forEach((button) => {
  button.addEventListener("click", () => {
    window.open(button.dataset.href, "_blank", "noopener");
  });
});

// Give the header a background once the cover has scrolled fully behind it,
// and show the back-to-top arrow once less than half of the cover is in view
const header = document.querySelector(".site-header");
const hero = document.querySelector(".hero");

new IntersectionObserver(
  ([entry]) => {
    document.body.classList.toggle("is-scrolled", !entry.isIntersecting);
    document.body.classList.toggle("show-to-top", entry.intersectionRatio < 0.5);
  },
  { rootMargin: `-${header.offsetHeight}px 0px 0px 0px`, threshold: [0, 0.5] },
).observe(hero);

document.querySelector(".to-top").addEventListener("click", () => {
  window.scrollTo({ top: 0, behavior: "smooth" });
  history.replaceState(null, "", location.pathname);
});

document.getElementById("year").textContent = new Date().getFullYear();
