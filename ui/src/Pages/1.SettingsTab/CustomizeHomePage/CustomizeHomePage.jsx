import React from "react";
import { useTranslation } from "react-i18next";

const CustomizeHomePage = () => {
	const { t, i18n } = useTranslation();
	return (
		<>
			<div className="container mt-3" dir="auto">
				<h1 className="text-center my-3" style={{ fontWeight: 600 }}>
					{t("Customize UI")}
				</h1>

				<div className="card p-3">
					<h3>{t("Favorites")}</h3>
				</div>

				<div className="card p-3 my-3">
					<h3>{t("Home page Charts")}</h3>
				</div>
			</div>
		</>
	);
};

export default CustomizeHomePage;
