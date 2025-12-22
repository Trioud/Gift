import { game } from "./gamelogic.js";

export function availability() {
  const marketingUpgrades = game.upgrades.marketing;
  const RHUpgrades = game.upgrades.rh;

  // Fête des RH
  const rhBtn = document.querySelector('button[onclick="feteRH()"]');
  if (rhBtn) {
    rhBtn.classList.toggle("disabled", game.argent <= 0);
    rhBtn.disabled = game.argent <= 0;
  }

  // Sabotage
  const sabotageBtn = document.querySelector(
    'button[onclick="utiliserSabotage()"]'
  );
  if (sabotageBtn) {
    sabotageBtn.classList.toggle("disabled", game.feteRH < 5);
    sabotageBtn.disabled = game.feteRH < 5;
  }

  // Acheter un Lutin
  const lutinBtn = document.querySelector('button[onclick="acheterLutin()"]');
  if (lutinBtn) {
    lutinBtn.classList.toggle("disabled", game.argent < game.elfCost);
    lutinBtn.disabled = game.argent < game.elfCost;
  }

  // Tapis Roulant
  const conveyorBtn = document.querySelector(
    'button[onclick="conveyorbelt()"]'
  );
  if (conveyorBtn) {
    const blocked = game.argent < 5000 || game.conveyorActive;
    conveyorBtn.classList.toggle("disabled", blocked);
    conveyorBtn.disabled = blocked;
  }

  // Marketing Upgrades
  for (const key in marketingUpgrades) {
    const btn = document.querySelector(`button[onclick="${key}()"]`);
    if (!btn) continue;

    const upgrade = marketingUpgrades[key];
    const current = upgrade.current;
    const blocked = upgrade.limit <= current || game.argent < upgrade.price;
    btn.classList.toggle("disabled", blocked);
    btn.disabled = blocked;
  }

  // RH Upgrades
  for (const key in RHUpgrades) {
    const btn = document.querySelector(`button[onclick="${key}()"]`);
    if (!btn) continue;

    const upgrade = RHUpgrades[key];
    const current = upgrade.current;
    const blocked = upgrade.limit <= current || game.argent < upgrade.price;

    btn.classList.toggle("disabled", blocked);
    btn.disabled = blocked;
  }
}
