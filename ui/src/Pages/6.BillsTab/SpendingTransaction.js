import React from "react";
import ButtonRow from "../../Components/SharedComponents/buttonsRow";
import Bill from "../../Components/SharedComponents/Bill";
import BillHeader from "../../Components/SharedComponents/BillHeader";
import { useTranslation } from "react-i18next";

function SpendingTransaction(props) {
  const { data, togglePopup } = props;
  const { t, i18n } = useTranslation();
  let pageName = t();

  return (
    <>
      {console.log(data)}
      <div className="container p-5" style={{ minHeight: "100px" }}>
        <BillHeader billTitle={"Receipt Cash Out"} />
        <Bill
          billTitle={"سند صرف"}
          isType={false}
          outerDataObject={data}
          togglePopup={togglePopup}
        />
      </div>
    </>
  );
}

export default SpendingTransaction;
