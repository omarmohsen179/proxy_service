import React from "react";
import { SelectBox } from "devextreme-react";
import TextBox from "devextreme-react/text-box";

const Input = React.memo(
  ({
    name,
    // [{key: "", value:"" }, ..]
    dataSource = [],
    validationErrorMessage,
    value,
    size = "col-12",
    handleChange,
    keys = { id: "id", name: "name" },
    placeholder = "قم بالاختيار",
    readOnly = false,
  }) => {
    return (
      <div className={"minInputHeight " + size}>
        <SelectBox
          readOnly={readOnly}
          placeholder={placeholder}
          validationMessageMode="auto"
          validationStatus={validationErrorMessage ? "invalid" : "valid"}
          validationError={{ message: validationErrorMessage }}
          // height="40px"
          dataSource={dataSource}
          displayExpr={keys.name}
          valueExpr={keys.id}
          value={value}
          showClearButton={false}
          onValueChange={(selectedItem) =>
            handleChange({ name, value: selectedItem })
          }
          rtlEnabled={true}
        />
      </div>
    );
  }
);

export default Input;
