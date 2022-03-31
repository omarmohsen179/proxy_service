import React from "react";

let withLabel = (WrappedComponent) => {
  const withLabel = (props) => {
    let { label, size } = props;
    return (
      <div className={"input-wrapper " + size}>
        {label && <div className="label">{label}</div>}
        <WrappedComponent {...props} />
      </div>
    );
  };
  return withLabel;
};
export default withLabel;
