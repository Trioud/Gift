import { game, updateUI } from "./gamelogic.js";

const marketingUpgrades = game.upgrades.marketing;
const RHUpgrades = game.upgrades.marketing;

function buyUpgrade(key, effectFn) {
  const upgrade = RHUpgrades[key];

  if (upgrade.limit === 0) return;
  if (game.cdf < upgrade.price) return;

  game.cdf -= upgrade.price;

  if (upgrade.limit > 0) {
    upgrade.limit -= 1;
  }

  effectFn();
  updateUI();
}

window.elfEfficiency = () => {
  buyUpgrade("elfEfficiency", () => {
    game.elfEfficiency += 1;
  });
};

window.marketingEfficiency = () => {
  buyUpgrade("marketingEfficiency", () => {
    game.eurosPerChild += 2;
  });
};

window.marketingUpgrade = () => {
  buyUpgrade("marketingUpgrade", () => {
    marketingUpgrades.upgradeTier += 1;
  });
};

window.elfSchedule = () => {
  buyUpgrade("elfSchedule", () => {
    if (game.workStartHour > 0) game.workStartHour--;

    if (game.workEndHour < 24) game.workEndHour++;

    if (game.workStartHour === 0 && game.workEndHour === 24) {
      game.fullTime = true;
    }
  });

  updateUI();
};
