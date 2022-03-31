import React, { useCallback } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { NumberBox, TextBox } from "../../../../../Components/Inputs";
import {
	selectVisible,
	setVisible,
} from "../../../../../Store/Items/ItemsSlice";
import SearchItem from "../../../../Items/SearchItem";
import { GET_DISCOUNT_INVOICE_ITEM_INFO } from "./API.DiscountInvoiceItemInformation";

const DiscountInvoiceItemInformation = ({
	billInformation,
	updateBillInformation,
	updateBillState,
	errors,
	updateErrors,
	selectedItem,
	setSelectedItem,
	updatedItem,
	setUpdatedItem,
	updateItemInformation,
	itemEditMode,
	selectedAccountId,
	addItemToInvoice,
}) => {
	let dispatch = useDispatch();
	let visible = useSelector(selectVisible);

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
	const { t, i18n } = useTranslation();
	// Callback to fire getItemInfo on row doubleClick in searchItemPopup
	const searchItemCallBackHandle = useCallback(
		(id) => {
			GET_DISCOUNT_INVOICE_ITEM_INFO(selectedAccountId, id)
				.then((item) => {
					setSelectedItem(item);
					setUpdatedItem(item);
				})
				.catch((error) => {
					console.log(error);
				});
		},
		[selectedAccountId, setSelectedItem, setUpdatedItem]
	);

	return (
		<>
			<SearchItem
				togglePopup={togglePopup}
				callBack={searchItemCallBackHandle}
				visible={visible}
			/>
			<div className="row px-3 py-2">
				<div className="col-3">
					<button
						disabled={
							itemEditMode ||
							!selectedAccountId ||
							!billInformation.emp_mo ||
							(billInformation.id && !billInformation.readOnly)
						}
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
						label="رقم الصنف"
						readOnly={true}
						// enterKeyHandle={barcodeHandle}
						required={false}
						name="item_no"
						value={updatedItem.item_no}
						handleChange={updateItemInformation}
					/>
				</div>

				<div className="col-3">
					<TextBox
						readOnly={true}
						required={false}
						label={t("Name")}
						name="item_name"
						value={updatedItem.item_name}
						handleChange={updateBillInformation}
					/>
				</div>

				<div className="col-3">
					<NumberBox
						readOnly={true}
						required={false}
						validationErrorMessage={errors.all_kmea}
						label={t("Total Quantity")}
						name="all_kmea"
						value={updatedItem.all_kmea ?? 0}
					/>
				</div>
				<div className="col-3">
					<NumberBox
						readOnly={true}
						required={false}
						validationErrorMessage={errors.old_price}
						label={t("the previous price")}
						name="old_price"
						value={updatedItem.old_price ?? 0}
					/>
				</div>

				<div className="col-3">
					<NumberBox
						readOnly={updatedItem.item_id ? false : true}
						required={false}
						validationErrorMessage={errors.kmea}
						label={t("Quantity")}
						name="kmea"
						value={updatedItem.kmea ?? 0}
						handleChange={updateItemInformation}
					/>
				</div>
				<div className="col-3">
					<NumberBox
						readOnly={updatedItem.item_id ? false : true}
						required={false}
						validationErrorMessage={errors.price}
						label={t("Price")}
						name="price"
						value={updatedItem.price ?? 0}
						handleChange={updateItemInformation}
					/>
				</div>
			</div>
		</>
	);
};

export default React.memo(DiscountInvoiceItemInformation);
