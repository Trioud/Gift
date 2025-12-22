import { game } from "./gamelogic.js";

export function toggleConvoyer() {
  const child = game.enfants;
  document
    .querySelector('[data-child-treshold="100"]')
    ?.style.setProperty("display", child >= 100 ? "block" : "none");
}
