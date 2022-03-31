import React from "react";
import { NumberBox } from "devextreme-react/number-box";
import withLabel from "./withLabel";
import { Validator, RequiredRule } from "devextreme-react/validator";

const NumberBoxFullWidth = React.memo(
  ({
    label,
    name,
    validationErrorMessage,
    value = "",
    handleChange,
    size,
    required = true,
    readOnly = false,
    showColor = true,
    mode = "number",
    stylingMode = "filled",
    placeholder = "",
  }) => {
    let colorClass = value >= 0 ? " greenInput" : " redInput";
    return (
      <NumberBox
        placeholder={placeholder}
        validationMessageMode="auto"
        validationStatus={validationErrorMessage ? "invalid" : "valid"}
        validationError={{ message: validationErrorMessage }}
        mode={mode}
        stylingMode={stylingMode}
        className={size + (showColor ? colorClass : "")}
        readOnly={readOnly}
        style={{ direction: "ltr" }}
        value={value || null}
        name={name}
        height="36px"
        onInput={({ event }) =>
          handleChange({ name, value: event.target.value })
        }
      />
    );
  }
);

export default NumberBoxFullWidth;
