import React, { useContext, useState, useEffect } from "react";
import PropTypes from "prop-types";
import classNames from "classnames";

import "./index.scss";
import GameContext from "./GameContext";
import { GAME_STATES } from "./states";
import { fetchGame, updateGame } from "./client";
import Columns from "./Columns";
import { generateTilesBombs, markFlag, play } from "./actions";

const GameApp = ({ id: gameId, height, width, state: originalState }) => {
  const [tiles, setTiles] = useState({});
  const [state, setState] = useState(originalState);

  const handleMarkFlag = (id) => {
    markFlag(id, tiles, setTiles, state, setState);
  };
  const handlePlay = (id) => {
    play(id, tiles, width, height, setTiles, state, setState);
  };

  useEffect(async () => {
    if (state === GAME_STATES.gameOver && Object.keys(tiles).length > 0) {
      updateGame(gameId, { state, tiles });
    } else if (state === GAME_STATES.pendingMining) {
      setTiles(generateTilesBombs(width, height));
      setState(GAME_STATES.playing);
    } else if (state === GAME_STATES.playing && Object.keys(tiles).length > 0) {
      updateGame(gameId, { tiles });
    }
  }, [tiles, state]);

  useEffect(async () => {
    if (Object.keys(tiles).length === 0) {
      const gameData = await fetchGame(gameId);
      setTiles(gameData.tiles);
      setState(gameData.state);
    }
  }, [tiles, state]);

  useEffect(async () => {
    if (state !== originalState) {
      updateGame(gameId, { state });
    }
  }, [state]);

  const classes = classNames("gameplay", {
    ["gameplay--gameover"]: state === GAME_STATES.gameOver,
  });

  const fetchGameEmoji = () => {
    switch (state) {
      case GAME_STATES.playing:
        return "🙂";
      case GAME_STATES.won:
        return "😎";
      default:
        return "😵";
    }
  };

  if (Object.keys(tiles).length === 0) return null;

  const gameEmoji = fetchGameEmoji();

  return (
    <main className={classes}>
      <GameContext.Provider
        value={{ markFlag: handleMarkFlag, play: handlePlay, gameState: state }}
      >
        <div className="game-header">{gameEmoji}</div>
        <div className="game-root">
          {[...Array(height).keys()].map((rowPosition, _) => {
            return (
              <Columns
                key={`row-${rowPosition}`}
                rowPosition={rowPosition}
                width={width}
                tiles={tiles}
              />
            );
          })}
        </div>
      </GameContext.Provider>
    </main>
  );
};

GameApp.propTypes = {
  id: PropTypes.number,
};
export default GameApp;
