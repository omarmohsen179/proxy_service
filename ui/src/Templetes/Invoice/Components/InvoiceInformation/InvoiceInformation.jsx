// react
import React, {
	useEffect,
	useRef,
	useState,
	useCallback,
	useMemo,
} from "react";
// inputs
import {
	TextBox,
	NumberBox,
	DateBox,
	SelectBox,
} from "../../../../Components/Inputs";
// devexpress
import { SelectBox as DxSelectBox } from "devextreme-react";
import { Popup } from "devextreme-react/popup";
import notify from "devextreme/ui/notify";
import ScrollView from "devextreme-react/scroll-view";
//
import NumberBoxFullWidth from "../../../../Components/Inputs/NumberBoxFullWidth";
import CaptureReceipt from "../../../../Pages/6.BillsTab/CaptureReceipt";

// API
import {
	GET_CASHIER_STORES,
	GET_CASHIERS,
	GET_INVOICE_NUMBER,
	GET_ACCOUNTS,
	GET_SALES_INVOICE_ITEMS,
	GET_CUSTOMERS_MONEY_TYPES,
} from "./API.InvoiceInformation";
import SpendingTransaction from "../../../../Pages/6.BillsTab/SpendingTransaction";
import { useTranslation } from "react-i18next";

const InvoiceInformation = ({
	isReturnTypeInvoice,
	isSalesTypeInvoice,
	isPurchasesTypeInvoice,
	isCashSelesTypeInvoice,
	updateItemsToReturn,
	bill,
	updateBillInformation,
	updateBillState,
	updateStores,
	errors,
	updateErrorsState,
	selectedAccount,
	setSelectedAccount,
	resetComponent,
	initData = {},
	accounts = [],
	moneyTypes = [],
	selectedMoneyType = 0,
	setSelectedMoneyType,
}) => {
	const [showCuptureReceiptPopup, setShowCuptureReceiptPopup] =
		useState(false);

	// Receipt Title
	const receiptTitle = useRef(isSalesTypeInvoice ? "إيصال قبض" : "سند صرف");

	//? ────────────────────────────────────────────────────────────────────────────────
	//? ─── EFFECTS ────────────────────────────────────────────────────────────────────
	//? ────────────────────────────────────────────────────────────────────────────────
	const { t, i18n } = useTranslation();

	//* ────────────────────────────────────────────────────────────────────────────────
	//* ─── CALLBACKS ──────────────────────────────────────────────────────────────────
	//* ────────────────────────────────────────────────────────────────────────────────
	// Close Pop of capture receipt or spending transaction
	const closePopUp = () => {
		setShowCuptureReceiptPopup(!showCuptureReceiptPopup);
	};

	//* on change account type (Customer or Safe) to set selected account {}
	const updateAccountType = useCallback(
		(selectedItem) => {
			updateBillInformation({
				name: "safeOrClient",
				value: selectedItem,
			});
			setSelectedAccount({});
		},
		[setSelectedAccount, updateBillInformation]
	);

	//* callBack to update selected account data
	const updateSelectedAccount = useCallback(
		(e) => {
			// Get Account data by id
			let _selectedAccount =
				accounts.find((account) => account.id == e.value) ?? {};

			// Set current selected account to Account we get before
			setSelectedAccount(_selectedAccount);
			// Update bill state
			updateBillState({
				tele_nkd: _selectedAccount.PhoneNumber,
				itemPrice: !isPurchasesTypeInvoice
					? _selectedAccount.defult_price
					: null,
				omla_id: _selectedAccount.omla_id,
				sno_id: e.value,
			});
			setSelectedMoneyType(_selectedAccount.omla_id);
		},
		[accounts, isPurchasesTypeInvoice, setSelectedAccount, updateBillState]
	);

	//* ────────────────────────────────────────────────────────────────────────────────
	//* ─── MEMOS ──────────────────────────────────────────────────────────────────────
	//* ────────────────────────────────────────────────────────────────────────────────

	//* Memo of button that responsible in updating invoice number
	const invoiceNumberButtonOptions = useMemo(() => {
		return {
			text: t("Update invoice number."),
			icon: "undo",
			type: "normal",
			stylingMode: "text",
			disabled: bill.readOnly,
			onClick: () => {
				GET_INVOICE_NUMBER(bill.invoiceType)
					.then((response) => {
						updateBillInformation({
							name: "e_no",
							value: response.InvoiceNumber,
						});

						if (errors.e_no) {
							let _errors = errors;
							delete _errors.e_no;
							updateErrorsState(_errors);
						}

						// notify(
						//   {
						//     message: `تم اعادة تعين رقم الفاتورة`,
						//     width: 450,
						//   },
						//   "warning",
						//   2000
						// );
					})
					.catch((error) => {
						console.log(error);
						// notify(
						//   {
						//     message: `حدث خطأ اثناء اعادة تعين رقم الفاتورة`,
						//     width: 450,
						//   },
						//   "error",
						//   2000
						// );
					});
			},
		};
	}, [
		bill.invoiceType,
		bill.readOnly,
		errors,
		updateBillInformation,
		updateErrorsState,
		t,
	]);

	//* Memo of button that responsible in get return invoice informations
	const returnInvoiceNumberButtonOptions = useMemo(() => {
		return {
			text: "استرجاع بيانات الفاتورة",
			icon: "checklist",
			type: "normal",
			stylingMode: "text",
			disabled: bill.readOnly || bill.num_sale === "0",
			onClick: () => {
				GET_SALES_INVOICE_ITEMS(bill.invoiceType, bill.num_sale)
					.then((items) => {
						updateItemsToReturn([...items]);
					})
					.catch(({ response }) => {
						let Errors = response.data ? response.data.Errors : [];
						let responseErrors = {};
						Errors &&
							Errors.forEach(({ Column, Error }) => {
								responseErrors = {
									...responseErrors,
									[Column]: Error,
								};
							});
						updateErrorsState(responseErrors);
						// Notify user
						notify(
							{
								message: `${"خطأ في البيانات"}`,
								width: 450,
							},
							"error",
							2000
						);
					});
			},
		};
	}, [bill.readOnly, bill.num_sale, updateItemsToReturn, updateErrorsState]);

	const cuptureReceipt = useMemo(() => {
		return {
			accountId: selectedAccount.id,
			caption: receiptTitle.current,
			mosweq_id: bill.mosweq_id,
		};
	}, [selectedAccount.id, bill.mosweq_id]);

	return (
		<>
			<div className="row pb-3 mx-auto">
				{/* الجزء الأيمن */}
				<div className="row col-md-12 col-lg-6">
					{/* رقم الفاتورة */}
					<div className="col-12">
						<NumberBox
							readOnly={bill.readOnly}
							validationErrorMessage={errors.e_no}
							required={false}
							label={t("Invoice Number")}
							value={bill.e_no}
							name="e_no"
							handleChange={updateBillInformation}
							buttonOptions={invoiceNumberButtonOptions}
						/>
					</div>

					{/* تاريخ الفاتورة */}
					<div className="col-12">
						<DateBox
							readOnly={bill.readOnly}
							required={false}
							label={t("Invoice Date")}
							value={bill.e_date}
							name="e_date"
							handleChange={updateBillInformation}
						/>
					</div>

					{/* البائع */}
					<div className="col-8">
						<SelectBox
							readOnly={bill.readOnly}
							validationErrorMessage={errors.mosweq_id}
							label={t("the seller")}
							dataSource={initData.cashiers}
							name="mosweq_id"
							value={bill.mosweq_id}
							handleChange={updateBillInformation}
						/>
					</div>

					{/* عميل ام خزينة */}
					<div className="col-4">
						<DxSelectBox
							readOnly={
								bill.readOnly ||
								isCashSelesTypeInvoice ||
								bill.invoiceType === "OldPurchases"
							}
							name={"safeOrClient"}
							placeholder={t("Choose")}
							dataSource={[
								{ id: "Customer", name: t("Customer") },
								{ id: "Safe", name: t("Safe") },
							]}
							displayExpr={"name"}
							valueExpr={"id"}
							value={bill.safeOrClient}
							rtlEnabled={true}
							onValueChange={(selectedItem) =>
								updateAccountType(selectedItem)
							}
						/>
					</div>

					{/* نسبة الزيادة على السعر */}
					<div className="col-5">
						{isSalesTypeInvoice ? (
							<NumberBox
								readOnly={bill.readOnly}
								required={false}
								validationErrorMessage={
									errors.ratioOfIncreaseInPrice
								}
								label={t("Price Ratio")}
								value={bill.ratioOfIncreaseInPrice ?? 0}
								name="ratioOfIncreaseInPrice"
								handleChange={updateBillInformation}
							/>
						) : isPurchasesTypeInvoice ? (
							<NumberBox
								readOnly={true}
								required={false}
								validationErrorMessage={errors.num_mas}
								label={t("Expense")}
								value={bill.num_mas ?? 0}
								name="num_mas"
								handleChange={updateBillInformation}
							/>
						) : null}
					</div>

					{/* ملاحظات */}
					<div className="col-7">
						<TextBox
							readOnly={bill.readOnly}
							required={false}
							label={t("Notes")}
							name="nots"
							value={bill.nots}
							handleChange={updateBillInformation}
						/>
					</div>
				</div>

				{/* الجزء الأيسر */}
				<div className="row col-md-12 col-lg-6">
					{/* الزبون الخزنة */}
					<div
						className={
							"col" +
							(bill.safeOrClient !== "Customer"
								? "-12 pl-0"
								: "-9")
						}
					>
						<SelectBox
							readOnly={bill.readOnly}
							validationErrorMessage={errors.sno_id}
							label={
								bill.safeOrClient === "Customer"
									? t("Customer")
									: t("Safe")
							}
							dataSource={accounts}
							name="sno_id"
							value={bill.sno_id}
							handleChange={updateSelectedAccount}
						/>
					</div>

					{bill.safeOrClient === "Customer" && (
						<div className="col-3">
							<NumberBoxFullWidth
								readOnly={true}
								hoverStateEnabled={false}
								value={selectedAccount.debit}
							/>
						</div>
					)}

					{/* نقدًا باسم */}
					<div className="col-9">
						<TextBox
							readOnly={bill.readOnly}
							required={false}
							label={t("Cash in the name")}
							name="nots1"
							value={bill.nots1}
							handleChange={updateBillInformation}
						/>
					</div>

					{/* رقم  الهاتف */}
					<div className="col-3">
						<NumberBoxFullWidth
							readOnly={bill.readOnly}
							placeholder={t("Phone Number")}
							showColor={false}
							handleChange={updateBillInformation}
							name="tele_nkd"
							value={bill.tele_nkd}
							mode="tel"
						/>
					</div>

					{/* العملة */}
					<div className="col-6">
						<SelectBox
							readOnly={bill.readOnly}
							validationErrorMessage={errors.MoneyType}
							label={t("Currency")}
							dataSource={moneyTypes}
							name="omla_id"
							keys={{ id: "omla_id", name: "description" }}
							value={selectedMoneyType}
							handleChange={(e) => setSelectedMoneyType(e.value)}
						/>
						{/* <TextBox
							label="العملة"
							readOnly={true}
							required={false}
							name="currency"
							value={selectedAccount.MoneyType}
							handleChange={updateBillInformation}
						/> */}
					</div>

					{/* م.التحويل */}
					<div className="col-6 px-0">
						<NumberBox
							readOnly={bill.readOnly}
							validationErrorMessage={errors.Ex_Rate}
							required={false}
							label={t("The transfer")}
							value={bill.Ex_Rate}
							name="Ex_Rate"
							handleChange={updateBillInformation}
						/>
					</div>

					{/* اسعار المنتج */}
					<div
						className={
							"col" +
							(bill.safeOrClient !== "Customer"
								? "-12 pl-0"
								: "-7")
						}
					>
						{isSalesTypeInvoice ? (
							<SelectBox
								readOnly={bill.readOnly}
								label={t("Product Price")}
								dataSource={[
									{ id: "price1", name: t("sectoral price") },
									{
										id: "p_gmla1",
										name: t("Wholesale price"),
									},
									{ id: "p_tkl", name: t("Cost price") },
									{
										id: "p_gmla_2",
										name: t("wholesale wholesale price"),
									},
								]}
								name={"itemPrice"}
								value={bill.itemPrice}
								handleChange={updateBillInformation}
							/>
						) : isPurchasesTypeInvoice ? (
							<NumberBox
								readOnly={bill.readOnly}
								required={false}
								validationErrorMessage={errors.num_surce}
								label={t("Source Invoice")}
								value={bill.num_surce}
								name="num_surce"
								handleChange={updateBillInformation}
							/>
						) : null}
					</div>

					{/* ايصال قبض */}
					{bill.id !== 0 && bill.safeOrClient === "Customer" && (
						<button
							style={{ height: "36px" }}
							className="col-5 btn btn-success d-flex align-items-center justify-content-center"
							onClick={() => setShowCuptureReceiptPopup(true)}
						>
							<i className="fas fa-file-invoice-dollar px-2 fa-2x"></i>
							<span className="">{receiptTitle.current}</span>
						</button>
					)}
				</div>

				{isReturnTypeInvoice && (
					<div className="row col-md-12 col-lg-6">
						<div className="col-12">
							<NumberBox
								readOnly={bill.readOnly}
								validationErrorMessage={errors.num_sale}
								required={false}
								label={t("Sales invoice number")}
								value={bill.num_sale}
								name="num_sale"
								handleChange={updateBillInformation}
								buttonOptions={returnInvoiceNumberButtonOptions}
							/>
						</div>
					</div>
				)}

				{/* Popup for Capture Receipt إيصال قبض */}
				{bill.id !== 0 && bill.safeOrClient === "Customer" && (
					<Popup
						maxWidth={"70%"}
						minWidth={250}
						minHeight={"90%"}
						closeOnOutsideClick={true}
						visible={showCuptureReceiptPopup}
						onHiding={setShowCuptureReceiptPopup}
						title={false}
					>
						<ScrollView>
							{isSalesTypeInvoice ? (
								<CaptureReceipt
									togglePopup={closePopUp}
									data={cuptureReceipt}
								/>
							) : (
								<SpendingTransaction
									togglePopup={closePopUp}
									data={cuptureReceipt}
								/>
							)}
						</ScrollView>
					</Popup>
				)}
			</div>
		</>
	);
};

export default React.memo(InvoiceInformation);
