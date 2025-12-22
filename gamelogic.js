// gamelogic.js
import { format, addHours } from 'https://cdn.skypack.dev/date-fns@2.30.0';

export let game = {
  argent: 0,
  cadeaux: 0,
  enfants: 0,
  lutins: 0,
  feteRH: 0,
  sabotages: 0,
  giftsPerChild: 5,
  eurosPerChild: 2,
  elfCost: 100,
  gameTime: new Date(2025, 0, 1, 9, 0, 0)
};

window.miner = () => {
  game.argent += 10 * (1 + game.feteRH);
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

function toggleModules() {
  const child = game.enfants;
  document.querySelector('[data-threshold="100"]')?.style.setProperty('display', child >= 100 ? 'block' : 'none');
  document.querySelectorAll('[data-threshold="1000"]').forEach(el => el.style.display = child >= 1000 ? 'block' : 'none');
  document.querySelectorAll('[data-threshold="10000"]').forEach(el => el.style.display = child >= 10000 ? 'block' : 'none');
  document.querySelectorAll('[data-threshold="100000"]').forEach(el => el.style.display = child >= 100000 ? 'block' : 'none');
  document.querySelectorAll('[data-threshold="1000000"]').forEach(el => el.style.display = child >= 1000000 ? 'block' : 'none');
}

function updateStat(id, value, prefix = '', unit = '') {
  const el = document.getElementById(id);
  const wrapper = el?.parentElement;
  if (!el || !wrapper) return;

  const thresholdAttr = wrapper.getAttribute('data-threshold');
  const threshold = thresholdAttr !== null ? parseInt(thresholdAttr) : null;
  const shouldDisplay = threshold === null || value >= threshold;

  if (shouldDisplay) {
    wrapper.style.display = 'block';
    el.textContent = `${prefix}${value}${unit}`;
  } else {
    wrapper.style.display = 'none';
  }
}

function updateUI() {
  updateStat('argent', game.argent);
  updateStat('cadeaux', game.cadeaux);
  updateStat('enfants', game.enfants);
  updateStat('lutins', game.lutins);
  updateStat('sabotage', game.sabotages);
  updateStat('feteRH', game.feteRH);

  const time = document.getElementById('horloge');
  const timeParent = time?.parentElement;
  if (time && timeParent) {
    time.textContent = format(game.gameTime, 'MMM d, HH:mm');
    timeParent.style.display = 'block';
  }

  const lutinButton = document.querySelector('button[onclick="acheterLutin()"]');
  if (lutinButton) {
    lutinButton.textContent = `Acheter un Lutin (€${game.elfCost})`;
  }

  toggleModules();
}

setInterval(() => {
  game.cadeaux += game.lutins;
  game.enfants = Math.floor(game.cadeaux / game.giftsPerChild);
  game.argent += game.enfants * game.eurosPerChild;
  game.gameTime = addHours(game.gameTime, 1);
  updateUI();
}, 2000);

updateUI();