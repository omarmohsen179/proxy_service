import React from "react";

function Selector(props) {
	return (
		<div dir={props.langDirection} className={props.selectorContainerStyle}>
			<label className={props.labelStyle}>{props.selectorLabel}</label>
			<select
				id={props.selectorID}
				className={props.selectorStyle}
				dir={props.selectorDirection}
			>
				<option value={props.value} className={props.optionStyle}>
					{props.value}
				</option>
			</select>
		</div>
	);
}

export default Selector;
