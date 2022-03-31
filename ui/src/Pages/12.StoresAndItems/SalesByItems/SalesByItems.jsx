import React, { useCallback, useState, useRef, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { TextBox } from "../../../Components/Inputs";
import { GET_ITEM_INFO } from "../../../Services/ApiServices/ItemsAPI";
import { selectVisible, setVisible } from "../../../Store/Items/ItemsSlice";
import SearchItem from "../../Items/SearchItem";
import { GET_ITEMS_TRANSACTION_BY_ACCOUNTS } from "./API.SalesByItems";
import SalesByItemsTable from "./Components/SalesByItemsTable";

const SalesByItems = () => {
	let dispatch = useDispatch();
	let visible = useSelector(selectVisible);
	const [selectedItemId, setSelectedItemId] = useState();
	const { t, i18n } = useTranslation();
	const [itemInformation, setItemInformation] = useState({});

	// Search items toggle popup
	const togglePopup = useCallback(
		(value) => {
			if (value === false || value === true) {
				dispatch(setVisible(value));
			} else {
				dispatch(setVisible());
			}
			sessionStorage.setItem("backUrl", "items");
		},
		[dispatch]
	);

	// Callback to fire getItemInfo on row doubleClick in searchItemPopup
	const searchItemCallBackHandle = useCallback((id) => {
		setSelectedItemId(id);
		GET_ITEM_INFO(0, id).then((item) => {
			setItemInformation(item);
		});
	}, []);

	const apiPayload = useMemo(() => {
		return { ItemID: selectedItemId };
	}, [selectedItemId]);
	return (
		<>
			<SearchItem
				togglePopup={togglePopup}
				callBack={searchItemCallBackHandle}
				visible={visible}
			/>

			<h1 className="invoiceName">{t("Sales by customers")}</h1>
			<div className="container-xxl rtlContainer mb-3">
				<div className="card p-3">
					<div className="row">
						<div className="col-3">
							<button
								style={{
									height: "36px",
								}}
								className="col-12 btn btn-outline-dark btn-outline"
								onClick={togglePopup}
							>
								<span>{t("Choose species")}</span>
							</button>
						</div>
						<div className="col-3">
							<TextBox
								readOnly={true}
								required={false}
								label={t("Number")}
								name="item_no"
								value={itemInformation.item_no}
							/>
						</div>
						<div className="col-6">
							<TextBox
								readOnly={true}
								required={false}
								label={t("Item Name")}
								name="item_name"
								value={itemInformation.item_name}
							/>
						</div>
						<div className="col-3">
							<TextBox
								readOnly={true}
								required={false}
								label={t("Quantity")}
								name="Quantity"
								value={itemInformation.Quantity}
							/>
						</div>
						<div className="col-3">
							<TextBox
								readOnly={true}
								required={false}
								label={t("Cost")}
								name="p_tkl"
								value={itemInformation.p_tkl}
							/>
						</div>
					</div>
					<div className="row py-3">
						<SalesByItemsTable apiPayload={apiPayload} />
					</div>
				</div>
			</div>
		</>
	);
};

export default SalesByItems;
