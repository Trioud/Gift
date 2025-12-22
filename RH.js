import { game, updateUI } from "./gamelogic.js";
import { upgrades as marketingUpgrades } from "./marketing.js";

const upgrades = {
  elfEfficiency: { price: 1, limit: 1 },
  marketingEfficiency: { price: 1, limit: 1 },
  marketingUpgrade: { price: 1, limit: 3 },
  elfSchedule: { price: 1, limit: 5 },
  nightClub: { price: 1, limit: 1 },
  sabotageCoin: { price: 5, limit: -1 },
};

function buyUpgrade(key, effectFn) {
  const upgrade = upgrades[key];

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
