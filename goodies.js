import { game } from "./gamelogic.js";

function updateMascotteWindow() {
  const windowEl = document.getElementById("mascotte-window");
  const imgEl = document.getElementById("mascotte-image");

  const isBought = game.upgrades.marketing.mascotte.current == 1;

  if (isBought) {
    windowEl.style.display = "block";
  } else {
    windowEl.style.display = "none";
  }
}

function updateInstagroomWindow() {
  const win = document.getElementById("instagroom-window");
  if (!win) return;

  if (game.upgrades.marketing.instagroom.current >= 1) {
    win.style.display = "block";
  } else {
    win.style.display = "none";
  }
}

function updateMotivationWindow() {
  const win = document.getElementById("motivation-window");
  if (!win) return;

  if (game.upgrades.rh.elfEfficiency.current === 1) {
    win.style.display = "block";
  } else {
    win.style.display = "none";
  }
}

function updateCharcoal() {
  const win = document.getElementById("charbon-window");
  if (!win) return;

  if (game.upgrades.sabotage.charbon.current == 1) {
    win.style.display = "block";
  } else {
    win.style.display = "none";
  }
}

function updateBribe() {
  const win = document.getElementById("bribe-window");
  if (!win) return;

  if (game.upgrades.sabotage.corruption.current == 1) {
    win.style.display = "block";
  } else {
    win.style.display = "none";
  }
}

function updateMadame() {
  const win = document.getElementById("madame-window");
  if (!win) return;

  if (game.upgrades.sabotage.casserole.current == 1) {
    win.style.display = "block";
  } else {
    win.style.display = "none";
  }
}

function updateConveyor() {
  const win = document.getElementById("conveyor-window");
  if (!win) return;

  if (game.conveyorActive) {
    win.style.display = "block";
  } else {
    win.style.display = "none";
  }
}

function updateAllWorkWindow() {
  const win = document.getElementById("allwork-window");
  if (!win) return;

  if (game.upgrades.rh.elfSchedule.current === 6) {
    win.style.display = "block";
  } else {
    win.style.display = "none";
  }
}

export function updateGoodies() {
  updateMascotteWindow();
  updateInstagroomWindow();
  updateAllWorkWindow();
  updateMotivationWindow();
  updateConveyor();
  updateCharcoal();
  updateBribe();
  updateMadame();
}
