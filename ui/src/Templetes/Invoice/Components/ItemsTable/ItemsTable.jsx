import React, { useCallback, useMemo, useRef } from "react";
import notify from "devextreme/ui/notify";
import Accordion from "devextreme-react/accordion";
import MasterTable from "../../../../Components/SharedComponents/Tables Components/MasterTable";
import { DELETE_INVOICE_ITEM } from "./API.ItemsTable";
import { useTranslation } from "react-i18next";

export const ItemsTable = React.memo(
	({
		items,
		updateItems,
		invoiceId,
		invoiceType,
		rowDoubleClickHandle,
		discount = 0,
		disabled,
	}) => {
		const { t, i18n } = useTranslation();
		const itemColAttributes = useRef([
			{
				field: "m_name",
				caption: "المخزن",
				captionEn: "Store",
			},
			{
				field: "item_no",
				caption: "رقم الصنف",
				captionEn: "Number",
				alignment: "center",
			},
			{ field: "item_name", captionEn: "Name", caption: "اسم الصنف" },
			{
				field: "code_no",
				captionEn: "Part Number",
				caption: "رقم القطعة",
			},
			{ field: "kmea", caption: "الكمية", captionEn: "Quantity" },
			{
				field: "price",
				caption: "السعر",
				captionEn: "Price",
				format: "currency",
			},
			{
				field: "PriceByMontyType",
				caption: "السعر بعد التحويل",
				captionEn: "Price Ex.",
				format: "currency",
			},
			{
				field: "TotalPriceByMontyType",
				caption: "الإجمالي بعد التحويل",
				captionEn: "Total Ex.",
				format: "currency",
			},
		]);

		const itemSummaryItems = useMemo(() => {
			return [
				{
					column: "TotalPriceByMontyType",
					summaryType: "sum",
					valueFormat: "currency",
					cssClass: "summaryNetSum",
					showInColumn: "TotalPriceByMontyType",
					customizeText: (data) => {
						return `${t("Total")}: ${parseFloat(data.value).toFixed(
							3
						)} `;
					},
				},
				{
					column: "TotalPriceByMontyType",
					summaryType: "sum",
					valueFormat: "currency",
					cssClass: "summaryNetSum",
					showInColumn: "TotalPriceByMontyType",
					customizeText: (data) => {
						return `${t("Discount")}:  ${parseFloat(
							discount
						).toFixed(3)}    `;
					},
				},
				{
					column: "TotalPriceByMontyType",
					summaryType: "sum",
					valueFormat: "currency",
					cssClass: "summaryNetSum",
					showInColumn: "TotalPriceByMontyType",
					customizeText: (data) => {
						let value = data.value - discount;
						return `${t("Net")}: ${parseFloat(value).toFixed(3)} `;
					},
				},
			];
		}, [discount, t]);

		const rowRemovingHandle = useCallback(
			async (e) => {
				e.cancel = true;
				e.data &&
					e.data.ID &&
					(await DELETE_INVOICE_ITEM(
						invoiceType,
						invoiceId,
						e.data.ID
					)
						.then(async (response) => {
							let updatedItems = [...items];

							let index = updatedItems.indexOf(e.data);

							if (~index) {
								//   items.length === 1 && setNewInvoice();
								updatedItems.splice(index, 1);
								updateItems(updatedItems);
							}

							// Stop Editing
							await e.component.refresh(true);

							// Notify user
							notify(
								{
									message: t("Deleted Successfully"),
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
									message: `${t("Failed Try again")}`,
									width: 450,
								},
								"error",
								2000
							);
						}));
			},
			[invoiceId, invoiceType, items, updateItems]
		);

		return (
			<>
				<div className="px-2 col-12">
					<MasterTable
						disabled={disabled}
						allowDelete
						allowExcel
						dataSource={items}
						height={items.length > 3 ? "500px" : "300px"}
						colAttributes={itemColAttributes.current}
						summaryItems={itemSummaryItems}
						onRowDoubleClick={rowDoubleClickHandle}
						onRowRemoving={(e) => rowRemovingHandle(e)}
					/>
				</div>
			</>
		);
	}
);
