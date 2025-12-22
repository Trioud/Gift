import { game } from './gamelogic.js';

const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
resizeCanvas();

// Z-index canvas fix
canvas.style.position = 'fixed';
canvas.style.top = '0';
canvas.style.left = '0';
canvas.style.zIndex = '0';

let camera = { x: 0, y: 0, dragging: false, lastX: 0, lastY: 0 };
let draggedModule = null;
let dragOffset = { x: 0, y: 0 };

// Update module positions each frame
function updateModulePositions() {
  document.querySelectorAll('.window.box').forEach(mod => {
    const x = parseInt(mod.dataset.worldX || '0', 10);
    const y = parseInt(mod.dataset.worldY || '0', 10);
    mod.style.transform = `translate(${x - camera.x}px, ${y - camera.y}px)`;
  });
}

function clearCanvas() {
  ctx.fillStyle = '#fff';
  ctx.fillRect(0, 0, canvas.width, canvas.height);
}

function gameLoop() {
  clearCanvas();
  updateModulePositions();
  requestAnimationFrame(gameLoop);
}

requestAnimationFrame(gameLoop);

// Global dragging logic (canvas or modules)
document.addEventListener('mousedown', (e) => {
  const title = e.target.closest('.box');

  if (title) {
    // Start dragging a module
    draggedModule = title.closest('.window.box');
    const rect = draggedModule.getBoundingClientRect();
    dragOffset.x = e.clientX - rect.left;
    dragOffset.y = e.clientY - rect.top;
  } else {
    // Start dragging the camera
    camera.dragging = true;
    camera.lastX = e.clientX;
    camera.lastY = e.clientY;
  }
});

document.addEventListener('mousemove', (e) => {
  if (draggedModule) {
    const newWorldX = e.clientX - dragOffset.x + camera.x;
    const newWorldY = e.clientY - dragOffset.y + camera.y;
    draggedModule.dataset.worldX = Math.round(newWorldX);
    draggedModule.dataset.worldY = Math.round(newWorldY);
  } else if (camera.dragging) {
    const dx = e.clientX - camera.lastX;
    const dy = e.clientY - camera.lastY;
    camera.x += dx;
    camera.y += dy;
    camera.lastX = e.clientX;
    camera.lastY = e.clientY;
  }
});

document.addEventListener('mouseup', () => {
  draggedModule = null;
  camera.dragging = false;
});

window.addEventListener('resize', resizeCanvas);
function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}
