import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { NumberBox } from "../../../../Components/Inputs";
import { GET_CUSTOMER_LAST_TRANSACTION } from "./API.CustomerItemLastTransaction";

const CustomerItemLastTransaction = ({ itemId, selectedAccountId }) => {
  const { t, i18n } = useTranslation();

  const [customerItemLastTransaction, setCustomerItemLastTransaction] =
    useState({});
  useEffect(() => {
    if (itemId && selectedAccountId) {
      GET_CUSTOMER_LAST_TRANSACTION(itemId, selectedAccountId)
        .then((response) => {
          setCustomerItemLastTransaction(response);
        })
        .catch((error) => console.log(error));
    } else {
      setCustomerItemLastTransaction({});
    }
  }, [itemId, selectedAccountId]);

  return (
    <>
      <div className="col-12">
        <h5 className="p-2 ">{t("The last transaction with the customer")}</h5>
        <div className="row">
          {/* الكمية */}
          <div className="col-4">
            <NumberBox
              required={false}
              readOnly={true}
              label={t("Quantity")}
              name="kmea"
              value={customerItemLastTransaction.kmea}
            />
          </div>

          {/* السعر */}
          <div className="col-4">
            <NumberBox
              required={false}
              readOnly={true}
              label={t("Price")}
              name="price"
              value={customerItemLastTransaction.price}
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default React.memo(CustomerItemLastTransaction);
