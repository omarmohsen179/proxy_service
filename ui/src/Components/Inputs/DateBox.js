import React from "react";
import { TextBox } from "devextreme-react";
import withLabel from "./withLabel";
import { Validator, RequiredRule } from "devextreme-react/validator";
import DateBox from "devextreme-react/date-box";
const Input = React.memo(
	({
		label,
		name = "date",
		value,
		handleChange,
		size = "col-12",
		required = true,
		stylingMode = "filled",
		readOnly = false,
		className = ""
	}) => {
		return (
			<DateBox
				className={className}
				readOnly={readOnly}
				style={{ direction: "ltr" }}
				stylingMode={stylingMode}
				value={value || new Date()}
				name={name}
				onValueChanged={(e) => handleChange && handleChange({ name, value: (e.value ? e.value : new Date()) })}
			>
				{required && (
					<Validator>
						<RequiredRule message="هذا الحقل مطلوب" />
					</Validator>
				)}
			</DateBox>
		);
	}
);

export default withLabel(Input);
