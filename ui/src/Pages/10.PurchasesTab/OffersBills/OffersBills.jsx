import React, {
	useRef,
	useState,
	useEffect,
	useCallback,
	useMemo,
} from "react";
import {
	DateBox,
	NumberBox,
	SelectBox,
	TextBox,
} from "../../../Components/Inputs";
import _, { isEmpty, isUndefined } from "lodash";
import DropDownButton from "devextreme-react/drop-down-button";
import {
	EXPORT_TO_PURCHASES_INVOICE,
	GET_OFFERS_BILLS_ACCOUNTS,
	GET_OFFERS_BILLS_NEXT_NUMBER,
	GET_OFFERS_BILL_ITEMS,
	IMPORT_OFFERS_FROM_EXCEL,
	UPDATE_OFFERS_BILL,
} from "./API.OffersBills";
import OffersBillsTable from "./Components/OffersBillsTable";
import SearchItem from "../../Items/SearchItem";
import { useDispatch, useSelector } from "react-redux";
import {
	selectVisible,
	setItem,
	setVisible,
} from "../../../Store/Items/ItemsSlice";
import {
	GET_ITEM_INFO,
	GET_MAIN_CATEGORIES,
} from "../../../Services/ApiServices/ItemsAPI";
import notify from "devextreme/ui/notify";
import OffersBillsSpeedActionsButtons from "./Components/OffersBillsSpeedActionsButtons/OffersBillsSpeedActionsButtons";
import EditTablePopup from "./Components/EditTablePopup/EditTablePopup";
import EnrollmentUnenrolledItemsPopup from "./Components/EnrollmentUnenrolledItemsPopup/EnrollmentUnenrolledItemsPopup";
import { GET_SPECIFIC_LOOKUP } from "../../../Services/ApiServices/General/LookupsAPI";
import { GET_CASHIER_STORES } from "../../../Services/ApiServices/SalesBillAPI";
import { useTranslation } from "react-i18next";

const OffersBills = () => {
	const dispatch = useDispatch();
	const { t, i18n } = useTranslation();
	// Default values
	const billDefaultValues = useRef({
		id: 0,
		num_orod: 0,
		datee: new Date(),
		cust: 0,
		nots: "",
		readOnly: false,
	});

	const [bill, setBill] = useState(billDefaultValues.current);

	// State of Errors
	const [errors, setErrors] = useState({});

	const [accounts, setAccounts] = useState([]);

	const [itemEditMode, setItemEditMode] = useState(false);

	const [updatedItem, setUpdatedItem] = useState({});

	const [selectedItem, setSelectedItem] = useState({});

	const [items, setItems] = useState([]);

	const [addButtonId, setAddButtonId] = useState(0);

	const [categories, setCategories] = useState([]);

	const [units, setUnits] = useState([]);

	const [stores, setStores] = useState([]);

	const [selectedStore, setSelectedStore] = useState(-1);

	// Popups
	const [showEditTablePopup, setShowEditTablePopup] = useState(false);

	const [showEnrollItemsPopup, setShowEnrollItemsPopup] = useState(false);

	let visible = useSelector(selectVisible);

	//* ────────────────────────────────────────────────────────────────────────────────
	//* ─── CALLBACKS ──────────────────────────────────────────────────────────────────
	//* ────────────────────────────────────────────────────────────────────────────────
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

	const toggleShowEditTablePopup = useCallback(() => {
		setShowEditTablePopup((prev) => !prev);
	}, []);

	const toggleShowEnrollItemsPopup = useCallback(() => {
		setShowEnrollItemsPopup((prev) => !prev);
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

	const updateSelectedStore = useCallback((e) => {
		setSelectedStore(e.value);
	}, []);

	const updateItemInformation = useCallback((e) => {
		setUpdatedItem((prev) => ({ ...prev, [e.name]: e.value }));
	}, []);
	const updateItems = useCallback((items) => {
		setItems(items);
	}, []);

	const searchItemCallBackHandle = useCallback((itemId) => {
		GET_ITEM_INFO(0, itemId, "ItemBarcode").then((item) => {
			setUpdatedItem({
				item_no: item.item_no,
				item_name: item.item_name,
				code_no: item.code_no,
				item_name_e: item.item_name_e,
				Exp_Date: new Date(),
				dess: 0,
				kmea: 1,
				price: item.p_tkl,
			});
		});
	}, []);

	const addItemToInvoice = useCallback(() => {
		if (bill.id > 0) {
			let updatedInvoice = {
				Data: [
					{
						ID: bill.id,
						InvoiceItems: [{ ...updatedItem }],
					},
				],
			};
			if (itemEditMode) {
				UPDATE_OFFERS_BILL(updatedInvoice)
					.then(({ Item }) => {
						let updatedItems = [...items];

						let index = updatedItems.indexOf(selectedItem);

						if (~index) {
							updatedItems[index] = { ...Item };
							setItems(updatedItems);
							// Notify user
							notify(
								{
									message: t("Saved Successfully"),
									width: 450,
								},
								"success",
								2000
							);
							setUpdatedItem({});
							setItemEditMode(false);
						}
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
						setErrors(responseErrors);
						// Notify user
						notify(
							{
								message: `${t("Failed Try again")}`,
								width: 450,
							},
							"error",
							2000
						);
					});
			} else {
				UPDATE_OFFERS_BILL(updatedInvoice)
					.then(({ Item }) => {
						let updatedItems = [...items];

						updatedItems.push(Item);

						setItems(updatedItems);

						// Notify user
						notify(
							{
								message: t("Saved Successfully"),
								width: 450,
							},
							"success",
							2000
						);
						setUpdatedItem({});
						setSelectedItem({});
						setItemEditMode(false);
					})
					.catch((_response) => {
						console.log(_response);
						let response = _response.response;
						let Errors = response.data ? response.data.Errors : [];
						let responseErrors = {};
						Errors &&
							Errors.forEach(({ Column, Error }) => {
								responseErrors = {
									...responseErrors,
									[Column]: Error,
								};
							});
						setErrors(responseErrors);
						// Notify user
						notify(
							{
								message: `${t("Failed Try again")}`,
								width: 450,
							},
							"error",
							2000
						);
					});
			}
		} else if (bill.id === 0) {
			let invoice = {
				Data: [
					{
						ID: "0",
						Invoice: {
							cust: bill.cust,
							datee: bill.datee,
							nots: bill.nots,
							num_orod: bill.num_orod,
							readOnly: bill.readOnly,
						},
						InvoiceItems: [updatedItem],
					},
				],
			};
			UPDATE_OFFERS_BILL(invoice)
				.then(({ id, Item }) => {
					setUpdatedItem({});
					setSelectedItem({});
					setItems([Item]);
					setBill((prev) => ({
						...prev,
						id: id,
						readOnly: true,
					}));
					// // Notify user
					notify(
						{
							message: t("Add Successfully"),
							width: 450,
						},
						"success",
						1000
					);
				})
				.catch((response) => {
					console.log(response);
					let Errors = response.data ? response.data.Errors : [];
					let responseErrors = {};
					Errors &&
						Errors.forEach(({ Column, Error }) => {
							responseErrors = {
								...responseErrors,
								[Column]: Error,
							};
						});
					setErrors(responseErrors);
					// Notify user
					notify(
						{
							message: `${t("Failed Try again")}`,
							width: 450,
						},
						"error",
						2000
					);
				});
		}
	}, [bill, itemEditMode, items, selectedItem, updatedItem]);

	const cancelEditItem = useCallback(() => {
		setItemEditMode(false);

		setUpdatedItem({});

		setErrors({});
	}, []);

	const addItemsFromExcel = useCallback(
		async (excelOffersData, AddAll) => {
			let data =
				bill.id === 0
					? {
							Data: [
								{
									ID: bill.id,
									AddAll: AddAll,
									Invoice: {
										cust: bill.cust,
										datee: bill.datee,
										nots: bill.nots,
										num_orod: bill.num_orod,
									},
									InvoiceItems: excelOffersData,
								},
							],
					  }
					: {
							Data: [
								{
									ID: bill.id,
									AddAll: AddAll,
									InvoiceItems: excelOffersData,
								},
							],
					  };

			return IMPORT_OFFERS_FROM_EXCEL(data)
				.then((response) => {
					const { ID, InsertItems, NonValidIDs } = response;

					// In case of add new invoice we need to update invoiceId
					ID &&
						setBill((prev) => ({
							...prev,
							id: ID,
							readOnly: true,
						}));

					// In all cases of 200 will return InsertItems so we need to update items
					if (InsertItems.length > 0) {
						// update items
						setItems((prev) => [...prev, ...InsertItems]);
						// notify user
						let message = AddAll
							? t("Items added successfully.")
							: t(
									"Available items have been successfully inserted"
							  );
						notify(
							{ message: message, width: 450 },
							"success",
							3000
						);
					}

					return NonValidIDs
						? // in case of NonValidIDs we are in pending state
						  {
								NonValidIDs: NonValidIDs,
								// Mock
								// NonValidIDs: [0, 1, 2, 3, 5, 9, 7],
								done: "pending",
						  }
						: // in case of not NonValidIDs we are in success state
						  {
								done: "success",
						  };
				})
				.catch((error) => {
					if (error.response?.status === 400) {
						notify(
							{ message: `${t("Failed Try again")}`, width: 450 },
							"error",
							3000
						);
					} else {
						notify(
							{
								message: `${t("Failed Try again")}`,
								width: 450,
							},
							"error",
							2000
						);
					}
					// in case of errors
					return { done: "failed" };
				});
		},
		[bill.cust, bill.datee, bill.id, bill.nots, bill.num_orod, t]
	);

	// This callback is fireing on item row in itemsTable clicked
	// This callback is responsible of
	// update bill.storeId
	const onItemRowDoubleClickHandle = useCallback((e) => {
		if (e.data.ID) {
			setItemEditMode(true);

			setSelectedItem(e.data);

			setUpdatedItem(e.data);

			setErrors({});
		}
	}, []);

	const setNewInvoice = useCallback((invoiceType) => {
		// Reset Bill
		setBill(billDefaultValues.current);

		// Reset Items
		setItems([]);

		// Reset Errors
		setErrors({});

		// Reset Item States
		setSelectedItem({});
		setUpdatedItem({});

		// Reset Edit mode
		setItemEditMode(false);

		// Reset child components
		GET_OFFERS_BILLS_NEXT_NUMBER()
			.then(({ NextNumber }) => {
				setBill((prev) => ({ ...prev, num_orod: NextNumber }));
			})
			.then(() => {
				notify(
					{
						message: t("Invoice Updated Successfully"),
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
						message: `${t("Failed Try again")}`,
						width: 450,
					},
					"error",
					2000
				);
			});
	}, []);

	const getBillInformation = useCallback(({ data }) => {
		setShowEditTablePopup(false);
		GET_OFFERS_BILL_ITEMS(data.ID)
			.then(({ OfferBillItems }) => {
				if (OfferBillItems.length > 0) {
					setBill((prev) => ({
						id: data.ID,
						datee: data.datee,
						cust: data.cust,
						nots: data.nots,
						num_orod: data.num_orod,
						readOnly: true,
					}));
					setItems(OfferBillItems);
				}
			})
			.catch((error) => {
				console.log(error);
			});
	}, []);

	const exportToPurchasesInvoice = useCallback(() => {
		EXPORT_TO_PURCHASES_INVOICE(selectedStore, bill.id)
			.then(() => {
				notify(
					{
						message: t(
							"Invoice has been successfully exported to Purchases"
						),
						width: 450,
					},
					"success",
					2000
				);
			})
			.catch((error) => {
				console.log(error);
				notify(
					{
						message: t("Invoice Updated Successfully"),
						width: 450,
					},
					"error",
					2000
				);
			});
	}, [bill.id, selectedStore]);

	const test = useCallback(() => {
		console.log(bill);
	}, [bill]);

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
				GET_OFFERS_BILLS_NEXT_NUMBER()
					.then((response) => {
						updateBillInformation({
							name: "num_orod",
							value: response.NextNumber,
						});

						if (errors.num_orod) {
							let _errors = errors;
							delete _errors.num_orod;
							setErrors(_errors);
						}
						notify(
							{
								message: t("The invoice number has been reset"),
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
								message: t(
									"An error occurred while resetting the invoice number"
								),
								width: 450,
							},
							"error",
							2000
						);
					});
			},
		};
	}, [bill.readOnly, errors, updateBillInformation, t]);

	const selectItemDisable = useMemo(() => {
		return itemEditMode || !bill.cust || (bill.id && !bill.readOnly);
	}, [bill.cust, bill.id, bill.readOnly, itemEditMode]);

	const itemInformationDisable = useMemo(() => {
		return !bill.cust;
	}, [bill.cust]);

	const disableButtonOnError = useMemo(() => {
		return (
			!updatedItem.item_no ||
			!updatedItem.item_name ||
			!(updatedItem.kmea > 0) ||
			!(updatedItem.price >= 0) ||
			!_.isEmpty(errors)
		);
	}, [
		errors,
		updatedItem.item_name,
		updatedItem.item_no,
		updatedItem.kmea,
		updatedItem.price,
	]);

	const enrollItemsButtonDisable = useMemo(() => {
		return !(bill.id !== 0 && items.length > 0);
	}, [bill.id, items.length]);

	const importFromExcel = useMemo(() => {
		return bill.cust > 0;
	}, [bill.cust]);

	//? ────────────────────────────────────────────────────────────────────────────────
	//? ─── EFFECTS ────────────────────────────────────────────────────────────────────
	//? ────────────────────────────────────────────────────────────────────────────────

	//? First Render effect
	//? to get invoiceNumber, accounts
	useEffect(() => {
		// 1- Get Invoice Number
		GET_OFFERS_BILLS_NEXT_NUMBER().then(({ NextNumber }) => {
			setBill((prev) => ({ ...prev, num_orod: NextNumber }));
		});
		// Get Accounts
		GET_OFFERS_BILLS_ACCOUNTS().then((accounts) => {
			setAccounts(accounts);
		});
		GET_MAIN_CATEGORIES().then(({ MainCategory }) => {
			setCategories(MainCategory);
		});
		GET_SPECIFIC_LOOKUP("الوحــــــــــــــــــــــــدات").then((units) => {
			setUnits(units);
		});
		GET_CASHIER_STORES().then((cashierStores) => {
			setStores(cashierStores);
		});
	}, []);

	useEffect(() => {
		if (bill.id != 0 && items.length < 1) {
			setNewInvoice(bill.invoiceType);
		}
	}, [items.length]);

	useEffect(() => {
		if (
			isUndefined(updatedItem.kmea) ||
			updatedItem.kmea == "0" ||
			isNaN(updatedItem.kmea) ||
			isEmpty(updatedItem.kmea)
		) {
			setUpdatedItem((prev) => ({ ...prev, kmea: 1 }));
		}
	}, [updatedItem.kmea]);

	useEffect(() => {
		if (isUndefined(updatedItem.Exp_Date)) {
			setUpdatedItem((prev) => ({ ...prev, Exp_Date: new Date() }));
		}
	}, [updatedItem.Exp_Date]);

	useEffect(() => {
		if (
			isUndefined(updatedItem.price) ||
			isNaN(updatedItem.price) ||
			isEmpty(updatedItem.price)
		) {
			setUpdatedItem((prev) => ({ ...prev, price: 0 }));
		}
	}, [updatedItem.price]);

	return (
		<>
			<SearchItem
				visible={visible}
				togglePopup={togglePopup}
				callBack={searchItemCallBackHandle}
			/>

			<EditTablePopup
				visible={showEditTablePopup}
				togglePopup={toggleShowEditTablePopup}
				handleDoubleClick={getBillInformation}
			/>

			<OffersBillsSpeedActionsButtons
				readOnly={bill.readOnly}
				showImportFromExcel={importFromExcel}
				openBillsTable={toggleShowEditTablePopup}
				setNewInvoice={setNewInvoice}
				addItemsFromExcel={addItemsFromExcel}
			/>

			<EnrollmentUnenrolledItemsPopup
				id={bill.id}
				visible={showEnrollItemsPopup}
				togglePopup={toggleShowEnrollItemsPopup}
				categories={categories}
				units={units}
			/>

			<h1 className="invoiceName">{t("Offer invoices")}</h1>
			<div className="container-xxl rtlContainer mb-3">
				<div className="card p-3">
					<div className="row">
						<div className="col-4">
							<NumberBox
								readOnly={bill.readOnly}
								validationErrorMessage={errors.num_orod}
								required={false}
								label="الرقم"
								value={bill.num_orod}
								name="num_orod"
								handleChange={updateBillInformation}
								buttonOptions={invoiceNumberButtonOptions}
							/>
						</div>
						<div className="col-4">
							<DateBox
								readOnly={bill.readOnly}
								required={false}
								label={t("Date")}
								value={bill.datee}
								name="datee"
								handleChange={updateBillInformation}
							/>
						</div>
						<div className="col-4">
							<SelectBox
								readOnly={bill.readOnly}
								validationErrorMessage={errors.cust}
								label={t("side")}
								dataSource={accounts}
								name="cust"
								value={bill.cust}
								handleChange={updateBillInformation}
							/>
						</div>
						<div className="col-12">
							<TextBox
								readOnly={bill.readOnly}
								required={false}
								label={t("Note")}
								name="nots"
								value={bill.nots}
								handleChange={updateBillInformation}
							/>
						</div>
					</div>
					<div className="row">
						<OffersBillsTable
							items={items}
							rowDoubleClickHandle={onItemRowDoubleClickHandle}
							invoiceId={bill.id}
							updateItems={updateItems}
						/>
					</div>
					<div className="row mt-3">
						<div className="col-3">
							<button
								disabled={selectItemDisable}
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
							<NumberBox
								label={t("Number")}
								readOnly={itemInformationDisable}
								required={false}
								name="item_no"
								value={updatedItem.item_no ?? 0}
								handleChange={updateItemInformation}
							/>
						</div>
						<div className="col-3">
							<TextBox
								label={t("Name")}
								readOnly={itemInformationDisable}
								required={false}
								name="item_name"
								value={updatedItem.item_name}
								handleChange={updateItemInformation}
							/>
						</div>
						<div className="col-3">
							<TextBox
								label={"English Name"}
								readOnly={itemInformationDisable}
								required={false}
								name="item_name_e"
								value={updatedItem.item_name_e}
								handleChange={updateItemInformation}
							/>
						</div>
						<div className="col-3">
							<NumberBox
								label={t("Part Number")}
								readOnly={itemInformationDisable}
								required={false}
								name="code_no"
								value={updatedItem.code_no ?? 0}
								handleChange={updateItemInformation}
							/>
						</div>
						<div className="col-3">
							<DateBox
								readOnly={itemInformationDisable}
								required={false}
								label={t("Expiry")}
								value={updatedItem.Exp_Date}
								name="Exp_Date"
								handleChange={updateItemInformation}
							/>
						</div>
						<div className="col-3">
							<NumberBox
								label={t("Quantity")}
								readOnly={itemInformationDisable}
								required={false}
								name="kmea"
								value={updatedItem.kmea}
								handleChange={updateItemInformation}
							/>
						</div>
						<div className="col-3">
							<NumberBox
								label={t("Price")}
								readOnly={itemInformationDisable}
								required={false}
								name="price"
								value={updatedItem.price ?? 0}
								handleChange={updateItemInformation}
							/>
						</div>
					</div>
					<div className="row">
						<div className="col-3">
							<DropDownButton
								key="add"
								rtlEnabled={true}
								className="col-12"
								disabled={disableButtonOnError}
								splitButton={true}
								useSelectMode={true}
								selectedItemKey={addButtonId}
								items={[
									{
										id: 0,
										name: itemEditMode
											? t("Edit")
											: t("Add"),
										icon: itemEditMode ? "edit" : "add",
										onClick: addItemToInvoice,
										// onClick: test,
									},
									{
										id: 1,
										name: t("Cancel"),
										icon: "clear",
										onClick: cancelEditItem,
										disabled: !updatedItem,
									},
								]}
								displayExpr="name"
								keyExpr="id"
								onButtonClick={({ selectedItem }) =>
									selectedItem.onClick()
								}
							/>
						</div>
						<div className="col-3">
							<button
								disabled={enrollItemsButtonDisable}
								style={{
									height: "43px",
								}}
								className="col-12 btn btn-outline-dark btn-outline"
								onClick={toggleShowEnrollItemsPopup}
							>
								<span>{t("List unlisted items")}</span>
							</button>
						</div>
						<div className="col-3">
							<SelectBox
								readOnly={enrollItemsButtonDisable}
								validationErrorMessage={errors.store}
								label={t("store")}
								dataSource={stores}
								name="store"
								value={selectedStore}
								handleChange={updateSelectedStore}
							/>
						</div>
						<div className="col-3">
							<button
								disabled={
									enrollItemsButtonDisable ||
									selectedStore < 1
								}
								style={{
									height: "43px",
								}}
								className="col-12 btn btn-outline-dark btn-outline"
								onClick={exportToPurchasesInvoice}
							>
								<span>{t("to purchases")}</span>
							</button>
						</div>
					</div>
				</div>
			</div>
		</>
	);
};

export default OffersBills;
