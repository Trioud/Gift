import { game, updateUI } from "./gamelogic.js";

const marketingUpgrades = game.upgrades.marketing;
const RHUpgrades = game.upgrades.rh;

function buyUpgrade(key, effectFn) {
  const upgrade = RHUpgrades[key];

  if (upgrade.limit === 0) return;
  if (RHUpgrades.cdf < upgrade.price) return;

  RHUpgrades.cdf -= upgrade.price;

  if (upgrade.limit > 0) {
    upgrade.limit -= 1;
  }

  effectFn();
  updateUI();
}

window.elfEfficiency = () => {
  buyUpgrade("elfEfficiency", () => {
    console.log(RHUpgrades.elfEfficiency);
    RHUpgrades.elfEfficiency.current += 1;
  });
};

window.marketingEfficiency = () => {
  buyUpgrade("marketingEfficiency", () => {
    console.log(RHUpgrades.marketingEfficiency);
    RHUpgrades.marketingEfficiency.current += 1;
    game.eurosPerChild += 2;
  });
};

window.marketingUpgrade = () => {
  buyUpgrade("marketingUpgrade", () => {
    game.marketingTier += 1;
  });
};

window.elfSchedule = () => {
  buyUpgrade("elfSchedule", () => {
    RHUpgrades.elfSchedule.current += 1;
    if (game.workStartHour > 0) game.workStartHour--;

    if (game.workEndHour < 24) game.workEndHour++;

    if (game.workStartHour === 0 && game.workEndHour === 24) {
      game.fullTime = true;
    }
  });

  updateUI();
};
