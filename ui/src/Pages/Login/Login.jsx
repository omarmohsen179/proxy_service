import React, { useCallback, useState } from "react";
import { LOGIN } from "./API.Login";
import config from "../../config";

import "./Login.css";
import logo from "../../Images/logo.png";
import { setWithExpiry } from "../../Services/LocalStorageService";
import { useHistory, Redirect } from "react-router-dom";

const {
	localStorageTokenKey,
	localStorageReadIdKey,
	localStorageMultiCurrencyKey,
	localStorageCurrencyKey,
} = config;

const Login = () => {
	let history = useHistory();

	const [formData, setFormData] = useState({});

	const updateFormData = useCallback((e) => {
		setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
	}, []);

	const loginHandle = useCallback(
		(e) => {
			LOGIN(formData.username, formData.password, formData.serial)
				.then(({ Read_ID, Token, MultiCurrency, Currency }) => {
					setWithExpiry(localStorageTokenKey, Token);
					setWithExpiry(localStorageReadIdKey, Read_ID);
					localStorage.setItem(localStorageCurrencyKey, Currency);
					history.replace("/#/home");
				})
				.catch((error) => {
					console.log(error);
				});
			e.preventDefault();
		},
		[formData.password, formData.serial, formData.username, history]
	);

	return (
		<div className="login d-flex flex-row align-items-center justify-content-evenly">
			<div className="centerForm notCairo">
				<div className="text-center p-3 buy__section">
					<a
						className="pass"
						href="https://mmm.almedadsoft.com/#/product/37"
					>
						Check Product
					</a>
				</div>
				<h1 className="notCairo">Login</h1>
				<form onSubmit={loginHandle} className="notCairo">
					<div className="txt_field notCairo">
						<input
							type="text"
							required
							name="username"
							onChange={updateFormData}
						/>
						<label className="notCairo">Username</label>
					</div>
					<div className="txt_field notCairo">
						<input
							type="password"
							required
							name="password"
							onChange={updateFormData}
						/>
						<label className="notCairo">Password</label>
					</div>
					<div className="txt_field notCairo">
						<input
							type="text"
							required
							name="serial"
							onChange={updateFormData}
						/>
						<label className="notCairo">Serial</label>
					</div>
					<div className="pass notCairo">Forgot Password?</div>
					<input type="submit" className="notCairo" value="Login" />
				</form>
			</div>
			<div className="w-30 login__logo">
				<a className="navbar-brand" href="https://www.almedadsoft.com">
					<img
						src={logo}
						alt=""
						width="100%"
						className="d-inline-block align-text-top"
					/>
				</a>
			</div>
		</div>
	);
};

export default Login;
