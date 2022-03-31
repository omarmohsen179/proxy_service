import React from "react";
import TextArea from "devextreme-react/text-area";
import { Validator, RequiredRule } from "devextreme-react/validator";
import withLabel from "./withLabel";

const Input = ({
    label,
    name,
    value,
    handleChange,
    required = true,
    height = 90,
}) => {
    return (
        <TextArea
            placeholder={label}
            value={value || ""}
            name={name}
            onInput={({ event }) => handleChange(event.target)}
            height={height}
        >
            {required && (
                <Validator>
                    <RequiredRule message="هذا الحقل مطلوب" />
                </Validator>
            )}
        </TextArea>
    );
};

// export default withLabel(Input);
export default withLabel(Input);
