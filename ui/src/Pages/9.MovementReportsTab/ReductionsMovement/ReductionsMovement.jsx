// React
import React, { useState, useEffect, useRef } from "react";
//css
import "./ReductionsMovement.css";
// Components
import MasterTable from "../../../Components/SharedComponents/Tables Components/MasterTable";
import { SelectBox, DateBox } from "../../../Components/Inputs";

// API
import {
  GET_ACCOUNTS,
  DISCOUNTS_INVOICES_TRANSACTIONS,
} from "./API.ReductionsMovement";

import { GET_MARKETERS } from "../../../Services/ApiServices/General/LookupsAPI";
import { useTranslation } from "react-i18next";

function ReductionsMovement() {
  // ============================================================================================================================
  // ================================================= Lists ====================================================================
  // ============================================================================================================================
  const { t, i18n } = useTranslation();
  // Table Column
  let columnsAttributes = [
    {
      caption: "رقم الفاتورة",
      captionEn: "Invoice Number",
      field: "docno",
      alignment: "center",
      isVisable: true,
    },
    {
      caption: "التاريخ",
      field: "DateMv",
      captionEn: "Date",
      alignment: "center",
      isVisable: true,
    },
    {
      caption: "الحساب",
      field: "bean",
      captionEn: "Account",
      alignment: "center",
      isVisable: true,
    },
    {
      caption: "الإجمالي",
      field: "daen",
      captionEn: "Total",
      alignment: "center",
      isVisable: true,
    },
    {
      caption: "المسوق",
      field: "nots",
      captionEn: "Marketer",
      alignment: "center",
      isVisable: true,
    },
  ];

  // ============================================================================================================================
  // ================================================= State ====================================================================
  // ============================================================================================================================

  // Date from and to values
  const [dateValue, setDateValue] = useState({
    from: new Date(new Date().getTime() - 60 * 60 * 24 * 7 * 1000),
    to: new Date(),
  });

  // Customer الزبون
  const [customerList, setCustomerList] = useState();
  const [customerValue, setCustomerValue] = useState();
  // Marketers المسوق
  const [marketersList, setMarketersList] = useState();
  const [marketersValue, setMarketersValue] = useState();

  // ============================================================================================================================
  // ================================================= Master Table Summary =====================================================
  // ============================================================================================================================

  // Summary;
  let itemSummaryItems = useRef([
    {
      column: "nots",
      summaryType: "sum",
      valueFormat: "currency",
      cssClass: "daenState",
      showInColumn: "nots",
      customizeText: (data) => {
        console.log(data);
        return `${t("Total")}: ${data.value ?? 0.0} `;
      },
    },
  ]);

  // ============================================================================================================================
  // ================================================= Effects ================================================================
  // ============================================================================================================================

  // Initial Effect
  useEffect(() => {
    // المسوق
    GET_MARKETERS()
      .then((res) => {
        console.log(res);
        setMarketersList(res);
      })
      .catch((err) => console.log(err));
    // الزبون
    GET_ACCOUNTS()
      .then((res) => {
        console.log(res);
        setCustomerList([{ name: t("All"), id: 0 }, ...res]);
      })
      .catch((err) => console.log(err));
  }, []);

  // ============================================================================================================================
  // ================================================= Handelers ================================================================
  // ============================================================================================================================

  // handle date chnage
  let handleDateChange = ({ name, value }) => {
    setDateValue((prevState) => ({ ...prevState, [name]: value }));
  };

  // set new value of Customer on selection of selectbox .. الزبون
  let handleCustomerChange = ({ value }) => {
    setCustomerValue(value);
  };

  // set new value of types on selection of selectbox .. المسوق
  let handleMarketersChnage = ({ value }) => {
    setMarketersValue(value);
  };

  let hanldetableData = (data) => {
    console.log(data);
  };

  return (
    <div className="container">
      {/* From to  */}
      <div
        style={{
          width: "100%",
          display: "flex",
          justifyContent: "space-between",
          flexWrap: "wrap",
          marginLeft: "auto",
          marginTop: "50px",
          direction: "rtl",
        }}
      >
        {console.log(customerList)}
        <div style={{ minWidth: "20%" }}>
          {t("Detecting the movement of discounts for the period")}
        </div>

        {/* FROM AND TO */}
        <div style={{ minWidth: "60%" }}>
          <div
            style={{
              width: "100%",
              display: "flex",
              justifyContent: "space-between",
            }}
          >
            <div style={{ width: "45%" }}>
              <DateBox
                label={t("From")}
                handleChange={handleDateChange}
                name="from"
                value={dateValue["from"]}
              />
            </div>
            <div style={{ width: "45%" }}>
              <DateBox
                label={t("To")}
                handleChange={handleDateChange}
                name="to"
                value={dateValue["to"]}
              />
            </div>
          </div>
        </div>
      </div>

      {/*  Select Boxes */}
      <div className="triple w-75 mt-5" style={{ marginLeft: "auto" }}>
        <SelectBox
          label={t("Customer")}
          dataSource={customerList}
          value={customerValue}
          handleChange={handleCustomerChange}
          required={false}
        />

        <SelectBox
          label={t("Type")}
          dataSource={marketersList}
          value={marketersValue}
          handleChange={handleMarketersChnage}
          required={false}
        />
      </div>

      {/* Table */}
      {/* Table */}
      <div className="mt-3">
        <MasterTable
          colAttributes={columnsAttributes}
          height={40 + "vh"}
          filterRow
          remoteOperations={
            customerValue != undefined && marketersValue != undefined
          }
          // apiKey="docno"
          apiMethod={
            customerValue != undefined && marketersValue != undefined
              ? DISCOUNTS_INVOICES_TRANSACTIONS
              : null
          }
          apiPayload={{
            data: {
              AccountID: customerValue,
              AgentID: marketersValue,
              FromDate:
                dateValue.from === ""
                  ? new Date(new Date().getTime() - 60 * 60 * 24 * 7 * 1000)
                  : dateValue.from,
              ToDate: dateValue.to === "" ? new Date() : dateValue.to,
            },
          }}
          otherMethod={hanldetableData}
          summaryItems={itemSummaryItems.current}
          allowExcel={true}
          allowPrint={true}
        />
      </div>
    </div>
  );
}

export default ReductionsMovement;

// THIS PAGE NEED PRININTG AND APIKEY AND SUMMARY
