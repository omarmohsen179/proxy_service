import React, { useCallback, useState, useMemo } from "react";
import notify from "devextreme/ui/notify";
import { useRef } from "react";
import MasterTable from "../../../Components/SharedComponents/Tables Components/MasterTable";
import { DELETE_RECEIPT_TRANSACTION } from "../API.OverTransactions";

const OverTransactionsTable = ({
  items = [],
  updateItems,
  transactionCode,
  transactionId,
  rowDoubleClickHandle,
  disabled,
}) => {
  const calculateValue = useCallback(({ AccountType, daen, mden, ex_rate }) => {
    let value = AccountType === "Credit" ? mden * -1 : daen;
    return value * ex_rate;
  }, []);

  const itemColAttributes = useRef([
    {
      field: "name",
      caption: "الحساب",
    },
    {
      field: "mden",
      caption: "مدين",
      cssClass: "redCell",
    },
    { field: "daen", caption: "دائن", cssClass: "greenCell" },
    { field: "ex_rate", caption: "م" },
    {
      field: "kmea",
      caption: "القيمة",
      calculateCellValueHandle: calculateValue,
    },
  ]);

  const itemSummaryItems = useMemo(
    () => [
      {
        column: "mden",
        summaryType: "sum",
        valueFormat: "currency",
        cssClass: "summaryNetSum",
        showInColumn: "mden",
        customizeText: (data) => {
          return `${parseFloat(data.value ?? 0).toFixed(3)} `;
        },
      },
      {
        column: "daen",
        summaryType: "sum",
        valueFormat: "currency",
        cssClass: "summaryNetSum",
        showInColumn: "daen",
        customizeText: (data) => {
          return `${parseFloat(data.value ?? 0).toFixed(3)} `;
        },
      },
      {
        column: "kmea",
        summaryType: "sum",
        valueFormat: "currency",
        cssClass: "summaryNetSum",
        showInColumn: "kmea",
        customizeText: (data) => {
          return `مقدار الخلل في التوازن  =  ${parseFloat(
            data.value ?? 0
          ).toFixed(3)} `;
        },
      },
    ],
    []
  );

  const rowRemovingHandle = useCallback(
    (e) => {
      e.cancel = true;
      e.data &&
        e.data.ID &&
        DELETE_RECEIPT_TRANSACTION({
          transactionCode,
          transactionId,
          transactionTransactionId: e.data.ID,
        })
          .then(async (response) => {
            let updatedItems = [...items];

            let index = updatedItems.indexOf(e.data);
            console.log(index);
            if (~index) {
              //   items.length === 1 && setNewInvoice();
              updatedItems.splice(index, 1);
              updateItems(updatedItems);
            }

            // Stop Editing
            await e.component.refresh(true);

            // Notify user
            notify(
              {
                message: `تم الحذف بنجاح`,
                width: 450,
              },
              "success",
              2000
            );
          })
          .catch((error) => {
            // Notify user
            notify(
              {
                message: `${error}`,
                width: 450,
              },
              "error",
              2000
            );
          });
    },
    [items, transactionCode, transactionId, updateItems]
  );

  return (
    <>
      <div className="px-2 col-12">
        <MasterTable
          disabled={disabled}
          allowDelete
          allowExcel
          dataSource={items}
          colAttributes={itemColAttributes.current}
          summaryItems={itemSummaryItems}
          onRowDoubleClick={rowDoubleClickHandle}
          onRowRemoving={rowRemovingHandle}
        />
      </div>
    </>
  );
};

export default React.memo(OverTransactionsTable);
