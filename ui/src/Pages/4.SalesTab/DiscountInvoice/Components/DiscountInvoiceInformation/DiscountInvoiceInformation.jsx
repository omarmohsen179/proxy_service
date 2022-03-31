import React, { useMemo, useEffect, useState, useCallback } from "react";
import {
  TextBox,
  NumberBox,
  DateBox,
  SelectBox,
} from "../../../../../Components/Inputs";

import notify from "devextreme/ui/notify";
import NumberBoxFullWidth from "../../../../../Components/Inputs/NumberBoxFullWidth";
import {
  GET_CASHIERS,
  GET_DISCOUNT_INVOICE_NUMBER,
} from "./API.DiscountInvoiceInformations";
import { GET_ACCOUNTS } from "../../../../../Templetes/Invoice/Components/InvoiceInformation/API.InvoiceInformation";
import { useTranslation } from "react-i18next";

const DiscountInvoiceInformation = ({
  bill,
  errors,
  updateBillInformation,
  updateErrorsState,
  setSelectedAccount,
  selectedAccount,
  updateBillState,
  resetComponent,
}) => {
  const [initData, setInitData] = useState({});
  const [accounts, setAccounts] = useState([]);
  const { t, i18n } = useTranslation();
  //* ────────────────────────────────────────────────────────────────────────────────
  //* ─── CALLBACKS ──────────────────────────────────────────────────────────────────
  //* ────────────────────────────────────────────────────────────────────────────────

  //* callBack to update selected account data
  const updateSelectedAccount = useCallback(
    (e) => {
      // Get Account data by id
      let _selectedAccount =
        accounts.find((account) => account.id == e.value) ?? {};

      // Set current selected account to Account we get before
      setSelectedAccount(_selectedAccount);

      updateBillInformation({
        name: "sno_id",
        value: e.value,
      });
    },
    [accounts, setSelectedAccount, updateBillInformation]
  );

  //? ────────────────────────────────────────────────────────────────────────────────
  //? ─── EFFECTS ────────────────────────────────────────────────────────────────────
  //? ────────────────────────────────────────────────────────────────────────────────

  //? First Render effect
  //? to get invoiceNumber, cashiers
  useEffect(() => {
    // 1- Get Invoice Number
    GET_DISCOUNT_INVOICE_NUMBER().then(({ InvoiceNumber }) => {
      updateBillState({ e_no: InvoiceNumber });
    });

    // 2- Get Cashers
    GET_CASHIERS().then((cashiers) => {
      setInitData((prev) => ({
        ...prev,
        cashiers,
      }));
      updateBillState({ emp_mo: cashiers[0]?.id });
    });
  }, []);

  //? Effect to reset Component
  useEffect(() => {
    if (resetComponent) {
      // 1- Get new Invoice Number
      GET_DISCOUNT_INVOICE_NUMBER()
        .then(({ InvoiceNumber }) => {
          updateBillState({
            e_no: InvoiceNumber,
            emp_mo: initData.cashiers[0]?.id,
          });
          setSelectedAccount({});
        })
        .then(() => {
          notify(
            {
              message: t("Invoice reset Successfully"),
              width: 450,
            },
            "warning",
            2000
          );
        })
        .catch((error) => {
          console.log(error);
          notify(
            {
              message: t("An error occurred while resetting the invoice"),
              width: 450,
            },
            "error",
            2000
          );
        });
    }
  }, [resetComponent]);

  //? on change in (emp_mo) to Get accounts data from api
  useEffect(() => {
    // 1- Get Accounts
    initData.cashiers &&
      GET_ACCOUNTS("Customer", initData.cashiers[0]?.id, "Sales").then(
        (_accounts) => setAccounts(_accounts)
      );
  }, [bill.emp_mo]);

  //* ────────────────────────────────────────────────────────────────────────────────
  //* ─── MEMOs ──────────────────────────────────────────────────────────────────────
  //* ────────────────────────────────────────────────────────────────────────────────
  //* Memo of button that responsible in updating invoice number
  const invoiceNumberButtonOptions = useMemo(() => {
    return {
      text: t("Update invoice number."),
      icon: "undo",
      type: "normal",
      stylingMode: "text",
      disabled: bill.readOnly,
      onClick: () => {
        GET_DISCOUNT_INVOICE_NUMBER()
          .then((response) => {
            updateBillInformation({
              name: "e_no",
              value: response.InvoiceNumber,
            });

            if (errors.e_no) {
              let _errors = errors;
              delete _errors.e_no;
              updateErrorsState(_errors);
            }

            notify(
              {
                message: t("Invoice reset Successfully"),
                width: 450,
              },
              "warning",
              2000
            );
          })
          .catch((error) => {
            console.log(error);
            notify(
              {
                message: t("An error occurred while resetting the invoice"),
                width: 450,
              },
              "error",
              2000
            );
          });
      },
    };
  }, [bill.readOnly, errors, updateBillInformation, updateErrorsState, t]);
  return (
    <>
      <div className="row pb-3 mx-auto border-bottom">
        <div className="row col-md-12 col-lg-12">
          <div className="col-6">
            <NumberBox
              readOnly={bill.readOnly}
              validationErrorMessage={errors.e_no}
              required={false}
              label={t("Number")}
              value={bill.e_no}
              name="e_no"
              handleChange={updateBillInformation}
              buttonOptions={invoiceNumberButtonOptions}
            />
          </div>
          <div className="col-6">
            <DateBox
              readOnly={bill.readOnly}
              required={false}
              label={t("Date")}
              value={bill.e_date}
              name="e_date"
              handleChange={updateBillInformation}
            />
          </div>
          <div className="col-6">
            <SelectBox
              readOnly={bill.readOnly}
              validationErrorMessage={errors.emp_mo}
              label={t("the seller")}
              dataSource={initData.cashiers}
              name="emp_mo"
              value={bill.emp_mo}
              handleChange={updateBillInformation}
            />
          </div>
          <div className="col-4">
            <SelectBox
              readOnly={bill.readOnly}
              validationErrorMessage={errors.sno_id}
              label={t("Client")}
              dataSource={accounts}
              name="sno_id"
              value={bill.sno_id}
              handleChange={updateSelectedAccount}
            />
          </div>
          <div className="col-2">
            <NumberBoxFullWidth
              readOnly={true}
              hoverStateEnabled={false}
              value={selectedAccount.debit}
            />
          </div>
          <div className="col-6">
            <TextBox
              readOnly={bill.readOnly}
              required={false}
              label={t("Note")}
              name="nots"
              value={bill.nots}
              handleChange={updateBillInformation}
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default React.memo(DiscountInvoiceInformation);
