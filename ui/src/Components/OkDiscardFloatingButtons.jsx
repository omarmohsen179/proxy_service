import React from "react";
import FloatingButton from "./SharedComponents/FloatingButton";

const OkDiscardFloatingButtons = ({ okHandle, discardHandle }) => {
  return (
    <div className="fixed-action-btn">
      <FloatingButton
        iconClass="fas fa-check"
        colorClass="bg-success"
        clickHandle={okHandle}
      />
      <FloatingButton
        iconClass="fas fa-undo"
        colorClass="bg-danger"
        clickHandle={discardHandle}
      />
    </div>
  );
};

export default React.memo(OkDiscardFloatingButtons);
