import React, { useRef } from "react";
import MasterTable from "../../../../../Components/SharedComponents/Tables Components/MasterTable";
import { GET_ITEMS_VALIDITY } from "../../API.ItemsValidity";

const ItemsValidityTable = ({ selectedCategoryId }) => {
  const colAttributes = useRef([
    {
      caption: "رقم الفاتورة",
      field: "docno",
      captionEn: "Invoice Number",
    },
    {
      caption: "رقم الصنف",
      field: "item_num",
      captionEn: "Item Number",
    },
    {
      caption: "اسم الصنف",
      field: "item_name",
      captionEn: "Item Name",
    },
    {
      caption: "تاريخ الحركة",
      captionEn: "Movement Date",
      field: "DateMv",
    },
    {
      caption: "الرصيد",
      captionEn: "Balance",
      field: "bal",
    },
    {
      caption: "الحساب",
      captionEn: "Account",
      field: "bean",
    },
  ]);
  return (
    <>
      <MasterTable
        colAttributes={colAttributes.current}
        height={"300px"}
        remoteOperations
        allowExcel
        filterRow
        apiMethod={GET_ITEMS_VALIDITY}
        apiPayload={{ categoryId: selectedCategoryId }}
        apiKey="num"
      />
    </>
  );
};

export default React.memo(ItemsValidityTable);
