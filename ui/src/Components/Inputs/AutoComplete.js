import React from "react";
import { Autocomplete } from "devextreme-react/autocomplete";
import withLabel from "./withLabel";

const Input = React.memo(({
    label,
    name,
    value,
    handleChange,
    dataSource = [],
    onFocusOut,
    validationErrorMessage
}) => {
    // console.log(dataSource);
    return (
        <Autocomplete
            placeholder={label}
            value={value || ""}
            name={name}
            onInput={({ event }) => {
                handleChange(event.target);
            }}
            onFocusOut={onFocusOut}
            dataSource={dataSource}
            validationStatus={validationErrorMessage ? "invalid" : "valid"}
            validationError={{ message: validationErrorMessage }}
        />
    );
});

export default withLabel(Input);
