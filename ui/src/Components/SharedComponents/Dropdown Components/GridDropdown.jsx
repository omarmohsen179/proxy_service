import React, { useState } from "react";
import SelectBox from "devextreme-react/select-box";
import DropDownBox from "devextreme-react/drop-down-box";
import { setSelectedGroupId } from "../../../Store/groups";
import { useDispatch, useSelector } from "react-redux";
import {
  clearSubPermissions,
  subPermissionsSelector,
} from "../../../Store/permissions";
import TableWithCheckBoxs from "../Tables Components/TableWithCheckBoxs";

function GridDropdown({
  placeHolder = "قم بالاختيار",
  data = [],
  size = "col-12",
  showClear = true,
}) {
  const colAttributes = [
    ["byan", "العملية"],
    ["ins", "إضافة"],
    ["del", "حذف"],
    ["up", "تعديل"],
    ["show", "عرض"],
  ];
  const [dropdownValue, setDropdownValue] = useState("");
  const dispatch = useDispatch();
  const subPermissions = useSelector(subPermissionsSelector);
  const dataGridRender = () => {
    return (
      <TableWithCheckBoxs
        data={subPermissions}
        colAttributes={colAttributes}
        height="350px"
      />
    );
  };

  const onValueChanged = (e) => {
    dispatch(setSelectedGroupId(e.value));
    setDropdownValue(e.value);
  };
  return (
    <div className={size}>
      <SelectBox
        placeholder={placeHolder}
        dataSource={data}
        displayExpr="name"
        valueExpr="id"
        showClearButton={showClear}
        value={dropdownValue}
        onValueChanged={onValueChanged}
        rtlEnabled={true}
        width={"100%"}
      />
    </div>
  );
}

export default GridDropdown;
