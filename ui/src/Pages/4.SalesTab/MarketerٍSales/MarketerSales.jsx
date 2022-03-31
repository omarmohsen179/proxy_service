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
import { ITEM_SSALES_PROFIT, CUSTOMERIES, GET_STUFF } from "./API.MarkterSales";
import { useTranslation } from "react-i18next";

function MarkterSales(props) {
	let categories = useSelector(selectCategories);
	let [stuff, setstuff] = useState([]);
	let [customers, setcustomers] = useState([]);
	let [categoriesList, setcategoriesList] = useState([]);
	let dispatch = useDispatch();
	const today = useMemo(() => {
		let defualtdateValue = new Date();
		return (
			(parseInt(defualtdateValue.getMonth()) + 1).toString() +
			"/" +
			defualtdateValue.getDate() +
			"/" +
			defualtdateValue.getFullYear()
		).toString();
	}, []);
	let [values, setvalues] = useState({
		FromDate: today,
		ToDate: today,
		CategoryID: 0,
		ItemID: 0,
		CustomerID: 0,
		StoreID: 0,
		FilterQuery: "",
		AgentID: 0,
	});
	const { t, i18n } = useTranslation();
	const tabCol = useMemo(() => {
		return [
			{
				caption: "رقم الفاتورة",
				captionEn: "Invoice Number",
				field: "e_no",
			},
			{ caption: "التاريخ", captionEn: "Date", field: "datee" },
			{
				caption: "أسم الزبون",
				field: "cust_name",
				captionEn: "Customer Name",
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
			{ caption: "الكميه", field: "kmea", captionEn: "Quantity" },
			{ caption: "السعر ", field: "price", captionEn: "Price" },
			{ caption: "اجمالي", field: "egmaly", captionEn: "Total" },
		];
	}, []);
	let handleChange = useCallback(
		({ name, value }) => {
			setvalues({ ...values, [name]: value });
		},
		[values]
	);

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

	const searchItemCallBackHandle = useCallback(
		// (id) => setUpdatedItem((prev) => ({ ...prev, item_id: id })),
		async (id) => {
			handleChange({ name: "ItemID", value: id });
		},
		[handleChange]
	);
	useEffect(async () => {
		dispatch(fetchCategories());
		setstuff([{ name: "كل", id: 0 }, ...(await GET_STUFF())]);
		setcustomers([{ name: "كل", id: 0 }, ...(await CUSTOMERIES())]);
	}, []);
	useEffect(async () => {
		setcategoriesList([{ name: "كل", id: 0 }, ...categories]);
	}, [categories]);
	return (
		<div
			dir={"auto"}
			className="row"
			style={{ display: "flex", justifyContent: "center", margin: 0 }}
		>
			<h1 style={{ width: "100%", textAlign: "center", padding: "2%" }}>
				{t("Marketers Sales Reveal")}
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
						label={t("According to the marketer")}
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
						<span className="">
							{t("Choose According to Category")}
						</span>
					</button>
				</div>
			</div>
			<div style={{ width: "95%" }}>
				<MasterTable
					remoteOperations
					apiKey={"e_no"}
					apiMethod={ITEM_SSALES_PROFIT}
					apiPayload={values}
					height="400px"
					colAttributes={tabCol}
				/>
			</div>
		</div>
	);
}
export default MarkterSales;
