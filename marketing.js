import { game, updateUI } from "./gamelogic.js";

const upgrades = {
  mascotte: { limit: 1, reduction: 0.5 },
  instagroom: { limit: 5, reduction: 0.1 },
  AIadd: { limit: 1, reduction: 0.5 },
  skeletonsCloset: { limit: 5, reduction: 0.2 },
  bribe: { limit: 1, reduction: 0.5 }
};

const remainingPurchases = {};
for (const key in upgrades) remainingPurchases[key] = upgrades[key].limit;

function buyUpgrade(name) {
  const prix = 5000;
  const upgrade = upgrades[name];
  if (!upgrade) return;
  if (game.argent >= prix && remainingPurchases[name] > 0) {
    game.argent -= prix;
    remainingPurchases[name] -= 1;

    game.giftsPerChild = Math.max(1, game.giftsPerChild - upgrade.reduction);

    const btn = document.querySelector(`button[onclick="${name}()"]`);
    if (btn && remainingPurchases[name] <= 0) {
      btn.disabled = true;
      btn.textContent += " (MAX)";
    }

    updateUI();
  }
}

window.mascotte = () => buyUpgrade("mascotte");
window.instagroom = () => buyUpgrade("instagroom");
window.AIadd = () => buyUpgrade("AIadd");
window.skeletonsCloset = () => buyUpgrade("skeletonsCloset");
window.bribe = () => buyUpgrade("bribe");
