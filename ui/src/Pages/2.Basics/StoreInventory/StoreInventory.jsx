import React, {
	useState,
	useEffect,
	useCallback,
	useMemo,
	useRef,
} from "react";

import { Button } from "devextreme-react/button";
import DateTime from "../../../Components/Inputs/DateTime";
import SelectBox from "../../../Components/Inputs/SelectBox";
import notify from "devextreme/ui/notify";
import MasterTable from "../../../Components/SharedComponents/Tables Components/MasterTable.jsx";
import TextBox from "../../../Components/Inputs/TextBox.js";
import NumberBox from "../../../Components/Inputs/NumberBox.js";
import MiscellaneousButtonBar from "../../../Components/SharedComponents/MiscellaneousButtonBar/MiscellaneousButtonBar.jsx";
import {
	NEXT_NUMBER,
	GET_ITEM_INFO,
	GET_OTHER_INVOICE,
	DELETE_INVOICE,
	INVOICE_TRANSACTION,
	GET_OTHER_INVOICE_ITEM,
	DELETE_INVOICE_ITEM,
	GET_ACCOUNTS,
	IMPORT_FROM_PRODUCTS,
} from "./API.StoreInventory";
import ButtonRow from "../../../Components/SharedComponents/buttonsRow";
import EditDelete from "../../../Components/SharedComponents/EditDelete1";
import Joi from "joi";
import { SpeedDialAction } from "devextreme-react/speed-dial-action";
import { Popup } from "devextreme-react/popup";
import { validateForm } from "../../../Services/services";
import { useTranslation } from "react-i18next";
import config from "devextreme/core/config";
import repaintFloatingActionButton from "devextreme/ui/speed_dial_action/repaint_floating_action_button";
function StoreInventory(props) {
	const [data, setData] = useState([]);
	const [errors, setErrors] = useState({});
	const [editDeleteStatus, setEditDeleteStatus] = useState("");
	const [dailog, setdialog] = useState(false);
	const { t, i18n } = useTranslation();
	const today = useMemo(() => {
		let defualtdateValue = new Date();
		return (
			(parseInt(defualtdateValue.getMonth()) + 1).toString() +
			"/" +
			defualtdateValue.getDate() +
			"/" +
			defualtdateValue.getFullYear()
		).toString();
	}, []);
	let initialValueInvoice = useRef({
		e_date: today,
		e_no: 0,
		nots: "",
		AID: 0,
	});
	let initialValueInvoiceItem = useMemo(() => {
		return {
			m_no: 0,
			item_id: 0,
			item_no: 0,
			item_name: "",
			ActuallyQuantity: 0,
			cse: t("Plus"),
			ExpiredDates: [],
			Exp_date: "",
			Exp_data_id: 0,
			grda: 0,
			nots: "",
		};
	}, [t]);
	const [Invoice, setInvoice] = useState(initialValueInvoice.current);
	const [InvoiceItem, setInvoiceItem] = useState(initialValueInvoiceItem);
	let [InvoiceItemData, setInvoiceItemData] = useState([]);
	let [AccountPopup, setAccountPopup] = useState(false);
	const [DisableInputs, setDisableInputs] = useState(false);
	let [AccountData, setAccountData] = useState([]);
	const colAttributes = useMemo(() => {
		return [
			{
				caption: "رقم الصنف ",
				captionEn: "Item No.",
				field: "item_no",
			},
			{
				caption: " اسم الصنف",
				captionEn: "item Name",
				field: "item_name",
			},
			{ caption: "الصلاحيه", captionEn: "Expiry", field: "Exp_date" },
			{ caption: "  الكميه", captionEn: "Quantity", field: "grda" },
			{ caption: "الملاحظه", captionEn: "Note", field: "nesba" },
		];
	}, []);
	const columnAttributesEditDelet = useMemo(() => {
		return [
			{
				caption: "رقم  ",
				captionEn: "Number",
				field: "e_no",
			},
			{
				caption: "تاريخ  ",
				captionEn: "Date",
				field: "e_date",
				dataType: "date",
			},
			{ caption: "ملاحظه", captionEn: "Note", field: "nots" },
			{ caption: "  أجمالي", captionEn: "Total", field: "total" },
		];
	}, []);
	const columnAttributesAccount = useMemo(() => {
		return [
			{ caption: "الأسم  ", captionEn: "Name", field: "name" },
			{ caption: "الرصيد", captionEn: "Balance", field: "debit" },
			{
				caption: "  الهاتف",
				captionEn: "Phone Number",
				field: "PhoneNumber",
			},
		];
	}, []);
	const schema = useMemo(() => {
		return {
			m_no: Joi.number().required().greater(0).required().messages({
				"any.required": `رقم الصنف مطلوب`,
				"number.greater": `هذا الحقل مطلوب `,
			}),
			nots: Joi.string().empty("").required().messages({
				"any.required": `هذا الحقل مطلوب `,
				"string.empty": `هذا الحقل مطلوب `,
			}),
			item_id: Joi.number().required().greater(0).required().messages({
				"any.required": `رقم الصنف مطلوب`,
				"number.greater": `رقم  يجب أن يكون أكبر من صفر`,
			}),
			grda: Joi.number().required().greater(-1).required().messages({
				"any.required": `رقم الصنف مطلوب`,
				"number.greater": `رقم  يجب أن يكون أكبر من صفر`,
			}),
			e_date: Joi.date()
				.required()
				.messages({ "any.required": "هذا الحقل مطلوب  " }),
			e_no: Joi.number().required().greater(0).required().messages({
				"any.required": `رقم الصنف مطلوب`,
				"number.greater": `رقم  يجب أن يكون أكبر من صفر`,
			}),
		};
	}, []);
	const type = useMemo(() => {
		return 3;
	}, []);
	useEffect(async () => {
		setInvoice({
			...initialValueInvoice.current,
			e_no: (await NEXT_NUMBER()).InvoiceNumber,
		});
	}, []);
	let handleChangeInvoiceItem = useCallback(
		({ name, value }) => {
			if (name == "grda") {
				if (parseInt(value) > parseInt(InvoiceItem.ActuallyQuantity)) {
					setInvoiceItem((prevState) => ({
						...prevState,
						[name]: value,
						cse: t("Plus"),
					}));
				} else {
					setInvoiceItem((prevState) => ({
						...prevState,
						[name]: value,
						cse: t("Minus"),
					}));
				}
			} else {
				if (name == "Exp_data_id") {
					setInvoiceItem((prevState) => ({
						...prevState,
						[name]: value,
						Exp_date: InvoiceItem.ExpiredDates.findIndex(
							(x) => x.id === value
						),
					}));
				} else {
					setInvoiceItem((prevState) => ({
						...prevState,
						[name]: value,
					}));
				}
			}
		},
		[InvoiceItem.ActuallyQuantity, InvoiceItem.ExpiredDates, t]
	);

	const handleChangeInvoice = useCallback(
		({ name, value }) => {
			// console.log("handleChange");
			setInvoice((prevState) => ({ ...prevState, [name]: value }));
		},
		[Invoice]
	);

	const closePopup = useCallback(async () => {
		setdialog(false);
	}, []);
	const onUpdate = useCallback(async () => {
		setEditDeleteStatus("edit");
		console.log("int");
		// setData((await GET_OTHER_INVOICE({skip:0,take:100,FilterQuery:""})).data)
		setdialog(!dailog);
	}, [dailog]);
	const onDelete = useCallback(async () => {
		setEditDeleteStatus("delete");
		//   setData((await GET_OTHER_INVOICE({skip:0,take:100,FilterQuery:""})).data)
		setdialog(!dailog);
	}, [dailog]);

	const onNew = useCallback(async () => {
		console.log("onNew");

		setInvoice({
			...initialValueInvoice.current,
			e_no: (await NEXT_NUMBER()).InvoiceNumber,
			e_date: today,
		});
		setInvoiceItemData([]);
		setInvoiceItem(initialValueInvoiceItem);
	}, []);
	const setValuesEditDelete = useCallback(async (value) => {
		console.log(value);
		setInvoice(value);

		setInvoiceItemData(await GET_OTHER_INVOICE_ITEM(value.ID));
	}, []);

	const Delete_Invoice = useCallback(async (id) => {
		return await DELETE_INVOICE(id);
	}, []);

	const get_other_invoices = useCallback(async (e) => {
		return await GET_OTHER_INVOICE(e);
	}, []);
	let Delete_Invoice_item = useCallback(
		async (data) => {
			console.log(Invoice);
			return await DELETE_INVOICE_ITEM(Invoice.ID, data.data.ID);
		},
		[Invoice]
	);

	let Accounttoggleup = useCallback(
		async (e) => {
			setAccountData(await GET_ACCOUNTS());
			setAccountPopup(!AccountPopup);
		},
		[AccountPopup]
	);
	const ResetProductsQuantities = useCallback(
		async (e) => {
			await IMPORT_FROM_PRODUCTS(
				e.id ? "ResetProductsQuantities" : "ReCredit",
				{ Iid: Invoice.ID ? Invoice.ID : 0, Aid: e.id ? e.id : 0 }
			)
				.then((res) => {
					setAccountPopup(false);
					notify(
						{
							message: t("The bill has been credited."),
							width: 600,
						},
						"success",
						3000
					);
					console.log(res);
				})
				.catch(({ response }) => {
					if (response.data && response.data.Errors.length > 0) {
						notify(
							{
								message: response.data.Errors[0].Error,
								width: 450,
							},
							"error",
							2000
						);
					}
				});
		},
		[AccountPopup, Invoice.ID]
	);

	let searchItemCallBackHandleStore = useCallback(
		(res) => {
			setInvoiceItem((prevState) => ({
				...prevState,
				item_name: res.item_name,
				item_id: res.id,
				item_no: res.item_no,
				ActuallyQuantity: res.ActuallyQuantity,
				ExpiredDates: res.ExpiredDates,
				Exp_date: res.ExpiredDates[0]
					? res.ExpiredDates[0].Exp_date
					: "1/1/2050",
				p_tkl: res.p_tkl,
			}));
		},
		[InvoiceItem]
	);

	let submit = useCallback(
		async (e) => {
			e.preventDefault();
			let { m_no, item_id, grda } = InvoiceItem;
			let { e_date, e_no, nots } = Invoice;

			let err = validateForm(
				{ e_date, e_no, item_id, grda, m_no, nots },
				schema
			);
			console.log(err);
			if (Object.keys(err).length != 0) {
				setErrors(err);
				if (err.item_id) {
					notify(
						{ message: t("Item is Required"), width: 600 },
						"error",
						3000
					);
				} else if (err.grda) {
					notify(
						{
							message: t("The value cannot be less than zero."),
							width: 600,
						},
						"error",
						3000
					);
				} else {
					notify(
						{
							message: t("Complete the missing data."),
							width: 600,
						},
						"error",
						3000
					);
				}
				return;
			}
			await INVOICE_TRANSACTION({
				Invoice: { ...Invoice },
				InvoiceItems: [InvoiceItem],
				StoreID: InvoiceItem.m_no,
				InvoiceType: "ProductsInventory",
				ID: Invoice.ID ? Invoice.ID : 0,
			})
				.then(async (res) => {
					setInvoiceItemData([...InvoiceItemData, res.Item]);
					setInvoiceItem({
						...initialValueInvoiceItem,
						m_no: InvoiceItem.m_no,
					});
					setInvoice({
						...Invoice,
						ID: Invoice.ID ? Invoice.ID : res.id,
					});
					setErrors({});
					notify(
						{ message: t("Saved Successfully"), width: 600 },
						"success",
						3000
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
						notify(
							{ message: t("Failed Try again"), width: 450 },
							"error",
							2000
						);
					}
				);
		},
		[InvoiceItem, Invoice]
	);

	useEffect(() => {
		if (Invoice.ID) {
			setDisableInputs(true);
		} else {
			setDisableInputs(false);
		}
	}, [Invoice.ID]);
	let onDeleteFun = useCallback(async (e) => {
		onNew();
		return await DELETE_INVOICE(e);
	}, []);

	//////////////////////////////////////////////////////

	const [showHandHeld, setShowHandHeld] = useState(false);

	const handHeldHandle = useCallback(() => {
		setShowHandHeld(true);
	}, []);

	useEffect(() => {
		config({
			floatingActionButtonConfig: {
				icon: "add",
				closeIcon: "close",
				shading: false,
				direction: "up",
				maxSpeedDialActionCount: 15,
				position: {
					my: i18n.language === "en" ? "right bottom" : "left bottom",
					at: i18n.language === "en" ? "right bottom" : "left bottom",
					offset: i18n.language === "en" ? "-30 -30" : "30 -30",
				},
			},
		});
		repaintFloatingActionButton();
	}, [i18n.language]);

	return (
		<>
			{/* {showHandHeld && (
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
			)} */}

			<div
				dir={"auto"}
				className="row"
				style={{ display: "flex", justifyContent: "center", margin: 0 }}
			>
				<h1
					style={{ width: "90%", textAlign: "center", padding: "2%" }}
				>
					{t("Inventory goods")}
				</h1>

				<>
					<SpeedDialAction
						icon="fas fa-redo-alt"
						label={t("Rebalance Invoice")}
						index={3}
						visible={true}
						onClick={ResetProductsQuantities}
					/>
					<SpeedDialAction
						icon="fas fa-ticket-alt"
						label={t("Balance invoice")}
						index={3}
						visible={true}
						onClick={Accounttoggleup}
					/>

					<SpeedDialAction
						icon="far fa-trash-alt"
						label={t("Remove")}
						index={4}
						visible={true}
						onClick={onDelete}
					/>
					<SpeedDialAction
						icon="far fa-edit"
						label={t("Edit")}
						index={3}
						visible={true}
						onClick={onUpdate}
					/>
					<SpeedDialAction
						icon="far fa-plus-square"
						label={t("New")}
						index={8}
						visible={true}
						onClick={onNew}
					/>
					<SpeedDialAction
						icon="activefolder"
						label={t("HandHeld")}
						visible={true}
						index={9}
						onClick={handHeldHandle}
					/>
				</>

				<Popup
					maxWidth={1000}
					title={editDeleteStatus == "edit" ? t("Edit") : t("Delete")}
					minWidth={150}
					minHeight={500}
					showTitle={true}
					dragEnabled={false}
					closeOnOutsideClick={true}
					visible={dailog}
					onHiding={closePopup}
				>
					{/*     <EditDeleteScroll
          columnAttributes={columnAttributesEditDelet}
          // deleteItem={Delete_Invoice}
          close={closePopup}
          getEditData={setValuesEditDelete}
          editDeleteStatus={editDeleteStatus}
          APIMethod={get_other_invoices}
          APIPayload={useMemo(() => {
            return {};
          }, [])}
          remoteOperations={true}
          removeApiMethod={DELETE_INVOICE}
          removeApiPayload={useMemo(() => {
            return {};
          }, [])}
        />*/}
					<EditDelete
						data={data}
						columnAttributes={columnAttributesEditDelet}
						deleteItem={onDeleteFun}
						close={closePopup}
						editDeleteStatus={editDeleteStatus}
						getEditData={setValuesEditDelete}
					/>
				</Popup>
				<Popup
					maxWidth={1000}
					title={t("Account")}
					minWidth={150}
					minHeight={500}
					showTitle={true}
					dragEnabled={false}
					closeOnOutsideClick={true}
					visible={AccountPopup}
					onHiding={() => {
						setAccountPopup(false);
					}}
				>
					<EditDelete
						data={AccountData}
						columnAttributes={columnAttributesAccount}
						deleteItem={Delete_Invoice}
						close={closePopup}
						getEditData={ResetProductsQuantities}
					/>
				</Popup>
				<form
					onSubmit={submit}
					className="row"
					style={{ width: "100%", justifyContent: "center" }}
				>
					<div className="col-12 col-md-6 col-lg-3">
						<NumberBox
							label={t("Invoice Number")}
							value={Invoice.e_no}
							name="e_no"
							handleChange={handleChangeInvoice}
							required={false}
							validationErrorMessage={errors.e_no}
							editDeleteStatus={editDeleteStatus}
							disabled={DisableInputs}
						/>
					</div>
					<div className="col-12 col-md-6 col-lg-3">
						<DateTime
							label={t("Invoice Date")}
							value={Invoice.e_date}
							name="e_date"
							handleChange={handleChangeInvoice}
							required={false}
							validationErrorMessage={errors.e_date}
							editDeleteStatus={editDeleteStatus}
							disabled={DisableInputs}
						/>
					</div>
					<div className="col-12 col-md-6 col-lg-3">
						<TextBox
							label={t("Note")}
							value={Invoice.nots}
							name="nots"
							handleChange={handleChangeInvoice}
							required={false}
							editDeleteStatus={editDeleteStatus}
							validationErrorMessage={errors.nots}
							disabled={DisableInputs}
						/>
					</div>
					<div style={{ width: "95%" }}>
						<MasterTable
							dataSource={InvoiceItemData}
							height="400px"
							colAttributes={colAttributes}
							allowDelete={true}
							onRowRemoving={Delete_Invoice_item}
						/>
					</div>
					<MiscellaneousButtonBar
						errors={errors}
						Invoice={Invoice.ID}
						searchItemCallBackHandleStore={
							searchItemCallBackHandleStore
						}
						values={InvoiceItem}
						type={type}
						handleChange={handleChangeInvoiceItem}
					/>
				</form>
			</div>
		</>
	);
}
export default StoreInventory;
