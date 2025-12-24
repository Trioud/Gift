// achievements.js
import { game } from "./gamelogic.js";

let activeToasts = [];

/* -------------------- TOAST -------------------- */

function showToast(title, message) {
  const bottomOffset = 20;
  const spacing = 15;
  const index = activeToasts.length;

  const toast = document.createElement("div");
  toast.className = "achievement-popup";
  toast.innerHTML = `<h3>🎉 ${title}</h3><p>${message}</p>`;

  activeToasts.push(toast);
  document.body.appendChild(toast);

  let totalHeight = bottomOffset;
  for (let i = 0; i < activeToasts.length - 1; i++) {
    totalHeight += activeToasts[i].offsetHeight + spacing;
  }
  toast.style.bottom = `${totalHeight}px`;

  setTimeout(() => {
    const rect = toast.getBoundingClientRect();
    const confettiEl = document.createElement("div");
    confettiEl.style.position = "fixed";
    confettiEl.style.left = rect.left + rect.width / 2 + "px";
    confettiEl.style.top = rect.top + rect.height / 2 + "px";
    document.body.appendChild(confettiEl);

    party.confetti(confettiEl, { count: party.variation.range(30, 50) });

    setTimeout(() => confettiEl.remove(), 1000);
  }, 50);

  setTimeout(() => {
    toast.classList.add("toast-exit");
    setTimeout(() => {
      activeToasts = activeToasts.filter((t) => t !== toast);
      toast.remove();

      let currentBottom = bottomOffset;
      activeToasts.forEach((t) => {
        t.style.bottom = `${currentBottom}px`;
        currentBottom += t.offsetHeight + spacing;
      });
    }, 300);
  }, 5000);
}

/* -------------------- HELPERS -------------------- */

function getGameValue(path) {
  return path.split(".").reduce((o, k) => o?.[k], game);
}

function compare(a, op, b) {
  switch (op) {
    case ">=":
      return a >= b;
    case "<=":
      return a <= b;
    case ">":
      return a > b;
    case "<":
      return a < b;
    case "==":
      return a === b;
    case "!=":
      return a !== b;
    default:
      return false;
  }
}

/* -------------------- CHECK -------------------- */

function updateAchievementsCounter() {
  const titleEl = document.getElementById("achievements-title");
  if (!titleEl) return;

  const total = game.achievement.length;
  const unlocked = game.achievement.filter((a) => a.active).length;

  titleEl.textContent = `Achievements ${unlocked} / ${total}`;
}

export function checkAchievements() {
  let updated = false;

  game.achievement.forEach((a) => {
    if (a.active) return;

    // BACKWARD COMPATIBILITY (old achievements)
    if (a.threshold !== undefined) {
      if (game.enfants >= a.threshold) {
        a.active = 1;
        showToast(a.label, a.message);
        updated = true;
      }
      return;
    }

    // NEW GENERIC ACHIEVEMENTS
    if (!a.watch || !a.operator || a.value === undefined) return;

    const left = getGameValue(a.watch);
    const right = typeof a.value === "string" ? getGameValue(a.value) : a.value;

    if (compare(left, a.operator, right)) {
      a.active = 1;
      showToast(a.label, a.message);
      updated = true;
    }
  });

  if (updated) {
    updateAchievementsDisplay();
    updateAchievementsCounter();
    saveGame();
  }
}

/* -------------------- UI -------------------- */

function updateAchievementsDisplay() {
  const list = document.getElementById("achievements-list");
  if (!list) return;

  list.innerHTML = "";

  game.achievement.forEach((a) => {
    const el = document.createElement("div");
    el.style.marginBottom = "8px";
    el.style.padding = "8px";
    el.style.border = a.active ? "2px solid #4CAF50" : "1px solid #ccc";
    el.style.borderRadius = "4px";

    let status = "🔒";

    if (!a.active) {
      if (a.threshold !== undefined) {
        status = `${game.enfants}/${a.threshold}`;
      } else {
        const left = getGameValue(a.watch);
        const right =
          typeof a.value === "string" ? getGameValue(a.value) : a.value;
        status = `${left}/${right}`;
      }
    }

    el.innerHTML = `
      <strong>${a.active ? "🎉" : "🔒"} ${a.label}</strong> - ${status}
      ${a.active ? `<br><small>${a.message}</small>` : ""}
    `;

    list.appendChild(el);
  });
}

export function updateAchievementsUI() {
  updateAchievementsDisplay();
  updateAchievementsCounter();
}

window.checkAchievements = checkAchievements;
