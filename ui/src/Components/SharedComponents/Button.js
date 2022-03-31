import React from "react";
import { useDispatch, useSelector } from "react-redux";

function Button({ label, image, handleClick }) {
	return (
		<div
			className={"buttonRow permissionsOption buttonContainer "}
			onClick={handleClick}
		>
			<div className="me-2">{label}</div>
			<div>
				<img src={image} className="w-100" />
			</div>
		</div>
	);
}

export default Button;
