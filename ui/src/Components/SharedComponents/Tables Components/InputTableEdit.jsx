import React, { useState, useEffect, useRef, useMemo } from "react";
import CustomStore from "devextreme/data/custom_store";
import notify from "devextreme/ui/notify";
import {
  Column,
  DataGrid,
  FilterRow,
  HeaderFilter,
  GroupPanel,
  Scrolling,
  Editing,
  Grouping,
  Lookup,
  MasterDetail,
  Button,
  Summary,
  RangeRule,
  RequiredRule,
  StringLengthRule,
  GroupItem,
  TotalItem,
  ValueFormat,
  Texts,
} from "devextreme-react/data-grid";
import SelectBox from "devextreme-react/select-box";
import { useTranslation } from "react-i18next";

function InputTableEdit({
  id = "",
  disabled = false,
  selectionMode = "single",
  dataSource,
  colAttributes,
  width = "100%",
  height = "100%",
  filterRow = true,
  groupPanel = false,
  headerFilter = false,
  canAdd = false,
  canUpdate = false,
  canDelete = true,
  onSelectionChanged,
  onRowRemoving,
  onRowRemoved,
  Uicon = false,
  onRowUpdated,
  deleteMessage = "هل انت متأكد من حذف هذا الاختيار ؟",
  optionChanged = null,
  remoteOperations = false,
  apiMethod,
  apiPayload,
  apiKey,
  onRowDoubleClick,
  mode,
}) {
  const { t, i18n } = useTranslation();
  let values = useRef();
  function onEditorPreparing(e) {
    var colind = colAttributes.map((item) => item.field).indexOf(e.dataField);
    if (colAttributes[colind].readOnly && e.parentType === "dataRow") {
      e.editorOptions.readOnly = true;
    }
  }
  const store = useMemo(
    () =>
      new CustomStore({
        // Key of this object
        key: apiKey,
        // OnLoad Event
        // (skip, take) => {return {data, totalCount}}
        load: function ({ skip, take }) {
          // API method

          return apiMethod({ ...apiPayload, skip, take }).then((data) => {
            // Return must be in this structure
            return {
              // Array of data that will shown in table
              data: data.data,
              // Total count of element will get from API
              totalCount: data.totalCount,
            };
          });
        },
        remove: (key) => {
          console.log(key);
        },
      }),
    [apiMethod, apiPayload, apiKey]
  );
  let data = remoteOperations ? store : dataSource;
  return (
    <React.Fragment>
      <DataGrid
        disabled={disabled}
        id={id}
        width={width}
        height={height}
        selection={{ mode: selectionMode }}
        showRowLines={true}
        hoverStateEnabled={true}
        dataSource={data}
        rtlEnabled={i18n.language === "ar"}
        showBorders={true}
        onRowDblClick={onRowDoubleClick}
        columnAutoWidth={true}
        allowColumnResizing={true}
        wordWrapEnabled={true}
        onSelectionChanged={onSelectionChanged}
        onRowRemoving={(e) => {
          onRowRemoving(e);
        }}
        onRowRemoved={onRowRemoved}
        onRowUpdated={onRowUpdated}
        onEditorPreparing={onEditorPreparing}
        remoteOperations={remoteOperations}
        sorting={!remoteOperations}
        onOptionChanged={(e) => {
          if (
            e.name != "hoveredElement" &&
            e.fullName &&
            optionChanged != null
          ) {
            if (e.fullName.match(/(\d+)/)) {
              if (
                colAttributes[e.fullName.match(/(\d+)/)[0]].dataType ==
                  "date" &&
                e.value
              ) {
                var today = new Date(e.value);
                e.value =
                  today.getFullYear() +
                  "-" +
                  String(today.getMonth() + 1).padStart(2, "0") +
                  "-" +
                  String(today.getDate()).padStart(2, "0");
                values.current = {
                  ...values.current,
                  [colAttributes[e.fullName.match(/(\d+)/)[0]].field]: {
                    type: "date",
                    value: e.value,
                  },
                };
              } else {
                values.current = {
                  ...values.current,
                  [colAttributes[e.fullName.match(/(\d+)/)[0]].field]: e.value,
                };
              }

              let str = "";
              for (const property in values.current) {
                if (values.current[property] != null) {
                  if (values.current[property].type) {
                    str +=
                      " cast( " +
                      property.replace("-", ".") +
                      " as date)  like '%" +
                      values.current[property].value +
                      "%'  and";
                  } else {
                    str +=
                      " " +
                      property.replace("-", ".") +
                      " like '%" +
                      values.current[property] +
                      "%'  and";
                  }
                }
              }
              var res = str.split(" ");
              res.pop();
              optionChanged(res.join(" "));
            }
          }
        }}
      >
        <FilterRow visible={filterRow} />
        <HeaderFilter visible={headerFilter} />
        <GroupPanel visible={groupPanel} />
        <Scrolling mode="virtual" />
        <Editing
          mode={mode ? "cell" : "row"}
          useIcons={Uicon}
          allowAdding={canAdd}
          allowDeleting={canDelete}
          allowUpdating={canUpdate}
        >
          <Texts deleteRow="حذف" confirmDeleteMessage={deleteMessage} />
        </Editing>
        {colAttributes.map((attr, index) => {
          return (
            <Column
              format={attr.field == "date" ? "M/d/yyyy" : null}
              key={index}
              type={attr.dataType == "button" ? "buttons" : null}
              dataType={attr.dataType}
              dataField={attr.field}
              caption={
                i18n.language === "ar"
                  ? attr.caption
                  : attr.captionEn ?? attr.caption
              }
              minWidth={attr.widthRatio ? `${attr.widthRatio}px` : "150px"}
            >
              {attr.data ? (
                <Lookup
                  dataSource={attr.data}
                  displayExpr="name"
                  valueExpr="id"
                />
              ) : null}
              {attr.dataType == "button" ? (
                <Button
                  text={attr.text}
                  icon={attr.icon ? attr.icon : null}
                  onClick={(e) => {
                    attr.func(e.row.data);
                  }}
                />
              ) : null}
            </Column>
          );
        })}
      </DataGrid>
    </React.Fragment>
  );
}

export default InputTableEdit;
