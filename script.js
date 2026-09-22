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

  const promptInput = document.getElementById("promptInput");
  const livePromptText = document.getElementById("livePromptText");
  const generationStatus = document.getElementById("generationStatus");
  const generateImageBtn = document.getElementById("generateImageBtn");

  const generateImage = () => {
    const prompt = (promptInput?.value || "").trim();
    const finalPrompt = prompt || "Luxury product ad, premium lighting, soft gradients, editorial look";
    livePromptText.textContent = finalPrompt;
    generationStatus.textContent = "Generating concept...";

    setTimeout(() => {
      generationStatus.textContent = "Concept ready • 4 variations created";
      generationStatus.classList.add("is-success");
      setTimeout(() => generationStatus.classList.remove("is-success"), 1800);
    }, 500);
  };

  generateImageBtn?.addEventListener("click", generateImage);
  promptInput?.addEventListener("input", () => {
    const value = promptInput.value.trim();
    if (value) {
      livePromptText.textContent = value;
    }
  });

  const chatWindow = document.getElementById("chatWindow");
  const chatForm = document.getElementById("chatForm");
  const chatInput = document.getElementById("chatInput");

  const addMessage = (text, type) => {
    const div = document.createElement("div");
    div.className = `message ${type}`;
    div.textContent = text;
    chatWindow.appendChild(div);
    chatWindow.scrollTop = chatWindow.scrollHeight;
  };

  const getAssistantReply = (question) => {
    const q = question.toLowerCase();

    if (q.includes("hook") || q.includes("viral") || q.includes("campaign")) {
      return "Here are 5 high-converting hooks: 1) Launch smarter, not louder. 2) Your next bestseller starts here. 3) Built to turn attention into action. 4) Design with confidence, sell with clarity. 5) The premium edge your audience will notice immediately.";
    }

    if (q.includes("code") || q.includes("debug") || q.includes("refactor")) {
      return "I’d simplify the logic first, remove redundant operations, and group the repeated tasks into a single reusable function so the app stays maintainable and faster to iterate.";
    }

    if (q.includes("image") || q.includes("visual") || q.includes("design")) {
      return "Use a cinematic prompt with one dominant subject, a clear mood, premium lighting, and a specific style anchor. A strong formula is: subject + mood + lighting + composition + editing style.";
    }

    if (q.includes("pricing") || q.includes("plan") || q.includes("business")) {
      return "The best fit depends on your workload. Starter is great for early testing, Pro is ideal for creators and marketers, and Business is best for teams that need shared workspaces and higher output.";
    }

    return "Great question. I’d start by clarifying the objective, the target audience, and the output format, then build the best-performing structure around that so the result is clear, fast, and premium.";
  };

  chatForm?.addEventListener("submit", (event) => {
    event.preventDefault();
    const question = chatInput?.value.trim();
    if (!question) return;

    addMessage(question, "user");
    chatInput.value = "";

    setTimeout(() => {
      addMessage(getAssistantReply(question), "bot");
    }, 350);
  });

  document.querySelectorAll("button").forEach((button) => {
    const text = button.textContent.trim().toLowerCase();
    const targetMap = {
      "start free": "#pricing",
      "watch demo": "#studio",
      "get started": "#pricing",
      "start pro": "#pricing",
      "try saska ai": "#pricing",
      "contact sales": "#faq"
    };

    const target = targetMap[text] || null;
    if (!target || button.classList.contains("tab-btn")) return;

    button.addEventListener("click", () => {
      document.querySelector(target)?.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  });

  document.querySelectorAll(".copilot-action").forEach((button) => {
    button.addEventListener("click", () => {
      const action = button.dataset.action;
      const summary = {
        optimize: "Optimized for speed, clarity, and conversion-focused structure.",
        explain: "Explained in plain language with a concise breakdown of the logic and trade-offs.",
        refactor: "Refactored into clearer, more reusable, and production-ready code blocks."
      };

      const outputBox = document.querySelector(".copilot-layout .code-card");
      if (outputBox) {
        outputBox.setAttribute("data-state", action);
        outputBox.title = summary[action] || "Action executed.";
      }

      const existing = document.querySelector(".copilot-status");
      if (existing) existing.remove();

      const status = document.createElement("div");
      status.className = "copilot-status";
      status.textContent = summary[action] || "Action executed.";
      document.querySelector(".copilot-layout")?.appendChild(status);
    });
  });
});
