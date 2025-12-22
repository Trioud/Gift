import { format, addHours } from 'https://cdn.skypack.dev/date-fns@2.30.0';

const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
resizeCanvas();

let camera = {
  x: 0,
  y: 0,
  dragging: false,
  lastX: 0,
  lastY: 0
};

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
  ctx.fillStyle = '#0af';
  ctx.fillRect(0, 0, 100, 100);
  ctx.restore();
}

function gameLoop() {
  drawBackground();
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