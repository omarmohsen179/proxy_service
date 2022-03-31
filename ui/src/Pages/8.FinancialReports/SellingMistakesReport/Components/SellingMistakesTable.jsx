import React, { useRef } from "react";
import MasterTable from "../../../../Components/SharedComponents/Tables Components/MasterTable";
import { GET_SELLING_MISTAKES_REPORT } from "../API.SellingMistakesReport";

const SellingMistakesTable = ({ apiPayload }) => {
  const colAttributes = useRef([
    { field: "item_no", caption: "رقم الصنف", captionEn: "Number" },
    { field: "item_name", caption: "اسم الصنف", captionEn: "Name" },
    {
      field: "InvoiceType",
      caption: "نوع الفاتورة",
      captionEn: "Invoice Type",
    },
    { field: "kmea", caption: "الكمية", captionEn: "Quantity" },
    { field: "name_emp", caption: "البائع", captionEn: "Saller" },
    { field: "sname", caption: "الخزينة", captionEn: "treasury" },
    { field: "p_tkl", caption: "سعر التكلفة", captionEn: "Cost price" },
    { field: "price", caption: "السعر", captionEn: "Price" },
  ]);

  return (
    <>
      <MasterTable
        allowExcel
        filterRow
        remoteOperations
        apiMethod={GET_SELLING_MISTAKES_REPORT}
        apiPayload={apiPayload}
        columnChooser={false}
        colAttributes={colAttributes.current}
        height={"300px"}
      />
    </>
  );
};

export default SellingMistakesTable;
