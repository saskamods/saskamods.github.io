document.addEventListener("DOMContentLoaded", () => {
  const tabs = document.querySelectorAll(".tab-btn");
  const panels = document.querySelectorAll(".tab-content");

  tabs.forEach((tab) => {
    tab.addEventListener("click", () => {
      const selected = tab.dataset.tab;

      tabs.forEach((btn) => btn.classList.toggle("active", btn === tab));
      panels.forEach((panel) => {
        panel.classList.toggle("active", panel.id === `tab-${selected}`);
      });
    });
  });
});
