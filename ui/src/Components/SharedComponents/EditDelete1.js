import React, { useState, useEffect, useCallback, useRef } from "react";
import notify from "devextreme/ui/notify";
import { Button as ButtonExpress } from "devextreme-react/button";
import { confirm } from "devextreme/ui/dialog";
import MasterTable from "../../Components/SharedComponents/Tables Components/MasterTable";
import { useTranslation } from "react-i18next";

function EditDelete(props) {
  const {
    data, // Data Source
    columnAttributes, // Columns Names
    editDeleteStatus, // Determine if it's a delete or edit and on this adding recycle bin icon in delete case
    getEditData, // Setstate from your primary page to get on it the selected data
    close, // close function on deleteing خروج
    deleteItem, // Deleting row API ... you are to give it id only, regarding this data object has the id as "ID"
  } = props;

  // To set the id of the selected row in it to enable deleting or editing on clicking ok.
  const selectedRowID = useRef("");
  const { t, i18n } = useTranslation();

  // helpers
  // Can delete popup
  let deletedPopUp = useCallback(() => {
    notify({ message: t("Deleted Successfully"), width: 600 }, "success", 3000);
    close();
  }, [close]);

  // Canot delete popup

  let notDeletedpopUp = useCallback(() => {
    notify(
      { message: t("Cannot delete this item"), width: 600 },
      "error",
      3000
    );
  }, []);

  // Handelers
  // Handle selection and setting selected row id to id storage
  let handleSelection = useCallback((event) => {
    // console.log("EDITDELETE-handleSelection");
    if (event.currentSelectedRowKeys[0] != undefined) {
      selectedRowID.current = event.currentSelectedRowKeys[0].ID;
    }
  }, []);

  // Handle double click on row of the table , mostly look like handle Ok except for parameter.
  let handleDoubleClick = useCallback(
    async (event) => {
      // console.log("EDITDELETE-handleDoubleClick");

      // checks if we need modal for delete or edit to handle functionality.
      if (editDeleteStatus === "delete") {
        let result = confirm(t("Are you sure you want to delete this check?"));
        //	Deleting and closing on pressing ok
        await result.then(async (dialogResult) => {
          if (dialogResult) {
            console.log(event.key.ID);
            await deleteItem(event.key.ID)
              .then((res) => {
                deletedPopUp();
              })
              .catch((err) => notDeletedpopUp());
          }
        });
      } else {
        getEditData(event.data);
        // console.log(close);
        close();
      }
    },
    [
      editDeleteStatus,
      deleteItem,
      deletedPopUp,
      notDeletedpopUp,
      getEditData,
      close,
    ]
  );

  // Handle Pressing Ok
  let handleOk = useCallback(async () => {
    // console.log("EDITDELETE-handleOk");

    if (editDeleteStatus === "delete") {
      let result = confirm(t("Are you sure you want to delete this option?"));
      await result.then(async (dialogResult) => {
        if (dialogResult) {
          await deleteItem(selectedRowID.current)
            .then((res) => {
              deletedPopUp();
            })
            .catch((err) => {
              notDeletedpopUp();
            });
        }
      });
    } else {
      console.log(["71", data]);
      var data1 = data.find((element) => element.ID === selectedRowID.current);
      getEditData(data1);
      close();
    }
  }, [
    close,
    data,
    deleteItem,
    deletedPopUp,
    editDeleteStatus,
    getEditData,
    notDeletedpopUp,
  ]);

  // handle delete function depending on id of row "on clicking on recycle bin icon"
  let handleDelete = useCallback(
    async (event) => {
      // console.log("EDITDELETE-handleDelete");
      event.cancel = true;
      console.log(event);
      await deleteItem(event.data.ID)
        .then((res) => {
          deletedPopUp();
        })
        .catch((err) => {
          notDeletedpopUp();
        });
    },
    [deleteItem, deletedPopUp, notDeletedpopUp]
  );

  return (
    <div>
      <MasterTable
        dataSource={data}
        colAttributes={columnAttributes}
        filterRow
        onRowDoubleClick={handleDoubleClick}
        height={"300px"}
        columnChooser={true}
        onSelectionChanged={handleSelection}
        allowDelete={editDeleteStatus === "delete" ? true : false}
        onRowRemoving={handleDelete}
      />
      {/* {console.log("EDITDELETE")} */}

      <div
        style={{
          width: "40%",
          display: "flex",
          justifyContent: "space-around",
          flexWrap: "wrap",
          marginTop: "5%",
        }}
      >
        <ButtonExpress
          width={120}
          height={34}
          text={t("Cancel")}
          type="danger"
          stylingMode="contained"
          onClick={close}
        />

        <ButtonExpress
          width={120}
          height={34}
          text={t("Ok")}
          type="success"
          stylingMode="contained"
          onClick={handleOk}
        />
      </div>
    </div>
  );
}

export default React.memo(EditDelete);
