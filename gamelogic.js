// gamelogic.js
import { format, addHours } from "https://cdn.skypack.dev/date-fns@2.30.0";
import { toggleConvoyer } from "./conveyor.js";
import { availability } from "./availability.js";

export const numberFormatter = new Intl.NumberFormat("fr-FR");

export let game = {
  argent: 0,
  cadeaux: 0,
  enfants: 0,
  lutins: 0,
  workStartHour: 6,
  workEndHour: 18,
  fullTime: false,
  cdf: 0,
  sabotages: 0,
  giftsPerChild: 5,
  eurosPerChild: 2,
  elfCost: 100,
  elfEfficiency: 1,
  conveyorActive: false,
  gameTime: new Date(2025, 0, 1, 9, 0, 0),
  gameStarted: false,
};

function isWorkHour() {
  if (game.fullTime) return true;

  const hour = game.gameTime.getHours();
  console.log(hour);
  return hour >= game.workStartHour && hour < game.workEndHour;
}

window.startGame = () => {
  game.gameStarted = true;
  document.getElementById("station").style.display = "block";
  document.getElementById("missionScreen").style.display = "none";
  setInterval(() => {
    if (game.gameStarted && isWorkHour()) {
      game.cadeaux += game.lutins;
    }
    game.gameTime = addHours(game.gameTime, 1);
    game.enfants = Math.floor(game.cadeaux / game.giftsPerChild);
    game.argent += game.enfants * game.eurosPerChild;
    updateUI();
  }, 2000);
};

if (!game.gameStarted) {
  const el = document.getElementById("station");
  el.style.display = "none";
}

window.conveyorbelt = () => {
  if (game.enfants >= 100 && game.argent >= 5000 && !game.conveyorActive) {
    game.argent -= 5000;
    const conveyorBtn = document.querySelector(
      'button[onclick="conveyorbelt()"]'
    );
    game.conveyorActive = true;
    game.elfEfficiency += 0.2;
    conveyorBtn.textContent = "Tapis Roulant opérationnel 🏗️";
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
    game.cdf += 1;
    game.argent = 0;
    updateUI();
  }
};

window.utiliserSabotage = () => {
  if (game.cdf >= 5) {
    game.sabotages += 1;
    game.cdf -= 5;
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

    const formatted =
      typeof value === "number" ? numberFormatter.format(value) : value;

    el.textContent = `${prefix}${formatted}${unit}`;
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
  updateStat("cdf", game.cdf);

  const time = document.getElementById("horloge");
  const timeParent = time?.parentElement;
  if (time && timeParent) {
    time.textContent = format(game.gameTime, "MMMM dd, HH:mm");
    timeParent.style.display = "block";
  }

  const lutinButton = document.querySelector(
    'button[onclick="acheterLutin()"]'
  );
  if (lutinButton) {
    lutinButton.textContent = `Embaucher un Lutin (€${numberFormatter.format(
      game.elfCost
    )})`;
  }

  toggleModules();
  toggleSubModules();

  const horaires = document.getElementById("horairesLutins");
  if (horaires) {
    if (game.fullTime) {
      horaires.textContent = "Les lutins travaillent 24h/24 (temps plein)";
    } else {
      horaires.textContent = `Les lutins travaillent de ${game.workStartHour}h00 à ${game.workEndHour}h00`;
    }
  }
  availability();
}

updateUI();
