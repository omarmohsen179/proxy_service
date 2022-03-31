import React, { useState, useEffect } from "react";
import ButtonRow from "../../Components/SharedComponents/buttonsRow";
import Bill from "../../Components/SharedComponents/Bill";
import BillHeader from "../../Components/SharedComponents/BillHeader";
import { INVOICE_CAPTURE_RECEIPT } from "../../Services/ApiServices/Bills/BillsTabAPI";
import { useTranslation } from "react-i18next";

function TransferBetweenStorages(props) {
  const { data, togglePopup } = props;

  return (
    <>
      <div className="container p-5" style={{ minHeight: "100px" }}>
        <BillHeader billTitle={"Move between lockers"} />
        <Bill
          billTitle={"نقل بين الخزائن"}
          isType={false}
          outerDataObject={data}
          togglePopup={togglePopup}
        />
      </div>
    </>
  );
}

export default TransferBetweenStorages;
