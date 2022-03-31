import React from "react";
import { Popup } from "devextreme-react/popup";
import ScrollView from "devextreme-react/scroll-view";
import PurchaseInvoicesExpenses from "../../../../Pages/10.PurchasesTab/PurchasesBill/Components/PurchaseInvoicesExpenses/PurchaseInvoicesExpenses";

const PurchaseExpensesPopup = ({
  visible,
  togglePopup,
  invoiceId,
  invoiceNumber,
  setLinkedValue,
}) => {
  return (
    <Popup visible={visible} onHiding={togglePopup}>
      <ScrollView showScrollbar="onHover">
        <PurchaseInvoicesExpenses
          ID={invoiceId}
          NUMBER={invoiceNumber}
          setLinkedValue={setLinkedValue}
        />
      </ScrollView>
    </Popup>
  );
};

export default PurchaseExpensesPopup;
