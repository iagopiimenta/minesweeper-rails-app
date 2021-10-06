import { GAME_STATES, TILE_TYPES } from "./states";

const fetchRowPosition = (columnLength, id) => {
  return Math.floor((id - 1) / columnLength);
};

const checkTileIsSameLevel = (referenceId, targetId, columnLength) => {
  const referencePosition = fetchRowPosition(columnLength, referenceId);
  const targetPosition = fetchRowPosition(columnLength, targetId);

  return referencePosition === targetPosition ? targetId : null;
};

const neighborhoodIdsFrom = (id, width, height) => {
  const left = checkTileIsSameLevel(id, id - 1, width);
  const right = checkTileIsSameLevel(id, id + 1, width);
  const top = id - width;
  const bottom = id + width;
  const topRight = checkTileIsSameLevel(top, top + 1, width);
  const topLeft = checkTileIsSameLevel(top, top - 1, width);
  const bottomRight = checkTileIsSameLevel(bottom, bottom + 1, width);
  const bottomLeft = checkTileIsSameLevel(bottom, bottom - 1, width);

  const neighbors = [
    left,
    right,
    top,
    bottom,
    topRight,
    topLeft,
    bottomRight,
    bottomLeft,
  ];
  return neighbors.filter((e) => e && e >= 1 && e <= width * height);
};

export const generateTilesBombs = (width, height) => {
  const bombIds = [];

  const totalTiles = width * height;
  while (bombIds.length < totalTiles * 0.1) {
    const rand = Math.floor(Math.random() * totalTiles) + 1;
    if (bombIds.indexOf(rand) === -1) {
      bombIds.push(rand);
    }
  }

  const newTiles = {};
  bombIds.forEach((id) => {
    newTiles[id] = {
      type: TILE_TYPES.bomb,
      revealed: false,
      flagged: false,
    };
    const neighbors = neighborhoodIdsFrom(id, width, height);

    neighbors.forEach((neighborId) => {
      const totalBombs = neighborhoodIdsFrom(neighborId, width, height).filter(
        (blockId) => {
          return bombIds.includes(blockId);
        }
      );

      if (newTiles[neighborId]) return;

      newTiles[neighborId] = {
        type: TILE_TYPES.hint,
        revealed: false,
        flagged: false,
        hint: totalBombs.length,
      };
    });
  });

  return newTiles;
};

const canShowTile = (id, tiles, width, height) => {
  if (isBomb(id, tiles)) return false;

  const neighborhoodIds = neighborhoodIdsFrom(id, width, height);

  return !neighborhoodIds.some((tileId) => isBomb(tileId, tiles));
};

const isBomb = (id, tiles) => {
  return tiles[id]?.type === TILE_TYPES.bomb;
};

const checkWinner = (newTiles, setGameState) => {
  const isMissingFlagSomeBomb = Object.keys(newTiles).some(
    (tileId) =>
      newTiles[tileId].type !== TILE_TYPES.bomb && !newTiles[tileId].revealed
  );

  console.log("isMissingFlagSomeBomb", isMissingFlagSomeBomb);

  if (!isMissingFlagSomeBomb) setGameState(GAME_STATES.won);
};

export const markFlag = (id, tiles, setTilesCallback, gameState, setGameState) => {
  if (gameState === GAME_STATES.gameOver) return;

  const newTiles = {
    ...tiles,
    [id]: {
      ...tiles[id],
      flagged: !tiles[id]?.flagged,
    },
  };

  setTilesCallback(newTiles);

  checkWinner(newTiles, setGameState);
};

export const play = (
  id,
  tiles,
  width,
  height,
  setTilesCallback,
  gameState,
  setGameState
) => {
  if (gameState === GAME_STATES.gameOver) return;

  const currentTile = tiles[id] || {};

  if (currentTile.type === TILE_TYPES.blank && currentTile.revealed) return;

  if (isBomb(id, tiles)) {
    const newTiles = {
      ...tiles,
      [id]: {
        ...currentTile,
        revealed: true,
      },
    };

    setTilesCallback(newTiles);
    setGameState(GAME_STATES.gameOver);
    return;
  }

  if (currentTile.type === TILE_TYPES.hint && !currentTile.revealed) {
    const newTiles = {
      ...tiles,
      [id]: {
        ...currentTile,
        revealed: true,
      },
    };

    setTilesCallback(newTiles);
    checkWinner(newTiles, setGameState);
    return;
  }

  if (currentTile.type === TILE_TYPES.hint && currentTile.revealed) {
    const neighbors = neighborhoodIdsFrom(id, width, height);
    const flaggedCount = neighbors.filter((tileId) => tiles[tileId]?.flagged);
    if (flaggedCount.length !== currentTile.hint) return;

    const tileMissingFlag = neighbors.find(
      (tileId) =>
        tiles[tileId]?.type === TILE_TYPES.bomb && !tiles[tileId]?.flagged
    );
    if (tileMissingFlag) {
      setTilesCallback({
        ...tiles,
        [tileMissingFlag]: {
          ...tiles[tileMissingFlag],
          revealed: true,
        },
      });
      setGameState(GAME_STATES.gameOver);
      return;
    }
  }

  let neighborhoodIds = neighborhoodIdsFrom(id, width, height);
  let tilesToCheck = neighborhoodIds.filter((id) =>
    canShowTile(id, tiles, width, height)
  );
  let hints = neighborhoodIds.filter(
    (id) => !canShowTile(id, tiles, width, height) && !isBomb(id, tiles)
  );
  neighborhoodIds.push(id);

  let tilesToRevel = [id];

  while (tilesToCheck.length > 0) {
    tilesToRevel = [...tilesToRevel, ...tilesToCheck];
    tilesToCheck.forEach((id) => {
      const nextNeighborhoodIds = neighborhoodIdsFrom(id, width, height).filter(
        (tileId) => !neighborhoodIds.includes(tileId)
      );
      const nextCanShowTilesList = nextNeighborhoodIds.filter((tileId) =>
        canShowTile(tileId, tiles, width, height)
      );
      hints = [
        ...hints,
        ...nextNeighborhoodIds.filter(
          (tileId) =>
            !canShowTile(tileId, tiles, width, height) && !isBomb(tileId, tiles)
        ),
      ];
      neighborhoodIds = [...nextNeighborhoodIds, ...neighborhoodIds];
      tilesToCheck = [...tilesToCheck, ...nextCanShowTilesList];
      tilesToCheck.splice(tilesToCheck.indexOf(id), 1);
    });
  }

  const newTiles = { ...tiles };

  [...tilesToRevel, ...hints].forEach(
    (tileId) =>
      (newTiles[tileId] = {
        type: TILE_TYPES.blank,
        ...newTiles[tileId],
        revealed: true,
      })
  );

  setTilesCallback(newTiles);

  checkWinner(newTiles, setGameState);
};
