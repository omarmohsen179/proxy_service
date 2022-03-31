// React
import React, { useState, useRef, useEffect, useCallback } from "react";
//css
import "./categoriesAndCustomersSales.css";

// Components
import MasterTable from "../../../Components/SharedComponents/Tables Components/MasterTable";
import { SelectBox, DateBox, CheckBox } from "../../../Components/Inputs";

// API
import {
  GET_MAIN_CATEGORIES,
  GET_ACCOUNTS,
  GET_CATEGORIES_SALES_TABLE_DATA,
} from "./API.CategoriesAndCustomersSales";
import { useTranslation } from "react-i18next";

function CategoriesAndCustomersSales() {
  const { t, i18n } = useTranslation();
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
      caption: "رقم القطعة",
      captionEn: "Part Number",
      field: "code_no",
      alignment: "center",
      isVisable: true,
    },
    {
      caption: "الكمية المباعة",
      captionEn: "Selled Quantity",
      field: "mbe",
      alignment: "center",
      isVisable: true,
    },
    {
      caption: "قيمة المباع",
      captionEn: "Selled Value",
      field: "mbe1",
      alignment: "center",
      isVisable: true,
    },
    {
      caption: "كمية المسترجع",
      captionEn: "Refund amount",
      field: "rmb",
      alignment: "center",
      isVisable: true,
    },
    {
      caption: "قيمة المسترجع",
      captionEn: "Refund Value",
      field: "rmb1",
      alignment: "center",
      isVisable: true,
    },

    {
      caption: "الربح",
      captionEn: "profit",
      field: "rbh",
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

  // Accounts الحساب
  const [accountsList, setAccountsList] = useState();
  const [accountsValue, setAccountsValue] = useState();
  // Marketers النوع
  const [typeList, setTypeList] = useState();
  const [typeValue, setTypeValue] = useState();

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
  // ================================================= Master Table Summary =====================================================
  // ============================================================================================================================

  // Summary;
  let itemSummaryItems = useRef([
    {
      column: "rmb",
      summaryType: "sum",
      valueFormat: "currency",
      cssClass: "daenState",
      showInColumn: "rmb",
      customizeText: (data) => {
        console.log(data);
        return t("Total") + `: ${data.value ?? 0.0} `;
      },
    },
    {
      column: "rmb1",
      summaryType: "sum",
      valueFormat: "currency",
      cssClass: "daenState",
      showInColumn: "rmb1",
      customizeText: (data) => {
        return `${data.value ?? 0.0} `;
      },
    },
    {
      column: "rbh",
      summaryType: "sum",
      valueFormat: "currency",
      cssClass: "mdenState",
      showInColumn: "rbh",
      customizeText: (data) => {
        return `${data.value ?? 0.0} `;
      },
    },
  ]);

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

  let getTableData = (data) => {
    // console.log(data.summary);
    // data.summary && { first: data.summary[0], second: data.summary[1] };
  };

  return (
    <div className="container">
      {/* From to  */}
      <div
        dir="rtl"
        style={{
          width: "100%",
          display: "flex",
          flexWrap: "wrap",
          width: "100%",
          marginLeft: "auto",
          marginTop: "50px",
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
          otherMethod={getTableData}
          summaryItems={itemSummaryItems.current}
          allowExcel={true}
          allowPrint={true}
        />
      </div>
    </div>
  );
}

export default CategoriesAndCustomersSales;
