// React
import React, { useRef, useEffect, useState, useCallback } from "react";

// Devexpress
import { Popup } from "devextreme-react/popup";
import ScrollView from "devextreme-react/scroll-view";
import { Button } from "devextreme-react/button";
import notify from "devextreme/ui/notify";

// Components
import MasterTable from "../../../Components/SharedComponents/Tables Components/MasterTable";
import { TextBox, DateBox, CheckBox } from "../../../Components/Inputs";
import OpenPDFWindow from "../../../Components/SharedComponents/PDFReader/PDFwindowFunction";
import BillDetails from "../../../Modals/SearchBillsTableANDmovements/BillDetails";

// API
// 1- Get table data
import { SEND_EMAIL_SMS } from "../../../Services/ApiServices/General/ReportsAPI";
import {
	GEt_MOVEMENT_SHEET_DATA,
	GET_MOVEMENT_SHEET_PDF,
} from "./API.DebtsStatement";
import { useTranslation } from "react-i18next";

function MovementSheet(props) {
	const {
		// if popup true or false
		popupVisibility,
		// set visibility to pop up to true or false
		handlePopupVisibility,
		// Popup title
		title,
		// Data that is displayed above table in the popup header
		headerData,
	} = props;

	const { t, i18n } = useTranslation();

	// Table Column Attributes
	let columnsAttributes = [
		{
			caption: "الرقم",
			field: "s_no",
			alignment: "center",
			isVisable: true,
		},
		{
			caption: "نوع العملية",
			field: "mvType",
			alignment: "center",
			isVisable: true,
		},
		{
			caption: "التاريخ",
			field: "DateMv",
			alignment: "center",
			isVisable: true,
		},
		{
			caption: "مدين",
			field: "mden",
			alignment: "center",
			isVisable: true,
		},
		{
			caption: "دائن",
			field: "daen",
			alignment: "center",
			isVisable: true,
		},
		{
			caption: "الرصيد",
			field: "bal",
			alignment: "center",
			isVisable: true,
		},
		{
			caption: "ملاحظات",
			field: "nots",
			alignment: "center",
			isVisable: true,
		},
	];

	// Summary data that is displayed under table
	let itemSummaryItems = useRef([
		{
			column: "mden",
			summaryType: "sum",
			valueFormat: "currency",
			cssClass: "mdenState",
			showInColumn: "mden",

			customizeText: (data) => {
				return `${(movementSheetTableData.current.data &&
					movementSheetTableData.current.data[0].mden) ??
					0.0
					}`;
			},
		},
		{
			column: "daen",
			summaryType: "sum",
			valueFormat: "currency",
			cssClass: "daenState",
			showInColumn: "daen",
			customizeText: (data) => {
				return `${(movementSheetTableData.current.data &&
					movementSheetTableData.current.data[0].daen) ??
					0.0
					}`;
			},
		},
	]);

	// ============================================================================================================================
	// ================================================= State ====================================================================
	// ============================================================================================================================

	// Local cuurency state
	const [localCurrency, setLocalCurrency] = useState({
		value: 0,
		state: false,
	});

	// Date from and to values
	const [dateValue, setDateValue] = useState({
		from: "",
		to: "",
	});

	// State of search table component
	const [billsDetailsVisibility, setBillsDetailsVisibility] = useState(false);

	// set BillsDetails Popup
	const [billsDetailsValueObject, setBillsDetailsValueObject] = useState({
		invoiceType: "",
		id: "",
	});

	const movementSheetTableData = useRef({});

	// ============================================================================================================================
	// ================================================= Effects ==================================================================
	// ============================================================================================================================

	// Set Time to first value
	useEffect(() => {
		console.log("FirstRenderEffect");
		// Determination of start and today date to be set and use in movementsheet كشف الحركة
		// Start date 1-1-2010
		let startDate = new Date("2010-01-01");
		// Today Date
		let todayDate = new Date();

		setDateValue({
			from: startDate,
			to: todayDate,
		});
	}, []);

	// ============================================================================================================================
	// ================================================= Handelers ================================================================
	// ============================================================================================================================

	// handle date chnage
	let handleDateChange = ({ name, value }) => {
		console.log("handleDateChange");
		setDateValue((prevState) => ({ ...prevState, [name]: value }));
	};
	// handle local currency state chnage  العملة المحلية
	let handleLocalCurrency = ({ value }) => {
		console.log("handleLocalCurrency");
		value === false
			? setLocalCurrency({ value: 0, state: false })
			: setLocalCurrency({ value: 1, state: true });
	};

	// Printing
	let handlePrintMovementSheet = () => {
		if (headerData != undefined) {
			let Data = {
				AccountID: headerData.s_no,
				BySystemMoneyType: localCurrency?.value,
				FromDate: dateValue.from,
				ToDate: dateValue.to,
			};
			GET_MOVEMENT_SHEET_PDF(Data)
				.then((file) => OpenPDFWindow(file))
				.catch((err) => console.log(err));
		}
	};
	// Sending EMails
	let handleSendEmail = () => {
		let Data = {
			AccountCol: "AccountID",
			SendType: "Email",
			MessageSubject: "",
			MessageBody: "",
			AccountID: headerData.s_no,
			BySystemMoneyType: localCurrency?.value,
			FromDate: dateValue.from,
			ToDate: dateValue.to,
			AccountsIDs: [headerData.s_no],
		};
		SEND_EMAIL_SMS("AccountTransactions", Data)
			.then((res) =>
				notify(
					{ message: "تم إرسال البريد بنجاح", width: 600 },
					"success",
					3000
				)
			)
			.catch((err) =>
				notify(
					{ message: "حدث خطأ أثناء الإرسال، حاول مرة أخرى", width: 600 },
					"error",
					3000
				)
			);
	};

	// getting data of table in case of skip and take
	let getMovementSheetTableData = (data) => {
		movementSheetTableData.current = data;
		console.log(data);
	};

	// handle double click
	let handleDoubleClick = (event) => {
		console.log(event);
		if (event && event.data.TransactionType != "") {
			setBillsDetailsVisibility(true);
			setBillsDetailsValueObject({
				invoiceType: event.data.TransactionType,
				id: event.data.id,
			});
		}
	};

	let handleSearchTableVisibility = () => {
		setBillsDetailsVisibility(!billsDetailsVisibility);
	};

	return (
		<Popup
			maxWidth={"100%"}
			minWidth={500}
			minHeight={"50%"}
			closeOnOutsideClick={true}
			visible={popupVisibility}
			onHiding={handlePopupVisibility}
			title={title}
		>
			<ScrollView className="container">
				{/* title */}
				{/* {console.log(dateValue.from)} */}
				{/* {console.log(dateValue)}
				{console.log(headerData.s_no)}
				{console.log(localCurrency.value)} */}
				<div
					dir="rtl"
					style={{
						width: "100%",
						display: "flex",
						justifyContent: "space-between",
						marginLeft: "auto",
						margin: "5px 0 20px 0",
					}}
				>
					<div
						style={{
							width: "5%",
							display: "flex",
							justifyContent: "space-between",
						}}
					>
						<div style={{ fontSize: "20px", marginLeft: "5px" }}>
							{`${headerData.s_no ? headerData.s_no : ""}`}
						</div>
						<div style={{ fontSize: "20px" }}>{`${headerData.s_name ? headerData.s_name : ""
							}`}</div>
					</div>
					<div style={{ fontSize: "20px" }}>{`الرصيد الحالي: ${parseFloat(headerData.daen) - parseFloat(headerData.mden)
						}`}</div>
					<div style={{ fontSize: "20px" }}>{`${headerData.tel ? "هاتف: " + headerData.tel : ""
						}`}</div>
				</div>

				<div
					dir="rtl"
					style={{
						width: "100%",
						display: "flex",
						flexWrap: "wrap",
						width: "100%",
						marginLeft: "auto",
					}}
				>
					<div style={{ minWidth: "20%" }}>
						<CheckBox
							label="العملة المحلية"
							value={localCurrency.state}
							handleChange={handleLocalCurrency}
						/>
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
									label="من"
									handleChange={handleDateChange}
									name="from"
									value={dateValue["from"]}
								/>
							</div>
							<div style={{ width: "45%" }}>
								<DateBox
									label="إلى"
									handleChange={handleDateChange}
									name="to"
									value={dateValue["to"]}
								/>
							</div>
						</div>
					</div>
				</div>
				<MasterTable
					// dataSource={tableData.toUse}
					height="300px"
					colAttributes={columnsAttributes}
					allowExcel
					allowPrint
					summaryItems={itemSummaryItems.current}
					remoteOperations={
						(dateValue && headerData.s_no && localCurrency.value) != undefined
							? true
							: false
					}

					apiMethod={
						(dateValue && headerData.s_no && localCurrency.value, headerData.moneyTypeId) != undefined
							? GEt_MOVEMENT_SHEET_DATA
							: null
					}
					apiPayload={{
						AccountID: headerData.s_no,
						BySystemMoneyType: localCurrency?.value,
						MoneyTypeId: headerData.moneyTypeId,
						LanguageID: i18n.language === "en" ? 1 : 0,
						data: { FromDate: dateValue.from, ToDate: dateValue.to },
					}}
					otherMethod={getMovementSheetTableData}
					onRowDoubleClick={handleDoubleClick}
				/>

				<div dir="rtl" className="row w-100 my-3">
					<div className="col-lg-4 col-md-6 col-12">
						<TextBox
							label={"30 >"}
							// value={data["name1"]}
							// name="name1"
							// validationErrorMessage={error["name1"]}
							// handleChange={handleChange}
							required={false}
						/>
					</div>
					<div className="col-lg-4 col-md-6 col-12">
						<TextBox
							label={"30 <"}
							// value={data["name1"]}
							// name="name1"
							// validationErrorMessage={error["name1"]}
							// handleChange={handleChange}
							required={false}
						/>
					</div>
					<div className="col-lg-4 col-md-6 col-12">
						<TextBox
							label={"45 <"}
							// value={data["name1"]}
							// name="name1"
							// validationErrorMessage={error["name1"]}
							// handleChange={handleChange}
							required={false}
						/>
					</div>
					<div className="col-lg-4 col-md-6 col-12">
						<TextBox
							label={"60 <"}
							// value={data["name1"]}
							// name="name1"
							// validationErrorMessage={error["name1"]}
							// handleChange={handleChange}
							required={false}
						/>
					</div>
					<div className="col-lg-4 col-md-6 col-12">
						<TextBox
							label={"90 <"}
							// value={data["name1"]}
							// name="name1"
							// validationErrorMessage={error["name1"]}
							// handleChange={handleChange}
							required={false}
						/>
					</div>
					<div className="col-lg-4 col-md-6 col-12">
						<TextBox
							label={"180 <"}
							// value={data["name1"]}
							// name="name1"
							// validationErrorMessage={error["name1"]}
							// handleChange={handleChange}
							required={false}
						/>
					</div>
				</div>

				<div
					className=" d-flex justify-content-between my-2"
					style={{ width: "20%" }}
				>
					<Button
						text="Email"
						icon="far fa-file-excel"
						type="default"
						stylingMode="outlined"
						width="100px"
						onClick={handleSendEmail}
					/>
					<Button
						text="Print"
						icon="far fa-sticky-note"
						type="default"
						stylingMode="outlined"
						width="100px"
						onClick={handlePrintMovementSheet}
					/>
				</div>

				<BillDetails
					visable={billsDetailsVisibility}
					Toggle={handleSearchTableVisibility}
					detailsvalue={billsDetailsValueObject}
				/>
			</ScrollView>
		</Popup>
	);
}

export default React.memo(MovementSheet);
