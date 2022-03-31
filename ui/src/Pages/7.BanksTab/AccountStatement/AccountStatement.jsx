// React
import React, { useState, useEffect, useRef, useCallback } from "react";
//css
import "./AccountStatement.css";
// Components
import MasterTable from "../../../Components/SharedComponents/Tables Components/MasterTable";
import { SelectBox, DateBox } from "../../../Components/Inputs";
import BanksCredits from "../BanksCredits/BanksCredits";
// DevExpress
import { Popup } from "devextreme-react/popup";
import ScrollView from "devextreme-react/scroll-view";

// API
import { GET_ACCOUNT_STATEMENT_TABLE_DATA } from "./API.AccountStatement";
import { Button } from "devextreme-react/button";
import { useTranslation } from "react-i18next";

function AccountStatement(props) {
	// when double clickng on any table row in أرصدة المصارف we get its data here
	const { DataFromBanksCredit } = props;
	// ============================================================================================================================
	// ================================================= Lists ====================================================================
	// ============================================================================================================================

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
			caption: "العملية",
			captionEn: "Operation",
			field: "doctype",
			alignment: "center",
			isVisable: true,
		},
		{
			caption: "التاريخ",
			captionEn: "Date",
			field: "dte",
			alignment: "center",
			isVisable: true,
		},
		{
			caption: "من / إلى حساب",
			captionEn: "From / to Account",
			field: "ksema",
			alignment: "center",
			isVisable: true,
		},
		{
			caption: "مدين",
			captionEn: "Debit",
			field: "mden",
			alignment: "center",
			isVisable: true,
		},
		{
			caption: "دائن",
			captionEn: "Creditor",
			field: "daen",
			alignment: "center",
			isVisable: true,
		},
		{
			caption: "الرصيد",
			captionEn: "Balance",
			field: "bal",
			alignment: "center",
			isVisable: true,
		},
		{
			caption: "ملاحظات",
			captionEn: "Note",
			field: "nots",
			alignment: "center",
			isVisable: true,
		},
	];

	// ============================================================================================================================
	// ================================================= State ====================================================================
	// ============================================================================================================================

	// Date from and to values
	const [dateValue, setDateValue] = useState({
		from: new Date(new Date().getTime() - 60 * 60 * 24 * 7 * 1000),
		to: new Date(),
	});

	// getting the bank id property to be used in calling apis
	const [bankID, setBankID] = useState();
	const [tableData, setTableData] = useState();
	const { t, i18n } = useTranslation();
	// Show or hide pop up of أرصدة المصارف
	const [banksCreditsPopupVisibility, setBanksCreditsPopupVisibility] =
		useState(false);
	// Setting data of الرقم - المصرف - البيان - العملة
	const [headerData, setHeaderData] = useState([]);

	// ============================================================================================================================
	// ================================================= Effects ==================================================================
	// ============================================================================================================================

	useEffect(() => {
		console.log("DataFromBanksCreditEFFECT");
		DataFromBanksCredit && setHeaderData(DataFromBanksCredit);
	}, [DataFromBanksCredit]);

	// ============================================================================================================================
	// ================================================= Master Table Summary =====================================================
	// ============================================================================================================================

	// Summary;
	let itemSummaryItems = useRef([
		{
			column: "mden",
			summaryType: "sum",
			valueFormat: "currency",
			cssClass: "daenState",
			showInColumn: "mden",
			customizeText: (data) => {
				return t("Total") + ` : ${data.value ?? 0.0} `;
			},
		},
		{
			column: "daen",
			summaryType: "sum",
			valueFormat: "currency",
			cssClass: "mdenState",
			showInColumn: "daen",
			customizeText: (data) => {
				return `${data.value ?? 0.0} `;
			},
		},
		{
			column: "bal",
			summaryType: "sum",
			valueFormat: "currency",
			cssClass: "daenState",
			showInColumn: "bal",
			customizeText: (data) => {
				return `${data.value ?? 0.0} `;
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

	// Show or hide popup of كشف حساب
	let handleBanksCreditsPopupVisibility = useCallback(() => {
		console.log("handleBanksCreditsPopupVisibility");
		setBanksCreditsPopupVisibility((prevState) => !prevState);
	}, []);

	// Setting header data of الرقم - المصرف - البيان - العملة
	let gettingHeaderDataOnDoubleClick = useCallback((event) => {
		console.log("gettingHeaderDataOnDoubleClick");

		setBanksCreditsPopupVisibility(false);
		setHeaderData(event.data);
	}, []);

	// Getting row id on selection on the row to egt data depending on it on selection Ok
	let gettingRowIdOnSelection = useCallback((event) => {
		console.log("gettingRowIdOnSelection");

		event &&
			event.currentSelectedRowKeys &&
			setBankID(event.currentSelectedRowKeys[0].bank_id);
	}, []);

	// Getting table data of كشف حساب so when clicking a row and clicking ok we
	// filter data we get here in table data by id of the row
	let gettingTableData = useCallback((data) => {
		console.log("gettingTableData");
		setTableData(data);
	}, []);

	// When selecting a row and selecting ok it get data to header and table
	// if nothing selected it just close
	let handlingOk = useCallback(() => {
		console.log("handlingOk");
		if (bankID != undefined) {
			let data = tableData.find((element) => element.id === bankID);
			setHeaderData(data);
		}
		setBanksCreditsPopupVisibility(false);
	}, [bankID, tableData]);
	return (
		<div className="container">
			{/* Header Data  */}
			<div
				style={{
					width: "100%",
					display: "flex",
					justifyContent: "space-between",
					flexWrap: "wrap",
					marginLeft: "auto",
					marginTop: "50px",
					direction: "rtl",
				}}
			>
				{props?.location?.pathname.split("/")[1] ==
					"AccountStatement" && (
					<div style={{ minWidth: "10%" }}>
						<Button
							text="كشف حساب"
							stylingMode="contained"
							onClick={() => setBanksCreditsPopupVisibility(true)}
						/>
					</div>
				)}

				<div>{t("Number") + ` : ${headerData.num ?? 0} `}</div>
				<div>
					{t("The bank") + ` : ${headerData.description ?? ""} `}
				</div>
				<div>{t("Statement") + ` : ${headerData.nots ?? ""} `} </div>
				<div>{t("the currency") + ` : ${headerData.omla ?? 0} `}</div>
			</div>
			{/* FROM AND TO */}
			<div
				style={{
					width: "70%",
					display: "flex",
					justifyContent: "space-between",
					direction: "rtl",
					marginTop: "20px",
					marginLeft: "auto",
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
			{/* Table */}
			<div className="mt-3">
				<MasterTable
					colAttributes={columnsAttributes}
					height={40 + "vh"}
					filterRow
					remoteOperations={
						headerData.bank_id != undefined &&
						banksCreditsPopupVisibility == false
					}
					apiMethod={
						headerData.bank_id != undefined
							? GET_ACCOUNT_STATEMENT_TABLE_DATA
							: null
					}
					apiPayload={{
						data: {
							BankID: headerData.bank_id,
							TransactionType: "",
							FromDate:
								dateValue.from === ""
									? new Date(
											new Date().getTime() -
												60 * 60 * 24 * 7 * 1000
									  )
									: dateValue.from,
							ToDate:
								dateValue.to === "" ? new Date() : dateValue.to,
						},
					}}
					summaryItems={itemSummaryItems.current}
					allowExcel={true}
					allowPrint={true}
				/>
			</div>
			{/* كشف حساب */}
			{props?.location?.pathname.split("/")[1] == "AccountStatement" && (
				<Popup
					maxWidth={"100%"}
					minWidth={500}
					closeOnOutsideClick={true}
					visible={banksCreditsPopupVisibility}
					onHiding={() => setBanksCreditsPopupVisibility(false)}
				>
					<ScrollView className="container">
						<BanksCredits
							visibileFromAccountStatement={false}
							getHeaderDataOnDoubleClick={
								gettingHeaderDataOnDoubleClick
							}
							getRowIdOnSelection={gettingRowIdOnSelection}
							getTableData={gettingTableData}
							handleOk={handlingOk}
							handleCancel={() =>
								setBanksCreditsPopupVisibility(false)
							}
						/>
					</ScrollView>
				</Popup>
			)}
		</div>
	);
}

export default React.memo(AccountStatement);
