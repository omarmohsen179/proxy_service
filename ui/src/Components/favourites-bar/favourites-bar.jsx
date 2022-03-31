import React, { useCallback, useEffect, useState } from "react";
import { ScrollView } from "devextreme-react/scroll-view";
import { useTranslation } from "react-i18next";
import { request } from "../../Services/CallAPI";
import { useHistory } from "react-router";

const FavouritesBar = () => {
	const { t, i18n } = useTranslation();
	const history = useHistory();

	const [favourites, setFavourites] = useState([]);

	useEffect(() => {
		let config = {
			method: "post",
			url: `/FavoritesTabs`,
		};

		request(config)
			.then((response) => {
				setFavourites(response);
			})
			.catch((error) => {
				console.log(error);
			});
	}, []);

	const redirectHandler = useCallback(
		(e) => {
			let { path } = e;
			history.push(`/${path}`);
		},
		[history]
	);

	return (
		<ScrollView
			id={"scroll__favourite"}
			rtlEnabled={true}
			direction="horizontal"
			showScrollbar="never"
			scrollByContent
		>
			<div className="d-flex justify-content-center align-items-center favourites__wrapper">
				{favourites.map((e, index) => {
					return (
						<div
							key={index}
							className="favourite__wrapper"
							onClick={() => redirectHandler(e)}
						>
							<i className={`px-5 mb-2 dx-icon ${e.icon}`}></i>
							<span>
								{i18n.language === "ar" ? e.text : e.textEn}
							</span>
						</div>
					);
				})}
			</div>
		</ScrollView>
	);
};

export default React.memo(FavouritesBar);
