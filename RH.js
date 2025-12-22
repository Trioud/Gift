import { format, addHours } from "https://cdn.skypack.dev/date-fns@2.30.0";
import { toggleConvoyer } from "./conveyor.js";

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
