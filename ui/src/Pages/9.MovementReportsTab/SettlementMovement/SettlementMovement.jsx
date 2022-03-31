// React
import React, { useState, useEffect, useRef } from "react";
//css
import "./settlementMovement.css";
// Components
import MasterTable from "../../../Components/SharedComponents/Tables Components/MasterTable";
import { SelectBox, DateBox } from "../../../Components/Inputs";

// API
import {
  GET_ACCOUNTS,
  DISCOUNTS_INVOICES_TRANSACTIONS,
} from "./API.SettlementMovement";

import { GET_MARKETERS } from "../../../Services/ApiServices/General/LookupsAPI";
import { useTranslation } from "react-i18next";

function SettlementMovement() {
  // ============================================================================================================================
  // ================================================= Lists ====================================================================
  // ============================================================================================================================
  const { t, i18n } = useTranslation();
  // Table Column
  let columnsAttributes = [
    {
      caption: "الرقم",
      field: "item_no",
      captionEn: "Number",
      alignment: "center",
      isVisable: true,
    },
    {
      caption: "الاسم",
      captionEn: "Name",
      field: "item_name",
      alignment: "center",
      isVisable: true,
    },
    {
      caption: "الكمية",
      field: "mbe",
      captionEn: "Quantity",
      alignment: "center",
      isVisable: true,
    },
    {
      caption: "العبوة",
      captionEn: "Package",
      field: "mbemtr",
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
      column: "mbe",
      summaryType: "sum",
      valueFormat: "currency",
      cssClass: "daenState",
      showInColumn: "mbe",
      customizeText: (data) => {
        return `${t("Total")}: ${data.value ?? 0.0} `;
      },
    },
    {
      column: "mbemtr",
      summaryType: "sum",
      valueFormat: "currency",
      cssClass: "daenState",
      showInColumn: "mbemtr",
      customizeText: (data) => {
        return `${data.value ?? 0.0} `;
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
        setMarketersList(res);
        console.log(res);
      })
      .catch((err) => console.log(err));
    // الزبون
    GET_ACCOUNTS()
      .then((res) => {
        console.log(res);
        setCustomerList(res);
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
        <div style={{ minWidth: "20%" }}>
          {t("Detection of the movement of items in the period")}
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
              AccountID: 0,
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

export default SettlementMovement;

// // THIS PAGE NEED PRININTG AND APIKEY AND SUMMARY
