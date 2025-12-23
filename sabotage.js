import { game, updateUI } from "./gamelogic.js";

const sabotageUpgrades = game.upgrades.sabotage;

function buyUpgrade(key, effectFn) {
  const upgrade = sabotageUpgrades[key];

  if (upgrade.limit <= upgrade.current && upgrade.limit != -1) return;
  if (game.sabotageCoins < upgrade.price) return;

  if (upgrade.price == -1) {
    game.argent = 0;
  } else {
    game.sabotageCoins -= upgrade.price;
  }

  effectFn();
  updateUI();
}

window.sabotageCoin = () => {
  if (game.upgrades.sabotage.sabotageCoin.price <= game.argent) {
    game.sabotageCoins += 1;
    game.argent -= game.upgrades.sabotage.sabotageCoin.price;
  }
  game.upgrades.sabotage.sabotageCoin.current += 1;
};

window.charbon = () => {
  buyUpgrade("charbon", () => {
    sabotageUpgrades.charbon.current += 1;
    game.cadeaux *= sabotageUpgrades.charbon.reduction;
  });
  w;
};

window.corruption = () => {
  buyUpgrade("corruption", () => {
    console.log(sabotageUpgrades.corruption);
    sabotageUpgrades.corruption.current += 1;
    game.argent *= sabotageUpgrades.corruption.reduction;
  });
};

window.casserole = () => {
  buyUpgrade("casserole", () => {
    console.log(sabotageUpgrades.casserole);
    sabotageUpgrades.casserole.current += 1;
    game.cadeaux *= sabotageUpgrades.casserole.reduction;
  });
};
