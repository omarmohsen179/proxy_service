import React from "react";

import { CheckBox } from "devextreme-react/check-box";
import withLabel from "./withLabel";

const Input = ({ label, value = false, name, handleChange, readOnly = false }) => {
	return (
		<CheckBox
			value={value}
			onValueChanged={({ value }) => handleChange({ name, value })}
			readOnly={readOnly}
		/>
	);
};

export default withLabel(Input);
