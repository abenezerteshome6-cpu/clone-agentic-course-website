const progressBar = document.querySelector(".page-progress span");
const designViews = {
  course: document.querySelector("#course-view"),
  fieldnotes: document.querySelector("#fieldnotes-view"),
};
const themeColor = document.querySelector('meta[name="theme-color"]');

function selectDesign(selectedDesign, updateAddress = true) {
  if (!Object.prototype.hasOwnProperty.call(designViews, selectedDesign)) return;

  if (updateAddress) {
    const url = new URL(window.location.href);
    if (selectedDesign === "fieldnotes") {
      url.searchParams.set("design", "fieldnotes");
    } else {
      url.searchParams.delete("design");
    }
    url.hash = "";
    window.history.replaceState(null, "", url);
  }

  Object.entries(designViews).forEach(([design, view]) => {
    view.hidden = design !== selectedDesign;
  });
  document.querySelectorAll("[data-design-option]").forEach((option) => {
    option.setAttribute(
      "aria-pressed",
      String(option.getAttribute("data-design-option") === selectedDesign),
    );
  });
  document.querySelectorAll(".menu-toggle, .course-menu-toggle").forEach((menuToggle) => {
    menuToggle.setAttribute("aria-expanded", "false");
    menuToggle.setAttribute(
      "aria-label",
      menuToggle.classList.contains("course-menu-toggle") ? "Open course navigation" : "Open navigation",
    );
    document.getElementById(menuToggle.getAttribute("aria-controls"))?.classList.remove("is-open");
  });

  const isFieldnotes = selectedDesign === "fieldnotes";
  document.title = isFieldnotes ? "Agentic Engineering — Fieldnotes" : "Agentic Engineering — Course";
  themeColor?.setAttribute("content", isFieldnotes ? "#10110f" : "#080b0b");

  updatePageProgress();
}

document.querySelectorAll(".menu-toggle, .course-menu-toggle").forEach((menuToggle) => {
  const nav = document.getElementById(menuToggle.getAttribute("aria-controls"));
  if (!nav) return;

  menuToggle.addEventListener("click", () => {
    const isOpen = menuToggle.getAttribute("aria-expanded") === "true";
    menuToggle.setAttribute("aria-expanded", String(!isOpen));
    menuToggle.setAttribute("aria-label", isOpen ? "Open navigation" : "Close navigation");
    nav.classList.toggle("is-open", !isOpen);
  });

  nav.addEventListener("click", (event) => {
    if (event.target instanceof Element && event.target.closest("a")) {
      menuToggle.setAttribute("aria-expanded", "false");
      menuToggle.setAttribute(
        "aria-label",
        menuToggle.classList.contains("course-menu-toggle") ? "Open course navigation" : "Open navigation",
      );
      nav.classList.remove("is-open");
    }
  });
});

document.querySelectorAll("[data-design-option]").forEach((option) => {
  option.addEventListener("click", () => {
    const selectedDesign = option.getAttribute("data-design-option");
    selectDesign(selectedDesign);
  });
});

document.addEventListener("keydown", (event) => {
  if (event.key !== "Escape") return;

  document.querySelectorAll(".menu-toggle, .course-menu-toggle").forEach((menuToggle) => {
    menuToggle.setAttribute("aria-expanded", "false");
    menuToggle.setAttribute(
      "aria-label",
      menuToggle.classList.contains("course-menu-toggle") ? "Open course navigation" : "Open navigation",
    );
    document.getElementById(menuToggle.getAttribute("aria-controls"))?.classList.remove("is-open");
  });
});

let progressScheduled = false;

function updatePageProgress() {
  if (!progressBar) return;

  const scrollableHeight = document.documentElement.scrollHeight - window.innerHeight;
  const progress = scrollableHeight > 0 ? (window.scrollY / scrollableHeight) * 100 : 0;
  progressBar.style.width = `${Math.min(progress, 100)}%`;
  progressScheduled = false;
}

window.addEventListener(
  "scroll",
  () => {
    if (!progressScheduled) {
      window.requestAnimationFrame(updatePageProgress);
      progressScheduled = true;
    }
  },
  { passive: true },
);

const initialDesign = new URLSearchParams(window.location.search).get("design");
selectDesign(initialDesign === "fieldnotes" ? "fieldnotes" : "course", false);
updatePageProgress();
