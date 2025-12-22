// achievements.js
import { game } from "./gamelogic.js";

// Liste des toasts actifs
let activeToasts = [];

function showToast(title, message) {
  const toastHeight = 100;
  const bottomOffset = 20;
  const spacing = 10;
  const index = activeToasts.length;

  // Créer le toast
  const toast = document.createElement("div");
  toast.className = "achievement-popup";
  toast.style.bottom = `${bottomOffset + index * (toastHeight + spacing)}px`;
  toast.innerHTML = `<h3>🎉 ${title}</h3><p>${message}</p>`;

  activeToasts.push(toast);
  document.body.appendChild(toast);

  // Confettis
  setTimeout(() => {
    const rect = toast.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    const confettiEl = document.createElement("div");
    confettiEl.style.position = "fixed";
    confettiEl.style.left = `${centerX}px`;
    confettiEl.style.top = `${centerY}px`;
    confettiEl.style.width = "1px";
    confettiEl.style.height = "1px";
    confettiEl.style.pointerEvents = "none";
    document.body.appendChild(confettiEl);

    party.confetti(confettiEl, { count: party.variation.range(30, 50) });

    setTimeout(() => {
      if (confettiEl.parentNode) document.body.removeChild(confettiEl);
    }, 1000);
  }, 50);

  // Supprimer après 5 secondes
  setTimeout(() => {
    if (toast.parentNode) {
      toast.classList.add("toast-exit");
      setTimeout(() => {
        if (toast.parentNode) {
          activeToasts = activeToasts.filter((t) => t !== toast);
          document.body.removeChild(toast);
          // Réorganiser les toasts restants
          activeToasts.forEach((t, i) => {
            t.style.bottom = `${bottomOffset + i * (toastHeight + spacing)}px`;
          });
        }
      }, 300);
    }
  }, 5000);
}

function updateAchievementsDisplay() {
  const achievementsList = document.getElementById("achievements-list");
  if (!achievementsList) return;

  achievementsList.innerHTML = "";

  game.achievement.forEach((achievement) => {
    const achievementEl = document.createElement("div");
    achievementEl.style.marginBottom = "8px";
    achievementEl.style.padding = "8px";
    achievementEl.style.border = achievement.active
      ? "2px solid #4CAF50"
      : "1px solid #ccc";
    achievementEl.style.borderRadius = "4px";

    const status = achievement.active
      ? "✅"
      : `${game.enfants}/${achievement.threshold}`;

    achievementEl.innerHTML = `
      <strong>${achievement.active ? "🎉" : "🔒"} ${
      achievement.label
    }</strong> - ${status}
      ${achievement.active ? `<br><small>${achievement.message}</small>` : ""}
    `;

    achievementsList.appendChild(achievementEl);
  });
}

export function checkAchievements() {
  let hasNewAchievement = false;
  game.achievement.forEach((achievement) => {
    if (achievement.active === 0 && game.enfants >= achievement.threshold) {
      achievement.active = 1;
      showToast(achievement.label, achievement.message);
      hasNewAchievement = true;
    }
  });
  if (hasNewAchievement) {
    updateAchievementsDisplay();
  }
}

export function updateAchievementsUI() {
  updateAchievementsDisplay();
}

// Rendre accessible globalement pour le HTML
window.checkAchievements = checkAchievements;
