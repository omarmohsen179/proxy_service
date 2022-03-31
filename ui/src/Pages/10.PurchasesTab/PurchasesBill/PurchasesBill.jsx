import React, {
  useState,
  useCallback,
  useEffect,
  useRef,
  useMemo,
} from "react";
import "./purchasesBill.css";
import notify from "devextreme/ui/notify";
import InvoiceInformation from "./Components/InvoiceInformation/InvoiceInformation";
import { ItemsTable } from "./Components/ItemsTable/ItemsTable";
import { ItemTransactionsTable } from "../../../Components/SharedComponents/Tables Components/ItemTransactionsTable/ItemTransactionsTable";
import { ItemsStorageQuantityTable } from "../../../Components/SharedComponents/Tables Components/ItemsStorageQuantityTable/ItemsStorageQuantityTable";
import ItemInformation from "./Components/ItemInformation/ItemInformation";
import InvoiceControlPanel from "./Components/InvoiceControlPanel/InvoiceControlPanel";
import {
  UPDATE_INVOICE,
  INSERT_INVOICE,
  DISTRIBUTE_INVOICE_ITEM_QUANTITY,
  GET_INVOICE_ITEMS,
  UPDATE_INVOICE_BASICS,
} from "./API.PurchasesBill";
import { TextBox } from "../../../Components/Inputs";
import CustomerItemLastTransaction from "./Components/CustomerItemLastTransaction/CustomerItemLastTransaction";
import SpeedActionsButtons from "./Components/SpeedActionsButtons/SpeedActionsButtons";
import Searchtable from "../../../Modals/SearchBillsTableANDmovements/SearchTable";
import { useTranslation } from "react-i18next";

const PurchasesBill = ({ invoiceType = "Sales" }) => {
  // Default values
  const billDefaultValues = useRef({
    id: 0,
    emp_id: "1",
    e_date: new Date(),
    invoiceType: invoiceType,
    safeOrClient: "Safe",
    mosweq_id: "",
    dis_type: 1,
    dis: 0,
    Ex_Rate: 1,
    itemPrice: "price1",
    readOnly: false,
  });

  // State of main information about Bill
  const [bill, setBill] = useState(billDefaultValues.current);
  const [parallelBill, setParallelBill] = useState({});
  const { t, i18n } = useTranslation();
  // Invoice Items
  const [items, setItems] = useState([]);

  // CasherStores
  const [stores, setStores] = useState([]);

  // SelectedAccount
  const [selectedAccount, setSelectedAccount] = useState({});

  // Debit Alert
  const [showDebitAlert, setShowDebitAlert] = useState(false);

  // State of Errors
  const [errors, setErrors] = useState({});

  // Item States
  const [selectedItem, setSelectedItem] = useState({});

  const [updatedItem, setUpdatedItem] = useState({});

  const [itemEditMode, setItemEditMode] = useState(false);

  // Reset Page
  const [resetComponents, setResetComponents] = useState(false);

  // Popups
  const [showSearchBill, setShowSearchBill] = useState(false);

  //* ────────────────────────────────────────────────────────────────────────────────
  //* ─── CALLBACKS ──────────────────────────────────────────────────────────────────
  //* ────────────────────────────────────────────────────────────────────────────────

  const updateBillInformation = useCallback(
    (e) => {
      setBill((prevBill) => ({ ...prevBill, [e.name]: e.value }));
      if (errors[e.name]) {
        let updatedErrors = { ...errors };
        delete updatedErrors[e.name];
        setErrors(updatedErrors);
      }
    },
    [errors]
  );

  const updateItemInformation = useCallback(
    (e) => {
      setUpdatedItem((prevItem) => ({ ...prevItem, [e.name]: e.value }));
      if (errors[e.name]) {
        let updatedErrors = { ...errors };
        delete updatedErrors[e.name];
        setErrors(updatedErrors);
      }
    },
    [errors]
  );

  const updateBillState = useCallback((data) => {
    setBill((prev) => ({ ...prev, ...data }));
  }, []);

  const updateStores = useCallback((stores) => {
    setStores([...stores]);
  }, []);

  const updateErrorsState = useCallback((data) => {
    setErrors(data);
  }, []);

  const updateItems = useCallback((data) => {
    setItems(data);
  }, []);

  const updateSelectedAccount = useCallback(
    (account) => {
      setSelectedAccount(account);
      if (
        bill.invoiceType !== "Sales" ||
        bill.safeOrClient !== "Customer" ||
        !account.id ||
        account.MaxDebit === "0" ||
        (account.debit &&
          parseInt(account.MaxDebit) + parseInt(account.debit) > 0)
      ) {
        setShowDebitAlert(false);
      } else {
        setShowDebitAlert(true);
      }
    },
    [bill.invoiceType, bill.safeOrClient]
  );

  // This callback is fireing on item row in itemsTable clicked
  // This callback is responsible of
  // update bill.storeId
  const onItemRowDoubleClickHandle = useCallback((e) => {
    if (e.data.item_id) {
      setItemEditMode(true);

      setBill((prev) => ({ ...prev, storeId: e.data.m_no }));

      setSelectedItem(e.data);

      setUpdatedItem(e.data);

      setErrors({});
    }
  }, []);

  const cancelEditItem = useCallback(() => {
    setItemEditMode(false);

    setSelectedItem({});

    setUpdatedItem({});

    setErrors({});
  }, []);

  const setNewInvoice = useCallback((invoiceType) => {
    // Reset Bill
    setBill(billDefaultValues.current);

    // Reset Items
    setItems([]);

    // Reset Errors
    setErrors({});

    // Reset Item States
    setSelectedItem({});
    setUpdatedItem({});

    // Reset Edit mode
    setItemEditMode(false);

    // Reset child components
    setResetComponents({ ...true });
  }, []);

  const editUpdatedItem = useCallback((data) => {
    data
      ? setUpdatedItem((prev) => ({ ...prev, ...data }))
      : setUpdatedItem({});
  }, []);

  const reselectSelectedItem = useCallback((data) => {
    data
      ? setSelectedItem((prev) => ({ ...prev, ...data }))
      : setSelectedItem({});
  }, []);

  const editErrors = useCallback((data) => {
    data ? setErrors((prev) => ({ ...prev, ...data })) : setErrors({});
  }, []);

  const insertInvoice = useCallback(
    (_item) => {
      console.log(_item);
      let invoice = {
        Data: [
          {
            InvoiceType: bill.invoiceType,
            ID: "0",
            AccountID: bill.sno_id,
            StoreID: bill.storeId,
            Invoice: {
              e_no: bill.e_no,
              e_date: bill.e_date,
              Ex_Rate: bill.Ex_Rate,
              mosweq_id: bill.mosweq_id,
              emp_id: bill.emp_id,
              omla_id: selectedAccount.omla_id,
              sno_id: bill.sno_id,
              tele_nkd: bill.tele_nkd,
              nots1: bill.nots1,
              nots: bill.nots,
              dis: bill.dis,
              dis_type: bill.dis_type,
            },
            InvoiceItems: [{ ..._item }],
          },
        ],
      };
      INSERT_INVOICE(invoice)
        .then(({ id, Item, InvoiceDiscount }) => {
          setUpdatedItem({});
          setSelectedItem({});
          setItems([Item]);
          setBill({
            ...bill,
            id: id,
            readOnly: true,
            InvoiceDiscount,
          });

          // Notify user
          notify(
            {
              message: t("Add Successfully"),
              width: 450,
            },
            "success",
            1000
          );
        })
        .catch(({ response }) => {
          let Errors = response.data ? response.data.Errors : [];
          let responseErrors = {};
          Errors.forEach(({ Column, Error }) => {
            responseErrors = { ...responseErrors, [Column]: Error };
          });
          setErrors(responseErrors);
          // Notify user
          notify(
            {
              message: `${t("Failed Try again")}`,
              width: 450,
            },
            "error",
            2000
          );
        });
    },
    [bill, selectedAccount.omla_id]
  );

  const addItemToInvoice = useCallback(
    (_item) => {
      if (bill.id > 0) {
        console.log(_item);
        let updatedInvoice = {
          Data: [
            {
              InvoiceType: bill.invoiceType,
              ID: bill.id,
              InvoiceDiscount: bill.dis,
              InvoiceDiscountType: bill.dis_type,
              AccountID: bill.sno_id,
              StoreID: bill.storeId,
              InvoiceItems: [{ ..._item }],
            },
          ],
        };
        if (itemEditMode) {
          UPDATE_INVOICE(updatedInvoice)
            .then(({ Item, InvoiceDiscount }) => {
              setBill((prev) => ({ ...prev, InvoiceDiscount }));

              let updatedItems = [...items];

              let index = updatedItems.indexOf(selectedItem);

              console.log(index);

              if (~index) {
                updatedItems[index] = { ...Item };
                setItems(updatedItems);
                // Notify user
                notify(
                  {
                    message: t("Updated Successfully"),
                    width: 450,
                  },
                  "success",
                  2000
                );
                setUpdatedItem({});
                setSelectedItem({});
                setItemEditMode(false);
              }
            })
            .catch(({ response }) => {
              let Errors = response.data ? response.data.Errors : [];
              let responseErrors = {};
              Errors.forEach(({ Column, Error }) => {
                responseErrors = { ...responseErrors, [Column]: Error };
              });
              setErrors(responseErrors);
              // Notify user
              notify(
                {
                  message: `${t("Failed Try again")}`,
                  width: 450,
                },
                "error",
                2000
              );
            });
        } else {
          UPDATE_INVOICE(updatedInvoice)
            .then(({ Item, InvoiceDiscount }) => {
              setBill((prev) => ({ ...prev, InvoiceDiscount }));

              let updatedItems = [...items];

              if (_item.MergeInOneInvoicItem === true && items.length > 0) {
                updatedItems = updatedItems.filter(
                  (item) => item.ID !== Item.ID
                );
              }

              updatedItems.push(Item);

              setItems(updatedItems);

              // Notify user
              notify(
                {
                  message: t("Add Successfully"),
                  width: 450,
                },
                "success",
                2000
              );
              setUpdatedItem({});
              setSelectedItem({});
              setItemEditMode(false);
            })
            .catch(({ response }) => {
              let Errors = response.data ? response.data.Errors : [];
              let responseErrors = {};
              Errors &&
                Errors.forEach(({ Column, Error }) => {
                  responseErrors = { ...responseErrors, [Column]: Error };
                });
              setErrors(responseErrors);
              // Notify user
              notify(
                {
                  message: `${t("Failed Try again")}`,
                  width: 450,
                },
                "error",
                2000
              );
            });
        }
      } else if (bill.id == 0) {
        insertInvoice(_item);
      }
    },
    [
      bill.dis,
      bill.dis_type,
      bill.id,
      bill.invoiceType,
      bill.sno_id,
      bill.storeId,
      insertInvoice,
      itemEditMode,
      items,
      selectedItem,
    ]
  );

  const mergeItemsHandle = useCallback(() => {
    setUpdatedItem((prev) => {
      let newUpdatedItem = { ...prev, MergeInOneInvoicItem: true };
      addItemToInvoice(newUpdatedItem);
      return newUpdatedItem;
    });
    // addItemToInvoice(updatedItem);
  }, [addItemToInvoice]);

  const explodeItamHandle = useCallback(
    (id) => {
      let data = {
        Data: [
          {
            Type: id,
            ID: updatedItem.ID ?? 0,
            item_id: updatedItem.item_id,
            InvoiceID: bill.id,
            sum_box: updatedItem.sum_box,
            price: updatedItem.price,
            dis1: updatedItem.dis1 ?? 0,
            m_no: updatedItem.m_no,
            Subject_to_validity: updatedItem.Subject_to_validity,
          },
        ],
      };
      DISTRIBUTE_INVOICE_ITEM_QUANTITY(data)
        .then(({ Items, InvoiceDiscount }) => {
          setBill((prev) => ({ ...prev, InvoiceDiscount }));
          console.log(itemEditMode);
          if (itemEditMode) {
            let updatedItems = items.filter(
              (item) => item.ID !== selectedItem.ID
            );
            setItems([...updatedItems, ...Items]);
            setItemEditMode(false);
            notify(
              {
                message: t("Add Successfully"),
                width: 450,
              },
              "success",
              2000
            );
          } else {
            setItems([...items, ...Items]);
          }

          setUpdatedItem({});
          setSelectedItem({});
        })
        .catch(({ response }) => {
          let Errors = response ? response.data.Errors : [] ?? [];
          let responseErrors = {};
          Errors &&
            Errors.forEach(({ Column, Error }) => {
              responseErrors = { ...responseErrors, [Column]: Error };
            });
          setErrors(responseErrors);

          // Notify user
          notify(
            {
              message: `${t("Failed Try again")}`,
              width: 450,
            },
            "error",
            2000
          );
        });
    },
    [
      bill.id,
      selectedItem.ID,
      itemEditMode,
      items,
      updatedItem.ID,
      updatedItem.Subject_to_validity,
      updatedItem.dis1,
      updatedItem.item_id,
      updatedItem.m_no,
      updatedItem.price,
      updatedItem.sum_box,
    ]
  );

  const openBillsTable = useCallback(() => {
    setShowSearchBill(true);
  }, []);

  const billRowDoubleClickHandle = ({ Invoice, Account }) => {
    if (Invoice.id && Invoice.invoiceType) {
      GET_INVOICE_ITEMS(Invoice.invoiceType, Invoice.id)
        .then((invoiceItems) => {
          setBill({
            ...Invoice,
            itemPrice: Account.defult_price,
            readOnly: true,
          });
          setSelectedAccount({ ...Account });
          setItems(invoiceItems);
        })
        .catch((error) => {
          console.log(error);
        })
        .finally(() => {
          setShowSearchBill(false);
          setSelectedItem({});
        });
    } else {
      console.log("error: Request failed (invoiceType or id is missing)");
    }
  };

  // Edit Basics Information
  const editInvoiceBasicsInformations = useCallback(() => {
    setBill((prev) => {
      setParallelBill({
        e_no: prev.e_no,
        e_date: prev.e_date,
        Ex_Rate: prev.Ex_Rate,
        mosweq_id: prev.mosweq_id,
        emp_id: prev.emp_id,
        omla_id: prev.omla_id,
        sno_id: prev.sno_id,
        nots: prev.nots,
        tele_nkd: prev.tele_nkd,
        nots1: prev.nots1,
        safeOrClient: prev.safeOrClient,
        itemPrice: prev.itemPrice,
      });
      return { ...prev, readOnly: !prev.readOnly };
    });
  }, []);

  const acceptFloatingButtonHandle = useCallback(() => {
    let updatedInvoiceValues = {};
    for (const key of Object.keys(parallelBill)) {
      parallelBill[key] !== bill[key] &&
        (updatedInvoiceValues[key] = bill[key]);
    }
    let updatedInvoice = {
      Data: [
        {
          ID: bill.id,
          InvoiceType: bill.invoiceType,
          Invoice: {
            ...updatedInvoiceValues,
          },
        },
      ],
    };
    UPDATE_INVOICE_BASICS(updatedInvoice)
      .then((response) => {
        console.log(response);
      })
      .then((response) => {
        setUpdatedItem({});
        setSelectedItem({});
        setBill({
          ...bill,
          readOnly: true,
          ...updatedInvoiceValues,
        });
        setErrors({});
        // Notify user
        notify(
          {
            message: `تم تحديث الفاتورة بنجاح`,
            width: 450,
          },
          "success",
          1000
        );
      })
      .catch(
        ({
          response: {
            data: { Errors },
          },
        }) => {
          let responseErrors = {};
          Errors.forEach(({ Column, Error }) => {
            responseErrors = { ...responseErrors, [Column]: Error };
          });
          setErrors(responseErrors);
          // Notify user
          notify(
            {
              message: `${t("Failed Try again")}`,
              width: 450,
            },
            "error",
            2000
          );
        }
      );
  }, [bill, parallelBill]);

  const discardFloatingButtonHandle = useCallback(() => {
    setUpdatedItem({});
    setSelectedItem({});
    setBill((prev) => ({
      ...prev,
      readOnly: true,
      ...parallelBill,
    }));
    setErrors({});
    // Notify user
    notify(
      {
        message: t("Invoice returned successfully"),
        width: 450,
      },
      "success",
      1000
    );
  }, [parallelBill]);

  //? ────────────────────────────────────────────────────────────────────────────────
  //? ─── EFFECTS ────────────────────────────────────────────────────────────────────
  //? ────────────────────────────────────────────────────────────────────────────────

  useEffect(() => {
    if (bill.id != 0 && items.length < 1) {
      setNewInvoice(bill.invoiceType);
    }
  }, [items.length]);

  //* ────────────────────────────────────────────────────────────────────────────────
  //* ─── MEMOs ──────────────────────────────────────────────────────────────────────
  //* ────────────────────────────────────────────────────────────────────────────────

  //* ItemTransactionsTable Payload to get data on scroll
  const itemTransactionsPayload = useMemo(() => {
    return {
      itemId: selectedItem.item_id,
      storeID: selectedItem.m_no,
    };
  }, [selectedItem.item_id, selectedItem.m_no]);

  return (
    <>
      {
        //! في المرة الرابعة ديما بيحصل مشكلة
        showSearchBill && (
          <Searchtable
            allowDelete={true}
            ob={{
              list_type: bill.safeOrClient,
              Type: bill.invoiceType,
            }}
            visible={showSearchBill}
            togglePopup={(e) => setShowSearchBill(!showSearchBill)}
            onclickRow={(e) => billRowDoubleClickHandle(e)}
          />
        )
      }

      <SpeedActionsButtons
        billInformation={{
          id: bill.id,
          readOnly: bill.readOnly,
          invoiceType: bill.invoiceType,
          safeOrClient: bill.safeOrClient,
        }}
        editInvoiceBasicsInformations={editInvoiceBasicsInformations}
        acceptFloatingButtonHandle={acceptFloatingButtonHandle}
        discardFloatingButtonHandle={discardFloatingButtonHandle}
        setNewInvoice={setNewInvoice}
        openBillsTable={openBillsTable}
      />
      <div className="container-xxl rtlContainer">
        <h3 className="p-3 sectionHeader">{t("Receipt Information")}</h3>
        <div className="row card p-3 mx-3 billSection">
          {showDebitAlert && (
            <div className="alert alert-danger">
              <i className="alertIcon fas fa-exclamation-triangle fa-5x d-block text-center pb-3 text-danger" />

              <h5 className="text-center">
                {t("This customer has exceeded the maximum allowed debt")}
              </h5>
            </div>
          )}
          <InvoiceInformation
            bill={bill}
            errors={errors}
            updateErrorsState={updateErrorsState}
            updateBillInformation={updateBillInformation}
            updateBillState={updateBillState}
            updateStores={updateStores}
            selectedAccount={selectedAccount}
            setSelectedAccount={updateSelectedAccount}
            resetComponent={resetComponents}
          />

          <ItemsTable
            disabled={!bill.readOnly}
            invoiceType={bill.invoiceType}
            invoiceId={bill.id}
            items={items}
            updateItems={updateItems}
            key="ItemsTable"
            rowDoubleClickHandle={onItemRowDoubleClickHandle}
            discount={bill.InvoiceDiscount}
          />
        </div>

        <h3 className="p-3 sectionHeader">{t("Item Information")}</h3>
        <div className="card mb-3 p-3 mx-3 billSection">
          <div className="p-3 col-12 border-bottom">
            <ItemInformation
              billInformation={{
                id: bill.id,
                invoiceType: bill.invoiceType,
                readOnly: bill.readOnly,
                itemPrice: bill.itemPrice ?? "p_tkl",
                emp_id: bill.emp_id,
                mosweq_id: bill.mosweq_id,
                mosawiq_nesba: bill.mosawiq_nesba,
                storeId: bill.storeId,
                dis: bill.dis,
                dis_type: bill.dis_type,
              }}
              updateBillInformation={updateBillInformation}
              updateBillState={updateBillState}
              stores={stores}
              // Store of changing and api element
              updatedItem={updatedItem}
              // to setState
              setUpdatedItem={editUpdatedItem}
              // For inputs
              updateItemInformation={updateItemInformation}
              // Data of item start state
              selectedItem={selectedItem}
              // Reset item start state
              setSelectedItem={reselectSelectedItem}
              updateErrors={editErrors}
              errors={errors}
              itemEditMode={itemEditMode}
              selectedAccountId={selectedAccount.id}
              addItemToInvoice={addItemToInvoice}
            />
            <InvoiceControlPanel
              billInformation={{ id: bill.id, bill: bill.itemPrice ?? "p_tkl" }}
              items={items}
              itemEditMode={itemEditMode}
              updatedItem={updatedItem}
              addItemToInvoice={addItemToInvoice}
              cancelEditItem={cancelEditItem}
              mergeItemsHandle={mergeItemsHandle}
              explodeItamHandle={explodeItamHandle}
              errors={errors}
            />
          </div>
          <div className="p-3 col-md-12 col-lg-12">
            <div
              className={
                "row px-3 py-2 " +
                (bill.safeOrClient === "Customer" ? "border-bottom" : "")
              }
            >
              <div className="col-6">
                <TextBox
                  required={false}
                  readOnly={true}
                  label="رصيد الصنف"
                  name="quantity"
                  value={updatedItem.Quantity}
                />
              </div>
              {updatedItem.Subject_to_validity && (
                <div className="col-6">
                  <TextBox
                    required={false}
                    readOnly={true}
                    label="رصيد الصلاحية"
                    name="expiredDateQuntity"
                    value={updatedItem.expiredDateQuntity}
                  />
                </div>
              )}
            </div>
            {bill.safeOrClient === "Customer" && (
              <div className="row px-3 py-2">
                <CustomerItemLastTransaction
                  itemId={updatedItem.item_id}
                  selectedAccountId={selectedAccount.id}
                />
              </div>
            )}
          </div>
        </div>

        <h3 className="p-3 sectionHeader">{t("Movement statement")}</h3>
        <div className="card mb-3 p-3 mx-3 billSection">
          <div className="row">
            <div className="p-3 col-md-12 col-lg-8">
              <ItemTransactionsTable
                itemTransactionsPayload={itemTransactionsPayload}
              />
            </div>
            <div className="p-3 col-md-12 col-lg-4">
              <ItemsStorageQuantityTable itemId={selectedItem.item_id} />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default PurchasesBill;
