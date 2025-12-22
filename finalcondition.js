import {
  format,
  addHours,
  isSameMinute,
} from "https://cdn.skypack.dev/date-fns@2.30.0";
import { game } from "./gamelogic.js";

//const endTime = new Date(2025, 11, 25, 0, 0, 0); // Month 11 = December

export function finishGame(tick) {
  if (game.enfants >= 1000000000) {
    document.getElementById("endScreenW").style.display = "flex";
  } else {
    document.getElementById("endScreenL").style.display = "flex";
  }
  clearInterval(tick);
}
