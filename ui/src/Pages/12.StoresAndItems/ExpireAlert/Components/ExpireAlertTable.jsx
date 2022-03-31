import React, { useRef } from "react";
import MasterTable from "../../../../Components/SharedComponents/Tables Components/MasterTable";
import { GET_ITEMS_NEAR_EXPIRED } from "../API.ExpireAlert";

const ExpireAlertTable = ({ apiPayload }) => {
  const colAttributes = useRef([
    {
      caption: "رقم الصنف",
      captionEn: "Number",
      field: "item_no",
    },
    {
      caption: "اسم الصنف",
      field: "item_name",
      captionEn: "Name",
    },
    {
      caption: "تاريخ الصالحية",
      field: "exp_date",
      captionEn: "Date",
    },
    {
      caption: "الكمية",
      field: "qunt",
      captionEn: "Quantity",
    },
  ]);
  return (
    <>
      <MasterTable
        colAttributes={colAttributes.current}
        height={"300px"}
        remoteOperations={
          apiPayload.RangValue > 0 && apiPayload.RangTypeValue ? true : false
        }
        allowExcel
        columnChooser={false}
        apiMethod={GET_ITEMS_NEAR_EXPIRED}
        apiPayload={apiPayload}
      />
    </>
  );
};
export default ExpireAlertTable;
