import { Popup, ScrollView } from "devextreme-react";
import React, { useRef } from "react";
import MasterTable from "../../../../../Components/SharedComponents/Tables Components/MasterTable";
import {
  GET_OFFERS_BILLS_TRANSACTIONS,
  REMOVE_OFFERS_BILLS,
} from "./API.EditTablePopup";

const EditTablePopup = ({
  visible,
  togglePopup,
  apiPayload = {},
  handleDoubleClick,
}) => {
  const colAttributes = useRef([
    { field: "num_orod", caption: "الرقم", captionEn: "Number" },
    { field: "datee", caption: " التاريخ", captionEn: "Date" },
    { field: "SupplierName", caption: "الجهة", captionEn: "Side" },
    { field: "nots", caption: "ملاحظات", captionEn: "Notes" },
  ]);

  return (
    <>
      <Popup visible={visible} onHiding={togglePopup}>
        <MasterTable
          filterRow
          allowDelete
          remoteOperations={visible}
          apiPayload={apiPayload}
          apiMethod={GET_OFFERS_BILLS_TRANSACTIONS}
          removeApiMethod={REMOVE_OFFERS_BILLS}
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
