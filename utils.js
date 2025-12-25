
/**
 *
 * @param {*} game
 * @returns
 */
function serializeGameState(game) {
  try {
    const gameCpy = JSON.parse(JSON.stringify(game))
    const gameState = {
      timestamp: Date.now(),
      lastUpdate: Date.now(),
      lastSave: Date.now(),
      game: {
        ...gameCpy,
        gameTime: game.gameTime instanceof Date
          ? game.gameTime.toISOString()
          : game.gameTime
      }
    }
    return gameState
  } catch (err) {
    console.error('[SaveSystem] Seriziation error:', err);
    return null;
  }
}

/**
 *
 * @param {*} save
 * @returns game
 */
function deserializeGameState(save) {
  try {
    const state = JSON.parse(save);
    if (state.game.gameTime) {
      state.game.gameTime = new Date(state.game.gameTime);
    }

    return state.game
  } catch (err) {
    console.error('[SaveSystem] Seriziation error:', err);
    return null;
  }
}
export { serializeGameState, deserializeGameState }
