import React from "react";
import "./spinner.css";
import spinner from "./spinner.gif";

const Spinner = () => {
  return (
    <div id="spinner" className="position-fixed">
      <img src={spinner} alt="loading" width="200" height="200" />
    </div>
  );
};

export default Spinner;
