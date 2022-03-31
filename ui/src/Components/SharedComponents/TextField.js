import React from "react";
import TextBox from "devextreme-react/text-box";

function TextField({
	fullContainerStyle,
	labelStyle,
	label,
	name,
	value,
	error,
	handleChange,
}) {
	return (
		<div className={`textFieldFullContainer  ${fullContainerStyle}`}>
			<div className={"textFieldWrapper "}>
				<div className={`textFieldTitleStyle ${labelStyle}`}>{label}</div>

				<div>
					<TextBox
						placeholder={label}
						id={name}
						name={name}
						value={value}
						onValueChanged={handleChange}
					/>
				</div>
			</div>
			<div className="errorContainer">{error}</div>
		</div>
	);
}

export default TextField;
