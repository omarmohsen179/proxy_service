import React from "react";
import { FileUploader } from "devextreme-react/file-uploader";
import withLabel from "./withLabel";
import { Validator, RequiredRule } from "devextreme-react/validator";

const Input = ({
    label,
    name,
    multiple = false,
    accept = "*",
    uploadMode = "instantly",
    handleChange,
    required = true,
}) => {
    // console.log(name);
    return (
        <FileUploader
            placeholder={label}
            multiple={multiple}
            accept={accept}
            uploadMode={uploadMode}
            name={name}
            accept={accept}
            rtlEnabled={true}
            onValueChanged={(event) =>
                handleChange({ name, value: event.value })
            }
        >
            {required && (
                <Validator>
                    <RequiredRule message="هذا الحقل مطلوب" />
                </Validator>
            )}
        </FileUploader>
    );
};

export default withLabel(Input);
