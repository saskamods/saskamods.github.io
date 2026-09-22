document.addEventListener("DOMContentLoaded", () => {
  const tabs = [...document.querySelectorAll(".tab-btn")];
  const panels = [...document.querySelectorAll(".tab-content")];

  const activateTab = (tab) => {
    const selected = tab?.dataset.tab;
    if (!selected) return;

    tabs.forEach((button) => {
      const active = button === tab;
      button.classList.toggle("active", active);
      button.setAttribute("aria-selected", String(active));
    });

    panels.forEach((panel) => {
      const active = panel.id === `tab-${selected}`;
      panel.classList.toggle("active", active);
      panel.hidden = !active;
    });
  };

  tabs.forEach((tab, index) => {
    tab.setAttribute("role", "tab");
    tab.setAttribute("aria-controls", `tab-${tab.dataset.tab}`);
    tab.addEventListener("click", () => activateTab(tab));
    tab.addEventListener("keydown", (event) => {
      if (event.key !== "ArrowRight" && event.key !== "ArrowLeft") return;
      event.preventDefault();
      const direction = event.key === "ArrowRight" ? 1 : -1;
      const next = tabs[(index + direction + tabs.length) % tabs.length];
      next.focus();
      activateTab(next);
    });
  });

  panels.forEach((panel) => {
    panel.setAttribute("role", "tabpanel");
    panel.hidden = !panel.classList.contains("active");
  });

  const targetForButton = (button) => {
    const label = button.textContent.trim().toLowerCase();
    if (label.includes("demo")) return "#studio";
    if (label.includes("start") || label.includes("get started") || label.includes("try")) return "#pricing";
    return null;
  };

  document.querySelectorAll("button").forEach((button) => {
    const target = targetForButton(button);
    if (!target || button.classList.contains("tab-btn")) return;

    button.addEventListener("click", () => {
      document.querySelector(target)?.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  });
});
