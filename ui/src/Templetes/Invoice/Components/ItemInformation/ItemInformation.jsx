import React, { useCallback, useMemo, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { selectVisible, setVisible } from "../../../../Store/Items/ItemsSlice";
import { GET_ITEM_INFO } from "./API.ItemInformation";
import {
	TextBox,
	NumberBox,
	DateBox,
	SelectBox,
} from "../../../../Components/Inputs";
import notify from "devextreme/ui/notify";
import { Button, CheckBox } from "devextreme-react";
import { UPDATE_INVOICE_DISCOUNT } from "../../../../Services/ApiServices/SalesBillAPI";
import SearchItem from "../../../../Pages/Items/SearchItem";
import { useTranslation } from "react-i18next";
const ItemInformation = ({
	billInformation,
	updateBillInformation,
	updateBillState,
	errors,
	stores,
	updateErrors,
	selectedItem,
	setSelectedItem,
	updatedItem,
	setUpdatedItem,
	updateItemInformation,
	itemEditMode,
	selectedAccountId,
	addItemToInvoice,
	isReturnTypeInvoice,
	fastInputItemNumber,
	setFastInputItemNumber,
}) => {
	let dispatch = useDispatch();
	let visible = useSelector(selectVisible);
	const { t, i18n } = useTranslation();

	//? ────────────────────────────────────────────────────────────────────────────────
	//? ─── STATES ─────────────────────────────────────────────────────────────────────
	//? ────────────────────────────────────────────────────────────────────────────────

	//* ────────────────────────────────────────────────────────────────────────────────
	//* ─── CALLBACKS ──────────────────────────────────────────────────────────────────
	//* ────────────────────────────────────────────────────────────────────────────────

	// Calling Api to get item informations by using id or barcode
	const getItemInfo = useCallback(
		//? idType = "ItemID" || 'ItemBarcode'
		(value, idType = "ItemID") => {
			billInformation.storeId &&
				GET_ITEM_INFO(billInformation.storeId, value, idType)
					.then((item) => {
						updateErrors();
						setSelectedItem(item);
						setUpdatedItem({
							item_id: item.id,
							Quantity: item.Quantity,
							p_tkl: item.p_tkl,
							Boxs: item.Boxs,
							itemBox_id: item.Boxs[0].id_s,
							Box_id: item.Boxs[0].box,
							unit_id: item.Boxs[0].unit_id,
							price: item.Boxs[0][billInformation.itemPrice],
							sum_box: item.Boxs[0].box,
							kmea: item.Boxs[0].box / (item.Boxs[0].box ?? 1),
							m_no: billInformation.storeId,
							emp_id: billInformation.emp_id,
							mosawiq_nesba: billInformation.mosawiq_nesba,
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
						});
					})
					.catch((error) => {
						console.log(error);
						notify(
							{
								message: `حدث خطأ`,
								width: 450,
							},
							"error",
							2000
						);
					});
		},
		[
			billInformation.emp_id,
			billInformation.itemPrice,
			billInformation.mosawiq_nesba,
			billInformation.storeId,
			setSelectedItem,
			setUpdatedItem,
			updateErrors,
		]
	);

	// Handling Enter key pressing on item number input
	const barcodeHandle = useCallback(
		({ value }) => {
			// get item informations
			billInformation.storeId &&
				GET_ITEM_INFO(billInformation.storeId, value, "ItemBarcode")
					.then((item) => {
						updateErrors();
						let _item = {
							item_id: item.id,
							p_tkl: item.p_tkl,
							Boxs: item.Boxs,
							itemBox_id: item.Boxs[0].id_s,
							Box_id: item.Boxs[0].box,
							unit_id: item.Boxs[0].unit_id,
							price: item.Boxs[0][billInformation.itemPrice],
							sum_box: item.Boxs[0].box,
							kmea: item.Boxs[0].box / (item.Boxs[0].box ?? 1),
							m_no: billInformation.storeId,
							emp_id: billInformation.emp_id,
							mosawiq_nesba: billInformation.mosawiq_nesba,
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
					})
					.finally(() => {
						setFastInputItemNumber(null);
					});
		},
		[
			addItemToInvoice,
			billInformation.emp_id,
			billInformation.itemPrice,
			billInformation.mosawiq_nesba,
			billInformation.storeId,
			setFastInputItemNumber,
			setUpdatedItem,
			updateErrors,
		]
	);

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

	// Callback to fire getItemInfo on row doubleClick in searchItemPopup
	const searchItemCallBackHandle = useCallback(
		(id) => {
			getItemInfo(id, "ItemID");
		},
		[getItemInfo]
	);

	//? ────────────────────────────────────────────────────────────────────────────────
	//? ─── EFFECTS ────────────────────────────────────────────────────────────────────
	//? ────────────────────────────────────────────────────────────────────────────────

	//? Works on SearchItemCallBack to set SelectedItem and Updated Item
	useEffect(() => {
		billInformation.storeId &&
			updatedItem.item_id &&
			(!itemEditMode
				? getItemInfo(updatedItem.item_id, "ItemID")
				: setUpdatedItem({ m_no: billInformation.storeId }));
	}, [billInformation.storeId]);

	useEffect(() => {
		let boxs = updatedItem.Boxs ? updatedItem.Boxs : selectedItem.Boxs;
		if (boxs && updatedItem.itemBox_id) {
			let box = boxs.find((box) => box.id_s == updatedItem.itemBox_id);
			box &&
				setUpdatedItem({
					Box_id: box.box,
					unit_id: box.unit_id,
					price: updatedItem.price ?? box[billInformation.itemPrice],
					sum_box: 1 * updatedItem.kmea * (box.box ?? 1),
				});
			if (errors) {
				let updatedErrors = { ...errors };
				delete updatedErrors.price;
				delete updatedErrors.sum_box;
				delete updatedErrors.kmea;
				updateErrors(updatedErrors);
			}
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [billInformation.itemPrice, selectedItem.Boxs, updatedItem.itemBox_id]);

	useEffect(() => {
		if (updatedItem.sum_box) {
			setUpdatedItem({
				kmea: updatedItem.sum_box / (updatedItem.Box_id ?? 1),
			});
		} else {
			setUpdatedItem({ kmea: 0 });
		}
	}, [updatedItem.sum_box]);

	useEffect(() => {
		if (updatedItem.kmea) {
			setUpdatedItem({
				sum_box: 1 * updatedItem.kmea * (updatedItem.Box_id ?? 1),
			});
		} else {
			setUpdatedItem({ sum_box: 0 });
		}
	}, [updatedItem.kmea]);

	useEffect(() => {
		fastInputItemNumber &&
			barcodeHandle({ value: fastInputItemNumber.itemNumber });
	}, [fastInputItemNumber]);

	//* ────────────────────────────────────────────────────────────────────────────────
	//* ─── MEMOs ──────────────────────────────────────────────────────────────────────
	//* ────────────────────────────────────────────────────────────────────────────────
	const discountButtonOptions = useMemo(() => {
		return {
			text: "تحديث الخصم",
			icon: "undo",
			type: "normal",
			stylingMode: "text",
			disabled: billInformation.id === 0,
			onClick: () => {
				let updatedInvoice = {
					Data: [
						{
							InvoiceType: billInformation.invoiceType,
							ID: billInformation.id,
							InvoiceDiscount: {
								dis: billInformation.dis,
								dis_type: billInformation.dis_type,
							},
						},
					],
				};
				UPDATE_INVOICE_DISCOUNT(updatedInvoice)
					.then(({ InvoiceDiscount }) => {
						updateBillState({ InvoiceDiscount: InvoiceDiscount });
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
						updateErrors(responseErrors);
					});
			},
		};
	}, [
		billInformation.dis,
		billInformation.dis_type,
		billInformation.id,
		billInformation.invoiceType,
		updateBillState,
		updateErrors,
	]);

	return (
		<>
			<SearchItem
				togglePopup={togglePopup}
				visible={visible}
				callBack={searchItemCallBackHandle}
			/>

			<div className="row px-3 py-2">
				{(!isReturnTypeInvoice || billInformation.num_sale === "0") && (
					<div className="col-3">
						<button
							disabled={
								itemEditMode ||
								!selectedAccountId ||
								!billInformation.storeId ||
								!billInformation.mosweq_id ||
								(billInformation.id &&
									!billInformation.readOnly)
							}
							style={{
								height: "36px",
							}}
							className="col-12 btn btn-outline-dark btn-outline"
							onClick={togglePopup}
						>
							<span>{t("Choose species")}</span>
						</button>
					</div>
				)}

				<div className="col-3">
					<SelectBox
						readOnly={
							billInformation.id && !billInformation.readOnly
						}
						label={t("Store")}
						dataSource={stores}
						name="storeId"
						value={billInformation.storeId}
						handleChange={updateBillInformation}
					/>
				</div>

				<div className="col-5">
					<NumberBox
						required={false}
						validationErrorMessage={errors.dis}
						label={t("Discount on the invoice")}
						value={billInformation.dis}
						name="dis"
						handleChange={updateBillInformation}
						buttonOptions={discountButtonOptions}
					/>
				</div>
				<CheckBox
					className="col-1"
					value={billInformation.dis_type}
					name="dis_type"
					onValueChanged={(e) =>
						updateBillInformation({
							name: "dis_type",
							value: !billInformation.dis_type,
						})
					}
				/>

				<div className="col-3">
					<TextBox
						label={t("Item Number")}
						readOnly={
							itemEditMode ||
							!selectedAccountId ||
							!billInformation.storeId ||
							!billInformation.mosweq_id ||
							(billInformation.id && !billInformation.readOnly)
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
						label={t("Package")}
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
							label={t("Expiry")}
							validationErrorMessage={errors.Exp_date}
							dataSource={
								selectedItem.ExpiredDates.length > 0
									? selectedItem.ExpiredDates
									: [
											{
												Exp_date: "1/1/2050",
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
						label={t("Amount Package ")}
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
						value={updatedItem.price ?? 0}
						handleChange={updateItemInformation}
					/>
				</div>

				<div className="col-3">
					<NumberBox
						required={false}
						validationErrorMessage={errors.dis1}
						label={t("Discount")}
						name="dis1"
						value={updatedItem.dis1 ?? 0}
						handleChange={updateItemInformation}
					/>
				</div>
			</div>
		</>
	);
};

export default React.memo(ItemInformation);
