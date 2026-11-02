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

// Peek Inside: the arrows and arrow keys move one page; swiping works natively.
// The counter and arrow states follow whichever page is in view.
const track = document.querySelector(".viewer-track");
const count = document.querySelector(".viewer-count");
const [prevButton, nextButton] = document.querySelectorAll(".viewer-btn");
const pageCount = track.children.length;

const currentPage = () => Math.round(track.scrollLeft / track.clientWidth);

const goToPage = (page) => {
  track.scrollTo({ left: page * track.clientWidth, behavior: "smooth" });
};

const updateViewer = () => {
  const page = currentPage();
  count.textContent = `${page + 1} / ${pageCount}`;
  prevButton.disabled = page === 0;
  nextButton.disabled = page === pageCount - 1;
};

document.querySelectorAll(".viewer-btn").forEach((button) => {
  button.addEventListener("click", () => goToPage(currentPage() + Number(button.dataset.step)));
});

track.addEventListener("keydown", (event) => {
  if (event.key === "ArrowLeft" || event.key === "ArrowRight") {
    event.preventDefault();
    goToPage(currentPage() + (event.key === "ArrowRight" ? 1 : -1));
  }
});

track.addEventListener("scroll", updateViewer, { passive: true });
updateViewer();

document.getElementById("year").textContent = new Date().getFullYear();
