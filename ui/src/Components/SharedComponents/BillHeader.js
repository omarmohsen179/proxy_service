import React, { useState } from "react";

// import "devextreme/dist/css/dx.common.css";
// import "devextreme/dist/css/dx.light.css";
import { Popup } from "devextreme-react/popup";
import { Button } from "devextreme-react/button";

import { SelectBox } from "../Inputs";

import DeletedHeader from "./DeletedHeader";

import { SEND_EMAIL_SMS } from "../../Services/ApiServices/General/ReportsAPI";
import { useTranslation } from "react-i18next";

function BillHeader(props) {
  // ============================================================================================================================
  // ================================================= Lists ================================================================
  // ============================================================================================================================
  const { billTitle } = props;
  const selectBoxValues = [
    {
      id: 1,
      name: "إيميل",
      icon: "fas fa-envelope-open-text",
    },
    {
      id: 2,
      name: "رسالة نصية",
      icon: "fas fa-sms",
    },
    {
      id: 3,
      name: "توثيق",
      icon: "far fa-save",
    },
  ];
  const { t, i18n } = useTranslation();
  // ============================================================================================================================
  // ================================================= State ================================================================
  // ============================================================================================================================
  let [popup, setPopup] = useState(false);

  // ============================================================================================================================
  // ================================================= Handelers ================================================================
  // ============================================================================================================================

  let showPopup = () => {
    setPopup(!popup);
    console.log(popup);
  };

  let handleEmailClaiming = () => {
    let Data = {
      AccountCol: "AccountID",
      SendType: "Email",
      MessageSubject: "",
      MessageBody: "",
      BySystemMoneyType: 0,
      FromDate: new Date("2010-01-01"),
      ToDate: new Date(),
      AccountsIDs: [],
    };

    SEND_EMAIL_SMS("إيصال قبض", Data)
      .then((res) => console.log(res))
      .catch((err) => console.log(err));
  };

  return (
    <>
      <div className="billHeaderContainer">
        <div className="billHeaderTitle">{t(billTitle)}</div>
      </div>
      <Popup
        maxWidth={500}
        minWidth={250}
        height={500}
        showTitle={true}
        dragEnabled={false}
        closeOnOutsideClick={true}
        visible={popup}
        onHiding={showPopup}
      >
        <DeletedHeader title={billTitle} />
      </Popup>
    </>
  );
}

export default BillHeader;
