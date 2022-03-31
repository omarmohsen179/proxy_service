import React, { useState, useCallback } from "react";
import { Button } from "devextreme-react/button";
import ScrollView from "devextreme-react/scroll-view";
import {
	COST_FOR_PURCHASES,
	NEXT_COST_PURCHASE_INVOICE,
	APPROVE_PURCHASE_INVOICES,
	COST_INVOICE_TRANSACTION,
	COSTS_FOR_COSTS_INVOICES,
	MATCH_COSTS_INVOICES,
} from "./PurchaseInvoiceExpensesAPI";
import notify from "devextreme/ui/notify";

import InputTableEdit from "../../../../../Components/SharedComponents/Tables Components/InputTableEdit";
import { NumberBox, SelectBox } from "../../../../../Components/Inputs";
import { useEffect } from "react";
import { useParams } from "react-router-dom";
import Add from "./Components/Add";
import TableCell from "../../../../../Components/Items/tableCell";
import { useHistory } from "react-router-dom";
import { useTranslation } from "react-i18next";
export default function PurchaseInvoicesExpenses({
	ID = 1,
	NUMBER = 3,
	setLinkedValue = (e) => {
		console.log(e);
	},
}) {
	const { t, i18n } = useTranslation();
	let [Values, setValues] = useState({});
	const [id, setid] = useState(0);
	const [number, setNumber] = useState(1);
	let [
		InvoiceCostForPurchasesInvoicesTable,
		setInvoiceCostForPurchasesInvoicesTable,
	] = useState([]);
	let [InvoicesCostsCosts, setInvoicesCostsCosts] = useState([]);
	let [dialog, setDialog] = useState(false);
	let col2 = [
		{
			caption: "من حساب",
			captionEn: "From Account",
			field: "hesab_name",
		},
		{
			caption: "في حساب",
			captionEn: "In Account",
			field: "name",
			readOnly: true,
		},
		{
			caption: "التاريخ ",
			captionEn: "Date",
			field: "dte",
			readOnly: true,
		},
		{
			caption: "القيمه",
			captionEn: "Amount",
			field: "kema",
			readOnly: true,
		},
		{
			caption: "العمله",
			captionEn: "Transaction",
			field: "omla",
			readOnly: true,
		},
		{
			caption: "م التحويل",
			captionEn: "Transfare",
			field: "x_rate",
			readOnly: true,
		},
		{ caption: "الملاحظه", field: "nots", readOnly: true },
		{
			caption: "تحميل المصريف",
			captionEn: "charge expenses",
			field: "ehtsab1",
			data: [
				{ id: 0, name: t("Item Price") },
				{ id: 1, name: t("Item Size") },
				{ id: 2, name: t("Item Weight") },
			],
		},
	];
	let col = [
		{
			caption: "رقم الفتورة",
			captionEn: "Invoice Number",
			field: "e_no",
			dataType: "number",
		},
		{
			caption: "التاريخ",
			captionEn: "Date",
			field: "e_date",
			widthRatio: "120",
			dataType: "date",
		},
		{
			caption: "المورد ",
			captionEn: " supplier",
			field: "name",
			dataType: "number",
		},
		{ caption: "السعر ", captionEn: " Price", field: "ex_rate" },
		{ caption: "الأجمالي", captionEn: " Total", field: "tottal" },

		{
			caption: "بعد التحويل",
			captionEn: "After conversion",
			field: "safi",
		},
		{
			dataType: "button",
			text: "الغأ الربط",
			func: async (e) => {
				await MATCH_COSTS_INVOICES(0, e.id)
					.then((res) => {
						trans();
						notify(
							{ message: t("Saved Successfully"), width: 450 },
							"success",
							2000
						);
						if (number == NUMBER) {
							setLinkedValue(0);
						}
					})
					.catch((err) => {
						console.log(err);
					});
			},
		},
	];

	let trans = async () => {
		// get All page data
		let costReq = await COST_FOR_PURCHASES(number);
		let res = await COSTS_FOR_COSTS_INVOICES(number);
		setInvoiceCostForPurchasesInvoicesTable(costReq.data);
		setInvoicesCostsCosts(res.data);
		setValues({
			InvoicesTotal: costReq.InvoicesTotal ? costReq.InvoicesTotal : 0,
			CostsTotal: res.CostsTotal ? res.CostsTotal : 0,
			all:
				res.CostsTotal && costReq.InvoicesTotal
					? (
							parseFloat(res.CostsTotal) /
							parseFloat(costReq.InvoicesTotal)
					  ).toFixed(2)
					: 0,
			costInvoiceNumber: number,
		});
	};
	useEffect(async () => {
		console.log("new");
		trans();
	}, [number, id]);
	useEffect(async () => {
		if (NUMBER && NUMBER > 0) {
			setNumber(NUMBER);
		} else {
			let nextNumber = await NEXT_COST_PURCHASE_INVOICE();
			if (nextNumber) {
				setNumber(nextNumber.NextCostPurchasesInvoicesNumber);
			}
		}

		if (ID) {
			setid(ID);
		}
	}, [ID, NUMBER]);
	let ondelete = async (e) => {
		//delete from InvoicesCostsCosts
		await COST_INVOICE_TRANSACTION(0, e.data.id, e.data.ehtsab)
			.then((res) => {
				console.log(res);
			})
			.catch((err) => {
				e.cancel = true;
			});
	};
	return (
		<div
			dir="rtl"
			className="row"
			style={{ display: "flex", justifyContent: "center", margin: 0 }}
		>
			<div style={{ width: "20%" }}>
				<TableCell label="رقم الفاتوره" value={number} />
			</div>
			<ScrollView height="100%" scrollByContent={true}>
				<div
					className="w-100 grid-container"
					style={{ padding: "10px" }}
					dir="auto"
				>
					<Button
						className="mx-1 buttonStyle"
						stylingMode="outlined"
						width="12%"
						text=" جديد"
						icon="fas fa-plus"
						type="success"
						rtlEnabled={true}
						onClick={async (e) => {
							let nextNumber = await NEXT_COST_PURCHASE_INVOICE();
							if (nextNumber) {
								setNumber(
									nextNumber.NextCostPurchasesInvoicesNumber
								);
								trans();
							}
							//  history.push(`/user/PurchaseInvoicesExpenses/${id}/${}`);
						}}
					/>

					<Button
						className="mx-1 buttonStyle"
						stylingMode="outlined"
						width={"12%"}
						text="سابق"
						type="default"
						icon="fas fa-forward"
						rtlEnabled={true}
						onClick={async (e) => {
							if (number > 1) {
								setNumber(parseInt(number) - 1);
								//   history.push(`/user/PurchaseInvoicesExpenses/${id}/${number-1}`);
							}
							//  history.push(`/user/PurchaseInvoicesExpenses/${id}/${parseInt(number)+1}`);
						}}
					/>

					<Button
						className="mx-1 buttonStyle"
						stylingMode="outlined"
						width={"12%"}
						text={t("Next")}
						type="default"
						icon="fas fa-backward"
						rtlEnabled={true}
						onClick={async (e) => {
							let nextNumber = await NEXT_COST_PURCHASE_INVOICE();
							if (
								number <
									nextNumber.NextCostPurchasesInvoicesNumber &&
								nextNumber
							) {
								setNumber(parseInt(number) + 1);
							}
						}}
					/>
					<Button
						className="mx-1 buttonStyle"
						stylingMode="outlined"
						width={"12%"}
						text={t("Print")}
						type="danger"
						icon="fas fa-print"
						rtlEnabled={true}
						onClick={(e) => {}}
					/>
					<Button
						className="mx-1 buttonStyle"
						stylingMode="outlined"
						rtlEnabled={true}
						onClick={async (e) => {
							await MATCH_COSTS_INVOICES(number, id)
								.then((res) => {
									trans();
									notify(
										{
											message: t("Saved Successfully"),
											width: 450,
										},
										"success",
										2000
									);
									setLinkedValue(number);
								})
								.catch((err) => {
									console.log(err);
									notify(
										{
											message: t("Failed Try again"),
											width: 600,
										},
										"error",
										3000
									);
								});
						}}
						width={"12%"}
						text="الربط"
						icon="fas fa-link"
					/>
				</div>

				<ScrollView height="100%" scrollByContent={true}>
					<InputTableEdit
						height="250px"
						style={{ width: "20%" }}
						dataSource={InvoiceCostForPurchasesInvoicesTable}
						colAttributes={col}
						filterRow={false}
					/>
					<div
						className="double"
						style={{
							padding: "2%",
							display: "flex",
							justifyContent: "center",
						}}
					>
						{" "}
						<div className="col-lg-6 col-md-6 col-sm-12">
							<TableCell
								label="اجمالي"
								value={Values["InvoicesTotal"]}
							/>
						</div>
					</div>
					<div style={{ width: "100%" }}>
						<InputTableEdit
							Uicon
							dataSource={InvoicesCostsCosts}
							colAttributes={col2}
							height={"300px"}
							canUpdate={true}
							canDelete={true}
							filterRow={false}
							onRowRemoving={ondelete}
						/>
					</div>
					<div
						className="row"
						style={{
							justifyContent: "center",
							display: "flex",
							width: "100%",
							padding: "10px",
						}}
					>
						<Button
							icon="fas fa-plus"
							style={{ width: "10%" }}
							text=""
							onClick={() => {
								setDialog(true);
							}}
							type="defualt"
							stylingMode="contained"
						/>
					</div>
				</ScrollView>
				<div
					className="double"
					style={{
						padding: "10px",
						display: "flex",
						justifyContent: "center",
					}}
				>
					{" "}
					<div className="col-lg-4 col-md-6 col-sm-12">
						<TableCell
							label="اجمالي الفواتير"
							value={Values["CostsTotal"]}
						/>
					</div>
					<div className="col-lg-4 col-md-6 col-sm-12">
						<TableCell
							label="معدل ارتفاع الدينار"
							value={Values["all"]}
						/>
					</div>
				</div>
				<div
					className="row"
					style={{
						justifyContent: "center",
						display: "flex",
						width: "100%",
						padding: "10px",
					}}
				>
					<div className="col-4">
						<Button
							style={{ width: "100%" }}
							text="اعتماد التكاليف"
							onClick={async () => {
								await APPROVE_PURCHASE_INVOICES(number)
									.then(() => {
										notify(
											{
												message:
													"تم اعتماد التكاليف  بنجاح",
												width: 450,
											},
											"success",
											2000
										);
										trans();
									})
									.catch((err) => {
										notify(
											{
												message: "هناك خطأ في البيانات",
												width: 600,
											},
											"error",
											3000
										);
									});
							}}
							type="success"
							stylingMode="contained"
						/>
					</div>
				</div>
				<Add
					visible={dialog}
					togglePopup={() => {
						setDialog(false);
					}}
					onclickRow={async (e) => {
						console.log(e);
						try {
							await COST_INVOICE_TRANSACTION(
								Values["costInvoiceNumber"],
								e.ID,
								e.ehtsab_1
							);
							let res = await COSTS_FOR_COSTS_INVOICES(
								Values["costInvoiceNumber"]
							);
							setInvoicesCostsCosts(res.data);
							notify(
								{ message: t("Add Successfully"), width: 450 },
								"success",
								2000
							);
							setDialog(false);
						} catch (err) {
							notify(
								{ message: t("Failed Try again"), width: 450 },
								"error",
								2000
							);
						}
					}}
					togglePopup={setDialog}
				/>
			</ScrollView>
		</div>
	);
}
