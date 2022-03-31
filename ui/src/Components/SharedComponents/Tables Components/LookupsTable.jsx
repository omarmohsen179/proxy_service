import React from "react";

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
} from "devextreme-react/data-grid";
import { CHECK_LOOKUP_VALUE } from "../../../Services/ApiServices/General/LookupsAPI";
import { CustomRule } from "devextreme-react/form";
import { useTranslation } from "react-i18next";
import { t } from "i18next";

function LookupsTable({
  disabled = false,
  //* "single" "multiple"
  selectionMode = "single",
  //* [{ }, ...]
  dataSource = [],
  colAttributes = [],
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
  const validation = async (e) => {
    try {
      const response = await CHECK_LOOKUP_VALUE({
        Table: dataSource.tablename,
        ID: e.data.id,
        CheckData: { [e.column.name]: e.value },
      });
      // console.log({
      //     Table: dataSource.tablename,
      //     ID: e.data.id,
      //     CheckData: { [e.column.name]: e.value },
      // });
      return response.Check;
    } catch (error) {
      return console.log(error);
    }
  };

  return (
    <React.Fragment>
      <DataGrid
        id="lookupsTable"
        repaintChangesOnly={true}
        highlightChanges={true}
        disabled={disabled}
        width={width}
        height={height}
        showRowLines={true}
        hoverStateEnabled={true}
        dataSource={dataSource}
        rtlEnabled={true}
        showBorders={true}
        columnAutoWidth={true}
        allowColumnResizing={true}
        wordWrapEnabled={true}
        selection={{ mode: selectionMode }}
        onSelectionChanged={onSelectionChanged}
        onRowUpdating={onRowUpdating}
        onRowRemoving={onRowRemoving}
        onRowRemoved={onRowRemoved}
        onRowInserting={onRowInserting}
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
          mode="row"
          useIcons={true}
          allowAdding={true}
          allowDeleting={true}
          allowUpdating={true}
        >
          <Texts
            exportAll={t("export all")}
            exportSelectedRows={t("export selected")}
            exportTo={t("export to")}
            addRow={t("add new")}
            editRow={t("Update")}
            saveRowChanges={t("Save")}
            cancelRowChanges={t("Cancel")}
            deleteRow={t("Remove")}
            confirmDeleteMessage={t("Are you sure to delete this element?")}
          />
        </Editing>
        <Scrolling mode="virtual" />
        {colAttributes &&
          colAttributes.map((col, index) => {
            //
            // console.log(col);
            return (
              <Column
                key={index}
                name={col.field}
                dataType={col.dataType || "string"}
                visible={col.isVisable}
                dataField={col.field}
                caption={
                  i18n.language === "en"
                    ? col.captionEn ?? col.caption
                    : col.caption
                }
                alignment={col.alignment || "right"}
                format={col.format}
                width={
                  col.widthRatio
                    ? `${col.widthRatio}px`
                    : `${(100 - col.widthRatio) / (colAttributes.length + 1)}%`
                }
              >
                {col.required && (
                  <RequiredRule message={t("This Input is Required")} />
                )}
              </Column>
            );
          })}

        <Export enabled={true} allowExportSelectedData={true} />
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
        text: t("Add"),
        onClick: async function (e) {
          await onInsertButtonClicked();
          oo(e);
        },
      };
    }
  });
};

export default React.memo(LookupsTable);
