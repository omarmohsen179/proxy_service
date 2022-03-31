import notify from "devextreme/ui/notify";
import React, { useRef, useCallback, useMemo } from "react";
import { useTranslation } from "react-i18next";
import MasterTable from "../../../../Components/SharedComponents/Tables Components/MasterTable";
import { DELETE_OFFERS_BILL_ITEM } from "../API.OffersBills";

const OffersBillsTable = ({
  items,
  updateItems,
  invoiceId,
  rowDoubleClickHandle,
  disabled,
}) => {
  const { t, i18n } = useTranslation();
  const itemColAttributes = useRef([
    {
      field: "item_no",
      caption: "رقم الصنف",
    },
    { field: "item_name", caption: "اسم الصنف", captionEn: "Item Name" },
    { field: "item_name_e", caption: "اسم الأجنبي", captionEn: "English Name" },
    { field: "code_no", caption: "رقم القطعة", captionEn: "Part Number" },
    { field: "Exp_Date", caption: "تاريخ الصلاحية", captionEn: "Expiry" },
    { field: "kmea", caption: "الكمية", captionEn: "Quantity" },
    { field: "price", caption: "السعر", captionEn: "Price" },
    {
      field: "total",
      caption: "الإجمالي",
      captionEn: "Total",
      format: "currency",
    },
  ]);

  const itemSummaryItems = useMemo(() => {
    return [
      {
        column: "total",
        summaryType: "sum",
        valueFormat: "currency",
        cssClass: "summaryNetSum",
        showInColumn: "total",
        customizeText: (data) => {
          return t("Total") + `: ${parseFloat(data.value).toFixed(3)} `;
        },
      },
    ];
  }, []);

  const rowRemovingHandle = useCallback(
    async (e) => {
      e.cancel = true;
      e.data &&
        e.data.ID &&
        (await DELETE_OFFERS_BILL_ITEM(invoiceId, e.data.ID)
          .then(async (response) => {
            let updatedItems = [...items];

            let index = updatedItems.indexOf(e.data);
            if (~index) {
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
                message: `${error}`,
                width: 450,
              },
              "error",
              2000
            );
          }));
    },
    [invoiceId, items, updateItems]
  );

  return (
    <>
      <div className="px-2 col-12">
        <MasterTable
          disabled={disabled}
          allowDelete
          allowExcel
          dataSource={items}
          height={items?.length > 3 ? "500px" : "300px"}
          colAttributes={itemColAttributes.current}
          summaryItems={itemSummaryItems}
          onRowDoubleClick={rowDoubleClickHandle}
          onRowRemoving={(e) => rowRemovingHandle(e)}
        />
      </div>
    </>
  );
};

export default React.memo(OffersBillsTable);
