import { game, updateUI } from "./gamelogic.js";

window.augmenterTempsDeTravail = () => {
  if (game.cdf >= 1) {
    if (game.workStartHour > 0) game.workStartHour--;

    if (game.workEndHour < 24) game.workEndHour++;

    if (game.workStartHour === 0 && game.workEndHour === 24) {
      game.fullTime = true;
    }
    game.cdf -= 1;
  }

  updateUI();
};
