import React, { useEffect, useMemo, useState } from "react";
import {
  NumberBox,
  Button as NumberBoxButton,
} from "devextreme-react/number-box";
import withLabel from "./withLabel";
import { Validator, RequiredRule } from "devextreme-react/validator";

const Input = React.memo(
  ({
    children,
    label,
    name,
    value = "",
    handleChange,
    size = "col-12",
    required = true,
    readOnly = false,
    placeholder = "",
    validationErrorMessage,
    valid = true,
    buttonOptions,
    ref,
    nonNegative = false,
    cssClass,
    disabled
  }) => {
    useEffect(() => {
      if (isNaN(value)) handleChange && handleChange({ name, value: 0 });
    }, [value])

    return (
      <NumberBox
        ref={ref}
        validationMessageMode="auto"
        validationStatus={validationErrorMessage ? "invalid" : "valid"}
        validationError={{ message: validationErrorMessage }}
        placeholder={placeholder}
        readOnly={readOnly}
        disabled={disabled}
        // rtlEnabled={true}
        style={{ height: '38px' }}
        value={parseFloat(value)}
        name={name}
        onInput={({ event }) => {
          if (nonNegative && event.target.value.includes('-')) {
            handleChange({ name, value: 0 })
          }
          else {
            handleChange({ name, value: event.target.value !== '' ? event.target.value : '0' })
          }

        }
        }
        className={cssClass + (!valid && " cell-error")}

      >
        {buttonOptions && (
          <NumberBoxButton
            name={name}
            location="before"
            options={buttonOptions}

          />
        )}
        {required && (
          <Validator>
            <RequiredRule message="هذا الحقل مطلوب" />
          </Validator>
        )}
      </NumberBox>
    );
  }
);

export default withLabel(Input);
