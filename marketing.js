import { game, updateUI } from "./gamelogic.js";

export const upgrades = {
  tier: 0,
  mascotte: {
    label: "Faire designer une mascotte",
    price: 10000,
    limit: 1,
    reduction: 0.5,
  },
  instagroom: {
    label: "Post Instagroom",
    price: 45000,
    limit: 5,
    reduction: 0.1,
  },
  AIadd: {
    label: "Faire une publicité avec de l'IA",
    price: 80000,
    limit: 1,
    reduction: 0.5,
  },
  skeletonsCloset: {
    label: "Trouver des éléments compromettants du Père Noël",
    price: 150000,
    limit: 5,
    reduction: 0.2,
  },
  bribe: {
    label: "Pot-de-vin à l'Éducation National",
    price: 1000000000,
    limit: 1,
    reduction: 0.5,
  },
};

export const remainingPurchases = {};
for (const key in upgrades) remainingPurchases[key] = upgrades[key].limit;

function updateButtonLabel(name) {
  const upgrade = upgrades[name];
  const btn = document.querySelector(`button[onclick="${name}()"]`);
  if (!btn || !upgrade) return;

  const remaining = remainingPurchases[name];
  if (remaining <= 0) {
    btn.textContent = `${upgrade.label} (MAX)`;
  } else {
    btn.textContent = `${upgrade.label} (€${upgrade.price})`;
  }
}

function buyUpgrade(name) {
  const upgrade = upgrades[name];
  if (!upgrade) return;
  if (game.argent >= upgrade.price && remainingPurchases[name] > 0) {
    game.argent -= upgrade.price;
    remainingPurchases[name] -= 1;

    game.giftsPerChild = Math.max(1, game.giftsPerChild - upgrade.reduction);

    updateButtonLabel(name);
    updateUI();
  }
}

// Bind window functions
window.mascotte = () => buyUpgrade("mascotte");
window.instagroom = () => buyUpgrade("instagroom");
window.AIadd = () => buyUpgrade("AIadd");
window.skeletonsCloset = () => buyUpgrade("skeletonsCloset");
window.bribe = () => buyUpgrade("bribe");

// Set initial button text
for (const name in upgrades) {
  updateButtonLabel(name);
}
