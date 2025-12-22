import { game, updateUI } from "./gamelogic.js";

const marketingUpgrades = game.upgrades.marketing;

export function updateMarketingButtonsVisibility() {
  for (const [name, upgrade] of Object.entries(marketingUpgrades)) {
    const btn = document.querySelector(`button[onclick="${name}()"]`);
    if (!btn) continue;

    if (game.marketingTier < upgrade.requiredTier) {
      btn.style.display = "none"; // 🔒 hidden
      btn.disabled = true;
    } else {
      btn.style.display = "inline-block";
      btn.disabled = upgrade.current >= upgrade.limit;
    }
  }
}

function updateButtonLabel(name) {
  const upgrade = marketingUpgrades[name];
  const btn = document.querySelector(`button[onclick="${name}()"]`);
  if (!btn || !upgrade) return;

  const remaining = upgrade.limit - upgrade.current;
  if (remaining <= 0) {
    btn.textContent = `${upgrade.label} (MAX)`;
  } else {
    btn.textContent = `${upgrade.label} (€${upgrade.price})`;
  }
}

function buyUpgrade(name) {
  const upgrade = marketingUpgrades[name];
  if (!upgrade) return;
  if (
    game.argent >= upgrade.price &&
    marketingUpgrades[name].limit - marketingUpgrades[name].current > 0
  ) {
    marketingUpgrades[name].current += 1;
    game.argent -= upgrade.price;
    game.giftsPerChild = Math.max(1, game.giftsPerChild - upgrade.reduction);

    updateButtonLabel(name);
    updateMarketingButtonsVisibility();
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
for (const name in marketingUpgrades) {
  updateButtonLabel(name);
}

window.updateMarketingButtonsVisibility = updateMarketingButtonsVisibility;
