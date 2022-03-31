import React, { useRef } from "react";
import MasterTable from "../../../../Components/SharedComponents/Tables Components/MasterTable";
import { GET_STAGNANT_ITEMS_REPORT } from "../API.StagnantItemsReport";

const StagnantItemsTable = ({ apiPayload, handleRowClicked }) => {
  const colAttributes = useRef([
    { field: "item_no", caption: "رقم الصنف", captionEn: "Number" },
    { field: "item_name", caption: "اسم الصنف", captionEn: "Name" },
    {
      field: "kemamsh",
      caption: "كمية المشتريات",
      captionEn: "Purchase Quantity",
    },
    { field: "kmeambe", caption: "كمية المبيعات", captionEn: "Sales Quantity" },
    { field: "kemambe", caption: "قيمة المبيعات", captionEn: "Sales Value" },
    { field: "nesba", caption: "النسبة", captionEn: "Percentage" },
    { field: "p_tkl", caption: "سعر التكلفة", captionEn: "Cost Price" },
    { field: "price", caption: "السعر", captionEn: "Price" },
  ]);

  return (
    <>
      <MasterTable
        allowExcel
        remoteOperations={apiPayload.CategoryID >= 0 ? true : false}
        apiMethod={GET_STAGNANT_ITEMS_REPORT}
        apiPayload={apiPayload}
        columnChooser={false}
        colAttributes={colAttributes.current}
        height={"300px"}
        onRowDoubleClick={handleRowClicked}
      />
    </>
  );
};

export default StagnantItemsTable;
