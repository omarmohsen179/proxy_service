import React, {
	useEffect,
	useRef,
	useMemo,
	useCallback,
	useState,
} from "react";
import notify from "devextreme/ui/notify";
import {
	TextBox,
	NumberBox,
	DateBox,
	SelectBox,
	DateTime,
} from "../../Components/Inputs";
import { Button } from "devextreme-react/button";
import OverTransactionsTable from "./Components/OverTransactionsTable";
import "./OverTransactions.css";
import { DropDownButton } from "devextreme-react/drop-down-button";
import {
	GET_RECEIPT_ACCOUNTS,
	GET_RECEIPT_CODE,
	GET_RECEIPT_NUMBER,
	GET_RECEIPT_TRANSACTIONS,
	GET_SPECIFIC_RECEIPT_TRANSACTIONS,
} from "./API.OverTransactions";
import _ from "lodash";
import OverTransactionsSpeedActionsButtons from "./Components/OverTransactionsSpeedActionsButtons/OverTransactionsSpeedActionsButtons";
import EditTablePopup from "./Components/EditTablePopup/EditTablePopup";
import { GET_PDF_FILE } from "../Invoice/Components/SpeedActionsButtons/API.SpeedActionsButtons";
import OpenPDFWindow from "../../Components/SharedComponents/PDFReader/PDFwindowFunction";
import { t } from "i18next";
import { useTranslation } from "react-i18next";

const OverTransactions = ({ type, title }) => {
	// Default values
	const billDefaultValues = useRef({
		id: 0,
		datee: new Date(),
		code_hesab: 0,
		// debitOrCredit: "Debit",
		readOnly: false,
	});
	const { t, i18n } = useTranslation();
	const DebitOrCredit = [
		{ id: "Debit", name: t("Debit") },
		{ id: "Credit", name: t("Creditor") },
	];

	//* ────────────────────────────────────────────────────────────────────────────────
	//* ─── STATES ─────────────────────────────────────────────────────────────────────
	//* ────────────────────────────────────────────────────────────────────────────────

	const [bill, setBill] = useState(billDefaultValues.current);

	const [accounts, setAccounts] = useState([]);

	const [receiptTransaction, setReceiptTransaction] = useState({});

	const [parallelBill, setParallelBill] = useState({});

	const [transactions, setTransactions] = useState([]);

	const [itemEditMode, setItemEditMode] = useState(false);

	const [showPopup, setShowPopup] = useState(false);

	const [errors, setErrors] = useState({});

	//* ────────────────────────────────────────────────────────────────────────────────
	//* ─── MEMOS ──────────────────────────────────────────────────────────────────────
	//* ────────────────────────────────────────────────────────────────────────────────

	const apiPayload = useMemo(() => {
		return { transactionCode: bill.code_hesab };
	}, [bill.code_hesab]);

	const debitOrCreditLabel = useMemo(() => {
		return bill.debitOrCredit === "Credit" ? t("Creditor") : t("Debit");
	}, [bill.debitOrCredit]);

	const debitOrCreditValue = useMemo(() => {
		let name = bill.debitOrCredit === "Credit" ? "mden" : "daen";
		return { [name]: receiptTransaction.value };
	}, [bill.debitOrCredit, receiptTransaction.value]);

	const selectedAccount = useMemo(() => {
		const index = accounts.findIndex(
			(account) =>
				account.hesab_id === receiptTransaction.selectedAccountId
		);
		if (~index) {
			return accounts[index];
		}
	}, [accounts, receiptTransaction.selectedAccountId]);

	//* Memo of button that responsible in updating invoice number
	const numberButtonOptions = useMemo(() => {
		return {
			text: t("Update Number"),
			icon: "undo",
			type: "normal",
			stylingMode: "text",
			disabled: bill.readOnly,
			onClick: () => {
				GET_RECEIPT_NUMBER(bill.code_hesab)
					.then(({ NextNumber: receiptNumber }) => {
						setBill((prev) => ({ ...prev, num: receiptNumber }));

						if (errors.e_no) {
							let _errors = errors;
							delete _errors.e_no;
							setErrors(_errors);
						}

						notify(
							{
								message: t("The number has been reset"),
								width: 450,
							},
							"warning",
							2000
						);
					})
					.catch((error) => {
						console.log(error);
						notify(
							{
								message: t("Failed Try again"),
								width: 450,
							},
							"error",
							2000
						);
					});
			},
		};
	}, [bill.code_hesab, bill.readOnly, errors, t]);

	const disableButtonOnError = useMemo(() => {
		return (
			!selectedAccount ||
			!(receiptTransaction.value > 0) ||
			!_.isEmpty(errors)
		);
	}, [errors, receiptTransaction.value, selectedAccount]);

	//* ────────────────────────────────────────────────────────────────────────────────
	//* ─── CALLBACKS ──────────────────────────────────────────────────────────────────
	//* ────────────────────────────────────────────────────────────────────────────────

	const openEditTable = useCallback(() => {
		setShowPopup(true);
	}, []);

	const togglePopup = useCallback(() => {
		setShowPopup((prev) => !prev);
	}, []);

	const updateBillInformation = useCallback(
		(e) => {
			setBill((prevBill) => ({ ...prevBill, [e.name]: e.value }));
			if (errors[e.name]) {
				let updatedErrors = { ...errors };
				delete updatedErrors[e.name];
				setErrors(updatedErrors);
			}
		},
		[errors]
	);

	const updateReceiptTransaction = useCallback(
		(e) => {
			setReceiptTransaction((prevBill) => ({
				...prevBill,
				[e.name]: e.value,
			}));
			if (errors[e.name]) {
				let updatedErrors = { ...errors };
				delete updatedErrors[e.name];
				setErrors(updatedErrors);
			}
		},
		[errors]
	);

	const updateItems = useCallback((data) => {
		setTransactions(data);
	}, []);

	const rowDoubleClickHandle = useCallback(
		({ data }) => {
			// Update ItemEditMode
			setItemEditMode(true);
			// Extract daen or mden value and type from data
			let value = data.AccountType === "Credit" ? data.mden : data.daen;
			// Update bill.DebitOrCredit
			setBill((prev) => ({ ...prev, debitOrCredit: data.AccountType }));
			GET_RECEIPT_ACCOUNTS(
				bill.id,
				bill.code_hesab,
				data.AccountType
			).then((accounts) => {
				// Insert row Accuont to Accounts
				setAccounts([
					...accounts,
					{
						hesab_id: data.hesab_id,
						name: data.name,
						table_id: data.table_id,
					},
				]);
				// Set setReceiptTransaction data
				setReceiptTransaction({
					ID: data.ID,
					ex_rate: data.ex_rate,
					value: value,
					selectedAccountId: data.hesab_id,
				});
			});
		},
		[bill.code_hesab, bill.id]
	);

	const updateReceipt = useCallback(() => {
		if (bill.id === 0) {
			let apiData = {
				Data: [
					{
						ID: bill.id,
						Receipt: {
							byan: bill.byan,
							code_hesab: bill.code_hesab,
							datee: bill.datee,
							nots: bill.nots,
							num: bill.num,
						},
						ReceiptTransactions: [
							{
								...selectedAccount,
								ex_rate: receiptTransaction.ex_rate,
								...debitOrCreditValue,
							},
						],
					},
				],
			};
			GET_RECEIPT_TRANSACTIONS(bill.code_hesab, apiData).then(
				(response) => {
					setBill((prev) => ({
						...prev,
						id: response.id,
						readOnly: true,
					}));
					setTransactions(response.ReceiptTransaction);
					setReceiptTransaction({});
				}
			);
		} else if (bill.id !== 0) {
			if (!itemEditMode) {
				// add item to table
				let apiData = {
					Data: [
						{
							ID: bill.id,
							ReceiptTransactions: [
								{
									...selectedAccount,
									ex_rate: receiptTransaction.ex_rate,
									...debitOrCreditValue,
								},
							],
						},
					],
				};
				GET_RECEIPT_TRANSACTIONS(bill.code_hesab, apiData).then(
					(response) => {
						setTransactions((prev) => [
							...prev,
							...response.ReceiptTransaction,
						]);
						setReceiptTransaction({});
					}
				);
			} else if (itemEditMode) {
				// Update Item
				let apiData = {
					Data: [
						{
							ID: bill.id,
							ReceiptTransactions: [
								{
									ID: receiptTransaction.ID,
									ex_rate: receiptTransaction.ex_rate,
									...debitOrCreditValue,
									...selectedAccount,
								},
							],
						},
					],
				};
				GET_RECEIPT_TRANSACTIONS(bill.code_hesab, apiData).then(
					(response) => {
						let updatedTransactions = [...transactions];
						let index = updatedTransactions.findIndex(
							(transaction) => {
								return (
									transaction.ID ===
									response.ReceiptTransaction[0]?.ID
								);
							}
						);

						if (~index) {
							updatedTransactions[index] = {
								...response.ReceiptTransaction[0],
							};
							setTransactions(updatedTransactions);
							// Notify user
							notify(
								{
									message: t("Updated Successfully"),
									width: 450,
								},
								"success",
								2000
							);
							setItemEditMode(false);
							setReceiptTransaction({});
						}
					}
				);
			}
		}
	}, [
		bill.byan,
		bill.code_hesab,
		bill.datee,
		bill.id,
		bill.nots,
		bill.num,
		debitOrCreditValue,
		itemEditMode,
		receiptTransaction.ID,
		receiptTransaction.ex_rate,
		selectedAccount,
		transactions,
	]);

	const cancelEditItem = useCallback(() => {
		setItemEditMode(false);

		setReceiptTransaction({});

		setErrors({});
	}, []);

	// Edit Basics Information
	const editInvoiceBasicsInformation = useCallback(() => {
		setBill((prev) => {
			setParallelBill({
				...prev,
			});
			return { ...prev, readOnly: !prev.readOnly };
		});
	}, []);

	const acceptFloatingButtonHandle = useCallback(() => {
		let updatedValues = {};
		for (const key of Object.keys(parallelBill)) {
			parallelBill[key] !== bill[key] && (updatedValues[key] = bill[key]);
		}
		let updatedInvoice = {
			Data: [
				{
					ID: bill.id,
					Receipt: {
						...updatedValues,
					},
					ReceiptTransactions: [],
				},
			],
		};
		GET_RECEIPT_TRANSACTIONS(bill.code_hesab, updatedInvoice)
			.then(() => {
				setReceiptTransaction({});
				setItemEditMode(false);
				setBill((prev) => ({
					...prev,
					...updatedValues,
					readOnly: true,
				}));
				setErrors({});
				// Notify user
				notify(
					{
						message: t("Updated Successfully"),
						width: 450,
					},
					"success",
					1000
				);
			})
			.catch(({ response }) => {
				let Errors = response.data ? response.data.Errors : [];
				let responseErrors = {};
				Errors &&
					Errors.forEach(({ Column, Error }) => {
						responseErrors = { ...responseErrors, [Column]: Error };
					});
				setErrors(responseErrors);
				// Notify user
				notify(
					{
						message: t("Failed Try again"),
						width: 450,
					},
					"error",
					2000
				);
			});
	}, [bill, parallelBill]);

	const discardFloatingButtonHandle = useCallback(() => {
		setReceiptTransaction({});
		setItemEditMode(false);
		setBill((prev) => ({
			...prev,
			readOnly: true,
			...parallelBill,
		}));
		setErrors({});
		// Notify user
		notify(
			{
				message: t("Registration has been successfully restored"),
				width: 450,
			},
			"success",
			1000
		);
	}, [parallelBill]);

	const setNewReceipt = useCallback(() => {
		// Reset Bill
		GET_RECEIPT_NUMBER(bill.code_hesab).then(
			({ NextNumber: receiptNumber }) => {
				setBill((prev) => ({
					num: receiptNumber,
					debitOrCredit: prev.debitOrCredit,
					code_hesab: prev.code_hesab,
					...billDefaultValues.current,
				}));
				// Reset Items
				setTransactions([]);
			}
		);

		// Reset Errors
		setErrors({});

		// Reset Item States
		setReceiptTransaction({});

		// Reset Edit mode
		setItemEditMode(false);
	}, [bill.code_hesab]);

	const getReceiptInformation = useCallback(
		({ data }) => {
			GET_SPECIFIC_RECEIPT_TRANSACTIONS({
				transactionCode: bill.code_hesab,
				transactionId: data.ID,
			}).then((_transactions) => {
				setBill((prev) => ({
					id: data.ID,
					debitOrCredit: "Debit",
					num: data.num,
					datee: data.datee,
					byan: data.byan,
					nots: data.nots,
					readOnly: true,
					code_hesab: prev.code_hesab,
				}));
				setTransactions(_transactions);
				if (_transactions.length === transactions.length) {
					GET_RECEIPT_ACCOUNTS(
						data.ID,
						bill.code_hesab,
						"Debit"
					).then((accounts) => {
						setAccounts(accounts);
						setReceiptTransaction((prev) => ({
							...prev,
							selectedAccountId: null,
						}));
					});
				}
			});
			setItemEditMode(false);
			setShowPopup(false);
		},
		[bill.code_hesab, transactions.length]
	);

	//* ────────────────────────────────────────────────────────────────────────────────
	//* ─── EFFECTS ────────────────────────────────────────────────────────────────────
	//* ────────────────────────────────────────────────────────────────────────────────

	// First render Effect
	useEffect(() => {
		// Get receipt code by receipt name
		console.log(title);
		GET_RECEIPT_CODE(title).then(({ code_hesab }) => {
			console.log(code_hesab);
			updateBillInformation({ name: "code_hesab", value: code_hesab });
			GET_RECEIPT_NUMBER(code_hesab).then(
				({ NextNumber: receiptNumber }) => {
					setBill((prev) => ({
						...billDefaultValues.current,
						num: receiptNumber,
						debitOrCredit: "Debit",
					}));
				}
			);
		});

		//I have add title as a parameter for the useEffect "to call use effect at title change" and swap at setBill from prev to billDefaultValues.current
	}, [title]);

	// GET Accounts due to DebitOrCredit value
	useEffect(() => {
		bill.code_hesab &&
			!itemEditMode &&
			GET_RECEIPT_ACCOUNTS(
				bill.id,
				bill.code_hesab,
				bill.debitOrCredit
			).then((accounts) => {
				setAccounts(accounts);
				setReceiptTransaction((prev) => ({
					...prev,
					selectedAccountId: null,
				}));
			});
	}, [bill.debitOrCredit, transactions.length, itemEditMode]);

	useEffect(() => {
		if (bill.id != 0 && transactions.length < 1) {
			setNewReceipt();
		}
	}, [transactions.length]);
	const printHandle = useCallback(async () => {
		await GET_PDF_FILE("DirectEntry", {
			...billDefaultValues,
		})
			.then((file) => {
				OpenPDFWindow(file);
			})
			.catch((error) => {
				console.log(error);
			});
	}, [billDefaultValues]);
	return (
		<>
			{bill.code_hesab > 0 && (
				<EditTablePopup
					visible={showPopup}
					apiPayload={apiPayload}
					togglePopup={togglePopup}
					handleDoubleClick={getReceiptInformation}
				/>
			)}
			<OverTransactionsSpeedActionsButtons
				receiptInformation={{
					id: bill.id,
					readOnly: bill.readOnly,
					receiptType: title,
				}}
				selectedAccountId={selectedAccount}
				editBasicsInformation={editInvoiceBasicsInformation}
				setNew={setNewReceipt}
				openEditTable={openEditTable}
				acceptFloatingButtonHandle={acceptFloatingButtonHandle}
				discardFloatingButtonHandle={discardFloatingButtonHandle}
			/>
			<h1 className="invoiceName">{t(title)}</h1>
			<div className="container rtlContainer">
				<div className="card p-3">
					<div className="row">
						<div className="col-4">
							<NumberBox
								readOnly={bill.readOnly}
								validationErrorMessage={errors.num}
								required={false}
								label="الرقم"
								value={bill.num ?? 0}
								name="num"
								handleChange={updateBillInformation}
								buttonOptions={numberButtonOptions}
							/>
						</div>
						<div className="col-4">
							<DateTime
								readOnly={bill.readOnly}
								required={false}
								label={t("Date")}
								value={bill.datee}
								name="datee"
								handleChange={updateBillInformation}
							/>
						</div>
						<div className="col-4">
							<TextBox
								readOnly={bill.readOnly}
								required={false}
								label={t("Statmenet")}
								name="byan"
								value={bill.byan}
								handleChange={updateBillInformation}
							/>
						</div>
						<div className="col-4">
							<TextBox
								readOnly={bill.readOnly}
								required={false}
								label={t("Note")}
								name="nots"
								value={bill.nots}
								handleChange={updateBillInformation}
							/>
						</div>
						<div className="col-4">
							<Button
								style={{ width: "100%" }}
								type={"button"}
								text={t("Print")}
								onClick={printHandle}
								stylingMode="contained"
							/>
						</div>
					</div>
					<div className="row">
						<OverTransactionsTable
							items={transactions}
							rowDoubleClickHandle={rowDoubleClickHandle}
							transactionCode={bill.code_hesab}
							transactionId={bill.id}
							updateItems={updateItems}
						/>
					</div>
					<div className="row mt-3">
						<div className="col-3">
							<SelectBox
								label={t("Account Type")}
								dataSource={DebitOrCredit.current}
								name="debitOrCredit"
								value={bill.debitOrCredit}
								handleChange={updateBillInformation}
							/>
						</div>
						<div className="col-3">
							<SelectBox
								readOnly={accounts.length < 1}
								label={t("Account")}
								dataSource={accounts}
								keys={{ name: "name", id: "hesab_id" }}
								name="selectedAccountId"
								value={receiptTransaction.selectedAccountId}
								handleChange={updateReceiptTransaction}
							/>
						</div>
						<div className="col-3">
							<NumberBox
								readOnly={selectedAccount ? false : true}
								required={false}
								label={debitOrCreditLabel}
								name={"value"}
								value={receiptTransaction.value ?? 0}
								handleChange={updateReceiptTransaction}
							/>
						</div>
						<div className="col-3">
							<NumberBox
								readOnly={selectedAccount ? false : true}
								required={false}
								label="م"
								name="ex_rate"
								value={receiptTransaction.ex_rate ?? 0}
								handleChange={updateReceiptTransaction}
							/>
						</div>
					</div>
					<div className="row mt-1">
						<div className="col-3">
							<DropDownButton
								key="add"
								rtlEnabled={true}
								className="col-12"
								disabled={disableButtonOnError}
								splitButton={true}
								useSelectMode={true}
								selectedItemKey={0}
								items={[
									{
										id: 0,
										name: itemEditMode
											? t("Edit")
											: t("Add"),
										icon: itemEditMode ? "edit" : "add",
										onClick: updateReceipt,
									},
									{
										id: 1,
										name: t("Cancel"),
										icon: "clear",
										onClick: cancelEditItem,
										disabled:
											!receiptTransaction.selectedAccountId,
									},
								]}
								displayExpr="name"
								keyExpr="id"
								onButtonClick={({ selectedItem }) =>
									selectedItem.onClick()
								}
							/>
						</div>
					</div>
				</div>
			</div>
		</>
	);
};

export default OverTransactions;
