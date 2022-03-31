import React from "react";

function Input({ inputComponent, width, label }) {
	return (
		<div className="input-wrapper">
			<div className="label">{label}</div>
			{inputComponent}
		</div>
	);
}

export default Input;
