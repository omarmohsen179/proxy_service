import React, {
  useEffect,
  useRef,
  useState,
  useCallback,
  useMemo,
} from "react";
import {
  TextBox,
  NumberBox,
  DateBox,
  SelectBox,
} from "../../../../../Components/Inputs";
import { SelectBox as DxSelectBox } from "devextreme-react";
import NumberBoxFullWidth from "../../../../../Components/Inputs/NumberBoxFullWidth";
import {
  GET_CASHIER_STORES,
  GET_CASHIERS,
  GET_INVOICE_NUMBER,
  GET_ACCOUNTS,
} from "./API.InvoiceInformation";
import notify from "devextreme/ui/notify";
import { useTranslation } from "react-i18next";

const InvoiceInformation = ({
  bill,
  updateBillInformation,
  updateBillState,
  updateStores,
  errors,
  updateErrorsState,
  selectedAccount,
  setSelectedAccount,
  resetComponent,
}) => {
  const [initData, setInitData] = useState({});
  const [accounts, setAccounts] = useState([]);
  const [showCuptureReceiptPopup, setShowCuptureReceiptPopup] = useState(false);
  const { t, i18n } = useTranslation();
  //? ────────────────────────────────────────────────────────────────────────────────
  //? ─── EFFECTS ────────────────────────────────────────────────────────────────────
  //? ────────────────────────────────────────────────────────────────────────────────

  //? First Render effect
  //? to get invoiceNumber, cashiers, cashierStores
  useEffect(() => {
    // 1- Get Invoice Number
    GET_INVOICE_NUMBER(bill.invoiceType).then(({ InvoiceNumber }) => {
      updateBillState({ e_no: InvoiceNumber });
    });

    // 2- Get Cashers
    GET_CASHIERS().then((cashiers) => {
      setInitData((prev) => ({
        ...prev,
        cashiers,
      }));
      updateBillState({ mosweq_id: cashiers[0]?.id });
    });

    // 3- Get Stores
    GET_CASHIER_STORES().then((cashierStores) => {
      setInitData((prev) => ({
        ...prev,
        cashierStores,
      }));
      updateBillState({ storeId: cashierStores[0]?.id });
      updateStores(cashierStores);
    });
  }, [bill.invoiceType, updateBillState, updateStores]);

  //? Effect to reset Component
  useEffect(() => {
    if (resetComponent) {
      console.log(resetComponent);
      // 1- Get new Invoice Number
      GET_INVOICE_NUMBER(bill.invoiceType)
        .then(({ InvoiceNumber }) => {
          updateBillState({
            e_no: InvoiceNumber,
            mosweq_id: initData.cashiers[0]?.id,
            storeId: initData.cashierStores[0]?.id,
          });
          setSelectedAccount({});
        })
        .then(() => {
          notify(
            {
              message: t("Invoice Updated Successfully"),
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

  //? on change in (safeOrClient) or (mosweq_id) to Get accounts data from api
  useEffect(() => {
    // 1- Get Accounts
    initData.cashiers &&
      GET_ACCOUNTS(
        bill.safeOrClient,
        initData.cashiers[0]?.id,
        bill.invoiceType
      ).then((_accounts) => setAccounts(_accounts));
  }, [bill.safeOrClient, bill.mosweq_id, initData.cashiers]);

  //* ────────────────────────────────────────────────────────────────────────────────
  //* ─── CALLBACKS ──────────────────────────────────────────────────────────────────
  //* ────────────────────────────────────────────────────────────────────────────────

  //* on change account type (Customer or Safe) to set selected account {}
  const updateAccountType = useCallback(
    (selectedItem) => {
      updateBillInformation({ name: "safeOrClient", value: selectedItem });
      setSelectedAccount({});
    },
    [setSelectedAccount, updateBillInformation]
  );

  //* callBack to update selected account data
  const updateSelectedAccount = useCallback(
    (e) => {
      // Get Account data by id
      let _selectedAccount =
        accounts.find((account) => account.id == e.value) ?? {};

      // Set current selected account to Account we get before
      setSelectedAccount(_selectedAccount);
      // Update bill state
      updateBillState({
        tele_nkd: _selectedAccount.PhoneNumber,
        itemPrice:
          bill.invoiceType !== "Purchases"
            ? _selectedAccount.defult_price
            : null,
        omla_id: _selectedAccount.omla_id,
        sno_id: e.value,
      });
    },
    [accounts, setSelectedAccount, updateBillState]
  );

  //* ────────────────────────────────────────────────────────────────────────────────
  //* ─── MEMOS ──────────────────────────────────────────────────────────────────────
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
        GET_INVOICE_NUMBER(bill.invoiceType)
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
                message: t("The invoice number has been reset"),
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
                message: t(
                  "An error occurred while resetting the invoice number"
                ),
                width: 450,
              },
              "error",
              2000
            );
          });
      },
    };
  }, [
    bill.invoiceType,
    bill.readOnly,
    errors,
    t,
    updateBillInformation,
    updateErrorsState,
  ]);

  return (
    <>
      <div className="row pb-3 mx-auto border-bottom">
        {/* الجزء الأيمن */}
        <div className="row col-md-12 col-lg-6">
          {/* رقم الفاتورة */}
          <div className="col-12">
            <NumberBox
              readOnly={bill.readOnly}
              validationErrorMessage={errors.e_no}
              required={false}
              label={t("Invoice Number")}
              value={bill.e_no}
              name="e_no"
              handleChange={updateBillInformation}
              buttonOptions={invoiceNumberButtonOptions}
            />
          </div>

          {/* تاريخ الفاتورة */}
          <div className="col-12">
            <DateBox
              readOnly={bill.readOnly}
              required={false}
              label={t("Date")}
              value={bill.e_date}
              name="e_date"
              handleChange={updateBillInformation}
            />
          </div>

          {/* البائع */}
          <div className="col-8">
            <SelectBox
              readOnly={bill.readOnly}
              validationErrorMessage={errors.mosweq_id}
              label={t("the seller")}
              dataSource={initData.cashiers}
              name="mosweq_id"
              value={bill.mosweq_id}
              handleChange={updateBillInformation}
            />
          </div>

          {/* عميل ام خزينة */}
          <div className="col-4">
            <DxSelectBox
              readOnly={bill.readOnly}
              name={"safeOrClient"}
              placeholder={t("Choose")}
              dataSource={[
                { id: "Customer", name: t("Customer") },
                { id: "Safe", name: t("Safe") },
              ]}
              displayExpr={"name"}
              valueExpr={"id"}
              value={bill.safeOrClient}
              rtlEnabled={true}
              onValueChange={(selectedItem) => updateAccountType(selectedItem)}
            />
          </div>

          {/* نسبة الزيادة على السعر */}
          <div className="col-5">
            {bill.invoiceType === "Sales" ? (
              <NumberBox
                readOnly={bill.readOnly}
                required={false}
                validationErrorMessage={errors.ratioOfIncreaseInPrice}
                label={t("Price Ratio")}
                value={bill.ratioOfIncreaseInPrice}
                name="ratioOfIncreaseInPrice"
                handleChange={updateBillInformation}
              />
            ) : bill.invoiceType === "Purchases" ? (
              <NumberBox
                readOnly={bill.readOnly}
                required={false}
                validationErrorMessage={errors.num_mas}
                label={t("Expenses")}
                value={bill.num_mas}
                name="num_mas"
                handleChange={updateBillInformation}
              />
            ) : null}
          </div>

          {/* ملاحظات */}
          <div className="col-7">
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

        {/* الجزء الأيسر */}
        <div className="row col-md-12 col-lg-6">
          {/* الزبون الخزنة */}
          <div
            className={
              "col" + (bill.safeOrClient !== "Customer" ? "-12 pl-0" : "-9")
            }
          >
            <SelectBox
              readOnly={bill.readOnly}
              validationErrorMessage={errors.sno_id}
              label={
                bill.safeOrClient === "Customer" ? t("Customer") : t("Safe")
              }
              dataSource={accounts}
              name="sno_id"
              value={bill.sno_id}
              handleChange={updateSelectedAccount}
            />
          </div>

          {bill.safeOrClient === "Customer" && (
            <div className="col-3">
              <NumberBoxFullWidth
                readOnly={true}
                hoverStateEnabled={false}
                value={selectedAccount.debit}
              />
            </div>
          )}

          {/* نقدًا باسم */}
          <div className="col-9">
            <TextBox
              readOnly={bill.readOnly}
              required={false}
              label={t("Cash in the name")}
              name="nots1"
              value={bill.nots1}
              handleChange={updateBillInformation}
            />
          </div>

          {/* رقم  الهاتف */}
          <div className="col-3">
            <NumberBoxFullWidth
              readOnly={bill.readOnly}
              placeholder={t("Phone Number")}
              showColor={false}
              handleChange={updateBillInformation}
              name="tele_nkd"
              value={bill.tele_nkd}
              mode="tel"
            />
          </div>

          {/* العملة */}
          <div className="col-6">
            <TextBox
              label={t("the currency")}
              readOnly={true}
              required={false}
              name="currency"
              value={selectedAccount.MoneyType}
              handleChange={updateBillInformation}
            />
          </div>

          {/* م.التحويل */}
          <div className="col-6 px-0">
            <NumberBox
              readOnly={bill.readOnly}
              validationErrorMessage={errors.Ex_Rate}
              required={false}
              label={t("The transfer")}
              value={bill.Ex_Rate}
              name="Ex_Rate"
              handleChange={updateBillInformation}
            />
          </div>

          {/* اسعار المنتج */}
          <div
            className={
              "col" + (bill.safeOrClient !== "Customer" ? "-12 pl-0" : "-7")
            }
          >
            {bill.invoiceType === "Sales" ? (
              <SelectBox
                readOnly={bill.readOnly}
                label={t("Product Price")}
                dataSource={[
                  { id: "price1", name: t("sectoral price") },
                  { id: "p_gmla1", name: t("Wholesale price") },
                  { id: "p_tkl", name: t("Cost price") },
                  { id: "p_gmla_2", name: t("wholesale wholesale price") },
                ]}
                name={"itemPrice"}
                handleChange={updateBillInformation}
              />
            ) : bill.invoiceType === "Purchases" ? (
              <NumberBox
                readOnly={bill.readOnly}
                required={false}
                validationErrorMessage={errors.num_surce}
                label={t("Source Invoice")}
                value={bill.num_surce}
                name="num_surce"
                handleChange={updateBillInformation}
              />
            ) : null}
          </div>

          {/* ايصال قبض */}
          {bill.safeOrClient === "Customer" && (
            <button
              style={{ height: "36px" }}
              className="col-5 btn btn-success d-flex align-items-center justify-content-center"
              onClick={() => setShowCuptureReceiptPopup(true)}
            >
              <i className="fas fa-file-invoice-dollar px-2 fa-2x"></i>
              <span className="">{t("Receipt Cash In")}</span>
            </button>
          )}
        </div>
      </div>
    </>
  );
};

export default React.memo(InvoiceInformation);
