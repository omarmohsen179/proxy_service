import React, { useState, useEffect, useCallback, useMemo } from "react";
import { useRef } from "react";
import DateTime from "../../../Components/Inputs/DateTime";
import SelectBox from "../../../Components/Inputs/SelectBox";
import MasterTable from "../../../Components/SharedComponents/Tables Components/MasterTable.jsx";
import { useTranslation } from "react-i18next";
import { CUSTOMER_ITEMS_SALES, CUSTOMERIES } from "./DatedBillsAPi";
function DatedBills(props) {
  const { t, i18n } = useTranslation();
  let [customers, setcustomers] = useState([]);
  const summaryData = useRef([
    {
      column: "egmaly",
      summaryType: "sum",
      valueFormat: "currency",
      showInColumn: "egmaly",
      customizeText: (data) => {
        return ` اجمالي  : ${data.value ?? 0} `;
      },
    },
  ]);
  let today = useMemo(() => {
    let defualtdateValue = new Date();
    return (
      (parseInt(defualtdateValue.getMonth()) + 1).toString() +
      "/" +
      defualtdateValue.getDate() +
      "/" +
      defualtdateValue.getFullYear()
    ).toString();
  }, []);
  let [values, setvalues] = useState({
    FromDate: today,
    ToDate: today,
    AccountID: 0,
  });
  let handleChange = useCallback(
    ({ name, value }) => {
      setvalues({ ...values, [name]: value });
    },
    [values]
  );

  const ApiMethod = useCallback(async (e) => {
    let Api = await CUSTOMER_ITEMS_SALES(e);
    //setvaluesfinal()
    return Api;
  }, []);

  useEffect(async () => {
    let data = await CUSTOMERIES();
    setcustomers(data);
    if (data && data.length > 0) {
      console.log(data[0].id);
      handleChange({ name: "AccountID", value: data[0].id });
    }
  }, []);
  return (
    <div
      dir={i18n.language == "en" ? "ltr" : "rtl"}
      className="row"
      style={{ display: "flex", justifyContent: "center", margin: 0 }}
    >
      <h1 style={{ width: "100%", textAlign: "center", padding: "2%" }}>
        {t("list of the items received by the customer")}
      </h1>
      <form className="row" style={{ width: "80%", padding: "4px" }}>
        <div className="col-12 col-md-6 col-lg-6">
          <DateTime
            label={t("From")}
            value={values["FromDate"]}
            name="FromDate"
            handleChange={handleChange}
            required={true}
            required={false}
          />
        </div>
        <div className="col-12 col-md-6 col-lg-6">
          <DateTime
            label={t("To")}
            value={values["ToDate"]}
            name="ToDate"
            handleChange={handleChange}
            required={true}
            required={false}
          />
        </div>
        <div className="col-12 col-md-6 col-lg-6">
          <SelectBox
            label={t("According to customer")}
            dataSource={customers}
            value={values.AccountID}
            name="AccountID"
            handleChange={handleChange}
            required={false}
          />
        </div>
      </form>

      <div style={{ width: "95%" }}>
        <MasterTable
          remoteOperations
          apiMethod={ApiMethod}
          apiPayload={values}
          height="400px"
          summaryItems={summaryData.current}
          colAttributes={[
            { caption: "الرقم", captionEn: "Number", field: "e_no" },
            { caption: "التاريخ", captionEn: "Date", field: "e_date" },

            {
              caption: "رقم الصنف",
              captionEn: "Item Number",
              field: "item_no",
            },
            {
              caption: "اسم الصنف",
              captionEn: "Item Name",
              field: "item_name",
            },
            { captionEn: "Quantity", caption: "الكميه", field: "kmea" },
            { captionEn: "Price", caption: "السعر", field: "price" },
            { captionEn: "Total", caption: "الأجمالي ", field: "egmaly" },
          ]}
        />
      </div>
    </div>
  );
}
export default DatedBills;
