import React from "react";
import { Popup } from "devextreme-react/popup";
import Bill from "../SharedComponents/Bill";
import ButtonRow from "../SharedComponents/buttonsRow";

function CuptureReceiptPopup({ showPopup, changeShowPopup }) {
  let renderTemplete = () => {
    return (
      <>
        <div className="container">
          <Bill related="الزبون" source="الخزينة" isType={true} />
          <ButtonRow />
        </div>
      </>
    );
  };

  return (
    <Popup
      visible={showPopup}
      onHiding={changeShowPopup}
      closeOnOutsideClick={true}
      showCloseButton={true}
      dragEnabled={false}
      showTitle={true}
      title="إيصال قبض"
      contentRender={renderTemplete}
      rtlEnabled={true}
      height={"450"}
    />
  );
}

export default CuptureReceiptPopup;
