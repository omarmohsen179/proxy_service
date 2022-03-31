import React, { useEffect, useState, useCallback, useRef } from "react";
import { Link } from "react-router-dom";
import Clock from "../SharedComponents/Clock";
import { GET_MAIN_SUB_BUTTONS as getMainSubButtons } from "../../Services/ApiServices/General/ButtonsAPI";

// Defining current date function
let currentdate = () => {
	let currentdate = new Date();
	let hours = currentdate.getHours();
	let minutes = currentdate.getMinutes();
	if (hours < 10) hours = "0" + hours;
	if (minutes < 10) minutes = "0" + minutes;
	return hours + ":" + minutes;
};

function SideNav() {
	// Sidenav scroll in-out state.
	const [classes, setClasses] = useState("fadeOut");
	// MenuButton scroll in-out icon state.
	const [menuButton, setmenuButton] = useState("fas fa-bars");
	// Main and sub buttons state
	const [buttons, setbuttons] = useState([]);
	// Main-sub buttons API calling
	useEffect(() => {
		// Useeffect async-await best practise
		(async () => {
			var buttons = await getMainSubButtons();
			setbuttons(buttons);
		})();
	}, []);

	const wrapperRef = useRef(null);
	useOutsideAlerter(wrapperRef);

	/**
	 * Hook that alerts clicks outside of the passed ref
	 */
	function useOutsideAlerter(ref) {
		useEffect(() => {
			/**
			 * Alert if clicked on outside of element
			 */
			function handleClickOutside(event) {
				if (ref.current && !ref.current.contains(event.target)) {
					setClasses("fadeOut");
					setmenuButton("fas fa-bars");
				}
			}

			// Bind the event listener
			document.addEventListener("mousedown", handleClickOutside);
			return () => {
				// Unbind the event listener on clean up
				document.removeEventListener("mousedown", handleClickOutside);
			};
		}, [ref]);
	}

	// Show-hide side nav function "Setstate to menu button icon and scroll in-out class"
	let showSideNav = () => {
		setClasses(menuButton === "fas fa-bars" ? "fadeIn" : "fadeOut");
		setmenuButton(
			menuButton === "fas fa-bars" ? "fas fa-times" : "fas fa-bars"
		);
	};

	const escFunction = useCallback((event) => {
		if (event.keyCode === 27) {
			setClasses("fadeOut");
			setmenuButton("fas fa-bars");
		}
	}, []);

	useEffect(() => {
		document.addEventListener("keydown", escFunction, false);
		return () => {
			document.removeEventListener("keydown", escFunction, false);
		};
	}, []);

	return (
		<div ref={wrapperRef}>
			{/* MenuButton */}
			<div onClick={showSideNav} className={"menuButton"}>
				<i className={menuButton}></i>
			</div>

			<div className={`sideNavWrapper  ${classes}`}>
				{/* Clock Component */}
				<Clock />

				{/* User Data  */}
				<div className="dateContainer">
					<div>أهلًا بك مستخدم النظام</div>
					<div>{currentdate() + " ساعة الدخول"}</div>
				</div>

				{/* Mapping Buttons and sub buttons to a list in side nav via boot-strap */}
				{buttons.map((button, index) => (
					<div key={index}>
						<div
							className="mainButton"
							data-bs-toggle="collapse"
							href={`#collapseExample${index}`}
							role="button"
							aria-expanded="false"
							aria-controls={`collapseExample${index}`}
						>
							{button.Name}
						</div>
						<div className="collapse" id={`collapseExample${index}`}>
							{button.SubButtons.map((sub, index) => (
								<Link
									key={index}
									to={`/user/${sub.RoutePath}`}
									onClick={() => showSideNav()}
								>
									<div className="subButton">{sub.name}</div>
								</Link>
							))}
						</div>
					</div>
				))}
			</div>
		</div>
	);
}

export default SideNav;
