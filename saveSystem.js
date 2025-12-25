import { deserializeGameState, serializeGameState } from './utils.js';

let saveTimeout = null;
// 1 sec in ms
const SAVE_DEBOUNCE_MS = 2000;

function saveGame(gameObject) {
  const state = serializeGameState(gameObject);
  if (state) {
    localStorage.setItem('gameState', JSON.stringify(state));
    console.log('[SaveSystem] Game saved immediately');
  }
}

// deprecated
function autoSave(gameObject) {
  if (saveTimeout) {
    clearTimeout(saveTimeout);
  }

  saveTimeout = setTimeout(() => {
    const state = serializeGameState(gameObject);
    if (state) {
      localStorage.setItem('gameState', JSON.stringify(state));
      console.log('[SaveSystem] Game auto-saved');
    }
    saveTimeout = null;
  }, SAVE_DEBOUNCE_MS);
}

function initSaveSystem(gameObject) {
  const localState = localStorage.getItem('gameState');
  if (localState) {
    const gameState = deserializeGameState(localState)
    if (!gameState) return false

    Object.assign(gameObject, gameState);
    console.log('[SaveSystem] Game loaded from local storage');
    return true;
  }
  console.log('[SaveSystem] No save found, starting new game');
}



export { saveGame, autoSave, initSaveSystem };
