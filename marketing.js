import { game, updateUI } from "./gamelogic.js";

const upgrades = {
  mascotte: { price: 5000, limit: 1, reduction: 0.5 },
  instagroom: { price: 5000, limit: 5, reduction: 0.1 },
  AIadd: { price: 5000, limit: 1, reduction: 0.5 },
  skeletonsCloset: { price: 5000, limit: 5, reduction: 0.2 },
  bribe: { price: 5000, limit: 1, reduction: 0.5 },
};

const remainingPurchases = {};
for (const key in upgrades) remainingPurchases[key] = upgrades[key].limit;

function buyUpgrade(name) {
  const upgrade = upgrades[name];
  if (!upgrade) return;
  if (game.argent >= upgrade.price && remainingPurchases[name] > 0) {
    game.argent -= upgrade.price;
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
