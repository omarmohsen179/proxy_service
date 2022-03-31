import React, { useState, useEffect } from "react";
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

function AdvancedTable({
    id = "",
    disabled = false,
    selectionMode = "single",
    dataSource,
    colAttributes,
    width = "100%",
    height = "100%",
    filterRow = true,
    groupPanel = false,
    headerFilter = true,
    canAdd = false,
    canUpdate = false,
    canDelete = true,
    onSelectionChanged,
    onRowRemoving,
    onRowRemoved,
    Uicon=false,
    onRowUpdated,
    deleteMessage = "هل انت متأكد من حذف هذا الاختيار ؟",
}) {
    function  onEditorPreparing(e) {
        var colind = colAttributes.map((item) => item.field).indexOf(e.dataField);
            if( colAttributes[colind].readOnly) {
              e.editorOptions.readOnly = colAttributes[colind].readOnly;
            }
          }
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
                dataSource={dataSource}
                rtlEnabled={true}
                showBorders={true}
                paging={false}
                columnAutoWidth={true}
                allowColumnResizing={true}
                wordWrapEnabled={true}
                onSelectionChanged={onSelectionChanged}
                onRowRemoving={onRowRemoving}
                onRowRemoved={onRowRemoved}
                onRowUpdated={onRowUpdated}
                onEditorPreparing={onEditorPreparing}
            >
                <FilterRow visible={filterRow} />
                <HeaderFilter visible={headerFilter} />
                <GroupPanel visible={groupPanel} />
                <Scrolling mode="virtual" />
                <Editing
                    mode="row"
                    useIcons={Uicon}
                    allowAdding={canAdd}
                    allowDeleting={canDelete}
                    allowUpdating={canUpdate}
                >
                    <Texts
                        deleteRow="حذف"
                        confirmDeleteMessage={deleteMessage}
                    />
                </Editing>
                {colAttributes.map((attr, index) => {
                    return (
                        <Column
                            key={index}
                            name={attr.field}
                            dataField={attr.field}
                            caption={attr.caption}
                            minWidth={
                                attr.widthRatio
                                    ? `${attr.widthRatio}px`
                                    : "150px"
                            }
                        />
                    );
                })}
            </DataGrid>
        </React.Fragment>
    );
}

export default AdvancedTable;