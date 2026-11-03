// Buttons with a data-href open that link in a new tab
document.querySelectorAll("button[data-href]").forEach((button) => {
  button.addEventListener("click", () => {
    window.open(button.dataset.href, "_blank", "noopener");
  });
});

// Menu button (phones and tablets): opens the nav links; choosing a link, pressing
// Escape or tapping elsewhere closes it
const menuButton = document.querySelector(".nav-toggle");

const setMenuOpen = (open) => {
  document.querySelector(".site-header").classList.toggle("is-open", open);
  menuButton.setAttribute("aria-expanded", String(open));
};

menuButton.addEventListener("click", () => {
  setMenuOpen(menuButton.getAttribute("aria-expanded") !== "true");
});

document.querySelectorAll(".site-nav a").forEach((link) => {
  link.addEventListener("click", () => setMenuOpen(false));
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") setMenuOpen(false);
});

document.addEventListener("click", (event) => {
  if (!event.target.closest(".site-header")) setMenuOpen(false);
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

// Reviews (side by side only): narrow the testimonials until their text is about as tall
// as the Instagram feed, so neither column needs empty space to match the other.
// Narrower text wraps onto more lines, so a binary search on the width finds the match.
const reviewsLayout = document.querySelector(".reviews-layout");
const testimonials = document.querySelector(".testimonials");
const feed = document.querySelector(".instagram");
const sideBySide = window.matchMedia("(min-width: 768px)");

const balanceReviews = () => {
  reviewsLayout.style.maxWidth = "";
  if (!sideBySide.matches) return;

  // Measure both columns at their natural heights, not stretched to match each other
  reviewsLayout.style.alignItems = "start";
  const feedHeight = feed.offsetHeight;
  const feedWidth = feed.offsetWidth;
  const gap = parseFloat(getComputedStyle(reviewsLayout).columnGap);
  let narrow = feedWidth + gap + 320; // keep the testimonials at least 320px wide
  let wide = reviewsLayout.offsetWidth;

  for (let i = 0; i < 12 && wide - narrow > 2; i++) {
    const width = (narrow + wide) / 2;
    reviewsLayout.style.maxWidth = `${width}px`;
    if (testimonials.offsetHeight > feedHeight) narrow = width;
    else wide = width;
  }

  reviewsLayout.style.maxWidth = `${Math.ceil(wide)}px`;
  reviewsLayout.style.alignItems = "";
};

let balanceQueued = false;
const queueBalance = () => {
  if (balanceQueued) return;
  balanceQueued = true;
  requestAnimationFrame(() => {
    balanceQueued = false;
    balanceReviews();
  });
};

// Re-balance when the feed finishes loading or changes size, the fonts arrive, or the
// window is resized
new ResizeObserver(queueBalance).observe(document.querySelector("behold-widget"));
document.fonts.ready.then(queueBalance);
window.addEventListener("resize", queueBalance);

document.getElementById("year").textContent = new Date().getFullYear();
