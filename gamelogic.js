import { format, addHours } from 'https://cdn.skypack.dev/date-fns@2.30.0';

export let game = {
  euros: 0,
  eurosPerSecond: 1,
  gameTime: new Date(2025, 0, 1, 9, 0, 0) // Jan 1, 09:00
};

const euroDisplay = document.getElementById('goldCount');
const giftButton = document.createElement('button');
giftButton.textContent = 'Emballer le cadeau';
giftButton.style.position = 'relative';
giftButton.style.marginTop = '10px';
document.getElementById('ui').appendChild(giftButton);

giftButton.onclick = () => {
  game.euros += 10;
  updateUI();
};

setInterval(() => {
  game.euros += game.eurosPerSecond;
  game.gameTime = addHours(game.gameTime, 1);
  updateUI();
}, 1000);

function updateUI() {
  euroDisplay.textContent = `€${Math.floor(game.euros)} | ${format(game.gameTime, 'MMM d, HH:mm')}`;
}