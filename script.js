const progressBar = document.querySelector(".page-progress span");

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
    if (selectedDesign !== "course" && selectedDesign !== "fieldnotes") return;

    document.querySelector("#course-view").hidden = selectedDesign !== "course";
    document.querySelector("#fieldnotes-view").hidden = selectedDesign !== "fieldnotes";
    document.querySelectorAll("[data-design-option]").forEach((designOption) => {
      designOption.setAttribute(
        "aria-pressed",
        String(designOption.getAttribute("data-design-option") === selectedDesign),
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

    document.title =
      selectedDesign === "fieldnotes"
        ? "Agentic Engineering — Fieldnotes"
        : "Agentic Engineering — Course";
    updatePageProgress();
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

updatePageProgress();
