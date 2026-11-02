// Buttons with a data-href open that link in a new tab
document.querySelectorAll("button[data-href]").forEach((button) => {
  button.addEventListener("click", () => {
    window.open(button.dataset.href, "_blank", "noopener");
  });
});

document.getElementById("year").textContent = new Date().getFullYear();
