import React from "react";
import PropTypes from "prop-types";
import './Button.css'; 

function Button({ children, isClicked }) {
  return (
    <button className="custom-button" onClick={isClicked}>
      {children}
    </button>
  );
}

Button.propTypes = {
  children: PropTypes.any.isRequired,
  isClicked: PropTypes.func
};

export default Button;