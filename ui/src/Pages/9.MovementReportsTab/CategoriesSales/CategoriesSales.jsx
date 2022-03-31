// React
import React, { useState, useEffect, useRef } from "react";
//css
import "./CategoriesSales.css";
// Components
import MasterTable from "../../../Components/SharedComponents/Tables Components/MasterTable";
import { SelectBox, DateBox } from "../../../Components/Inputs";

// API
import {
  GET_MAIN_CATEGORIES,
  GET_ACCOUNTS,
  GET_CATEGORIES_SALES_TABLE_DATA,
} from "./API.CategoriesSales";
import { useTranslation } from "react-i18next";

function CategoriesSales() {
  // ============================================================================================================================
  // ================================================= Lists ====================================================================
  // ============================================================================================================================

  // Table Column
  let columnsAttributes = [
    {
      caption: "الرقم",
      captionEn: "Number",
      field: "item_no",
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
  const { t, i18n } = useTranslation();
  // ============================================================================================================================
  // ================================================= State ====================================================================
  // ============================================================================================================================

  // Date from and to values
  const [dateValue, setDateValue] = useState({
    from: new Date(new Date().getTime() - 60 * 60 * 24 * 7 * 1000),
    to: new Date(),
  });

  // Accounts الحساب
  const [accountsList, setAccountsList] = useState();
  const [accountsValue, setAccountsValue] = useState();
  // Marketers النوع
  const [typeList, setTypeList] = useState();
  const [typeValue, setTypeValue] = useState();

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
        console.log(data);
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
    // التصنيف
    GET_MAIN_CATEGORIES()
      .then((res) => {
        setTypeList(res.MainCategory);
        console.log(res);
      })
      .catch((err) => console.log(err));
    // النوع
    GET_ACCOUNTS()
      .then((res) => {
        setAccountsList([{ name: "الكل", id: 0 }, ...res]);
      })
      .catch((err) => console.log(err));
  }, []);

  // ============================================================================================================================
  // ================================================= Handelers ================================================================
  // ============================================================================================================================

  // handle date chnage
  let handleDateChange = ({ name, value }) => {
    console.log("handleDateChange");
    setDateValue((prevState) => ({ ...prevState, [name]: value }));
  };

  // set new value of Accounts on selection of selectbox .. الحساب
  let handleAccountsChange = ({ value }) => {
    setAccountsValue(value);
  };

  // set new value of types on selection of selectbox .. النوع
  let handleTypeChnage = ({ value }) => {
    setTypeValue(value);
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
          label={t("Account")}
          dataSource={accountsList}
          value={accountsValue}
          handleChange={handleAccountsChange}
          required={false}
        />

        <SelectBox
          label={t("Type")}
          dataSource={typeList}
          value={typeValue}
          handleChange={handleTypeChnage}
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
            accountsValue != undefined && typeValue != undefined
          }
          // apiKey="docno"
          apiMethod={
            accountsValue != undefined && typeValue != undefined
              ? GET_CATEGORIES_SALES_TABLE_DATA
              : null
          }
          apiPayload={{
            data: {
              AccountID: accountsValue,
              CategoryID: typeValue,
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

export default CategoriesSales;

// THIS PAGE NEED PRININTG AND APIKEY AND SUMMARY
