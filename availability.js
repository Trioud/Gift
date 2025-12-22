// availability.js
import { game } from "./gamelogic.js";
import { upgrades, remainingPurchases } from "./marketing.js";

export function availability() {
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
  for (const key in upgrades) {
    const btn = document.querySelector(`button[onclick="${key}()"]`);
    if (!btn) continue;

    const upgrade = upgrades[key];
    const remaining = remainingPurchases[key];
    const blocked = remaining <= 0 || game.argent < upgrade.price;

    btn.classList.toggle("disabled", blocked);
    btn.disabled = blocked;
  }
}
