// React
import React, { useState, useRef, useEffect, useCallback } from "react";
// CSS
import "./DebtsStatement.css";
// Components
import { SelectBox, CheckBox } from "../../../Components/Inputs";
import MasterTable from "../../../Components/SharedComponents/Tables Components/MasterTable";
import OpenPDFWindow from "../../../Components/SharedComponents/PDFReader/PDFwindowFunction";
// Modals
import MovementSheet from "./MovementSheet";
// devexpress
import { Button } from "devextreme-react/button";
import { TextArea as TextExpress } from "devextreme-react/text-area";
import { SpeedDialAction } from "devextreme-react/speed-dial-action";
import notify from "devextreme/ui/notify";
// API
// API that gets Marketer data to dropdown list المسوق
import { GET_MARKETERS } from "../../../Services/ApiServices/General/LookupsAPI";
import {
	GET_CLASSIFICATIONS,
	SEND_EMAIL_SMS,
} from "../../../Services/ApiServices/General/ReportsAPI";
import {
	GET_TABLE_DATA,
	GEt_MOVEMENT_SHEET_DATA,
	GET_PDF,
} from "./API.DebtsStatement";
import { GET_MONEY_TYPES } from "../../2.Basics/MoneyTypes/Components/MoneyTypes";
import { useTranslation } from "react-i18next";

function DebtsStatement() {
	const { t, i18n } = useTranslation();
	// ============================================================================================================================
	// ================================================= Lists ====================================================================
	// ============================================================================================================================

	// Table Column
	let columnsAttributes = [
		{
			caption: "الرقم",
			captionEn: "Number",
			field: "docno",
			alignment: "center",
			isVisable: true,
		},
		{
			caption: "البيان",
			captionEn: "Statment",
			field: "s_name",
			alignment: "center",
			isVisable: true,
		},
		{
			caption: "مدين",
			field: "mden",
			captionEn: "Debit",
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
			caption: "الهاتف",
			captionEn: "Phone Number",
			field: "tel",
			alignment: "center",
			isVisable: true,
		},
		{
			caption: "العملة",
			captionEn: "The Currency",
			field: "omla",
			alignment: "center",
			isVisable: false,
		},
		{
			caption: "المسوق",
			captionEn: "Markter",
			field: "mosweq_name",
			alignment: "center",
			isVisable: false,
		},
		{
			caption: "تاريخ آخر بيع",
			captionEn: "Last sale date",
			field: "last_mbe",
			alignment: "center",
			isVisable: false,
		},
		{
			caption: "تاريخ آخر سداد",
			field: "last_egb",
			captionEn: "Last payment date",
			alignment: "center",
			isVisable: false,
		},
	];

	let DebitTypeState = [
		{ id: 0, name: t("All") },
		{ id: 1, name: t("Debit only") },
		{ id: 2, name: t("Credit only") },
		{ id: 3, name: t("Credit + Debit") },
	];

	// ============================================================================================================================
	// ================================================= State ====================================================================
	// ============================================================================================================================

	// Marketers المسوقين
	const [marketersList, setMarketersList] = useState();
	// marketers selected value.
	const [marketersValue, setMarketersValue] = useState();
	//
	const [moneyTypes, setMoneyTypes] = useState([]);
	//
	const [selectedMoneyType, setSelectedMoneyType] = useState(0);
	// Classifications التصنيف
	const [classificationsList, setClassificationsList] = useState();
	// calssifications selected value.
	const [classificationsValue, setClassificationsValue] = useState();
	// حالة الدين
	const [depitTypeValue, setdepitTypeValue] = useState();
	//  بيانات الجدول
	const [isSMS, setIsSMS] = useState({ mode: "single", open: false });
	// Open or close MovementSheet popup  كشف الحركة
	const [popupVisibility, setPopupVisibility] = useState(false);
	// set data of selected row of the table to be sendt to the pop up to be displayed there.
	const [movementSheetHeaderData, setMovementSheetHeaderData] = useState({});
	// set selected rows ids of the table to be used in the sending emails and sms to particular people.
	const setIDsArray = useRef([]);
	// Check if there are any data in the table so that we let buttons work or not
	const setIsTableData = useRef(false);
	// Check if رسالة إفتراضية check box is checked or not this check box is shown when clicking إرسال رسالة نصية
	const [defaultMessage, setDefaultMessage] = useState(false);
	// value og the Text Area that is shown when clicking إرسال رسالة نصية
	const [textAreaMessageBody, setTextAreaMessageBody] = useState("");
	//   Toatal value of daen values.
	const setMdenSum = useRef(0);
	//   Toatal value of mden values.
	const setDaenSum = useRef(0);

	// ============================================================================================================================
	// ================================================= Master Table Summary =====================================================
	// ============================================================================================================================

	// Summary
	let itemSummaryItems = [
		{
			column: "mden",
			summaryType: "sum",
			valueFormat: "currency",
			cssClass: "mdenState",
			showInColumn: "mden",

			customizeText: (data) => {
				return `${t("Debit")}: ${setMdenSum.current}`;
			},
		},
		{
			column: "daen",
			summaryType: "sum",
			valueFormat: "currency",
			cssClass: "daenState",
			showInColumn: "daen",
			customizeText: (data) => {
				return `${t("Creditor")}:  ${setDaenSum.current}    `;
			},
		},
		{
			column: "tel",
			summaryType: "sum",
			valueFormat: "currency",
			cssClass:
				setMdenSum.current &&
				(setDaenSum.current - setMdenSum.current >= 0
					? "daenState"
					: "mdenState"),
			showInColumn: "tel",
			customizeText: (data) => {
				// console.log(data);
				return `${t("Total")}: ${
					setDaenSum.current - setMdenSum.current
				} `;
			},
		},
	];

	// ============================================================================================================================
	// ================================================= Effects ==================================================================
	// ============================================================================================================================

	// Initial : get classifications and marketers selectboxes
	useEffect(async () => {
		// getting المسوقين
		GET_MARKETERS()
			.then((res) => {
				setMarketersList([{ id: 0, name: t("All") }, ...res]);
			})
			.catch((err) => console.log(err));

		// getting التصنيف
		GET_CLASSIFICATIONS()
			.then((res) => {
				setClassificationsList(res);
				// console.log(res);
			})
			.catch((err) => console.log(err));

		GET_MONEY_TYPES()
			.then((res) => {
				setMoneyTypes(res);
			})
			.catch((err) => console.log(err));
	}, []);

	// ============================================================================================================================
	// ================================================= Handelers ================================================================
	// ============================================================================================================================

	// Main Select Boxes
	// ========================
	// set new value of marketers on selection of selectbox .. المسوقين
	let handleMarketersChange = ({ value }) => {
		setMarketersValue(value);
	};
	// set new value of classifications on selection of selectbox .. التصنيف
	let handleClassificationsChange = ({ value }) => {
		setClassificationsValue(value);
	};
	// set new value of DepitType on selection of selectbox .. حالة الدين
	let handleDepitTypeChange = ({ value }) => {
		setdepitTypeValue(value);
	};

	let handleMoneyTypeChange = ({ value }) => {
		setSelectedMoneyType(value);
	};

	// إظهار المودال الخاص بكل عميل وهو كشف الحركة
	// ===========================================================
	// open or close popup of كشف الحركة
	let handlePopupVisibility = useCallback(() => {
		setPopupVisibility(!popupVisibility);
	}, [popupVisibility]);

	// Double Clikcking matters
	let handleDoubleClick = async (e) => {
		setMovementSheetHeaderData({
			...e.data,
			moneyTypeId: selectedMoneyType,
		});
		setPopupVisibility(!popupVisibility);
	};

	// إرسال رسالة نصية
	// ========================
	// Show sms part عند ضغط إرسال رسالة نصية
	let handleSendSMS = () => {
		if (isSMS.open === false) setIsSMS({ mode: "multiple", open: true });
	};
	// Cancel Sms part عند ضغط إلغاء في ملحقات إرسال الرسالة النصية
	let handleCancelSendSMS = () => {
		if (isSMS.open === true) setIsSMS({ mode: "single", open: false });
	};
	// إرسال رسالة نصية Toggler
	let handleDefaultMessageChange = () => {
		setDefaultMessage(!defaultMessage);
	};
	// Text Area of إرسال رسالة نصية
	let handleDefaultMessageBody = (event) => {
		setTextAreaMessageBody(event.value);
	};
	// زرار المطالبة الخاص ب زرار إرسال رسالة نصية
	let handleCliming = () => {
		if (setIsTableData.current) {
			let Data = {
				AccountCol: "AccountID",
				SendType: "SMS",
				MessageSubject: "",
				MessageBody: "",

				BySystemMoneyType: 0,
				FromDate: new Date("2010-01-01"),
				ToDate: new Date(),
				AccountsIDs: setIDsArray.current,
			};
			if (setIDsArray.current.length != 0) {
				SEND_EMAIL_SMS("AccountTransactions", Data)
					.then((res) =>
						handleNotify(
							t("Text messages sent successfully"),
							"success"
						)
					)
					.catch((err) =>
						handleNotify(
							t("An error occurred while sending, try again"),
							"error"
						)
					);
			} else {
				handleNotify(
					t("Some customers should be selected first to send to"),
					"error"
				);
			}
		} else {
			handleNotify(t("Table contains no data."), "error");
		}
	};
	// زرار تذكير الحساب الخاص ب زرار إرسال رسالة نصية
	let handleAccountReminder = () => {
		if (setIsTableData.current) {
			let Data = {
				AccountCol: "AccountID",
				SendType: "SMS",
				MessageSubject: "",
				MessageBody: defaultMessage
					? ""
					: textAreaMessageBody.length > 0
					? textAreaMessageBody
					: notify(
							{
								message: t("You must write a letter first."),
								width: 600,
							},
							"error",
							3000
					  ),
				BySystemMoneyType: 0,
				FromDate: new Date("2010-01-01"),
				ToDate: new Date(),
				AccountsIDs: setIDsArray.current,
			};

			if (setIDsArray.current.length === 0) {
				handleNotify(
					t("Some must be selected first to be sent to."),
					"error"
				);
			} else {
				if (defaultMessage === false) {
					if (textAreaMessageBody.length === 0) {
						handleNotify("يجب كتابة نص الرسالة", "error");
					} else {
						SEND_EMAIL_SMS("AccountTransactions", Data)
							.then((res) =>
								handleNotify(
									t("Text messages sent successfully"),
									"success"
								)
							)
							.catch((err) =>
								handleNotify(
									"حدث خطأ أثناء الإرسال، حاول مرة أخرى",
									"error"
								)
							);
					}
				} else {
					SEND_EMAIL_SMS("AccountTransactions", Data)
						.then((res) =>
							handleNotify(
								"تم إرسال الرسائل النصية بنجاح",
								"success"
							)
						)
						.catch((err) =>
							handleNotify(
								"حدث خطأ أثناء الإرسال، حاول مرة أخرى",
								"error"
							)
						);
				}
			}
		} else {
			handleNotify("الجدول لا يحتوي على بيانات", "error");
		}
	};

	// مطالبة SMS
	// ===========================

	let handleSMSClaiming = () => {
		if (setIsTableData.current) {
			let Data = {
				AccountCol: "AccountID",
				SendType: "SMS",
				MessageSubject: "",
				MessageBody: "",
				BySystemMoneyType: 0,
				FromDate: new Date("2010-01-01"),
				ToDate: new Date(),
				AccountsIDs: [],
			};

			SEND_EMAIL_SMS("AccountTransactions", Data)
				.then((res) =>
					handleNotify("تم إرسال الرسائل النصية بنجاح", "success")
				)
				.catch((err) =>
					handleNotify(
						"حدث خطأ أثناء الإرسال، حاول مرة أخرى",
						"error"
					)
				);
		} else {
			handleNotify("لا يوجد بيانات في الجدول", "error");
		}
	};

	//	إرسال الكشوفات إلى الإيميلات
	// ===========================
	let handleSendSheetsToEmails = () => {
		if (setIsTableData.current) {
			let Data = {
				AccountCol: "AccountID",
				SendType: "Email",
				MessageSubject: "",
				MessageBody: "",
				BySystemMoneyType: 0,
				FromDate: new Date("2010-01-01"),
				ToDate: new Date(),
				AccountsIDs: setIDsArray.current,
			};
			SEND_EMAIL_SMS("AccountTransactions", Data)
				.then((res) => {
					handleNotify(
						t("E-mail has been sent successfully"),
						"success"
					);
				})
				.catch((err) => {
					handleNotify(
						t("An error occurred while sending, try again"),
						"error"
					);
				});
		} else {
			handleNotify(t("Table contains no data."), "error");
		}
	};

	//	General Handlers
	// ===========================
	// call API to print the table's data
	let handlePrint = () => {
		let Data = {
			AgentID: marketersValue,
			DebitType: depitTypeValue,
		};
		GET_PDF(Data)
			.then((file) => OpenPDFWindow(file))
			.catch((err) => console.log(err));
	};

	let handleSelection = useCallback((event) => {
		// console.log(event.selectedRowsData[0].s_no);

		event.cancel = true;
		let letselectedItemsIdsArray = [];
		event &&
			event.selectedRowKeys.map((element) =>
				letselectedItemsIdsArray.push(element)
			);
		setIDsArray.current = letselectedItemsIdsArray;
	}, []);

	// Function that gets data of the table in OnScrollGettingData case
	let getTableData = useCallback((data) => {
		if (data != undefined) {
			setMdenSum.current = data.PayableTotal;
			setDaenSum.current = data.DebitTotal;
			setIsTableData.current = data.data.length > 0;
		}
	}, []);

	// Function that handels notifying
	let handleNotify = (MessageBody, MessageType) => {
		notify({ message: MessageBody, width: 600 }, MessageType, 3000);
	};

	return (
		<div className="container">
			<h2 className="text-center mb-4" style={{ fontWeight: "600" }}>
				{t("Debt Disclosure")}
			</h2>
			<div className="p-4 card">
				<div className="double ">
					<SelectBox
						label={t("Categorize")}
						keys={{ name: "class" }}
						dataSource={classificationsList}
						value={classificationsValue}
						handleChange={handleClassificationsChange}
						required={false}
					/>
					<SelectBox
						label={t("Marketer")}
						dataSource={marketersList}
						value={marketersValue}
						handleChange={handleMarketersChange}
						required={false}
					/>
				</div>

				<div className="double ">
					<SelectBox
						label={t("case of debt")}
						dataSource={DebitTypeState}
						value={depitTypeValue}
						handleChange={handleDepitTypeChange}
						required={false}
					/>
					<SelectBox
						label={t("Currency")}
						dataSource={moneyTypes}
						value={selectedMoneyType}
						keys={{ id: "id", name: "description" }}
						handleChange={handleMoneyTypeChange}
						required={false}
					/>
				</div>
				{/* Table */}
				<div className="my-2">
					<MasterTable
						selectionMode={isSMS.mode}
						allowSelectAllMode={false}
						onSelectionChanged={handleSelection}
						height={40 + "vh"}
						colAttributes={columnsAttributes}
						remoteOperations={
							depitTypeValue != undefined &&
							classificationsValue != undefined &&
							marketersValue != undefined
								? true
								: false
						}
						apiKey="docno"
						apiMethod={
							depitTypeValue != undefined &&
							classificationsValue != undefined &&
							marketersValue != undefined &&
							selectedMoneyType != 0
								? GET_TABLE_DATA
								: null
						}
						apiPayload={{
							AccountType: classificationsValue?.class,
							AgentID: marketersValue,
							DebitType: depitTypeValue,
							MoneyTypeId: selectedMoneyType,
						}}
						otherMethod={getTableData}
						summaryItems={itemSummaryItems}
						allowExcel={true}
						allowPrint={true}
						onRowDoubleClick={handleDoubleClick}
					/>
				</div>
				<div className="double mt-3">
					{/* Buttons */}
					<div className="triple">
						<Button
							text={t("Send statements to e-mails")}
							type="default"
							stylingMode="outlined"
							onClick={handleSendSheetsToEmails}
						/>
						<Button
							text={t("SMS prompt")}
							type="default"
							stylingMode="outlined"
							onClick={handleSMSClaiming}
						/>
						<Button
							text={t("Send a text")}
							type="default"
							stylingMode="outlined"
							type="default"
							stylingMode="outlined"
							onClick={handleSendSMS}
						/>
					</div>
				</div>
			</div>

			{/* === */}

			{isSMS.open && (
				<div className="mt-3">
					<TextExpress
						height="130px"
						value={textAreaMessageBody}
						onValueChanged={handleDefaultMessageBody}
					/>
					<div className="double mt-3">
						<div className="double">
							<CheckBox
								label={t("default message")}
								value={defaultMessage}
								name="Cancel_box"
								handleChange={handleDefaultMessageChange}
							/>
							<Button
								text={t("Account Reminder")}
								type="default"
								stylingMode="outlined"
								type="default"
								stylingMode="outlined"
								onClick={handleAccountReminder}
							/>
						</div>
						<div className="double">
							<Button
								text={t("Claim")}
								type="default"
								stylingMode="outlined"
								type="default"
								stylingMode="outlined"
								onClick={handleCliming}
							/>
							<Button
								text={t("Cancel")}
								type="default"
								stylingMode="outlined"
								type="default"
								stylingMode="outlined"
								onClick={handleCancelSendSMS}
							/>
						</div>
					</div>
				</div>
			)}

			<MovementSheet
				popupVisibility={popupVisibility}
				handlePopupVisibility={handlePopupVisibility}
				title={t("Motion Detection")}
				headerData={movementSheetHeaderData}
			/>

			{marketersValue && depitTypeValue !== undefined && (
				<SpeedDialAction
					icon="alignleft"
					label={t("Print")}
					index={3}
					onClick={handlePrint}
				/>
			)}
		</div>
	);
}

export default DebtsStatement;
