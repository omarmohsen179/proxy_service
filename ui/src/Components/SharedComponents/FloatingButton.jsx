import React from "react";

const FloatingButton = ({ iconClass, colorClass, clickHandle }) => {
  return (
    <div
      className={"btn-floating btn-large mx-3 " + colorClass}
      onClick={clickHandle}
    >
      <i className={iconClass} />
    </div>
  );
};

export default React.memo(FloatingButton);
