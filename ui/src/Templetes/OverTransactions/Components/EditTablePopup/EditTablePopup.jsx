import { Popup, ScrollView } from "devextreme-react";
import React, { useRef } from "react";
import MasterTable from "../../../../Components/SharedComponents/Tables Components/MasterTable";
import {
  GET_OTHER_TRANSACTIONS_TRANSACTIONS,
  REMOVE_OTHER_TRANSACTION,
} from "./API.EditTablePopup";

const EditTablePopup = ({
  visible,
  togglePopup,
  apiPayload = {},
  handleDoubleClick,
}) => {
  const colAttributes = useRef([
    { field: "num", caption: "الرقم", captionEn: "Number" },
    { field: "datee", caption: " التاريخ", captionEn: "Date" },
    { field: "byan", caption: "البيان", captionEn: "Statment" },
    { field: "nots", caption: "ملاحظات", captionEn: "Note" },
  ]);

  return (
    <>
      <Popup visible={visible} onHiding={togglePopup}>
        <MasterTable
          filterRow
          allowDelete
          remoteOperations={
            apiPayload.transactionCode && visible ? true : false
          }
          apiPayload={apiPayload}
          apiMethod={GET_OTHER_TRANSACTIONS_TRANSACTIONS}
          removeApiMethod={REMOVE_OTHER_TRANSACTION}
          removeApiPayload={{ transactionCode: apiPayload.transactionCode }}
          columnChooser={false}
          colAttributes={colAttributes.current}
          height={"100%"}
          onRowDoubleClick={handleDoubleClick}
        />
      </Popup>
    </>
  );
};

export default React.memo(EditTablePopup);
