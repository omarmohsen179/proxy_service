import React, { useState, useEffect, useCallback, useMemo } from "react";
import DateTime from "../../../Components/Inputs/DateTime";
import { STAFF_MEMEBERS_TRANCATION } from "./API.SalaryDue";
import MasterTable from "../../../Components/SharedComponents/Tables Components/MasterTable.jsx";
import SearchItem from "../../Items/SearchItem";
import { useTranslation } from "react-i18next";
function SalaryDue(props) {
  let summaryData = [
    {
      column: "salary",
      summaryType: "sum",
      valueFormat: "currency",
      showInColumn: "salary",
      customizeText: (data) => {
        return ` اجمالي  : ${data.value ?? 0} `;
      },
    },

    {
      column: "alawa",
      summaryType: "sum",
      valueFormat: "currency",
      showInColumn: "alawa",
      customizeText: (data) => {
        return `   ${data.value ?? 0} `;
      },
    },
    {
      column: "ksm",
      summaryType: "sum",
      valueFormat: "currency",
      showInColumn: "ksm",
      customizeText: (data) => {
        return `    ${data.value ?? 0} `;
      },
    },
    {
      column: "egmaly",
      summaryType: "sum",
      valueFormat: "currency",
      showInColumn: "egmaly",
      customizeText: (data) => {
        return `    ${data.value ?? 0} `;
      },
    },
  ];
  const { t, i18n } = useTranslation();
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
  });
  let handleChange = ({ name, value }) => {
    setvalues({ ...values, [name]: value });
  };
  const ApiMethod = useCallback(async (e) => {
    let Api = await STAFF_MEMEBERS_TRANCATION(e);
    //setvaluesfinal()
    return Api;
    //{totalCount:0,data:[]}
  }, []);

  return (
    <div
      dir={"auto"}
      className="row"
      style={{ display: "flex", justifyContent: "center", margin: 0 }}
    >
      <h1 style={{ width: "100%", textAlign: "center", padding: "2%" }}>
        {t("Salaries Due")}
      </h1>
      <form className="row" style={{ width: "80%", padding: "4px" }}>
        <div className="col-12 col-md-6 col-lg-6">
          <DateTime
            label={t("From")}
            value={values["FromDate"]}
            name="FromDate"
            handleChange={handleChange}
            required={false}
          />
        </div>
        <div className="col-12 col-md-6 col-lg-6">
          <DateTime
            label={t("To")}
            value={values["ToDate"]}
            name="ToDate"
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
          summaryItems={summaryData}
          colAttributes={[
            { caption: "رقم الموظف", captionEn: "Number", field: "s_no" },
            { caption: "اسم الموظف", captionEn: "Name", field: "s_name" },
            { caption: "المرتب", captionEn: "Salary", field: "salary" },

            { caption: "العلاوه", captionEn: "Bounce", field: "alawa" },
            { caption: "الخصميات", captionEn: "Discount", field: "ksm" },
            { caption: "الأجمالي", captionEn: "Total", field: "egmaly" },
          ]}
        />
      </div>
    </div>
  );
}
export default SalaryDue;
