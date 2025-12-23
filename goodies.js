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

  if (game.upgrades.marketing.instagroom.current === 1) {
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
}
