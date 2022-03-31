import React, { useState, useEffect, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setSelectedGroupId } from "../../../Store/groups.js";
import {
	getNodesIn,
	getOtherPermissions,
} from "../../../Store/otherPermissions.js";
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
import {
	ITEM_SSALES_PROFIT,
	CUSTOMERIES,
	GET_STORES,
	GET_STUFF,
} from "./API.ProfitDetailsMovement";

import { useTranslation } from "react-i18next";
function ProfitDetialsMovement(props) {
	let categories = useSelector(selectCategories);
	let [stuff, setstuff] = useState([]);
	let [customers, setcustomers] = useState([]);
	let [store, setstore] = useState([]);
	let [categoriesList, setcategoriesList] = useState([]);
	let dispatch = useDispatch();
	const { t, i18n } = useTranslation();
	let summaryData = [
		{
			column: "kmea",
			summaryType: "sum",
			valueFormat: "currency",
			showInColumn: "kmea",
			customizeText: (data) => {
				return ` ${t("Total")}  : ${data.value ?? 0} `;
			},
		},

		{
			column: "price",
			summaryType: "sum",
			valueFormat: "currency",
			showInColumn: "price",
			customizeText: (data) => {
				return ` ${t("Total sold")} : ${data.value ?? 0} `;
			},
		},
		{
			column: "p_tkl",
			summaryType: "sum",
			valueFormat: "currency",
			showInColumn: "p_tkl",
			customizeText: (data) => {
				return ` ${t("Total cost")} : ${data.value ?? 0} `;
			},
		},
		{
			column: "rbh1",
			summaryType: "sum",
			valueFormat: "currency",
			showInColumn: "rbh1",
			customizeText: (data) => {
				return ` ${t("Gross profit")} : ${data.value ?? 0} `;
			},
		},
	];
	let [valuesfinal, setvaluesfinal] = useState({});
	var today = new Date();
	today =
		String(today.getMonth() + 1).padStart(2, "0") +
		"/" +
		String(today.getDate()).padStart(2, "0") +
		"/" +
		today.getFullYear();
	let [values, setvalues] = useState({
		FromDate: today,
		ToDate: today,
		StoreID: 0,
		CategoryID: 0,
		ItemID: 0,
		CustomerID: 0,
		FilterQuery: "",
		AgentID: 0,
	});
	let handleChange = useCallback(({ name, value }) => {
		setvalues({ ...values, [name]: value });
	}, []);

	let visible = useSelector(selectVisible);
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

	const ApiMethod = useCallback(async (e) => {
		let Api = await ITEM_SSALES_PROFIT(e);
		//setvaluesfinal()
		return Api;
	}, []);
	const searchItemCallBackHandle = useCallback(
		// (id) => setUpdatedItem((prev) => ({ ...prev, item_id: id })),
		async (id) => {
			console.log(id);
			handleChange({ name: "ItemID", value: id });
		},
		[]
	);
	useEffect(async () => {
		dispatch(fetchCategories());
		setstuff([{ name: t("All"), id: 0 }, ...(await GET_STUFF())]);
		setcustomers([{ name: t("All"), id: 0 }, ...(await CUSTOMERIES())]);
		setstore([
			{ name: t("All"), id: 0 },
			...(await GET_STORES()).map((R) => {
				return { id: parseInt(R.id), name: R.description };
			}),
		]);
	}, []);
	useEffect(async () => {
		setcategoriesList([{ name: t("All"), id: 0 }, ...categories]);
	}, [categories]);
	return (
		<div
			className="row"
			style={{ display: "flex", justifyContent: "center", margin: 0 }}
		>
			<h1 style={{ width: "100%", textAlign: "center", padding: "2%" }}>
				{t("Detailed profit statement")}
			</h1>
			<form className="row" style={{ width: "80%", padding: "4px" }}>
				<SearchItem
					visible={visible}
					togglePopup={togglePopup}
					callBack={searchItemCallBackHandle}
				/>
				<div className="col-12 col-md-6 col-lg-6">
					<DateTime
						label={t("From")}
						value={values["FromDate"]}
						name="FromDate"
						handleChange={handleChange}
						required={true}
						required={false}
					/>
				</div>
				<div className="col-12 col-md-6 col-lg-6">
					<DateTime
						label={t("To")}
						value={values["ToDate"]}
						name="ToDate"
						handleChange={handleChange}
						required={true}
						required={false}
					/>
				</div>
			</form>
			<div className="row" style={{ width: "80%", padding: "4px" }}>
				<div className="col-12 col-md-6 col-lg-3">
					<SelectBox
						label={t("According to customer")}
						dataSource={customers}
						value={values.CustomerID}
						name="CustomerID"
						handleChange={handleChange}
						required={false}
					/>
				</div>
				<div className="col-12 col-md-6 col-lg-3">
					<SelectBox
						label={t("shop")}
						dataSource={store}
						value={values.StoreID}
						name="StoreID"
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
					<SelectBox
						label="حسب المسوق"
						dataSource={stuff}
						value={values.AgentID}
						name="AgentID"
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
			</div>
			<div style={{ width: "95%" }}>
				<MasterTable
					remoteOperations
					apiKey={"e_no"}
					apiMethod={ApiMethod}
					apiPayload={values}
					height="400px"
					summaryItems={summaryData}
					colAttributes={[
						{
							caption: "رقم الفاتورة",
							field: "e_no",
							captionEn: "Number",
						},
						{
							caption: "التاريخ",
							field: "datee",
							captionEn: "Date",
						},
						{
							caption: "التصنيف",
							field: "des",
							captionEn: "Category",
						},
						{
							caption: "رقم الصنف",
							field: "item_no",
							captionEn: "Item Number",
						},
						{
							caption: "اسم الصنف",
							field: "item_name",
							captionEn: "Item Name",
						},
						{
							caption: "الزبون",
							field: "cust_name",
							captionEn: "Customer",
						},
						{
							caption: "الكميه",
							field: "kmea",
							captionEn: "Quantity",
						},
						{
							caption: "السعر البيع",
							field: "price",
							captionEn: "Price",
						},
						{
							caption: "تكلفة ",
							field: "p_tkl",
							captionEn: "Cost",
						},
						{
							caption: "الربح",
							field: "rbh1",
							captionEn: "Profit",
						},
						{
							caption: "الربح المجمل",
							field: "rbhall",
							captionEn: "gross profit",
						},
					]}
				/>
			</div>
		</div>
	);
}
export default ProfitDetialsMovement;
