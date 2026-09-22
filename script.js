document.addEventListener("DOMContentLoaded", () => {
  const tabs = document.querySelectorAll(".tab-btn");
  const panelContents = document.querySelectorAll(".tab-content");

  tabs.forEach((tab) => {
    tab.addEventListener("click", () => {
      const target = tab.dataset.tab;

      tabs.forEach((btn) => btn.classList.toggle("active", btn === tab));

      panelContents.forEach((content) => {
        const isActive = content.id === `tab-${target}`;
        content.classList.toggle("active", isActive);
      });
    });
  });
});
