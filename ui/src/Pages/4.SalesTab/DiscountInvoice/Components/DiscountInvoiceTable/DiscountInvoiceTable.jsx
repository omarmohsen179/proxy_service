import React, { useCallback } from "react";
import notify from "devextreme/ui/notify";
import MasterTable from "../../../../../Components/SharedComponents/Tables Components/MasterTable";
import "./discountInvoiceTable.css";
import { DELETE_DISCOUNT_INVOICE_ITEM } from "../../API.DiscountInvoice";

const DiscountInvoiceTable = ({
  items,
  updateItems,
  invoiceId,
  rowDoubleClickHandle,
  disabled,
}) => {
  const itemColAttributes = [
    {
      field: "item_no",
      caption: "رقم الصنف",
      alignment: "center",
    },
    { field: "item_name", caption: "اسم الصنف" },
    { field: "all_kmea", caption: "اجمالي الكمية" },
    { field: "old_price", caption: "السعر السابق", format: "currency" },
    { field: "kmea", caption: "الكمية" },
    {
      field: "price",
      caption: "السعر",
      format: "currency",
    },
  ];

  const rowRemovingHandle = useCallback(
    (e) => {
      e.cancel = true;
      e.data &&
        e.data.ID &&
        DELETE_DISCOUNT_INVOICE_ITEM(invoiceId, e.data.ID)
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
          });
    },
    [invoiceId, items, updateItems]
  );
  return (
    <div className="px-4 py-3 col-12">
      <MasterTable
        disabled={disabled}
        allowDelete
        allowExcel
        dataSource={items}
        colAttributes={itemColAttributes}
        onRowDoubleClick={rowDoubleClickHandle}
        onRowRemoving={(e) => rowRemovingHandle(e)}
      />
    </div>
  );
};

export default React.memo(DiscountInvoiceTable);
