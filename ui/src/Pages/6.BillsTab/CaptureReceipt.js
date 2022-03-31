import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import Bill from "../../Components/SharedComponents/Bill";
import BillHeader from "../../Components/SharedComponents/BillHeader";
import { INVOICE_CAPTURE_RECEIPT } from "../../Services/ApiServices/Bills/BillsTabAPI";

function CaptureReceipt(props) {
  const { data, togglePopup } = props;

  return (
    <>
      <div className="container p-2" style={{ minHeight: "100px" }}>
        <BillHeader billTitle={"Receipt Cash In"} />
        <Bill
          billTitle={"إيصال قبض"}
          isType={true}
          outerDataObject={data}
          togglePopup={togglePopup}
        />
      </div>
    </>
  );
}

export default CaptureReceipt;
