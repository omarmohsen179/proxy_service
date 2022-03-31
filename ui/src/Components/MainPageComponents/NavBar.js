import React from "react";
import { useDispatch, useSelector } from "react-redux";
import Selector from "../SharedComponents/Selector";
import logo from "../../Images/logo.png";

function NavBar() {
	return (
		<nav className="navbar navbar-light bg-light" style={{ minHeight: "50px" }}>
			<div className="container-fluid">
				<a className="navbar-brand" href="#" style={{ width: "100px" }}>
					<img
						src={logo}
						alt=""
						width="100%"
						className="d-inline-block align-text-top"
					/>
				</a>
			</div>
		</nav>
	);
}

export default NavBar;
