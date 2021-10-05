import classNames from "classnames";
import React, { useContext } from "react";
import GameContext from "./GameContext";
import { GAME_STATES, TILE_TYPES } from "./states";

const Tile = ({ id, tile }) => {
  const { play, markFlag, gameState } = useContext(GameContext);

  const handleClick = (e) => {
    if (e.type === "click") {
      // Left click
      console.debug("tile clicked:", id);
      play(id);
    } else if (e.type === "contextmenu") {
      // Right click
      markFlag(id);
      e.preventDefault();
    }
  };

  const fetchTileSymbol = (tile) => {
    if (!tile.revealed && tile.flagged) return "🚩";
    if (tile.revealed && tile.type === TILE_TYPES.bomb) return "💥";
    if (gameState !== GAME_STATES.gameOver) {
      if (!tile.revealed) return "";
    }

    switch (tile.type) {
      case TILE_TYPES.bomb:
        return "💣";
      case TILE_TYPES.hint:
        return tile.hint;
      default:
        return "";
    }
  };

  const tileSymbol = fetchTileSymbol(tile);

  const classes = classNames("tile", `tile-${tile.type}`, {
    ["tile--revealed"]: tile.revealed,
    ["tile--flagged"]: !tile.revealed && tile.flagged,
  });

  return (
    <span onClick={handleClick} onContextMenu={handleClick} className={classes}>
      {tileSymbol}
    </span>
  );
};

export default Tile;
