import React, { useState, useEffect, useCallback, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import DateTime from "../../../Components/Inputs/DateTime";
import SelectBox from "../../../Components/Inputs/SelectBox";
import MasterTable from "../../../Components/SharedComponents/Tables Components/MasterTable.jsx";
import {
	selectVisible,
	setItem,
	setVisible,
} from "../../../Store/Items/ItemsSlice";
import SearchItem from "../../Items/SearchItem";
import {
	selectCategories,
	fetchCategories,
} from "../../../Store/Items/CategoriesSlice";
import { PURCHASE_TRANSACTION, SUPPLIERIES } from "./API.PurchaseItemMovement";
import TableCell from "../../../Components/Items/tableCell.js";
import { useRef } from "react";
import { useTranslation } from "react-i18next";
function PurchaseItemMovemnt(props) {
	const { t, i18n } = useTranslation();
	let visible = useSelector(selectVisible);
	let categories = useSelector(selectCategories);
	const summaryData = useRef([
		{
			column: "allqunt",
			summaryType: "sum",
			valueFormat: "currency",
			cssClass: "summaryNetSum",
			showInColumn: "allqunt",
			customizeText: (data) => {
				return `${t("Total")} : ${data.value ?? 0} `;
			},
		},
	]);

	let colAttributes = useMemo(() => {
		return [
			{
				caption: "رقم الفاتورة",
				field: "e_no",
				captionEn: "Invoice Number",
			},
			{ caption: "الحساب", field: "name", captionEn: "Account" },
			{
				caption: "تاريخ الفاتورة",
				captionEn: "Invoice Date",
				field: "e_date",
				widthRatio: "120",
			},
			{
				caption: "رقم الصنف",
				captionEn: "Item Number",
				field: "item_no",
			},
			{
				caption: "اسم الصنف",
				captionEn: "Item Name",
				field: "item_name",
			},
			{ caption: "الكميه", captionEn: "Quantity", field: "kmea" },
			{ caption: "السعر", captionEn: "Price", field: "price" },
			{
				caption: "الكمية الكلية",
				captionEn: "Collections",
				field: "allqunt",
			},
		];
	}, []);
	let [suppliers, setsuppliers] = useState([]);
	let [categoriesList, setcategoriesList] = useState([]);
	let dispatch = useDispatch();
	let today = useMemo(() => {
		let defualtdateValue = new Date();
		return (
			(parseInt(defualtdateValue.getMonth()) + 1).toString() +
			"/" +
			defualtdateValue.getDate() +
			"/" +
			defualtdateValue.getFullYear()
		).toString();
	}, []);
	let handleChange = useCallback(({ name, value }) => {
		setvalues((values) => ({ ...values, [name]: value }));
	}, []);
	let [values, setvalues] = useState({
		FromDate: today,
		ToDate: today,
		SupplierID: 0,
		CategoryID: 0,
		ItemID: 0,
		FilterQuery: "",
	});
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

	const searchItemCallBackHandle = useCallback(
		async (id) => {
			handleChange({ name: "ItemID", value: id });
		},
		[handleChange]
	);
	const ApiMethod = useCallback(async (e) => {
		let Api = await PURCHASE_TRANSACTION(e);
		//settotal()
		return Api;
	}, []);
	useEffect(async () => {
		dispatch(fetchCategories());
		setsuppliers([{ name: t("All"), id: 0 }, ...(await SUPPLIERIES())]);
	}, []);
	useEffect(async () => {
		setcategoriesList([{ name: t("All"), id: 0 }, ...categories]);
	}, [categories]);
	return (
		<div
			dir="rtl"
			className="row"
			style={{ display: "flex", justifyContent: "center", margin: 0 }}
		>
			<h1 style={{ width: "100%", textAlign: "center", padding: "2%" }}>
				{t("Detecting the movement of purchases of items")}
			</h1>
			<form className="row" style={{ width: "80%", padding: "4px" }}>
				<SearchItem
					togglePopup={togglePopup}
					visible={visible}
					callBack={searchItemCallBackHandle}
				/>
				<div className="col-12 col-md-6 col-lg-6">
					<DateTime
						label={t("From")}
						value={values["FromDate"]}
						name="FromDate"
						handleChange={handleChange}
						required={false}
					/>
				</div>
				<div className="col-12 col-md-6 col-lg-6">
					<DateTime
						label={t("To")}
						value={values["ToDate"]}
						name="ToDate"
						handleChange={handleChange}
						required={false}
					/>
				</div>
			</form>
			<div className="col-12 col-md-6 col-lg-3">
				<SelectBox
					label={t("by supplier")}
					dataSource={suppliers}
					value={values.SupplierID}
					name="SupplierID"
					handleChange={handleChange}
					required={false}
				/>
			</div>
			<div className="col-12 col-md-6 col-lg-3">
				<SelectBox
					label={t("According to Category")}
					dataSource={categoriesList}
					value={values.CategoryID}
					name="CategoryID"
					handleChange={handleChange}
					required={false}
				/>
			</div>
			<div className="col-12 col-md-6 col-lg-3">
				<button
					style={{
						height: "36px",
					}}
					className="col-12 btn btn-outline-dark btn-outline"
					onClick={togglePopup}
				>
					<span className="">{t("Choose by category")}</span>
				</button>
			</div>

			<div style={{ width: "95%" }}>
				<MasterTable
					remoteOperations
					apiKey={"e_no"}
					apiMethod={ApiMethod}
					apiPayload={values}
					height="400px"
					summaryItems={summaryData.current}
					colAttributes={colAttributes}
				/>
			</div>
		</div>
	);
}
export default PurchaseItemMovemnt;
