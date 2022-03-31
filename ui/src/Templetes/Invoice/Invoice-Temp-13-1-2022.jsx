import React, {
	useState,
	useCallback,
	useEffect,
	useRef,
	useMemo,
} from "react";
import "./invoice.css";
import notify from "devextreme/ui/notify";
import InvoiceInformation from "./Components/InvoiceInformation/InvoiceInformation";
import { ItemsTable } from "./Components/ItemsTable/ItemsTable";
import { ItemTransactionsTable } from "../../Components/SharedComponents/Tables Components/ItemTransactionsTable/ItemTransactionsTable";
import { ItemsStorageQuantityTable } from "../../Components/SharedComponents/Tables Components/ItemsStorageQuantityTable/ItemsStorageQuantityTable";
import ItemInformation from "./Components/ItemInformation/ItemInformation";
import InvoiceControlPanel from "./Components/InvoiceControlPanel/InvoiceControlPanel";
import {
	UPDATE_INVOICE,
	INSERT_INVOICE,
	DISTRIBUTE_INVOICE_ITEM_QUANTITY,
	GET_INVOICE_ITEMS,
	UPDATE_INVOICE_BASICS,
	ADD_SALES_OFFER_TO_INVOICE,
} from "./API.Invoice";
import { TextBox } from "../../Components/Inputs";
import CustomerItemLastTransaction from "./Components/CustomerItemLastTransaction/CustomerItemLastTransaction";
import SpeedActionsButtons from "./Components/SpeedActionsButtons/SpeedActionsButtons";
import Searchtable from "../../Modals/SearchBillsTableANDmovements/SearchTable";

import { GET_SALES_INVOICE_ITEMS } from "./Components/InvoiceInformation/API.InvoiceInformation";
import FastInputScreen from "./Components/FastInputItem/FastInputScreen";
import HandHeld from "../../Components/SharedComponents/HandHeld/HandHeld";
import { ItemsToReturnTable } from "./ItemsToReturnTable/ItemsToReturnTable";
import PurchaseInvoicesExpenses from "../../Pages/10.PurchasesTab/PurchasesBill/Components/PurchaseInvoicesExpenses/PurchaseInvoicesExpenses";
import PurchaseExpensesPopup from "./Components/PurchaseExpensesPopup/PurchaseExpensesPopup";
import { getWithExpiry } from "../../Services/LocalStorageService";
import { useTranslation } from "react-i18next";
import config from "../../config";

let { localStorageMultiCurrencyKey, localStorageCurrencyKey } = config;

const Invoice = ({ invoiceType, invoiceName, invoiceNameEn }) => {
	const { t, i18n } = useTranslation();

	// Templete Type
	const [isReturnTypeInvoice, setIsReturnTypeInvoice] = useState(
		invoiceType.includes("Return") || invoiceType.includes("IncomingOrders")
	);
	const [isSalesTypeInvoice, setisSalesTypeInvoice] = useState(
		invoiceType.includes("Sales") || invoiceType.includes("IncomingOrders")
	);
	const [isPurchasesTypeInvoice, setisPurchasesTypeInvoice] = useState(
		invoiceType.includes("Purchases")
	);
	const [isCashSelesTypeInvoice, setIsCashSelesTypeInvoice] = useState(
		invoiceType === "CashSales"
	);

	// Default values
	const billDefaultValues = useRef({
		id: 0,
		emp_id: "1",
		e_date: new Date(),
		invoiceType: invoiceType,
		safeOrClient: invoiceType === "OldPurchases" ? "Customer" : "Safe",
		mosweq_id: "",
		dis_type: 1,
		dis: 0,
		Ex_Rate: 1,
		itemPrice: "price1",
		readOnly: false,
		num_sale: "0",
		num_mas: 0,
	});

	// State of main information about Bill
	const [bill, setBill] = useState(billDefaultValues.current);
	const [parallelBill, setParallelBill] = useState({});

	// Invoice Items
	const [items, setItems] = useState([]);

	const [itemsToReturn, setItemsToReturn] = useState([]);

	// CasherStores
	const [stores, setStores] = useState([]);

	// SelectedAccount
	const [selectedAccount, setSelectedAccount] = useState({});

	// Debit Alert
	const [showDebitAlert, setShowDebitAlert] = useState(false);

	// State of Errors
	const [errors, setErrors] = useState({});

	// Item States
	const [selectedItem, setSelectedItem] = useState({});

	const [updatedItem, setUpdatedItem] = useState({});

	const [itemEditMode, setItemEditMode] = useState(false);

	const [fastInputItemNumber, setFastInputItemNumber] = useState(null);

	// Reset Page
	const [resetComponents, setResetComponents] = useState(false);

	// Popups
	const [showSearchBill, setShowSearchBill] = useState(false);

	const [showSearchOffersBill, setShowSearchOffersBill] = useState(false);

	const [showHandHeld, setShowHandHeld] = useState(false);

	const [purchaseExpensesPopup, setPurchaseExpensesPopup] = useState(false);

	//* ────────────────────────────────────────────────────────────────────────────────
	//* ─── CALLBACKS ──────────────────────────────────────────────────────────────────
	//* ────────────────────────────────────────────────────────────────────────────────

	const setNewInvoice = useCallback((invoiceType) => {
		// Reset Bill
		setBill(billDefaultValues.current);

		// Reset Items
		setItems([]);

		setItemsToReturn([]);

		// Reset Errors
		setErrors({});

		// Reset Item States
		setSelectedItem({});
		setUpdatedItem({});

		// Reset Edit mode
		setItemEditMode(false);

		// Reset child components
		setResetComponents({ ...true });
	}, []);

	const updateTempleteType = useCallback(() => {
		setIsReturnTypeInvoice(
			invoiceType.includes("Return") ||
				invoiceType.includes("IncomingOrders")
		);
		setisSalesTypeInvoice(
			invoiceType.includes("Sales") ||
				invoiceType.includes("IncomingOrders")
		);
		setisPurchasesTypeInvoice(invoiceType.includes("Purchases"));
		setIsCashSelesTypeInvoice(invoiceType === "CashSales");
		setNewInvoice();
		setBill((prevBill) => ({ ...prevBill, invoiceType: invoiceType }));
		//setBill((prevBill) => ({ ...billDefaultValues, invoiceType: invoiceType }));
		// setSelectedAccount({});
		// setSelectedItem({});
	}, [invoiceType, setNewInvoice]);

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

	const updateItemInformation = useCallback(
		(e) => {
			setUpdatedItem((prevItem) => ({ ...prevItem, [e.name]: e.value }));
			if (errors[e.name]) {
				let updatedErrors = { ...errors };
				delete updatedErrors[e.name];
				setErrors(updatedErrors);
			}
		},
		[errors]
	);

	const updateBillState = useCallback((data) => {
		setBill((prev) => ({ ...prev, ...data }));
	}, []);

	const updateStores = useCallback((stores) => {
		setStores([...stores]);
	}, []);

	const updateErrorsState = useCallback((data) => {
		setErrors(data);
	}, []);

	const updateItems = useCallback((data) => {
		setItems(data);
	}, []);

	const updateItemsToReturn = useCallback((data) => {
		setItemsToReturn(data);
	}, []);

	const updateSelectedAccount = useCallback(
		(account) => {
			setSelectedAccount(account);
			if (
				bill.invoiceType !== "Sales" ||
				bill.safeOrClient !== "Customer" ||
				!account.id ||
				account.MaxDebit === "0" ||
				(account.debit &&
					parseInt(account.MaxDebit) + parseInt(account.debit) > 0)
			) {
				setShowDebitAlert(false);
			} else {
				setShowDebitAlert(true);
			}
		},
		[bill.invoiceType, bill.safeOrClient]
	);

	// This callback is fireing on item row in itemsTable clicked
	// This callback is responsible of
	// update bill.storeId
	const onItemRowDoubleClickHandle = useCallback((e) => {
		if (e.data.item_id) {
			setItemEditMode(true);

			setBill((prev) => ({ ...prev, storeId: e.data.m_no }));

			setSelectedItem(e.data);

			setUpdatedItem(e.data);

			setErrors({});
		}
	}, []);

	const onItemToReturnRowDoubleClickHandle = useCallback((e) => {
		if (e.data.item_id) {
			setBill((prev) => ({ ...prev, storeId: e.data.m_no }));

			setSelectedItem(e.data);

			setUpdatedItem(e.data);

			setErrors({});
		}
	}, []);

	const cancelEditItem = useCallback(() => {
		setItemEditMode(false);

		setSelectedItem({});

		setUpdatedItem({});

		setErrors({});
	}, []);

	const editUpdatedItem = useCallback((data) => {
		data
			? setUpdatedItem((prev) => ({ ...prev, ...data }))
			: setUpdatedItem({});
	}, []);

	const reselectSelectedItem = useCallback((data) => {
		data
			? setSelectedItem((prev) => ({ ...prev, ...data }))
			: setSelectedItem({});
	}, []);

	const editErrors = useCallback((data) => {
		data ? setErrors((prev) => ({ ...prev, ...data })) : setErrors({});
	}, []);

	const insertInvoice = useCallback(
		(_item) => {
			let invoice = {
				Data: [
					{
						InvoiceType: bill.invoiceType,
						ID: "0",
						AccountID: bill.sno_id,
						StoreID: bill.storeId,
						Invoice: {
							e_no: bill.e_no,
							e_date: bill.e_date,
							Ex_Rate: bill.Ex_Rate,
							omla_id: bill.omla_id,
							takseem: bill.takseem,
							mosweq_id: bill.mosweq_id,
							// emp_id: bill.emp_id,
							// omla_id: selectedAccount.omla_id,
							sno_id: bill.sno_id,
							tele_nkd: bill.tele_nkd,
							nots1: bill.nots1,
							nots: bill.nots,
							dis: bill.dis,
							dis_type: bill.dis_type,
							num_sale: bill.num_sale,
						},
						InvoiceItems: [
							{ ..._item, mosawiq_nesba: bill.mosawiq_nesba },
						],
					},
				],
			};
			INSERT_INVOICE(invoice)
				.then(({ id, Item, InvoiceDiscount }) => {
					setUpdatedItem({});
					setSelectedItem({});
					setItems([Item]);
					setBill({
						...bill,
						id: id,
						readOnly: true,
						InvoiceDiscount,
					});

					// Notify user
					notify(
						{
							message: t("Add Successfully"),
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
							responseErrors = {
								...responseErrors,
								[Column]: Error,
							};
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
		},
		[bill, selectedAccount.omla_id]
	);

	const addItemToInvoice = useCallback(
		(_item) => {
			if (bill.id > 0) {
				let updatedInvoice = {
					Data: [
						{
							InvoiceType: bill.invoiceType,
							ID: bill.id,
							InvoiceDiscount: bill.dis,
							InvoiceDiscountType: bill.dis_type,
							AccountID: bill.sno_id,
							StoreID: bill.storeId,
							InvoiceItems: [
								{ ..._item, mosawiq_nesba: bill.mosawiq_nesba },
							],
						},
					],
				};
				if (itemEditMode) {
					UPDATE_INVOICE(updatedInvoice)
						.then(({ Item, InvoiceDiscount }) => {
							setBill((prev) => ({ ...prev, InvoiceDiscount }));

							let updatedItems = [...items];

							let index = updatedItems.indexOf(selectedItem);

							if (~index) {
								updatedItems[index] = { ...Item };
								setItems(updatedItems);
								// Notify user
								notify(
									{
										message: t("Updated Successfully"),
										width: 450,
									},
									"success",
									2000
								);
								setUpdatedItem({});
								setSelectedItem({});
								setItemEditMode(false);
							}
						})
						.catch(({ response }) => {
							let Errors = response.data
								? response.data.Errors
								: [];
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
									message: t("Failed Try again"),
									width: 450,
								},
								"error",
								2000
							);
						});
				} else {
					UPDATE_INVOICE(updatedInvoice)
						.then(({ Item, InvoiceDiscount }) => {
							setBill((prev) => ({ ...prev, InvoiceDiscount }));

							let updatedItems = [...items];

							if (
								_item.MergeInOneInvoicItem === true &&
								items.length > 0
							) {
								updatedItems = updatedItems.filter(
									(item) => item.ID !== Item.ID
								);
							}

							updatedItems.push(Item);

							setItems(updatedItems);

							// Notify user
							notify(
								{
									message: t("Add Successfully"),
									width: 450,
								},
								"success",
								2000
							);
							setUpdatedItem({});
							setSelectedItem({});
							setItemEditMode(false);
						})
						.catch(({ response }) => {
							let Errors = response.data
								? response.data.Errors
								: [];
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
									message: t("Failed Try again"),
									width: 450,
								},
								"error",
								2000
							);
						});
				}
			} else if (bill.id == 0) {
				insertInvoice(_item);
			}
		},
		[
			bill.dis,
			bill.dis_type,
			bill.id,
			bill.invoiceType,
			bill.mosawiq_nesba,
			bill.sno_id,
			bill.storeId,
			insertInvoice,
			itemEditMode,
			items,
			selectedItem,
		]
	);

	const mergeItemsHandle = useCallback(() => {
		setUpdatedItem((prev) => {
			let newUpdatedItem = { ...prev, MergeInOneInvoicItem: true };
			addItemToInvoice(newUpdatedItem);
			return newUpdatedItem;
		});
		// addItemToInvoice(updatedItem);
	}, [addItemToInvoice]);

	const explodeItamHandle = useCallback(
		(id) => {
			let data = {
				Data: [
					{
						Type: id,
						InvoiceType: bill.invoiceType,
						ID: updatedItem.ID ?? 0,
						item_id: updatedItem.item_id,
						InvoiceID: bill.id,
						sum_box: updatedItem.sum_box,
						kmea: updatedItem.kmea,
						price: updatedItem.price,
						dis1: updatedItem.dis1 ?? 0,
						m_no: updatedItem.m_no,
						Subject_to_validity: updatedItem.Subject_to_validity,
					},
				],
			};
			DISTRIBUTE_INVOICE_ITEM_QUANTITY(data)
				.then(({ Items, InvoiceDiscount }) => {
					setBill((prev) => ({ ...prev, InvoiceDiscount }));
					if (itemEditMode) {
						let updatedItems = items.filter(
							(item) => item.ID !== selectedItem.ID
						);
						setItems([...updatedItems, ...Items]);
						setItemEditMode(false);
						notify(
							{
								message: t(
									"Quantity has been exceeded successfully"
								),
								width: 450,
							},
							"success",
							2000
						);
					} else {
						setItems([...items, ...Items]);
					}

					setUpdatedItem({});
					setSelectedItem({});
				})
				.catch(({ response }) => {
					let Errors = response ? response.data.Errors : [] ?? [];
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
							message: t("Failed Try again"),
							width: 450,
						},
						"error",
						2000
					);
				});
		},
		[
			bill.invoiceType,
			bill.id,
			updatedItem.ID,
			updatedItem.item_id,
			updatedItem.sum_box,
			updatedItem.kmea,
			updatedItem.price,
			updatedItem.dis1,
			updatedItem.m_no,
			updatedItem.Subject_to_validity,
			itemEditMode,
			items,
			selectedItem.ID,
		]
	);

	const openBillsTable = useCallback(() => {
		setShowSearchBill(true);
	}, []);

	const openOffersBillsTable = useCallback(() => {
		setShowSearchOffersBill(true);
	}, []);

	const billRowDoubleClickHandle = useCallback(({ Account, Invoice }) => {
		if (Invoice.id && Invoice.invoiceType) {
			GET_INVOICE_ITEMS(Invoice.invoiceType, Invoice.id)
				.then((invoiceItems) => {
					setBill({
						...Invoice,
						itemPrice: Account.defult_price,
						readOnly: true,
					});
					setSelectedAccount({ ...Account });
					setItems(invoiceItems);
				})
				.catch((error) => {
					console.log(error);
				})
				.finally(() => {
					setShowSearchBill(false);
					setSelectedItem({});
				});
		} else {
			console.log("error: Request failed (invoiceType or id is missing)");
		}
	}, []);

	const getSalesOffer = useCallback(
		({ Account, Invoice }) => {
			ADD_SALES_OFFER_TO_INVOICE({
				OfferSaleInvoiceID: Invoice.id,
				AgentID: bill.mosweq_id,
				AccountID: selectedAccount.id,
				ListType: bill.safeOrClient,
				InvoiceType: "Sales",
			})
				.then(({ Account, Invoice }) => {
					billRowDoubleClickHandle({
						Account: selectedAccount,
						Invoice,
					});
				})
				.catch((error) => {
					console.log(error);
				})
				.finally(() => {
					setShowSearchOffersBill(false);
					setSelectedItem({});
				});
		},
		[
			bill.mosweq_id,
			bill.safeOrClient,
			billRowDoubleClickHandle,
			selectedAccount,
		]
	);

	const itemClickedHandle = useCallback((itemNumber) => {
		setFastInputItemNumber({ itemNumber: itemNumber });
	}, []);

	// Edit Basics Information
	const editInvoiceBasicsInformations = useCallback(() => {
		setBill((prev) => {
			setParallelBill({
				e_no: prev.e_no,
				e_date: prev.e_date,
				Ex_Rate: prev.Ex_Rate,
				mosweq_id: prev.mosweq_id,
				// emp_id: prev.emp_id,
				omla_id: prev.omla_id,
				sno_id: prev.sno_id,
				nots: prev.nots,
				tele_nkd: prev.tele_nkd,
				nots1: prev.nots1,
				safeOrClient: prev.safeOrClient,
				itemPrice: prev.itemPrice,
			});
			return { ...prev, readOnly: !prev.readOnly };
		});
	}, []);

	const acceptFloatingButtonHandle = useCallback(() => {
		let updatedInvoiceValues = {};
		for (const key of Object.keys(parallelBill)) {
			parallelBill[key] !== bill[key] &&
				(updatedInvoiceValues[key] = bill[key]);
		}
		let updatedInvoice = {
			Data: [
				{
					ID: bill.id,
					InvoiceType: bill.invoiceType,
					Invoice: {
						...updatedInvoiceValues,
					},
				},
			],
		};
		UPDATE_INVOICE_BASICS(updatedInvoice)
			.then(() => {
				setUpdatedItem({});
				setSelectedItem({});
				setItemEditMode(false);
				setBill({
					...bill,
					readOnly: true,
					...updatedInvoiceValues,
				});
				setErrors({});
				// Notify user
				notify(
					{
						message: t("Invoice updated successfully"),
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
		setUpdatedItem({});
		setSelectedItem({});
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
				message: t("Invoice returned successfully"),
				width: 450,
			},
			"success",
			1000
		);
	}, [parallelBill]);

	const handHeldHandle = useCallback(() => {
		setShowHandHeld(true);
	}, []);

	const purchaseExpensesHandle = useCallback(() => {
		setPurchaseExpensesPopup(true);
	}, []);

	const setLinkedValue = useCallback((num_mas) => {
		setBill((prev) => ({ ...prev, num_mas: num_mas }));
	}, []);

	//? ────────────────────────────────────────────────────────────────────────────────
	//? ─── EFFECTS ────────────────────────────────────────────────────────────────────
	//? ────────────────────────────────────────────────────────────────────────────────

	useEffect(() => {
		isReturnTypeInvoice &&
			itemsToReturn.length >= 1 &&
			GET_SALES_INVOICE_ITEMS(bill.invoiceType, bill.num_sale)
				.then((items) => {
					setItemsToReturn(items);
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
					itemsToReturn([]);
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
		if (bill.id != 0 && items.length < 1) {
			setNewInvoice(bill.invoiceType);
		}
	}, [items.length]);

	useEffect(() => {
		var currencyKey = localStorage.getItem(localStorageCurrencyKey);
		var ss = localStorage.getItem(localStorageMultiCurrencyKey);
		console.log(ss == true);
		// invoiceType !== bill.invoiceType && window.location.reload();
		invoiceType !== bill.invoiceType && updateTempleteType();
	}, [invoiceType]);

	//* ────────────────────────────────────────────────────────────────────────────────
	//* ─── MEMOs ──────────────────────────────────────────────────────────────────────
	//* ────────────────────────────────────────────────────────────────────────────────
	//* ItemTransactionsTable Payload to get data on scroll
	const itemTransactionsPayload = useMemo(() => {
		return {
			itemId: selectedItem.item_id,
			storeID: selectedItem.m_no,
		};
	}, [selectedItem.item_id, selectedItem.m_no]);

	return (
		<>
			{showSearchBill && (
				<Searchtable
					allowDelete={true}
					ob={{
						list_type: bill.safeOrClient,
						Type: invoiceType,
					}}
					visible={showSearchBill}
					togglePopup={(e) => setShowSearchBill(!showSearchBill)}
					onclickRow={(e) => billRowDoubleClickHandle(e)}
				/>
			)}

			{showHandHeld && (
				<HandHeld
					title={invoiceName}
					invoiceType={invoiceType}
					AgentID={bill.mosweq_id}
					AccountID={selectedAccount.id}
					isVisable={showHandHeld}
					handleVisibility={() =>
						setShowHandHeld((prev) => {
							return !prev;
						})
					}
				/>
			)}

			{showSearchOffersBill && (
				<Searchtable
					allowDelete={false}
					ob={{
						list_type: bill.safeOrClient,
						Type:
							invoiceType === "Purchases"
								? "IncomingOrders"
								: "SalesOffers",
					}}
					visible={showSearchOffersBill}
					togglePopup={(e) =>
						setShowSearchOffersBill(!showSearchOffersBill)
					}
					onclickRow={(e) => getSalesOffer(e)}
				/>
			)}

			{purchaseExpensesPopup && (
				<PurchaseExpensesPopup
					visible={purchaseExpensesPopup}
					togglePopup={(e) =>
						setPurchaseExpensesPopup(!purchaseExpensesPopup)
					}
					invoiceId={bill.id}
					invoiceNumber={bill.num_mas}
					setLinkedValue={setLinkedValue}
				/>
			)}

			<SpeedActionsButtons
				billInformation={{
					id: bill.id,
					readOnly: bill.readOnly,
					invoiceType: bill.invoiceType,
					safeOrClient: bill.safeOrClient,
					mosweq_id: bill.mosweq_id,
				}}
				selectedAccountId={selectedAccount.id}
				editInvoiceBasicsInformations={editInvoiceBasicsInformations}
				acceptFloatingButtonHandle={acceptFloatingButtonHandle}
				discardFloatingButtonHandle={discardFloatingButtonHandle}
				setNewInvoice={setNewInvoice}
				openBillsTable={openBillsTable}
				openOffersBillsTable={openOffersBillsTable}
				handHeldHandle={handHeldHandle}
				purchaseExpensesHandle={purchaseExpensesHandle}
			/>

			<div className="container-xxl" dir="auto">
				<h1 className="invoiceName">
					{i18n.language === "en" ? invoiceNameEn : invoiceName}
				</h1>
				<div className="accordion card my-2" id="invoiceInformation">
					<div className="accordion-item">
						<h2
							className="accordion-header"
							id="invoiceInformationHeading"
						>
							<button
								className="accordion-button"
								type="button"
								data-bs-toggle="collapse"
								data-bs-target="#invoiceInformationCollapse"
								aria-expanded="true"
								aria-controls="invoiceInformationCollapse"
							>
								<h3 className="px-3 sectionHeader">
									{t("Receipt Information")}
								</h3>
							</button>
						</h2>

						<div
							id="invoiceInformationCollapse"
							className="accordion-collapse  show"
							aria-labelledby="invoiceInformationHeading"
						>
							<div className="accordion-body">
								<div className="row p-3 mx-3 billSection">
									{showDebitAlert && (
										<div className="alert alert-danger">
											<i className="alertIcon fas fa-exclamation-triangle fa-5x d-block text-center pb-3 text-danger" />

											<h5 className="text-center">
												{t(
													"This customer has exceeded the maximum allowed debt"
												)}
											</h5>
										</div>
									)}
									<InvoiceInformation
										isPurchasesTypeInvoice={
											isPurchasesTypeInvoice
										}
										isSalesTypeInvoice={isSalesTypeInvoice}
										isReturnTypeInvoice={
											isReturnTypeInvoice
										}
										isCashSelesTypeInvoice={
											isCashSelesTypeInvoice
										}
										bill={bill}
										errors={errors}
										updateErrorsState={updateErrorsState}
										updateBillInformation={
											updateBillInformation
										}
										updateBillState={updateBillState}
										updateStores={updateStores}
										selectedAccount={selectedAccount}
										setSelectedAccount={
											updateSelectedAccount
										}
										updateItemsToReturn={
											updateItemsToReturn
										}
										resetComponent={resetComponents}
									/>

									<div
										className="accordion px-4"
										id="accordionTable"
									>
										{isReturnTypeInvoice &&
											itemsToReturn.length > 0 && (
												<div className="accordion-item">
													<h2
														className="accordion-header"
														id="headingOne"
													>
														<button
															className="accordion-button"
															type="button"
															data-bs-toggle="collapse"
															data-bs-target="#collapseOne"
															aria-expanded="true"
															aria-controls="collapseOne"
														>
															<h6 className="ppx-3 sectionHeader mx-2">
																{t(
																	"Items inside the sales invoice"
																)}
															</h6>
														</button>
													</h2>
													<div
														id="collapseOne"
														className="accordion-collapse collapse show"
														aria-labelledby="headingOne"
														// data-bs-parent="#accordionTable"
													>
														<div className="accordion-body">
															<ItemsToReturnTable
																items={
																	itemsToReturn
																}
																disabled={
																	itemEditMode ||
																	!selectedAccount.id ||
																	!bill.storeId ||
																	!bill.mosweq_id ||
																	(bill.id &&
																		!bill.readOnly)
																}
																key="ItemsToReturnTable"
																rowDoubleClickHandle={
																	onItemToReturnRowDoubleClickHandle
																}
															/>
														</div>
													</div>
												</div>
											)}
										<div className="accordion-item">
											<h2
												className="accordion-header"
												id="headingTwo"
											>
												<button
													className="accordion-button"
													type="button"
													data-bs-toggle="collapse"
													data-bs-target="#collapseTwo"
													aria-expanded="true"
													aria-controls="collapseTwo"
												>
													<h6 className="ppx-3 sectionHeader mx-2">
														{t("Receipt Items")}
													</h6>
												</button>
											</h2>
											<div
												id="collapseTwo"
												className="accordion-collapse collapse show"
												aria-labelledby="headingTwo"
												// data-bs-parent="#accordionTable"
											>
												<div className="accordion-body">
													<ItemsTable
														disabled={
															!bill.readOnly
														}
														invoiceType={
															bill.invoiceType
														}
														invoiceId={bill.id}
														items={items}
														updateItems={
															updateItems
														}
														key="ItemsTable"
														rowDoubleClickHandle={
															onItemRowDoubleClickHandle
														}
														discount={
															bill.InvoiceDiscount
														}
													/>
												</div>
											</div>
										</div>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>

				<div className="accordion card my-2" id="itemInformation">
					<div className="accordion-item">
						<h2
							className="accordion-header"
							id="itemInformationSection"
						>
							<button
								className="accordion-button"
								type="button"
								data-bs-toggle="collapse"
								data-bs-target="#itemInformationCollapseOne"
								aria-expanded="true"
								aria-controls="itemInformationCollapseOne"
							>
								<h3 className="px-3 sectionHeader">
									{t("Item Information")}
								</h3>
							</button>
						</h2>
						<div
							id="itemInformationCollapseOne"
							className="accordion-collapse collapse show"
							aria-labelledby="itemInformationSection"
						>
							<div className="accordion-body">
								<div className="p-3 col-12 border-bottom">
									<ItemInformation
										billInformation={{
											id: bill.id,
											invoiceType: bill.invoiceType,
											readOnly: bill.readOnly,
											itemPrice:
												bill.itemPrice ?? "p_tkl",
											// emp_id: bill.emp_id,
											mosweq_id: bill.mosweq_id,
											mosawiq_nesba: bill.mosawiq_nesba,
											storeId: bill.storeId,
											dis: bill.dis,
											dis_type: bill.dis_type,
											num_sale: bill.num_sale,
										}}
										updateBillInformation={
											updateBillInformation
										}
										updateBillState={updateBillState}
										stores={stores}
										// Store of changing and api element
										updatedItem={updatedItem}
										// to setState
										setUpdatedItem={editUpdatedItem}
										// For inputs
										updateItemInformation={
											updateItemInformation
										}
										// Data of item start state
										selectedItem={selectedItem}
										// Reset item start state
										setSelectedItem={reselectSelectedItem}
										updateErrors={editErrors}
										errors={errors}
										itemEditMode={itemEditMode}
										selectedAccountId={selectedAccount.id}
										addItemToInvoice={addItemToInvoice}
										isReturnTypeInvoice={
											isReturnTypeInvoice
										}
										fastInputItemNumber={
											fastInputItemNumber
										}
									/>
									<InvoiceControlPanel
										billInformation={{
											id: bill.id,
											bill: bill.itemPrice ?? "p_tkl",
										}}
										items={items}
										itemEditMode={itemEditMode}
										updatedItem={updatedItem}
										addItemToInvoice={addItemToInvoice}
										cancelEditItem={cancelEditItem}
										mergeItemsHandle={mergeItemsHandle}
										explodeItamHandle={explodeItamHandle}
										errors={errors}
									/>
								</div>
								<div className="p-3 col-md-12 col-lg-12">
									<div
										className={
											"row px-3 py-2 " +
											(bill.safeOrClient === "Customer"
												? "border-bottom"
												: "")
										}
									>
										<div className="col-6">
											<TextBox
												required={false}
												readOnly={true}
												label={t("Item Balance")}
												name="quantity"
												value={updatedItem.Quantity}
											/>
										</div>
										{updatedItem.Subject_to_validity && (
											<div className="col-6">
												<TextBox
													required={false}
													readOnly={true}
													label={t(
														"Validity balance"
													)}
													name="expiredDateQuntity"
													value={
														updatedItem.expiredDateQuntity
													}
												/>
											</div>
										)}
									</div>
									{bill.safeOrClient === "Customer" &&
										!isReturnTypeInvoice && (
											<div className="row px-3 py-2">
												<CustomerItemLastTransaction
													itemId={updatedItem.item_id}
													selectedAccountId={
														selectedAccount.id
													}
												/>
											</div>
										)}
								</div>
							</div>
						</div>
					</div>
				</div>

				{isCashSelesTypeInvoice && selectedAccount.id && (
					<div className="accordion card my-2" id="fastInputs">
						<div className="accordion-item">
							<h2
								className="accordion-header"
								id="fastInputsHeading"
							>
								<button
									className="accordion-button"
									type="button"
									data-bs-toggle="collapse"
									data-bs-target="#fastInputsCollapse"
									aria-expanded="true"
									aria-controls="fastInputsCollapse"
								>
									<h3 className="px-3 sectionHeader">
										{t("Fast Sell")}
									</h3>
								</button>
							</h2>

							<div
								id="fastInputsCollapse"
								className="accordion-collapse collapse show"
								aria-labelledby="fastInputsHeading"
							>
								<div className="accordion-body">
									<div className="p-3 mx-3 billSection">
										<FastInputScreen
											itemClickedHandle={
												itemClickedHandle
											}
										/>
									</div>
								</div>
							</div>
						</div>
					</div>
				)}

				{!isReturnTypeInvoice ? (
					<div
						className="accordion card my-3"
						id="transactionsTables"
					>
						<div className="accordion-item">
							<h2
								className="accordion-header"
								id="transactionsTablesHeading"
							>
								<button
									className="accordion-button"
									type="button"
									data-bs-toggle="collapse"
									data-bs-target="#transactionsTablesCollapse"
									aria-expanded="true"
									aria-controls="transactionsTablesCollapse"
								>
									<h3 className="px-3 sectionHeader">
										{t("Transactions on item")}
									</h3>
								</button>
							</h2>
							<div
								id="transactionsTablesCollapse"
								className="accordion-collapse collapse show"
								aria-labelledby="transactionsTablesHeading"
							>
								<div className="accordion-body">
									<div className=" mx-3 billSection">
										<div className="row">
											<div className="p-3 col-md-12 col-lg-8">
												<ItemTransactionsTable
													itemTransactionsPayload={
														itemTransactionsPayload
													}
												/>
											</div>
											<div className="p-3 col-md-12 col-lg-4">
												<ItemsStorageQuantityTable
													itemId={
														selectedItem.item_id
													}
												/>
											</div>
										</div>
									</div>
								</div>
							</div>
						</div>
					</div>
				) : (
					<></>
				)}
			</div>
		</>
	);
};

export default Invoice;
