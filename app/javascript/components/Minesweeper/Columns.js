import React from "react";

import { TILE_TYPES } from "./states";
import Tile from "./Tile";

const Columns = ({ rowPosition, width, tiles }) => {
  return (
    <div className="game-column" key={`rows-${rowPosition}`}>
      {Array.from({ length: width }, (_, i) => i + 1).map(
        (columnPosition, _) => {
          const id = columnPosition + rowPosition * width;
          const currentTile = tiles[id] || {
            type: TILE_TYPES.blank,
            revealed: false,
            flagged: false,
          };

          return (
            <Tile
              key={`column-${rowPosition}-${columnPosition}`}
              id={id}
              tile={currentTile}
            ></Tile>
          );
        }
      )}
    </div>
  );
};

export default Columns;
