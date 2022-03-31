import React from "react";
import { SelectBox } from "devextreme-react";
import withLabel from "./withLabel";

const SelectBoxWithValue = React.memo(
  ({
    value,
    name,
    // [{id: "", name:"" }, ..]
    dataSource = [],
    handleChange,
    keys = { id: "id", name: "name" },
    placeholder = "قم بالاختيار",
  }) => {
    return (
      <>
        <SelectBox
          placeholder={placeholder}
          dataSource={dataSource}
          displayExpr={keys.name}
          valueExpr={keys.id}
          defaultValue={value}
          rtlEnabled={true}
          onValueChange={(selectedItem) =>
            handleChange({ name, value: selectedItem })
          }
          searchEnabled={true}
        />
        <h1>Value</h1>
      </>
    );
  }
);

export default withLabel(SelectBoxWithValue);
