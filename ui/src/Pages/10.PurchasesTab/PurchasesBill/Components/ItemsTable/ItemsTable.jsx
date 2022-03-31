import notify from "devextreme/ui/notify";
import React, { useCallback } from "react";
import { useTranslation } from "react-i18next";
import MasterTable from "../../../../../Components/SharedComponents/Tables Components/MasterTable";
import { DELETE_INVOICE_ITEM } from "./API.ItemsTable";

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
    const itemColAttributes = [
      {
        field: "m_name",
        caption: "المخزن",
        captionEn: "Store",
      },
      {
        field: "item_no",
        caption: "رقم الصنف",
        alignment: "center",
        captionEn: "Item Number",
      },
      { field: "item_name", captionEn: "Item Name", caption: "اسم الصنف" },
      { field: "code_no", captionEn: "Part Number", caption: "رقم القطعة" },
      { field: "kmea", caption: "الكمية", captionEn: "Quantity" },
      {
        field: "price",
        caption: "السعر",
        captionEn: "Price",
        format: "currency",
      },
      {
        field: "TotalAfterDiscount",
        caption: "الإجمالي بعد الخصم",
        caption: "Total After Discount",
        format: "currency",
      },
    ];

    const itemSummaryItems = [
      {
        column: "TotalAfterDiscount",
        summaryType: "sum",
        valueFormat: "currency",
        cssClass: "summaryNetSum",
        showInColumn: "TotalAfterDiscount",
        customizeText: (data) => {
          return t("Total") + `: ${data.value} `;
        },
      },
      {
        column: "TotalAfterDiscount",
        summaryType: "sum",
        valueFormat: "currency",
        cssClass: "summaryNetSum",
        showInColumn: "TotalAfterDiscount",
        customizeText: (data) => {
          return `الخصم:  ${discount}    `;
        },
      },
      {
        column: "TotalAfterDiscount",
        summaryType: "sum",
        valueFormat: "currency",
        cssClass: "summaryNetSum",
        showInColumn: "TotalAfterDiscount",
        customizeText: (data) => {
          let value = data.value - discount;

          return `الصافي: ${value} `;
        },
      },
    ];
    const { t, i18n } = useTranslation();
    const rowRemovingHandle = useCallback(
      async (e) => {
        e.cancel = true;
        e.data &&
          e.data.ID &&
          (await DELETE_INVOICE_ITEM(invoiceType, invoiceId, e.data.ID)
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
                  message: t("Add Successfully"),
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
        <div className="px-4 py-3 col-12">
          <MasterTable
            disabled={disabled}
            allowDelete
            allowExcel
            dataSource={items}
            colAttributes={itemColAttributes}
            summaryItems={itemSummaryItems}
            onRowDoubleClick={rowDoubleClickHandle}
            onRowRemoving={(e) => rowRemovingHandle(e)}
          />
        </div>
      </>
    );
  }
);
