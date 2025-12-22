// gamelogic.js
import { format, addHours } from "https://cdn.skypack.dev/date-fns@2.30.0";
import { toggleConvoyer } from "./conveyor.js";

export let game = {
  argent: 0,
  cadeaux: 5000,
  enfants: 0,
  lutins: 0,
  feteRH: 0,
  sabotages: 0,
  giftsPerChild: 5,
  eurosPerChild: 2,
  elfCost: 100,
  elfEfficiency: 1,
  conveyorActive: false,
  gameTime: new Date(2025, 0, 1, 9, 0, 0),
  gameStarted: false,
};

window.startGame = () => {
  game.gameStarted = true;
  document.getElementById("station").style.display = "block";
  document.getElementById("missionScreen").style.display = "none";
  setInterval(() => {
    game.cadeaux += game.lutins;
    game.enfants = Math.floor(game.cadeaux / game.giftsPerChild);
    game.argent += game.enfants * game.eurosPerChild;
    game.gameTime = addHours(game.gameTime, 1);
    updateUI();
  }, 2000);
};

if (!game.gameStarted) {
  const el = document.getElementById("station");
  el.style.display = "none";
}

window.conveyerbelt = () => {
  if (game.enfants >= 100 && game.argent >= 5000 && !game.conveyorActive) {
    game.argent -= 5000;
    game.elfEfficiency += 0.2;
    game.conveyorActive = true;
    conveyorButton.textContent = "Conveyor Activated 🏗️";
    updateUI();
  }
  updateUI();
};

window.acheterLutin = () => {
  const prix = game.elfCost;
  if (game.argent >= prix) {
    game.argent -= prix;
    game.lutins += 1;
    game.elfCost = Math.floor(game.elfCost * 1.5);
    updateUI();
  }
};

window.emballerManuellement = () => {
  game.cadeaux += 1;
  game.enfants = Math.floor(game.cadeaux / game.giftsPerChild);
  updateUI();
};

window.feteRH = () => {
  if (game.argent > 0) {
    game.feteRH += 1;
    game.argent = 0;
    updateUI();
  }
};

window.utiliserSabotage = () => {
  if (game.feteRH >= 5) {
    game.sabotages += 1;
    game.feteRH -= 5;
    updateUI();
  }
};

window.instagroom = () => {
  const prix = 5000;
  if (game.argent >= prix) {
    game.argent -= prix;

    game.giftsPerChild = Math.max(1, game.giftsPerChild - 0.05);
    updateUI();
  }
};

function toggleModules() {
  const child = game.enfants;
  document
    .querySelector('[data-threshold="100"]')
    ?.style.setProperty("display", child >= 100 ? "block" : "none");
  document
    .querySelectorAll('[data-threshold="1000"]')
    .forEach((el) => (el.style.display = child >= 1000 ? "block" : "none"));
  document
    .querySelectorAll('[data-threshold="10000"]')
    .forEach((el) => (el.style.display = child >= 10000 ? "block" : "none"));
  document
    .querySelectorAll('[data-threshold="100000"]')
    .forEach((el) => (el.style.display = child >= 100000 ? "block" : "none"));
  document
    .querySelectorAll('[data-threshold="1000000"]')
    .forEach((el) => (el.style.display = child >= 1000000 ? "block" : "none"));
}

function toggleSubModules() {
  // Emballage
  toggleConvoyer();
}

function updateStat(id, value, prefix = "", unit = "") {
  const el = document.getElementById(id);
  const wrapper = el?.parentElement;
  if (!el || !wrapper) return;

  const thresholdAttr = wrapper.getAttribute("data-threshold");
  const threshold = thresholdAttr !== null ? parseInt(thresholdAttr) : null;
  const shouldDisplay = threshold === null || value >= threshold;

  if (shouldDisplay) {
    wrapper.style.display = "block";
    el.textContent = `${prefix}${value}${unit}`;
  } else {
    wrapper.style.display = "none";
  }
}

export function updateUI() {
  updateStat("argent", game.argent);
  updateStat("cadeaux", game.cadeaux);
  updateStat("enfants", game.enfants);
  updateStat("lutins", game.lutins);
  updateStat("sabotage", game.sabotages);
  updateStat("feteRH", game.feteRH);

  const time = document.getElementById("horloge");
  const timeParent = time?.parentElement;
  if (time && timeParent) {
    time.textContent = format(game.gameTime, "MMM d, HH:mm");
    timeParent.style.display = "block";
  }

  const lutinButton = document.querySelector(
    'button[onclick="acheterLutin()"]'
  );
  if (lutinButton) {
    lutinButton.textContent = `Embaucher un Lutin (€${game.elfCost})`;
  }

  toggleModules();
  toggleSubModules();
}

updateUI();
