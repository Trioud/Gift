import { game, updateUI } from "./gamelogic.js";

const marketingUpgrades = game.upgrades.marketing;
const RHUpgrades = game.upgrades.rh;

function buyUpgrade(key, effectFn) {
  const upgrade = RHUpgrades[key];

  if (upgrade.limit === 0) return;
  if (game.cdf < upgrade.price) return;

  game.cdf -= upgrade.price;

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
    console.log(RHUpgrades.marketingUpgrade);
    RHUpgrades.marketingUpgrade.current += 1;
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
