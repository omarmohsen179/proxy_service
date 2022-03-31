import React, { useRef } from "react";
import MasterTable from "../../../../Components/SharedComponents/Tables Components/MasterTable";
import { GET_ITEMS_TRANSACTION_BY_ACCOUNTS } from "../API.SalesByItems";

const SalesByItemsTable = ({ apiPayload }) => {
  const colAttributes = useRef([
    {
      caption: "الحساب",
      captionEn: "Account",
      field: "bean",
    },
    {
      caption: "الكمية",
      captionEn: "Quantity",
      field: "kmea",
    },
  ]);
  return (
    <>
      <MasterTable
        colAttributes={colAttributes.current}
        height={"300px"}
        remoteOperations={apiPayload.ItemID ? true : false}
        allowExcel
        columnChooser={false}
        apiMethod={GET_ITEMS_TRANSACTION_BY_ACCOUNTS}
        apiPayload={apiPayload}
      />
    </>
  );
};

export default SalesByItemsTable;
