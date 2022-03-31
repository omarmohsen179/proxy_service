import React, { useEffect, useState } from "react";
import DateBox from "devextreme-react/date-box";
import withLabel from "./withLabel";
import { Validator, RequiredRule } from "devextreme-react/validator";

const DateTime = ({
  def,
  label,
  name,
  value,
  handleChange,
  required = true,
  validationErrorMessage,
  readOnly = false,
  disabled = false,
  valid = true,
}) => {
  function onValueChanged(e) {
    let dateType = new Date(e.value);
    let month = (parseInt(dateType.getMonth()) + 1).toString();
    let finalFormat = (
      month +
      "/" +
      dateType.getDate() +
      "/" +
      dateType.getFullYear()
    ).toString();
    handleChange({ name: name, value: finalFormat });
  }

  return (
    <DateBox
      validationMessageMode="auto"
      validationStatus={validationErrorMessage ? "invalid" : "valid"}
      validationError={{ message: validationErrorMessage }}
      readOnly={readOnly}
      disabled={disabled}
      rtlEnabled={true}
      name={name}
      value={value}
      onValueChanged={onValueChanged}
      displayFormat="MM-dd-yyyy"
    >
      {required && (
        <Validator>
          <RequiredRule message="هذا الحقل مطلوب" />
        </Validator>
      )}
    </DateBox>
  );
};

export default withLabel(DateTime);
