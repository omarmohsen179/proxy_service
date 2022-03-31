import React, {
	useCallback,
	useEffect,
	useMemo,
	useRef,
	useState,
} from "react";
import { format } from "date-fns";
import _ from "lodash";
import CuptureReceiptPopup from "../../Components/SalesBillComponents/CuptureReceiptPopup";
import { Button as NumberBoxButton } from "devextreme-react/number-box";
import DropDownButton from "devextreme-react/drop-down-button";
import {
	TextBox,
	NumberBox,
	DateBox,
	SelectBox,
} from "../../Components/Inputs";
import SelectBoxFullWidth from "../../Components/Inputs/SelectBoxFullWidth";
import NumberBoxFullWidth from "../../Components/Inputs/NumberBoxFullWidth";
import MasterTable from "../../Components/SharedComponents/Tables Components/MasterTable";
import { SpeedDialAction } from "devextreme-react/speed-dial-action";
import axios from "axios";
import { Button, CheckBox, DataGrid, Popup } from "devextreme-react";

import {
	ItemsStorageQuantityTable,
	ItemsTable,
	ItemTransactionsTable,
} from "../../Components/SalesBillComponents/SalesBillTables";
import {
	DELETE_INVOICE_ITEM,
	GET_ACCOUNTS,
	GET_CASHIERS,
	GET_CASHIER_STORES,
	GET_INVOICE_NUMBER,
	INSRET_INVOICE,
	UPDATE_INVOICE,
	GET_INVOICE_ITEMS,
	DELETE_INVOICE,
	UPDATE_INVOICE_DISCOUNT,
	UPDATE_INVOICE_BASICS,
	DISTRIBUTE_INVOICE_ITEM_QUANTITY,
} from "../../Services/ApiServices/SalesBillAPI";
import SearchItem from "../Items/SearchItem";
import { GET_ITEM_INFO } from "../../Services/ApiServices/ItemsAPI";
import {
	GET_CUSTOMER_LAST_TRANSACTION,
	GET_REPORT_ITEM_STORES_QUANTITY,
	GET_REPORT_ITEM_TRANSACTIONS,
} from "../../Services/ApiServices/General/ReportsAPI";
import notify from "devextreme/ui/notify";
import Searchtable from "../../Modals/SearchBillsTableANDmovements/SearchTable";
import { ValidationStatus } from "../../Components/SalesBillComponents/SalesBillErrors";
import DebitAlert from "../../Components/SalesBillComponents/DebitAlert";
import MergeItems from "../../Components/SalesBillComponents/MergeItems";
import FloatingButton from "../../Components/SharedComponents/FloatingButton";
import { useDispatch, useSelector } from "react-redux";
import {
	selectVisible,
	setItem,
	setVisible,
} from "../../Store/Items/ItemsSlice";
import OkDiscardFloatingButtons from "../../Components/OkDiscardFloatingButtons";
import { useTranslation } from "react-i18next";

const SalesBill = () => {
	const { t, i18n } = useTranslation();

	let dispatch = useDispatch();
	//? { invoiceType:"", e_no:"", id:"",
	//?   e_date:"", Ex_Rate:"",mosweq_id:"",
	//?   emp_id:"", omla_id:"", sno_id:"",
	//?   nots? :"", dis?:"", dis_type?:"",
	//?   tele_nkd?:"", nots1?:"",
	//!   num_mass:"", num_sale:"", num_surce:"", total:"",
	//?   safeOrClient:"", itemPrice:""
	//?   storeId:"" }
	const [bill, setBill] = useState({
		id: 0,
		emp_id: "1",
		e_date: new Date(),
		invoiceType: "Sales",
		safeOrClient: "Safe",
		mosweq_id: "",
		dis_type: 1,
		dis: 0,
		Ex_Rate: 1,
		itemPrice: "price1",
		readOnly: false,
	});
	const [parallelBill, setParallelBill] = useState({});
	const [initData, setInitData] = useState({ cashiers: [] });
	const [items, setItems] = useState([]);
	const [selectedItem, setSelectedItem] = useState({});
	const [billTableSelectedItem, setBillTableSelectedItem] = useState({});
	const [updatedItem, setUpdatedItem] = useState({});
	const [showSearchItemPopup, setShowSearchItemPopup] = useState(false);
	const [accounts, setAccounts] = useState([]);
	const [itemStoreQuantity, setItemStoreQuantity] = useState([]);
	const [itemTransactions, setItemTransactions] = useState([]);
	const [selectedAccount, setSelectedAccount] = useState({});
	const [customerLastItemTransaction, setCustomerLastItemTransaction] =
		useState({ price: 0.0, kema: 1 });
	const storageClientsOption = [
		{ id: "Customer", name: t("Customer") },
		{ id: "Safe", name: t("Safe") },
	];
	const [itemEditMode, setItemEditMode] = useState(false);
	const [showCuptureReceiptPopup, setShowCuptureReceiptPopup] =
		useState(false);
	const [showSearchBill, setShowSearchBill] = useState(false);
	const [showDebitAlert, setShowDebitAlert] = useState(false);
	const [showMergeItemsPopup, setShowMergeItemsPopup] = useState(false);
	const [conditions, setConditions] = useState({});
	const [errors, setErrors] = useState({});
	const [explodeButtonId, setExplodeButtonId] = useState(0);
	const [addButtonId, setAddButtonId] = useState(0);
	// const [itemInfoRefs, setItemInfoRefs] = useState([]);

	//! //////////////////////////////////////////////////////////////

	useEffect(() => {
		// bill.sno_id && console.log(bill.sno_id);
	}, [bill.sno_id]);

	//! ─── INVOICE TRANSACTIONS ──────────────────────────────────────────────────────

	const insertInvoice = useCallback(
		async (_item) => {
			console.log(_item);
			let invoice = {
				Data: [
					{
						InvoiceType: "Sales",
						ID: "0",
						AccountID: bill.sno_id,
						StoreID: bill.storeId,
						Invoice: {
							e_no: bill.e_no,
							e_date: bill.e_date,
							Ex_Rate: bill.Ex_Rate,
							mosweq_id: bill.mosweq_id,
							emp_id: bill.emp_id,
							omla_id: selectedAccount.omla_id,
							sno_id: bill.sno_id,
							tele_nkd: bill.tele_nkd,
							nots1: bill.nots1,
							nots: bill.nots,
							dis: bill.dis,
							dis_type: bill.dis_type,
						},
						InvoiceItems: [{ ..._item }],
					},
				],
			};
			await INSRET_INVOICE(invoice)
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
							message: t("Invoice added successfully"),
							width: 450,
						},
						"success",
						1000
					);
				})
				.catch(
					({
						response: {
							data: { Errors },
						},
					}) => {
						let responseErrors = {};
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
					}
				);
		},
		[bill, selectedAccount.omla_id]
	);

	const addItemToInvoice = useCallback(
		async (_item) => {
			if (bill.id > 0) {
				console.log(_item);
				if (itemEditMode) {
					let updatedInvoice = {
						Data: [
							{
								InvoiceType: "Sales",
								ID: bill.id,
								InvoiceDiscount: bill.dis,
								InvoiceDiscountType: bill.dis_type,
								AccountID: bill.sno_id,
								StoreID: bill.storeId,
								InvoiceItems: [{ ..._item }],
							},
						],
					};
					await UPDATE_INVOICE(updatedInvoice)
						.then(({ Item, InvoiceDiscount }) => {
							setBill((prev) => ({ ...prev, InvoiceDiscount }));

							let updatedItems = [...items];

							let index = updatedItems.indexOf(
								billTableSelectedItem
							);

							console.log(index);

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
								setBillTableSelectedItem({});
								setItemStoreQuantity([]);
								setItemTransactions([]);
								setItemEditMode(false);
							}
						})
						.catch(
							({
								response: {
									data: { Errors },
								},
							}) => {
								let responseErrors = {};
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
							}
						);
				} else {
					let updatedInvoice = {
						Data: [
							{
								InvoiceType: "Sales",
								ID: bill.id,
								InvoiceDiscount: bill.dis,
								InvoiceDiscountType: bill.dis_type,
								AccountID: bill.sno_id,
								StoreID: bill.storeId,
								InvoiceItems: [{ ..._item }],
							},
						],
					};
					await UPDATE_INVOICE(updatedInvoice)
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
							setBillTableSelectedItem({});
							setItemEditMode(false);
						})
						.catch(
							({
								response: {
									data: { Errors },
								},
							}) => {
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
							}
						);
				}
			} else if (bill.id == 0) {
				await insertInvoice(_item);
			}
		},
		[
			bill.dis,
			bill.dis_type,
			bill.id,
			bill.sno_id,
			bill.storeId,
			billTableSelectedItem,
			insertInvoice,
			itemEditMode,
			items,
		]
	);

	//! ────────────────────────────────────────────────────────────────────────────────

	//! ─── GET ITEM INFORMATIONS ──────────────────────────────────────────────────────

	// Calling Api to get item informations by using id or barcode
	const getItemInfo = useCallback(
		//? idType = "ItemID" || 'ItemBarcode'
		async (value, idType = "ItemID") => {
			bill.storeId &&
				(await GET_ITEM_INFO(bill.storeId, value, idType)
					.then((item) => {
						console.log("item From API ::", item);
						setErrors({});
						setUpdatedItem((prev) => ({
							item_id: item.id,
							p_tkl: item.p_tkl,
							Boxs: item.Boxs,
							itemBox_id: item.Boxs[0].id_s,
							Box_id: item.Boxs[0].box,
							unit_id: item.Boxs[0].unit_id,
							price: item.Boxs[0][bill.itemPrice],
							sum_box: item.Boxs[0].box,
							kmea: item.Boxs[0].box / (item.Boxs[0].box ?? 1),
							m_no: bill.storeId,
							emp_id: bill.emp_id,
							mosawiq_nesba: bill.mosawiq_nesba,
							dis1_typ: "1",
							item_name: item.item_name,
							item_no: item.item_no,
							Subject_to_validity: item.Subject_to_validity,
							Exp_date: item.ExpiredDates[0]
								? item.ExpiredDates[0].Exp_date
								: null,
							expiredDateQuntity: item.ExpiredDates[0]
								? item.ExpiredDates[0].qunt
								: 0,
						}));
					})
					// .then(() => console.log(updatedItem))
					.catch((error) => console.log(error)));
		},
		[bill.emp_id, bill.itemPrice, bill.mosawiq_nesba, bill.storeId]
	);

	// Handling Enter key pressing on item number input
	const barcodeHandle = ({ value }) => {
		// get item informations
		bill.storeId &&
			GET_ITEM_INFO(bill.storeId, value, "ItemBarcode")
				.then((item) => {
					console.log("item From API ::", item);
					setErrors({});
					let _item = {
						item_id: item.id,
						p_tkl: item.p_tkl,
						Boxs: item.Boxs,
						itemBox_id: item.Boxs[0].id_s,
						Box_id: item.Boxs[0].box,
						unit_id: item.Boxs[0].unit_id,
						price: item.Boxs[0][bill.itemPrice],
						sum_box: item.Boxs[0].box,
						kmea: item.Boxs[0].box / (item.Boxs[0].box ?? 1),
						m_no: bill.storeId,
						emp_id: bill.emp_id,
						mosawiq_nesba: bill.mosawiq_nesba,
						dis1_typ: "1",
						item_name: item.item_name,
						item_no: item.item_no,
						Exp_date: item.ExpiredDates[0]
							? item.ExpiredDates[0].Exp_date
							: null,
						expiredDateQuntity: item.ExpiredDates[0]
							? item.ExpiredDates[0].qunt
							: 0,
					};
					setUpdatedItem(_item);
					return _item;
				})
				// add item to invoice
				.then((_item) => addItemToInvoice(_item))
				.catch((error) => {
					// setErrors({});
					console.log(error);
				});
	};

	//? Works on SearchItemCallBack to set SelectedItem and Updated Item
	useEffect(() => {
		async function updateSelectedItem() {
			await getItemInfo(updatedItem.item_id, "ItemID");
		}
		bill.storeId &&
			updatedItem.item_id &&
			(!itemEditMode
				? updateSelectedItem()
				: setUpdatedItem((prev) => ({ ...prev, m_no: bill.storeId })));
	}, [bill.storeId]);

	//! ────────────────────────────────────────────────────────────────────────────────

	//? First Render effect
	useEffect(() => {
		console.log("render");
		async function getInitialData() {
			let cashierStores = await GET_CASHIER_STORES();

			let cashiers = await GET_CASHIERS();

			let response = await GET_INVOICE_NUMBER(bill.invoiceType);

			setInitData((prevInitData) => ({
				...prevInitData,
				cashierStores,
				cashiers,
			}));

			setBill((prevBill) => ({
				...prevBill,
				e_no: response.InvoiceNumber,
				storeId: cashierStores[0]?.id,
				mosweq_id: cashiers[0]?.id,
			}));

			let _accounts = await GET_ACCOUNTS(
				bill.safeOrClient,
				cashiers[0]?.id,
				bill.invoiceType
			);

			setAccounts(_accounts);
		}

		getInitialData();
	}, [bill.invoiceType, bill.safeOrClient]);

	useEffect(() => {
		let _cashier = initData.cashiers.find(
			(cashier) => cashier.id == bill.mosweq_id
		);
		_cashier &&
			_cashier.mosawiq_nesba &&
			setBill((prevBill) => ({
				...prevBill,
				mosawiq_nesba: _cashier.mosawiq_nesba,
			}));
	}, [bill.mosweq_id, initData.cashiers]);

	useEffect(() => {
		let boxs = updatedItem.Boxs
			? updatedItem.Boxs
			: billTableSelectedItem.Boxs;
		if (boxs && updatedItem.itemBox_id) {
			let box = boxs.find((box) => box.id_s == updatedItem.itemBox_id);
			box &&
				setUpdatedItem((prevUpdatedItem) => ({
					...prevUpdatedItem,
					Box_id: box.box,
					unit_id: box.unit_id,
					price: box[bill.itemPrice],
					sum_box: 1 * prevUpdatedItem.kmea * (box.box ?? 1),
				}));
			if (errors) {
				let updatedErrors = { ...errors };
				delete updatedErrors.price;
				delete updatedErrors.sum_box;
				delete updatedErrors.kmea;
				setErrors(updatedErrors);
			}
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [
		bill.itemPrice,
		billTableSelectedItem.Boxs,
		selectedItem.Boxs,
		updatedItem.itemBox_id,
	]);

	useEffect(() => {
		if (updatedItem.sum_box) {
			setUpdatedItem((prevUpdatedItem) => ({
				...prevUpdatedItem,
				kmea: prevUpdatedItem.sum_box / (prevUpdatedItem.Box_id ?? 1),
			}));
		}
	}, [updatedItem.sum_box]);

	useEffect(() => {
		if (updatedItem.kmea) {
			setUpdatedItem((prevUpdatedItem) => ({
				...prevUpdatedItem,
				sum_box:
					1 * prevUpdatedItem.kmea * (prevUpdatedItem.Box_id ?? 1),
			}));
		}
	}, [updatedItem.kmea]);

	//? Get Reports about bill table selected Item
	//! Return here
	useEffect(() => {
		async function getItemReports() {
			await GET_REPORT_ITEM_STORES_QUANTITY(billTableSelectedItem.item_id)
				.then((respone) => {
					setItemStoreQuantity(respone);
				})
				.catch((error) => {
					console.log(error);
				});

			bill.safeOrClient === "Customer" &&
				(await GET_CUSTOMER_LAST_TRANSACTION(
					billTableSelectedItem.item_id,
					selectedAccount.id
				)
					.then((response) => {
						console.log("CustomerLastItemTransaction:: ", response);
						setCustomerLastItemTransaction(response);
					})
					.catch((error) => console.log(error)));
		}

		billTableSelectedItem.item_id && getItemReports();
	}, [bill.safeOrClient, billTableSelectedItem.item_id, selectedAccount.id]);

	//! ────────────────────────────────────────────────────────────────────────────────

	//? This fuction is updateing bill by the event name and value
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

	const updateAccountType = async (e) => {
		try {
			setSelectedAccount({});
			console.log(e.name, e.value);
			setBill({ ...bill, [e.name]: e.value });
			let _accounts = await GET_ACCOUNTS(
				e.value,
				bill.mosweq_id,
				bill.invoiceType
			);
			setAccounts(_accounts);
		} catch (error) {
			console.log(error);
		}
	};

	const updateSelectedAccount = (e) => {
		let selectedAccount =
			accounts.find((account) => account.id == e.value) ?? {};

		selectedAccount.MaxDebit === "0" ||
		(selectedAccount.debit &&
			parseInt(selectedAccount.MaxDebit) +
				parseInt(selectedAccount.debit) >
				0)
			? setShowDebitAlert(false)
			: setShowDebitAlert(true);

		setSelectedAccount(selectedAccount);
		setBill({
			...bill,
			tele_nkd: selectedAccount.PhoneNumber,
			itemPrice: selectedAccount.defult_price,
			omla_id: selectedAccount.omla_id,
			sno_id: e.value,
		});
	};

	const rowDoubleClickHandle = useCallback(async (e) => {
		if (e.data.item_id) {
			console.log(e.data);
			setItemEditMode(true);
			setBill((prev) => ({ ...prev, storeId: e.data.m_no }));
			setBillTableSelectedItem(e.data);
			setUpdatedItem(e.data);
			setErrors({});
		}
	}, []);

	const setNewInvoice = useCallback(async () => {
		await GET_INVOICE_NUMBER(bill.invoiceType)
			.then((response) => {
				setBill((prevBill) => ({
					id: 0,
					emp_id: prevBill.emp_id,
					e_date: new Date(),
					invoiceType: "Sales",
					safeOrClient: prevBill.safeOrClient,
					// storeId: initData.cashierStores[0].id,
					// mosweq_id: initData.cashiers[0].id,
					storeId: prevBill.storeId,
					mosweq_id: prevBill.mosweq_id,
					mosawiq_nesba: prevBill.mosawiq_nesba,
					dis_type: 1,
					dis: 0,
					Ex_Rate: 1,
					itemPrice: "0",
					readOnly: false,

					e_no: response.InvoiceNumber,
				}));
				setShowDebitAlert(false);
				setUpdatedItem({});
				setBillTableSelectedItem({});
				setSelectedItem({});
				setItems([]);
				setSelectedAccount({});
				setItemStoreQuantity([]);
				setItemTransactions([]);
				setItemEditMode(false);
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
						message: t("Failed Try again"),
						width: 450,
					},
					"error",
					2000
				);
			});
		// debugger;
	}, [bill.invoiceType]);

	const rowRemovingHandle = useCallback(
		async (e) => {
			e.cancel = true;
			e.data &&
				e.data.ID &&
				(await DELETE_INVOICE_ITEM(bill.invoiceType, bill.id, e.data.ID)
					.then(async (response) => {
						let updatedItems = [...items];

						let index = updatedItems.indexOf(e.data);

						if (~index) {
							items.length === 1 && setNewInvoice();
							updatedItems.splice(index, 1);
							setItems(updatedItems);
						}

						// Stop Editing
						await e.component.refresh(true);

						// Notify user
						notify(
							{
								message: `تم الحذف بنجاح`,
								width: 450,
							},
							"success",
							2000
						);
					})
					.catch((error) => {
						// Notify user
						notify(
							{
								message: `${error}`,
								width: 450,
							},
							"error",
							2000
						);
					}));
		},
		[bill.id, bill.invoiceType, items, setNewInvoice]
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
			await getItemInfo(id, "ItemID");
		},
		[getItemInfo]
	);

	const openBillsTable = useCallback(() => {
		setShowSearchBill(true);
	}, []);

	const billRowDoubleClickHandle = ({ data }) => {
		console.log(data);
		if (data.id && data.invoiceType) {
			GET_INVOICE_ITEMS(data.invoiceType, data.id)
				.then((invoiceItems) => {
					console.log(invoiceItems);
					setBill({ ...data, storeId: initData.cashierStores[0].id });
					setSelectedAccount(data.Account);
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
	};

	const disableButtonOnError = useMemo(() => {
		return !updatedItem.item_name || !_.isEmpty(errors);
	}, [errors, updatedItem.item_name]);

	const explodeButtonIsDisable = useMemo(() => {
		return !(
			bill.id > 0 &&
			updatedItem.Boxs &&
			updatedItem.Boxs.length > 1 &&
			parseFloat(updatedItem.Box_id) > 1 &&
			parseFloat(updatedItem.sum_box) > 1
		);
	}, [updatedItem.Box_id, updatedItem.sum_box, bill.id]);

	const mergeButtonIsDisable = useMemo(() => {
		return _.isEmpty(
			items.filter(
				(item) =>
					!itemEditMode &&
					item.item_id === updatedItem.item_id &&
					updatedItem.m_no === item.m_no &&
					(!item.Subject_to_validity ||
						updatedItem.Exp_date === item.Exp_date)
			)
		);
	}, [
		itemEditMode,
		items,
		updatedItem.Exp_date,
		updatedItem.item_id,
		updatedItem.m_no,
	]);

	const mergeItemsHandle = useCallback(() => {
		setUpdatedItem((prev) => ({ ...prev, MergeInOneInvoicItem: true }));
	}, []);

	const explodeItamHandle = useCallback(
		(id) => {
			let data = {
				Data: [
					{
						Type: id,
						ID: updatedItem.ID ?? 0,
						item_id: updatedItem.item_id,
						InvoiceID: bill.id,
						sum_box: updatedItem.sum_box,
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
					console.log(itemEditMode);
					if (itemEditMode) {
						let updatedItems = items.filter(
							(item) => item.ID !== billTableSelectedItem.ID
						);
						setItems([...updatedItems, ...Items]);
						setItemEditMode(false);
						setBillTableSelectedItem({});
						setItemStoreQuantity([]);
						setItemTransactions([]);
						notify(
							{
								message: `تم تفريط الكمية بنجاح`,
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
			bill.id,
			billTableSelectedItem.ID,
			itemEditMode,
			items,
			updatedItem.ID,
			updatedItem.Subject_to_validity,
			updatedItem.dis1,
			updatedItem.item_id,
			updatedItem.m_no,
			updatedItem.price,
			updatedItem.sum_box,
		]
	);

	useEffect(() => {
		updatedItem.MergeInOneInvoicItem && addItemToInvoice(updatedItem);
	}, [updatedItem.MergeInOneInvoicItem]);

	const itemTransactionsPayload = useMemo(() => {
		return {
			itemId: billTableSelectedItem.item_id,
			storeID: billTableSelectedItem.m_no,
		};
	}, [billTableSelectedItem]);

	const discountButtonOptions = useMemo(() => {
		return {
			text: t("Update discount"),
			icon: "undo",
			type: "normal",
			stylingMode: "text",
			disabled: bill.id === 0,
			onClick: () => {
				let updatedInvoice = {
					Data: [
						{
							InvoiceType: bill.invoiceType,
							ID: bill.id,
							InvoiceDiscount: {
								dis: bill.dis,
								dis_type: bill.dis_type,
							},
						},
					],
				};
				UPDATE_INVOICE_DISCOUNT(updatedInvoice)
					.then(({ InvoiceDiscount }) => {
						console.log(InvoiceDiscount);
						setBill((prev) => ({
							...prev,
							InvoiceDiscount: InvoiceDiscount,
						}));
					})
					.catch(({ response }) => {
						let responseErrors = {};
						response.data.Errors.forEach(({ Column, Error }) => {
							responseErrors = {
								...responseErrors,
								[Column]: Error,
							};
						});
						setErrors(responseErrors);
					});
			},
		};
	}, [bill.dis, bill.dis_type, bill.id, bill.invoiceType]);

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
						setBill((prevBill) => ({
							...prevBill,
							e_no: response.InvoiceNumber,
						}));

						if (errors.e_no) {
							let _errors = errors;
							delete _errors.e_no;
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
								message: t("Failed Try again"),
								width: 450,
							},
							"error",
							2000
						);
					});
			},
		};
	}, [bill.invoiceType, bill.readOnly, errors]);

	const editInvoiceBasicsInformations = useCallback(() => {
		setBill((prev) => {
			setParallelBill({
				e_no: prev.e_no,
				e_date: prev.e_date,
				Ex_Rate: prev.Ex_Rate,
				mosweq_id: prev.mosweq_id,
				emp_id: prev.emp_id,
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
			.then((response) => {
				console.log(response);
			})
			.then((response) => {
				setUpdatedItem({});
				setSelectedItem({});
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
			.catch(
				({
					response: {
						data: { Errors },
					},
				}) => {
					let responseErrors = {};
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
				}
			);
		console.log(updatedInvoice);
	}, [bill, parallelBill]);

	const discardFloatingButtonHandle = useCallback(() => {
		setUpdatedItem({});
		setSelectedItem({});
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

	const handleTest = (e) => {
		// console.log(itemEditMode);
		// console.log(bill);
		// console.log(parallelBill);
		// console.log(updatedItem.itemBox_id, updatedItem.Box_id);
		// console.log(updatedItem.item_name, _.isEmpty(errors));
		// mergeItemsHandle();
		// console.log(errors);
		// console.log(updatedItem.Quantity);
		// console.log(updatedItem.expiredDateQuntity);
		console.log(items);
	};

	return (
		<>
			{
				//! في المرة الرابعة ديما بيحصل مشكلة
				showSearchBill && (
					<Searchtable
						allowDelete={true}
						ob={{
							list_type: bill.safeOrClient,
							Type: bill.invoiceType,
						}}
						visible={showSearchBill}
						togglePopup={(e) => setShowSearchBill(!showSearchBill)}
						onclickRow={(e) => billRowDoubleClickHandle(e)}
					/>
				)
			}

			<CuptureReceiptPopup
				showPopup={showCuptureReceiptPopup}
				changeShowPopup={() =>
					setShowCuptureReceiptPopup(!CuptureReceiptPopup)
				}
			/>

			<SearchItem
				visible={visible}
				togglePopup={togglePopup}
				callBack={searchItemCallBackHandle}
			/>

			{!(bill.id === 0) && !bill.readOnly && (
				// <FloatingButton clickHandle={acceptFloatingButtonHandle} />
				<OkDiscardFloatingButtons
					okHandle={acceptFloatingButtonHandle}
					discardHandle={discardFloatingButtonHandle}
				/>
			)}

			{bill.id !== 0 && bill.readOnly && (
				<SpeedDialAction
					icon="alignleft"
					label={t("basic modification")}
					index={3}
					onClick={editInvoiceBasicsInformations}
				/>
			)}
			<SpeedDialAction
				icon="add"
				label={t("New Invoice")}
				index={2}
				onClick={setNewInvoice}
			/>
			<SpeedDialAction
				icon="edit"
				label={t("Update Invoice")}
				index={1}
				visible={true}
				onClick={openBillsTable}
			/>

			<div className="customContainer card  p-3 mx-3 salesBill">
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

				<h3 className="p-3 text-primary">بيانات الفاتورة</h3>
				<div className="row pb-3 mx-auto border-bottom">
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
							<SelectBoxFullWidth
								readOnly={bill.readOnly}
								dataSource={storageClientsOption}
								name={"safeOrClient"}
								value={bill.safeOrClient}
								handleChange={updateAccountType}
							/>
						</div>

						{/* نسبة الزيادة على السعر */}
						<div className="col-5">
							<NumberBox
								readOnly={bill.readOnly}
								required={false}
								validationErrorMessage={
									errors.ratioOfIncreaseInPrice
								}
								label={t("Price Ratio")}
								value={bill.ratioOfIncreaseInPrice}
								name="ratioOfIncreaseInPrice"
								handleChange={updateBillInformation}
							/>
						</div>

						{/* ملاحظات */}
						<div className="col-7">
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
								// stylingMode="underlined"
							/>
						</div>

						{/* العملة */}
						<div className="col-6">
							<TextBox
								label={t("Currency")}
								readOnly={true}
								required={false}
								name="currency"
								value={selectedAccount.MoneyType}
								handleChange={updateBillInformation}
							/>
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
						</div>

						{/* ايصال قبض */}
						{bill.safeOrClient === "Customer" && (
							<button
								style={{ height: "36px" }}
								className="col-5 btn btn-success d-flex align-items-center justify-content-center"
								onClick={() => setShowCuptureReceiptPopup(true)}
							>
								<i className="fas fa-file-invoice-dollar px-2 fa-2x"></i>
								<span className="">{t("Receipt Cash In")}</span>
							</button>
						)}
					</div>
				</div>

				<div className="row py-3 border-bottom">
					{/* Table */}
					<div className="px-3 col-12">
						<ItemsTable
							disabled={!bill.readOnly}
							dataSource={items}
							key="ItemsTable"
							rowDoubleClickHandle={rowDoubleClickHandle}
							rowRemovingHandle={rowRemovingHandle}
							discount={bill.InvoiceDiscount}
						/>
					</div>
					<div className="pt-1 col-12">
						<div className="row px-1 py-2">
							<div className="col-3">
								<button
									disabled={
										itemEditMode ||
										!selectedAccount.id ||
										!bill.storeId ||
										!bill.mosweq_id ||
										(bill.id && !bill.readOnly)
									}
									style={{
										height: "36px",
									}}
									className="col-12 btn btn-outline-dark btn-outline"
									onClick={togglePopup}
									// onClick={() => setShowSearchItemPopup(true)}
								>
									{/* <i className="fas fa-file-invoice-dollar px-2 fa-2x" /> */}
									<span className="">
										{t("Choose species")}
									</span>
								</button>
							</div>

							{/* المخزن */}
							<div className="col-3">
								<SelectBox
									readOnly={bill.id && !bill.readOnly}
									label={t("store")}
									dataSource={initData.cashierStores}
									name="storeId"
									value={bill.storeId}
									handleChange={updateBillInformation}
								/>
							</div>

							{/* الخصم علي الفاتورة */}
							<div className="col-5">
								<NumberBox
									required={false}
									validationErrorMessage={errors.dis}
									label={t("Discount on the invoice")}
									value={bill.dis}
									name="dis"
									handleChange={updateBillInformation}
									buttonOptions={discountButtonOptions}
								/>
							</div>
							<CheckBox
								className="col-1 pt-2 "
								value={bill.dis_type}
								name="dis_type"
								onValueChanged={(e) =>
									updateBillInformation({
										name: "dis_type",
										value: !bill.dis_type,
									})
								}
							/>

							<div className="col-3">
								<TextBox
									label={t("Item Number")}
									readOnly={
										itemEditMode ||
										!selectedAccount.id ||
										!bill.storeId ||
										!bill.mosweq_id ||
										(bill.id && !bill.readOnly)
									}
									enterKeyHandle={barcodeHandle}
									required={false}
									name="item_no"
									value={updatedItem.item_no}
									handleChange={updateItemInformation}
								/>
							</div>

							<div className="col-3">
								<TextBox
									readOnly={true}
									required={false}
									label={t("Item Name")}
									name="item_name"
									value={updatedItem.item_name}
									handleChange={updateBillInformation}
								/>
							</div>

							<div className="col-3">
								<SelectBox
									label="العبوة"
									validationErrorMessage={errors.itemBox_id}
									dataSource={updatedItem.Boxs}
									keys={{ name: "description", id: "id_s" }}
									name="itemBox_id"
									value={updatedItem.itemBox_id}
									handleChange={updateItemInformation}
								/>
							</div>

							{selectedItem && selectedItem.Subject_to_validity && (
								<div className="col-3">
									<SelectBox
										label="الصلاحية"
										validationErrorMessage={errors.Exp_date}
										dataSource={
											selectedItem.ExpiredDates.length > 0
												? selectedItem.ExpiredDates
												: [
														{
															Exp_date:
																"1/1/2050",
														},
												  ]
										}
										keys={{
											name: "Exp_date",
											id: "Exp_date",
										}}
										name="Exp_date"
										value={updatedItem.Exp_date}
										handleChange={updateItemInformation}
									/>
								</div>
							)}

							<div className="col-3">
								<NumberBox
									required={false}
									validationErrorMessage={errors.sum_box}
									label={t("Amount Package")}
									name="sum_box"
									value={updatedItem.sum_box}
									handleChange={updateItemInformation}
								/>
							</div>

							<div className="col-3">
								<NumberBox
									required={false}
									validationErrorMessage={errors.kmea}
									label={t("Quantity")}
									name="kmea"
									value={updatedItem.kmea}
									handleChange={updateItemInformation}
								/>
							</div>

							<div className="col-3">
								<NumberBox
									required={false}
									validationErrorMessage={errors.price}
									label={t("Price")}
									name="price"
									value={updatedItem.price}
									handleChange={updateItemInformation}
								/>
							</div>

							<div className="col-3">
								<NumberBox
									required={false}
									validationErrorMessage={errors.dis1}
									label={t("Discount")}
									name="dis1"
									value={updatedItem.dis1}
									handleChange={updateItemInformation}
								/>
							</div>
						</div>
						<div className="row px-1">
							<div className="col-3">
								<DropDownButton
									key="add"
									rtlEnabled={i18n.language == "ar"}
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
											onClick: () =>
												addItemToInvoice(updatedItem),
										},
										{
											id: 1,
											name: "دمج",
											icon: "unselectall",
											onClick: mergeItemsHandle,
											disabled: mergeButtonIsDisable,
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
								<DropDownButton
									stylingMode="outlined"
									key="explode"
									rtlEnabled={i18n.language == "ar"}
									className="col-12"
									disabled={explodeButtonIsDisable}
									splitButton={true}
									useSelectMode={true}
									selectedItemKey={explodeButtonId}
									items={[
										{
											id: 0,
											name: t("disposable inferiority"),
											icon: "rowproperties",
											onClick: ({ itemData }) =>
												explodeItamHandle(itemData.id),
										},
										{
											id: 1,
											name: "تفريط الكمية",
											icon: "smalliconslayout",
											onClick: ({ itemData }) =>
												explodeItamHandle(itemData.id),
										},
									]}
									displayExpr="name"
									keyExpr="id"
									// on selected button clicked
									onButtonClick={({ selectedItem }) => {
										explodeItamHandle(selectedItem.id);
									}}
									// on option from dropDawn clicked
									onItemClick={({ itemData }) => {
										setExplodeButtonId(itemData.id);
									}}
								/>
							</div>

							<div className="col-3">
								<button
									style={{ height: "41px" }}
									className="col-12 btn btn-success d-flex align-items-center justify-content-center"
									onClick={(e) => handleTest(e)}
								>
									<i className="fas fa-file-invoice-dollar px-2 fa-2x"></i>
									<span className="">{t("Infomration")}</span>
								</button>
							</div>
						</div>
					</div>
					<div className="pt-1 col-md-12 col-lg-12">
						{/* بيانات الصنف */}
						<div className="row">
							<h5 className="px-3 pb-2">
								{t("Item Information")}
							</h5>
							{/* رصيد الصنف */}
							<div className="col-4">
								<TextBox
									required={false}
									readOnly={true}
									label="رصيد الصنف"
									name="quantity"
									value={updatedItem.Quantity}
								/>
							</div>
							{/* رصيد الصلاحية */}
							{updatedItem.Subject_to_validity && (
								<div className="col-4">
									<TextBox
										required={false}
										readOnly={true}
										label={t("Validity balance")}
										name="expiredDateQuntity"
										value={updatedItem.expiredDateQuntity}
									/>
								</div>
							)}
						</div>

						{bill.safeOrClient === "Customer" && (
							<div className="col-12">
								<h5 className="p-2 ">
									{t(
										"The last transaction with the customer"
									)}
								</h5>
								<div className="row">
									{/* الكمية */}
									<div className="col-4">
										<NumberBox
											required={false}
											readOnly={true}
											label={t("Quantity")}
											name="kmea"
											value={
												customerLastItemTransaction.kmea
											}
										/>
									</div>

									{/* السعر */}
									<div className="col-4">
										<NumberBox
											required={false}
											readOnly={true}
											label={t("Price")}
											name="price"
											value={
												customerLastItemTransaction.price
											}
										/>
									</div>
								</div>
							</div>
						)}
					</div>
				</div>

				<div className="row py-3 border-bottom">
					<h3 className="p-3 text-primary">بيان الحركات</h3>

					{/* Table */}
					<div className="p-3 card col-md-12 col-lg-8">
						<ItemTransactionsTable
							itemTransactionsPayload={itemTransactionsPayload}
						/>
					</div>
					<div className="p-3 card col-md-12 col-lg-4">
						<ItemsStorageQuantityTable
							dataSource={itemStoreQuantity}
						/>
					</div>
				</div>
			</div>
		</>
	);
};
export default SalesBill;
