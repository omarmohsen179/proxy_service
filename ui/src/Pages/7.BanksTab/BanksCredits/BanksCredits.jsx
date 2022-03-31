// React
import React, { useState, useRef, useEffect, useCallback } from "react";
//css
// import "./BanksCredits.css";

// DevExpress
import { Popup } from "devextreme-react/popup";
import ScrollView from "devextreme-react/scroll-view";

// Components
import MasterTable from "../../../Components/SharedComponents/Tables Components/MasterTable";
import { SelectBox, DateBox } from "../../../Components/Inputs";
import { Button } from "devextreme-react/button";
import AccountStatement from "../AccountStatement/AccountStatement";

// API
// Get table data
// get table data api
import { GET_BANKS_CREDITS_TABLE_DATA } from "./API.BanksCredits";
// get data of select box "عملة الحساب"
import { GET_MONEYTYPES_LOOKUP } from "../../../Services/ApiServices/General/LookupsAPI";
import { useTranslation } from "react-i18next";

function BanksCredits(props) {
	const {
		// State that show whether some elements is hown or not depending on where to dispaly page
		visibileFromAccountStatement = true,
		// Getting header data of Popup of كشف الحساب  on double clicking on any row of master table in كشف الحساب
		getHeaderDataOnDoubleClick,
		// Getting master table row id to use in popup of كشف الحساب, we use it there in getting full row data by
		// the id we get when clicking OK
		getRowIdOnSelection,
		// The full data of كشف الحساب sothat we can get the matched element of it with the selected id
		// and set data to the table when cliking ok in كشف الحساب
		getTableData,
		// Function that is invoked when clicking ok in popup of كشف الحساب
		handleOk,
		// Function that is invoked when clicking Cancel in popup of كشف الحساب
		handleCancel,
	} = props;
	// ============================================================================================================================
	// ================================================= Lists ====================================================================
	// ============================================================================================================================
	const { t, i18n } = useTranslation();
	// Table Column
	let columnsAttributes = [
		{
			caption: "الرقم",
			captionEn: "Number",
			field: "num",
			alignment: "center",
			isVisable: true,
		},
		{
			caption: "المصرف",
			captionEn: "the bank",
			field: "description",
			alignment: "center",
			isVisable: true,
		},
		{
			caption: "بيان الحساب",
			captionEn: "Account statement",
			field: "nots",
			alignment: "center",
			isVisable: true,
		},
		{
			caption: "الرصيد الحالي",
			captionEn: "current balance",
			field: "balance",
			alignment: "center",
			isVisable: true,
		},
		{
			caption: "العملة",
			field: "omla",
			captionEn: "the currency",
			alignment: "center",
			isVisable: true,
		},
	];
	// ============================================================================================================================
	// ================================================= State ====================================================================
	// ============================================================================================================================

	// Date from and to values
	const [dateValue, setDateValue] = useState({
		from: new Date(new Date().getTime() - 60 * 60 * 24 * 10000 * 1000),
		to: new Date(),
	});

	// Accounts الحساب
	const [moneyTypesList, setMoneyTypesList] = useState();
	const [moneyTypesValue, setMoneyTypesValue] = useState();

	// Accounts الحساب
	const [tableData, setTableData] = useState();
	// Show or hide pop up of كشف الحساب
	const [
		accountStatementPopupVisibility,
		setAccountStatementPopupVisibility,
	] = useState(false);
	const [DataObjFromBanksCredit, setDataObjFromBanksCredit] = useState({});

	// ============================================================================================================================
	// ================================================= Effects ================================================================
	// ============================================================================================================================

	// Initial Effect
	useEffect(() => {
		// عملة الحساب
		GET_MONEYTYPES_LOOKUP()
			.then((res) => {
				// console.log(res);
				setMoneyTypesList([
					{
						description: " ",
						id: 0,
					},
					...res,
				]);
				// setMoneyTypesList(res);
				// console.log(res);
			})
			.catch((err) => console.log(err));
	}, []);

	// Get table data on changing of عملة الحساب
	useEffect(() => {
		let Data;
		if (visibileFromAccountStatement == false) {
			Data = {
				MoneyTypeName: "",
			};
		} else {
			Data = {
				MoneyTypeName:
					moneyTypesList &&
					moneyTypesList.find(
						(element) => element.id == moneyTypesValue
					) &&
					moneyTypesList.find(
						(element) => element.id == moneyTypesValue
					).description,
			};
		}
		console.log(Data);
		(Data.MoneyTypeName || Data.MoneyTypeName == "") &&
			GET_BANKS_CREDITS_TABLE_DATA(Data)
				.then((res) => {
					getTableData && getTableData(res);
					// console.log(res);
					setTableData(res);
				})
				.catch((err) => console.log(err));
	}, [moneyTypesValue]);

	// ============================================================================================================================
	// ================================================= Master Table Summary =====================================================
	// ============================================================================================================================

	// Summary;
	let itemSummaryItems = useRef([
		{
			column: "balance",
			summaryType: "sum",
			valueFormat: "currency",
			cssClass: "daenState",
			showInColumn: "balance",
			customizeText: (data) => {
				// console.log(data);
				return `الإجمالي: ${data.value ?? 0.0} `;
			},
		},
	]);

	// ============================================================================================================================
	// ================================================= Handelers ================================================================
	// ============================================================================================================================
	// handle date chnage
	let handleDateChange = ({ name, value }) => {
		console.log("handleDateChange");
		setDateValue((prevState) => ({ ...prevState, [name]: value }));
	};

	// set new value of Accounts on selection of selectbox .. الحساب
	let handleAccountCurrency = ({ value }) => {
		console.log("handleAccountCurrency");

		setMoneyTypesValue(value);
	};

	// SHow or hide كشف الحساب and setting data to its table on double click
	let handleAccountStatementPopupVisibility = (event) => {
		console.log("handleAccountStatementPopupVisibility");
		event && event.data && setDataObjFromBanksCredit(event.data);
		setAccountStatementPopupVisibility(!accountStatementPopupVisibility);
	};

	return (
		<div className="container">
			{console.log(props?.location?.pathname.split("/")[2])}
			{console.log("Banks Credits")}
			{/* From to  */}
			{visibileFromAccountStatement && (
				<div
					dir="rtl"
					style={{
						width: "100%",
						display: "flex",
						flexWrap: "wrap",
						width: "100%",
						marginLeft: "auto",
						marginTop: "50px",
					}}
				>
					<div style={{ minWidth: "20%" }}>
						{t("Bank balance statement")}
					</div>

					{/* FROM AND TO */}
					<div style={{ minWidth: "60%" }}>
						<div
							style={{
								width: "100%",
								display: "flex",
								justifyContent: "space-between",
							}}
						>
							<div style={{ width: "45%" }}>
								<DateBox
									label={t("From")}
									handleChange={handleDateChange}
									name="from"
									value={dateValue["from"]}
								/>
							</div>
							<div style={{ width: "45%" }}>
								<DateBox
									label={t("To")}
									handleChange={handleDateChange}
									name="to"
									value={dateValue["to"]}
								/>
							</div>
						</div>
					</div>
				</div>
			)}
			{/*  Select Boxes */}
			{visibileFromAccountStatement && (
				<div
					className="triple w-75 mt-5"
					style={{ marginLeft: "auto" }}
				>
					<SelectBox
						label={t("Account currency")}
						dataSource={moneyTypesList}
						keys={{ id: "id", name: "description" }}
						value={moneyTypesValue}
						handleChange={handleAccountCurrency}
						required={false}
					/>
				</div>
			)}
			{/* Table */}
			<div className="mt-3">
				<MasterTable
					dataSource={tableData}
					colAttributes={columnsAttributes}
					height={40 + "vh"}
					filterRow
					summaryItems={
						visibileFromAccountStatement
							? itemSummaryItems.current
							: []
					}
					onRowDoubleClick={
						props?.location?.pathname.split("/")[1] ==
						"BanksCredits"
							? handleAccountStatementPopupVisibility
							: getHeaderDataOnDoubleClick
					}
					onSelectionChanged={getRowIdOnSelection}
					allowExcel={true}
					allowPrint={true}
				/>
			</div>
			{!visibileFromAccountStatement && (
				<div
					style={{
						marginTop: "20px",
						width: "100%",
						display: "flex",
						justifyContent: "space-evenly",
						alignItems: "center",
					}}
				>
					<Button
						text={t("Cancel")}
						width="100px"
						stylingMode="contained"
						onClick={handleCancel}
					/>
					<Button
						text={t("Ok")}
						width="100px"
						stylingMode="contained"
						onClick={handleOk}
					/>
				</div>
			)}
			{/* كشف حساب */}
			{props?.location?.pathname.split("/")[1] == "BanksCredits" && (
				<Popup
					maxWidth={"100%"}
					minWidth={500}
					closeOnOutsideClick={true}
					visible={accountStatementPopupVisibility}
					onHiding={handleAccountStatementPopupVisibility}
				>
					<ScrollView className="container">
						<AccountStatement
							DataFromBanksCredit={DataObjFromBanksCredit}
						/>
					</ScrollView>
				</Popup>
			)}
		</div>
	);
}

export default React.memo(BanksCredits);
