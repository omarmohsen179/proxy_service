import React, {
	useRef,
	useState,
	useCallback,
	useMemo,
	useEffect,
} from "react";
import DiscountInvoiceInformation from "./Components/DiscountInvoiceInformation/DiscountInvoiceInformation";
import DiscountInvoiceItemInformation from "./Components/DiscountInvoiceItemInformation/DiscountInvoiceItemInformation";
import DiscountInvoiceTable from "./Components/DiscountInvoiceTable/DiscountInvoiceTable";
import DropDownButton from "devextreme-react/drop-down-button";
import _ from "lodash";
import notify from "devextreme/ui/notify";
import {
	GET_DISCOUNT_INVOICE_ITEMS,
	INSERT_DISCOUNT_INVOICE,
	UPDATE_DISCOUNT_INVOICE,
} from "./API.DiscountInvoice";
import SpeedActionsButtons from "../../../Templetes/Invoice/Components/SpeedActionsButtons/SpeedActionsButtons";
import InputTable from "./../../../Modals/InputTable/InputsTable";
import { useTranslation } from "react-i18next";
import { selectVisible } from "../../../Store/Items/ItemsSlice";
import { useSelector } from "react-redux";

const DiscountInvoice = () => {
	//? ────────────────────────────────────────────────────────────────────────────────
	//? ─── STATES AND REFS ────────────────────────────────────────────────────────────
	//? ────────────────────────────────────────────────────────────────────────────────
	// Default values
	const billDefaultValues = useRef({
		id: 0,
		e_date: new Date(),
		emp_mo: "",
		sno_id: "",
		nots: "",
		readOnly: false,
	});
	const { t, i18n } = useTranslation();
	let visible = useSelector(selectVisible);
	// State of main information about Bill
	const [bill, setBill] = useState(billDefaultValues.current);

	// Invoice Items
	const [items, setItems] = useState([]);

	// Item States
	const [selectedItem, setSelectedItem] = useState({});

	const [updatedItem, setUpdatedItem] = useState({});

	const [itemEditMode, setItemEditMode] = useState(false);

	// SelectedAccount
	const [selectedAccount, setSelectedAccount] = useState({});

	// State of Errors
	const [errors, setErrors] = useState({});

	// Reset Page
	const [resetComponents, setResetComponents] = useState(false);

	// DropdawmButton id
	const [addButtonId, setAddButtonId] = useState(0);

	// Popups
	const [showSearchBill, setShowSearchBill] = useState(false);

	//* ────────────────────────────────────────────────────────────────────────────────
	//* ─── CALLBACKS ──────────────────────────────────────────────────────────────────
	//* ────────────────────────────────────────────────────────────────────────────────

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

	const updateBillState = useCallback((data) => {
		setBill((prev) => ({ ...prev, ...data }));
	}, []);

	const updateErrorsState = useCallback((data) => {
		setErrors(data);
	}, []);

	const updateSelectedAccount = useCallback((account) => {
		setSelectedAccount(account);
	}, []);

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

	const editUpdatedItem = useCallback((data) => {
		data
			? setUpdatedItem((prev) => ({ ...prev, ...data }))
			: setUpdatedItem({});
	}, []);

	// This callback is fireing on item row in itemsTable clicked
	// This callback is responsible of
	// update bill.storeId
	const onItemRowDoubleClickHandle = useCallback((e) => {
		if (e.data.item_id) {
			setItemEditMode(true);

			setSelectedItem(e.data);

			setUpdatedItem(e.data);

			setErrors({});
		}
	}, []);

	const reselectSelectedItem = useCallback((data) => {
		data
			? setSelectedItem((prev) => ({ ...prev, ...data }))
			: setSelectedItem({});
	}, []);

	const editErrors = useCallback((data) => {
		data ? setErrors((prev) => ({ ...prev, ...data })) : setErrors({});
	}, []);

	const updateItems = useCallback((data) => {
		setItems(data);
	}, []);

	const cancelEditItem = useCallback(() => {
		setItemEditMode(false);

		setSelectedItem({});

		setUpdatedItem({});

		setErrors({});
	}, []);

	const insertInvoice = useCallback(
		(_item) => {
			console.log("insertInvoice");
			let invoice = {
				Data: [
					{
						ID: "0",
						Invoice: {
							e_no: bill.e_no,
							e_date: bill.e_date,
							emp_mo: bill.emp_mo,
							sno_id: bill.sno_id,
							nots: bill.nots,
						},
						InvoiceItems: [{ ..._item }],
					},
				],
			};
			console.log(bill.sno_id);
			INSERT_DISCOUNT_INVOICE(invoice)
				.then(({ id, Item }) => {
					setUpdatedItem({});
					setSelectedItem({});
					setItems([Item]);
					setBill((prevBill) => ({
						...prevBill,
						id: id,
						readOnly: true,
					}));

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
				.catch(({ response }) => {
					let Errors = response.data ? response.data.Errors : [];
					let responseErrors = {};
					Errors.forEach(({ Column, Error }) => {
						responseErrors = { ...responseErrors, [Column]: Error };
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
		},
		[bill.e_date, bill.e_no, bill.emp_mo, bill.nots, bill.sno_id]
	);

	const addItemToInvoice = useCallback(
		(_item) => {
			if (bill.id > 0) {
				console.log(_item);
				let updatedInvoice = {
					Data: [
						{
							ID: bill.id,
							InvoiceItems: [{ ..._item }],
						},
					],
				};
				if (itemEditMode) {
					UPDATE_DISCOUNT_INVOICE(updatedInvoice)
						.then(({ Item }) => {
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
					UPDATE_DISCOUNT_INVOICE(updatedInvoice)
						.then(({ Item }) => {
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
									message: `${t("Failed Try again")}`,
									width: 450,
								},
								"error",
								2000
							);
						});
				}
			} else if (bill.id === 0) {
				insertInvoice(_item);
			}
		},
		[bill.id, insertInvoice, itemEditMode, items, selectedItem]
	);

	const setNewInvoice = useCallback(() => {
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
		setResetComponents({ ...true });
	}, []);

	const openBillsTable = useCallback(() => {
		setShowSearchBill(true);
	}, []);

	const billRowDoubleClickHandle = useCallback(({ Account, Invoice }) => {
		if (Account && Invoice) {
			GET_DISCOUNT_INVOICE_ITEMS(Invoice.id)
				.then((invoiceItems) => {
					setBill({
						...Invoice,
						itemPrice: Account.defult_price,
						sno_id: Account.id,
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

	//? ────────────────────────────────────────────────────────────────────────────────
	//? ─── EFFECTS ────────────────────────────────────────────────────────────────────
	//? ────────────────────────────────────────────────────────────────────────────────

	useEffect(() => {
		if (bill.id != 0 && items.length < 1) {
			setNewInvoice(bill.invoiceType);
		}
	}, [items.length]);

	//* ────────────────────────────────────────────────────────────────────────────────
	//* ─── MEMOs ──────────────────────────────────────────────────────────────────────
	//* ────────────────────────────────────────────────────────────────────────────────

	const disableButtonOnError = useMemo(() => {
		return !updatedItem.item_name || !_.isEmpty(errors);
	}, [errors, updatedItem.item_name]);

	return (
		<>
			{showSearchBill && (
				<InputTable
					allowDelete={true}
					visible={showSearchBill}
					togglePopup={(e) => setShowSearchBill(!showSearchBill)}
					onclickRow={(e) => billRowDoubleClickHandle(e)}
				/>
			)}

			<SpeedActionsButtons
				billInformation={{
					id: bill.id,
					readOnly: bill.readOnly,
					invoiceType: "DiscountInvoice",
				}}
				setNewInvoice={setNewInvoice}
				openBillsTable={openBillsTable}
				showBasicsEditButton={false}
			/>
			<div className="container-xxl rtlContainer">
				<h3 className="p-3 sectionHeader">{t("discount bill")}</h3>
				<div className="row card p-3 mx-3 billSection">
					<DiscountInvoiceInformation
						bill={bill}
						errors={errors}
						updateBillInformation={updateBillInformation}
						updateBillState={updateBillState}
						updateErrorsState={updateErrorsState}
						setSelectedAccount={updateSelectedAccount}
						selectedAccount={selectedAccount}
						resetComponent={resetComponents}
					/>
					<DiscountInvoiceTable
						disabled={!bill.readOnly}
						invoiceId={bill.id}
						items={items}
						updateItems={updateItems}
						key="ItemsTable"
						rowDoubleClickHandle={onItemRowDoubleClickHandle}
					/>
					<DiscountInvoiceItemInformation
						billInformation={{
							id: bill.id,
							invoiceType: bill.invoiceType,
							readOnly: bill.readOnly,
							itemPrice: bill.itemPrice ?? "p_tkl",
							emp_id: bill.emp_id,
							emp_mo: bill.emp_mo,
							mosawiq_nesba: bill.mosawiq_nesba,
							storeId: bill.storeId,
							dis: bill.dis,
							dis_type: bill.dis_type,
						}}
						updateBillInformation={updateBillInformation}
						updateBillState={updateBillState}
						// Store of changing and api element
						updatedItem={updatedItem}
						// to setState
						setUpdatedItem={editUpdatedItem}
						// For inputs
						updateItemInformation={updateItemInformation}
						// Data of item start state
						selectedItem={selectedItem}
						// Reset item start state
						setSelectedItem={reselectSelectedItem}
						updateErrors={editErrors}
						errors={errors}
						itemEditMode={itemEditMode}
						selectedAccountId={selectedAccount.id}
						addItemToInvoice={addItemToInvoice}
					/>
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
										: t("Remove"),
									icon: itemEditMode ? "edit" : "add",
									onClick: () =>
										addItemToInvoice(updatedItem),
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
				</div>
			</div>
		</>
	);
};

export default DiscountInvoice;
