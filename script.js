// script.js
import { format, addHours } from 'https://cdn.skypack.dev/date-fns@2.30.0';

// Game State
export let game = {
  euros: 0,
  eurosPerSecond: 1,
  gameTime: new Date(2025, 0, 1, 9, 0, 0) // Jan 1, 09:00
};

// Canvas Setup
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
resizeCanvas();

// Camera
let camera = {
  x: 0,
  y: 0,
  dragging: false,
  lastX: 0,
  lastY: 0
};

// UI Elements
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

// Game Loop (Tick System)
setInterval(() => {
  game.euros += game.eurosPerSecond;
  game.gameTime = addHours(game.gameTime, 1); // 1 in-game hour per second
  updateUI();
}, 1000);

function updateUI() {
  euroDisplay.textContent = `€${Math.floor(game.euros)} | ${format(game.gameTime, 'MMM d, HH:mm')}`;
}

// Background Drawing
function drawBackground() {
  ctx.save();
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.translate(camera.x, camera.y);
  ctx.fillStyle = '#222';
  for (let x = 0; x < canvas.width * 2; x += 100) {
    for (let y = 0; y < canvas.height * 2; y += 100) {
      ctx.strokeStyle = '#333';
      ctx.strokeRect(x, y, 100, 100);
    }
  }
  // Quick square
  ctx.fillStyle = '#0af';
  ctx.fillRect(0, 0, 100, 100);
  ctx.restore();
}

function gameLoop() {
  drawBackground();
  requestAnimationFrame(gameLoop);
}
requestAnimationFrame(gameLoop);

// Camera Dragging
canvas.addEventListener('mousedown', (e) => {
  camera.dragging = true;
  camera.lastX = e.clientX;
  camera.lastY = e.clientY;
});

canvas.addEventListener('mouseup', () => {
  camera.dragging = false;
});

canvas.addEventListener('mousemove', (e) => {
  if (!camera.dragging) return;
  let dx = e.clientX - camera.lastX;
  let dy = e.clientY - camera.lastY;
  camera.x += dx;
  camera.y += dy;
  camera.lastX = e.clientX;
  camera.lastY = e.clientY;
});

// Resize Canvas on Window Resize
window.addEventListener('resize', resizeCanvas);
function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}