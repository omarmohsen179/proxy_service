import React, { useEffect, useState } from "react";
import { Button } from "devextreme-react/button";
import DateBox from "devextreme-react/date-box";
import {
	TextBox,
	NumberBox,
	SelectBox,
	CheckBox,
	DateTime,
} from "../../../Components/Inputs";
import ItemTransactionsTable from "./Components/ItemTransactionsTable";
import { GET_REPORT_ITEM_TRANSACTIONS } from "./ItemMovementsAPI";

import TableCell from "../../../Components/Items/tableCell";
import UpperLabel from "../../../Components/Items/upperLabel";
import { GET_CASHIER_STORES } from "../../../Services/ApiServices/SalesBillAPI";
import { useCallback } from "react";

import SearchItem from "../../Items/SearchItem";
import {
	selectVisible,
	setItem,
	setVisible,
} from "../../../Store/Items/ItemsSlice";
import { useDispatch, useSelector } from "react-redux";
import { useTranslation } from "react-i18next";

let subtractMonthes = (num) => {
	let date = new Date(Date.now());
	let month = date.getMonth() - num;
	date.setMonth(month);
	return date;
};

const ItemMovements = ({ id }) => {
	let dispatch = useDispatch();
	let visible = useSelector(selectVisible);
	let [values, setValues] = useState({
		storeID: 0,
		toDate: new Date(Date.now()).toLocaleDateString(),
		fromDate: subtractMonthes(1).toLocaleDateString(),
	});
	let [data, setData] = useState({});
	let [stores, setStores] = useState([]);
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
	const { t, i18n } = useTranslation();
	const searchItemCallBackHandle = useCallback(async (id) => {
		handleStoreChange({ name: "itemId", value: id });
	}, []);
	useEffect(async () => {
		if (!id) {
			handleStoreChange({ name: "itemId", value: 0 });
		} else {
			handleStoreChange({ name: "itemId", value: id });
		}

		let x = await GET_CASHIER_STORES();
		stores = [{ id: 0, name: t("All") }, ...x];
		setStores(stores);
	}, []);
	useEffect(async () => {
		if (!id) {
			setValues({
				itemId: 0,
				storeID: values.storeID,
				toDate: new Date(Date.now()).toLocaleDateString(),
				fromDate: subtractMonthes(1).toLocaleDateString(),
			});
		} else {
			setValues({
				itemId: id,
				storeID: values.storeID,
				toDate: new Date(Date.now()).toLocaleDateString(),
				fromDate: subtractMonthes(1).toLocaleDateString(),
			});
		}
	}, [id]);

	let handleDateChange = useCallback(
		({ name, value }) => {
			let date = new Date(value);
			setValues((values) => ({
				...values,
				[name]: date.toLocaleDateString(),
			}));
		},
		[values]
	);

	let handleStoreChange = useCallback(
		({ name, value }) => {
			setValues((values) => ({ ...values, [name]: value }));
		},
		[values]
	);
	let ApiFun = useCallback(async (e) => {
		let da = await GET_REPORT_ITEM_TRANSACTIONS(e);
		setData(da);
		return da;
	}, []);
	return (
		<div className="container-xxl card p-3">
			{/*<UpperLabel label='كشف حركة الصنف' />*/}
			<div className="row mx-3" dir="rtl">
				<div style={{ padding: "10px" }}>
					{id ? null : (
						<button
							style={{
								height: "36px",
							}}
							className="col-12 btn btn-outline-dark btn-outline"
							onClick={togglePopup}
						>
							<span className="">{t("Choose species")}</span>
						</button>
					)}
				</div>

				<div className="one col-3">
					<div className="label">{t("From")}</div>
					<DateBox
						defaultValue={values.fromDate}
						onValueChanged={({ value }) =>
							handleDateChange({ name: "fromDate", value })
						}
					/>
				</div>
				<div className="one col-3">
					<div className="label">{t("to")}</div>
					<DateBox
						defaultValue={values.toDate}
						onValueChanged={({ value }) =>
							handleDateChange({ name: "toDate", value })
						}
						min={values.fromDate}
					/>
				</div>
				<div dir="rtl " className="col-4">
					<SelectBox
						dataSource={stores}
						label={t("store")}
						name="storeID"
						handleChange={handleStoreChange}
						value={values.storeID}
					/>
				</div>
			</div>

			{!id && (
				<SearchItem
					togglePopup={togglePopup}
					callBack={searchItemCallBackHandle}
					visible={visible}
				/>
			)}

			<div className="row m-3" dir="rtl">
				<div className="col-5">
					<TableCell label={t("Name")} value={data.ItemName} />
				</div>
				<div className="col-2">
					<TableCell
						label={t("Quantity")}
						value={data.ItemQuantity}
					/>
				</div>
				<div className="col-3">
					<Button
						type="default"
						className="mx-1"
						stylingMode="outlined"
						text={t("average cost price")}
						icon="fas fa-chart-bar"
						width={"100%"}
						rtlEnabled={true}
					/>
				</div>
				<div className="col-2">
					<Button
						type="default"
						className="mx-1"
						stylingMode="outlined"
						text={t("average selling price")}
						icon="fas fa-chart-bar"
						width={"100%"}
						rtlEnabled={true}
					/>
				</div>
			</div>

			<div className="row px-3">
				<ItemTransactionsTable apiPayload={values} API={ApiFun} />
			</div>

			<div className="double center m-3" dir="rtl">
				<div className="double">
					<div className="double">
						<div className="label">{t("total incoming")}</div>
						<div className="border py-1 green">
							{data.EnterQuantity || 0}
						</div>
					</div>

					<div className="double">
						<div className="label ">{t("total outlay")}</div>
						<div className="border py-1 red">
							{data.OutQuantity || 0}
						</div>
					</div>
				</div>
			</div>

			<div className="item-transaction border mx-3 p-3">
				<TableCell
					label={t("total purchases")}
					value={data.PurchasesTotal || 0}
					color="green"
				/>
				<TableCell
					label={t("total sales")}
					value={data.SalesTotal || 0}
					color="red"
				/>
				<TableCell
					label={t("Rebalance +")}
					value={data.OverQuantity || 0}
					color="green"
				/>
				<TableCell
					label={t("Destruction of materials")}
					value={data.DamageTotal || 0}
					color="red"
				/>
				<TableCell
					label={t("Sales Return")}
					value={data.ReturnSalesTotal || 0}
					color="green"
				/>
				<TableCell
					label={t("Return Purchases")}
					value={data.ReturnPurchasesTotal || 0}
					color="red"
				/>
				<TableCell
					label={t("Rebalance-")}
					value={data.UnderQuantity || 0}
					color="red"
				/>
				<TableCell
					label={t("existing value")}
					value={data.ItemQuantity || 0}
					color="green"
				/>
				<TableCell
					label={t("Intial Balance")}
					value={data.BeginAmount || 0}
					color="green"
				/>
				<TableCell
					label={t("Win Item")}
					value={data.ItemProfite || 0}
					color="green"
				/>
				<TableCell
					label={t("Average Selling")}
					value={data.AvergeSales || 0}
				/>
				<TableCell label={t("Cost")} value={data.ItemCost || 0} />
			</div>
		</div>
	);
};

export default ItemMovements;
