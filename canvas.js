// canvas.js
import { game } from './gamelogic.js';

const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
resizeCanvas();

let camera = { x: 0, y: 0, dragging: false, lastX: 0, lastY: 0 };

function clearCanvas() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
}

function gameLoop() {
  clearCanvas();
  requestAnimationFrame(gameLoop);
}

requestAnimationFrame(gameLoop);

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

window.addEventListener('resize', resizeCanvas);
function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}