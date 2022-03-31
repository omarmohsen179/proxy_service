import React, { useCallback, useRef } from "react";
import notify from "devextreme/ui/notify";
import Accordion from "devextreme-react/accordion";
import MasterTable from "../../../Components/SharedComponents/Tables Components/MasterTable";

export const ItemsToReturnTable = React.memo(
  ({ items, rowDoubleClickHandle, disabled }) => {
    const itemColAttributes = useRef([
      {
        field: "m_name",
        caption: "المخزن",
        captionEn: "Store",
      },
      {
        field: "item_no",
        caption: "رقم الصنف",
        alignment: "center",
        captionEn: "Number",
      },
      { field: "item_name", captionEn: "Item Name", caption: "اسم الصنف" },
      { field: "code_no", captionEn: "Part Number", caption: "رقم القطعة" },
      { field: "kmea", captionEn: "Quantity", caption: "الكمية" },
      {
        field: "price",
        captionEn: "Price",
        caption: "السعر",
        format: "currency",
      },
      {
        field: "TotalAfterDiscount",
        caption: "الإجمالي بعد الخصم",
        captionEn: "Total After Discount",
        format: "currency",
      },
    ]);

    return (
      <>
        <div className="px-2 col-12">
          <MasterTable
            disabled={disabled}
            dataSource={items}
            colAttributes={itemColAttributes.current}
            onRowDoubleClick={rowDoubleClickHandle}
          />
        </div>
      </>
    );
  }
);
