import React, { useMemo } from "react";
import { Route, Redirect } from "react-router-dom";
import { getWithExpiry } from "../Services/LocalStorageService";
import config from "../config.js";

let { localStorageTokenKey, localStorageReadIdKey } = config;

const ProtectedInRoute = ({ path, component: Component, render, ...rest }) => {
	let flag = useMemo(() => {
		return getWithExpiry(localStorageTokenKey) ? true : false;
	}, []);
	return (
		<Route
			{...rest}
			render={(props) => {
				if (flag) return <Redirect to="/Home" />;
				return Component ? <Component {...props} /> : render(props);
			}}
		/>
	);
};

export default ProtectedInRoute;
