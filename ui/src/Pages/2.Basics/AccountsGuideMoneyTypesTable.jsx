import React, { useEffect, useState } from "react";
import _, { set } from "lodash";

import {
  Column,
  DataGrid,
  FilterRow,
  HeaderFilter,
  GroupPanel,
  Editing,
  Scrolling,
  Texts,
  Export,
  RequiredRule,
  AsyncRule,
  NumericRule,
  Lookup,
} from "devextreme-react/data-grid";
import { CustomRule } from "devextreme-react/form";
import { useTranslation } from "react-i18next";
import { createStore } from "devextreme-aspnet-data-nojquery";

import {
  DELETE_ACCOUNT_MONEY_TYPE,
  GEY_ACCOUNT_MONEY_TYPES,
  UPDATE_ACCOUNT_MONEY_TYPES,
} from "./AccountMoneyTypeTransactions";
import notify from "devextreme/ui/notify";
import { GET_MONEY_TYPES } from "./MoneyTypes/Components/MoneyTypes";

function AccountsGuideMoneyTypesTable({
  userId = 1246,
  disabled = false,
  //* "single" "multiple"
  selectionMode = "single",
  //* [{ }, ...]
  width = "100%",
  height = "100%",
  filterRow = false,
  groupPanel = false,
  headerFilter = false,
  onSelectionChanged,
  onRowRemoving,
  onRowRemoved,
  onRowDoubleClick,
  onRowInserting,
  onRowUpdating,
  onSaving,
  onInitNewRow,
  onInsertButtonClicked,
}) {
  const { t, i18n } = useTranslation();

  const [dataSource, setDataSource] = useState([]);
  const [moneyTypes, setMoneyTypes] = useState([]);

  useEffect(() => {
    GEY_ACCOUNT_MONEY_TYPES(userId)
      .then((data) => {
        setDataSource(data);
      })
      .catch((error) => {
        console.log(error);
      });

    GET_MONEY_TYPES().then((data) => {
      setMoneyTypes(data);
    });
  }, [userId]);

  // let moneyTypes = createStore({
  // 	key: "id",
  // 	loadUrl: `${apiEndPoint}/InvoicesMoneyTypes`,
  // 	// onBeforeSend: (e) => {
  // 	// 	e.method = "POST";
  // 	// },
  // });

  const onEditorPreparing = (e) => {
    if (e.dataField === "description") {
      console.log(1, e.dataField);

      e.allowEditing = false;
      e.readOnly = true;
      e.isOnForm = false;
    }
  };

  const onInserting = async (e) => {
    e.cancel = true;
    if (e.data) {
      let data = {
        Data: [{ ...e.data, cust_id: userId, daen_end: 0, mden_end: 0 }],
      };

      await UPDATE_ACCOUNT_MONEY_TYPES(data)
        .then(async (result) => {
          // Adding new item
          e.data.id = result;
          setDataSource((prev) => [...prev, { ...e.data }]);

          // Stop Editing
          // await e.component.saveEditData();
          await e.component.cancelEditData();
          await e.component.refresh(true);

          // Notify User
          notify(
            {
              message: `Added Successfully`,
              width: 450,
            },
            "success",
            2000
          );
        })
        .catch(async (error) => {
          console.log(error);
          await e.component.refresh(true);
          e.component.cancelEditData();
          notify(
            {
              message: `${error}`,
              width: 450,
            },
            "error",
            2000
          );
        });
    }
  };

  const onUpdating = async (e) => {
    e.cancel = true;
    if (e.newData) {
      let data = {
        Data: [{ ...e.oldData, ...e.newData }],
      };

      await UPDATE_ACCOUNT_MONEY_TYPES(data)
        .then(async () => {
          // Update Data in our state
          let updatedData = dataSource;
          let index = updatedData.indexOf(e.oldData);
          if (~index) {
            updatedData[index] = {
              ...e.oldData,
              ...e.newData,
            };
          }
          setDataSource(updatedData);

          // Stop Editing
          await e.component.refresh(true);
          await e.component.cancelEditData();

          // Notify user
          notify(
            {
              message: `Updated Successfully`,
              width: 450,
            },
            "success",
            2000
          );
        })
        .catch(async (error) => {
          console.log(error);
          await e.component.refresh(true);
          e.component.cancelEditData();
          notify(
            {
              message: `${error}`,
              width: 450,
            },
            "error",
            2000
          );
        });
    }
  };

  const OnRemoving = async (e) => {
    e.cancel = true;

    if (e.data) {
      await DELETE_ACCOUNT_MONEY_TYPE(e.data.id)
        .then(async (result) => {
          // // Adding new item
          // let updatedSelectedMainLookup = selectedMainLookup;

          _.remove(dataSource, (element) => {
            return element.id === e.data.id;
          });

          // setSelectedMainLookup(selectedMainLookup);

          // Stop Editing
          await e.component.saveEditData();
          await e.component.cancelEditData();
          await e.component.refresh(true);

          // Notify User
          notify(
            {
              message: `Deleted Successfully`,
              width: 450,
            },
            "success",
            2000
          );
        })
        .catch(async (error) => {
          console.log(error);
          await e.component.refresh(true);
          e.component.cancelEditData();
          notify(
            {
              message: `${error}`,
              width: 450,
            },
            "error",
            2000
          );
        });
    }
    console.log(e);
  };

  return (
    <React.Fragment>
      <DataGrid
        id=""
        onEditorPreparing={onEditorPreparing}
        repaintChangesOnly={true}
        highlightChanges={true}
        disabled={disabled}
        width={width}
        height={"40vh"}
        showRowLines={true}
        rtlEnabled={true}
        hoverStateEnabled={true}
        dataSource={dataSource}
        showBorders={true}
        columnAutoWidth={true}
        allowColumnResizing={true}
        wordWrapEnabled={true}
        selection={{ mode: selectionMode }}
        onSelectionChanged={onSelectionChanged}
        onRowUpdating={onUpdating}
        onRowRemoving={OnRemoving}
        onRowRemoved={onRowRemoved}
        onRowInserting={onInserting}
        onRowDblClick={onRowDoubleClick}
        onSaving={onSaving}
        onInitNewRow={onInitNewRow}
        onToolbarPreparing={
          onInsertButtonClicked &&
          ((e) => onToolbarPreparing(e, onInsertButtonClicked))
        }
      >
        <FilterRow visible={filterRow} />
        <HeaderFilter visible={headerFilter} />
        <GroupPanel visible={groupPanel} />
        <Editing
          mode="form"
          useIcons={true}
          allowAdding={true}
          allowDeleting={true}
          allowUpdating={true}
        >
          <Texts
            exportAll="تصدير الكل"
            exportSelectedRows="تصدير المحدد"
            exportTo="تصدير الى"
            addRow="إضافة جديد"
            editRow="تعديل"
            saveRowChanges="حفظ"
            cancelRowChanges="إلغاء"
            deleteRow="حذف"
            confirmDeleteMessage="هل انت متأكد من حذف هذا الاختيار ؟"
          />
        </Editing>
        <Scrolling mode="virtual" />

        <Column
          key={1}
          name={"omla_id"}
          dataType={"string"}
          dataField={"omla_id"}
          caption={i18n.language === "ar" ? "العملة" : "Currency"}
          alignment={"center"}
          // allowEditing={false}
        >
          <Lookup
            dataSource={moneyTypes}
            displayExpr="description"
            valueExpr="id"
          />
          <RequiredRule
            message={
              i18n.language === "en"
                ? "This field is required"
                : "هذا الحقل مطلوب"
            }
          />
        </Column>

        <Column
          key={2}
          name={"mden"}
          dataType={"number"}
          dataField={"mden"}
          caption={i18n.language === "ar" ? "مدين" : "Debtor"}
          alignment={"center"}
        >
          <RequiredRule
            message={
              i18n.language === "en"
                ? "This field is required"
                : "هذا الحقل مطلوب"
            }
          />
        </Column>

        <Column
          key={3}
          name={"daen"}
          dataType={"number"}
          dataField={"daen"}
          caption={i18n.language === "ar" ? "دائن" : "Creditor"}
          alignment={"center"}
        >
          <RequiredRule
            message={
              i18n.language === "en"
                ? "This field is required"
                : "هذا الحقل مطلوب"
            }
          />
        </Column>

        <Column
          key={4}
          name={"ex_rate"}
          dataType={"number"}
          dataField={"ex_rate"}
          caption={i18n.language === "ar" ? "معدل" : "Ex. Rate"}
          alignment={"center"}
        >
          <RequiredRule
            message={
              i18n.language === "en"
                ? "This field is required"
                : "هذا الحقل مطلوب"
            }
          />
        </Column>
      </DataGrid>
    </React.Fragment>
  );
}

const onToolbarPreparing = (e, onInsertButtonClicked) => {
  let toolbarItems = e.toolbarOptions.items;
  // Modifies an existing item
  toolbarItems.forEach(function (item) {
    if (item.name === "addRowButton") {
      const oo = item.options.onClick;
      item.options = {
        ...item.options,
        // icon: "exportxlsx",
        text: "إضافة",
        onClick: async function (e) {
          await onInsertButtonClicked();
          oo(e);
        },
      };
    }
  });
};

export default React.memo(AccountsGuideMoneyTypesTable);
