import React from "react";
import PropTypes from "prop-types";

const GameApp = () => {
  return <React.Fragment>Id: {this.props.id}</React.Fragment>;
};

GameApp.propTypes = {
  id: PropTypes.number,
};
export default GameApp;
