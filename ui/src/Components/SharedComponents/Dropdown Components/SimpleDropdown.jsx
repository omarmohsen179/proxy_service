import React, { useState } from "react";
import SelectBox from "devextreme-react/select-box";
import { setSelectedGroupId } from "../../../Store/groups";
import { useDispatch } from "react-redux";
import { clearSubPermissions } from "../../../Store/permissions";

function SimpleDropdown({
	placeHolder,
	displayExpr = "name",
	valueExpr = "id",
	onValueChanged,
	dropdownValue,
	data = [],
	size = "col-12",
	showClear = false,
	defaultValue,
}) {
	return (
		<div className={`h-100 ${size}`}>
			<SelectBox
				className="h-100"
				placeholder={placeHolder}
				defaultValue={defaultValue}
				dataSource={data}
				displayExpr={displayExpr}
				valueExpr={valueExpr}
				showClearButton={showClear}
				value={dropdownValue}
				onValueChanged={onValueChanged}
				rtlEnabled={true}
				width={"100%"}
			/>
		</div>
	);
}

export default SimpleDropdown;
