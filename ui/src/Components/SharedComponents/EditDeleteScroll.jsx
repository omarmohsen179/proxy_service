import React, {
  useState,
  useEffect,
  useCallback,
  useRef,
  useMemo,
} from "react";
import notify from "devextreme/ui/notify";
import { Button as ButtonExpress } from "devextreme-react/button";
import { confirm } from "devextreme/ui/dialog";
import MasterTable from "../../Components/SharedComponents/Tables Components/MasterTable";
import FilterQueryTable from "./Tables Components/FilterQueryTable";
// import { GET_EDIT_DELETE_DATA } from "../../Pages/5.MiscellaneousTab/TypesTransfer/API.TypesTransfer";

function EditDelete(props) {
  const {
    //	data, // Data Source
    columnAttributes, // Columns Names
    editDeleteStatus, // Determine if it's a delete or edit and on this adding recycle bin icon in delete case
    getEditData, // Setstate from your primary page to get on it the selected data
    close, // close function on deleteing خروج
    deleteItem, // Deleting row API ... you are to give it id only, regarding this data object has the id as "ID"
    APIMethod,
    APIPayload,
    remoteOperations,
    removeApiMethod,
    removeApiPayload,

    TABLE_DATA_API, // API of getting data to the table
    remoteOperationsObject = { item: undefined }, // Object that has values to be checked if not undefined so api works
    apiPayloadDataObject = undefined, // Object that has api payload
  } = props;

  // To set the id of the selected row in it to enable deleting or editing on clicking ok.
  const selectedRowID = useRef("");
  const [data, setData] = useState();

  // Handelers
  // Handle selection and setting selected row id to id storage
  let handleSelection = useCallback((event) => {
    // console.log("EditDeleteInfiniteLoad-handleSelection");
    if (event.currentSelectedRowKeys[0] != undefined) {
      selectedRowID.current = event.currentSelectedRowKeys[0].ID;
    }
  }, []);

  // Handle double click on row of the table , mostly look like handle Ok except for parameter.
  let handleDoubleClick = useCallback(
    async (event) => {
      // console.log("EditDeleteInfiniteLoad-handleDoubleClick");

      // checks if we need modal for delete or edit to handle functionality.
      if (editDeleteStatus === "delete") {
        let result = confirm("هل أنت متأكد من حذف هذا الاختيار؟");
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
        close();
      }
    },
    [editDeleteStatus]
  );

  // Handle Pressing Ok
  let handleOk = useCallback(async () => {
    // console.log("EditDeleteInfiniteLoad-handleOk");

    if (editDeleteStatus === "delete") {
      let result = confirm("هل أنت متأكد من حذف هذا الإختيار؟");
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
      var data1 = data.find((element) => element.ID === selectedRowID.current);
      getEditData(data1);
      close();
    }
  }, [data]);

  // handle delete function depending on id of row "on clicking on recycle bin icon"
  let handleDelete = useCallback(
    async (event) => {
      // console.log("EditDeleteInfiniteLoad-handleDelete");
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
    [deleteItem, deleteItem]
  );

  // helpers
  // Can delete popup
  let deletedPopUp = () => {
    notify({ message: "تم مسح هذا العنصر ", width: 600 }, "success", 3000);
    close();
  };

  // Canot delete popup

  let notDeletedpopUp = () => {
    notify({ message: "لا يمكن مسح هذا العنصر", width: 600 }, "error", 3000);
  };

  ///// Infinite Scroll Stuff /////

  let remoteOperationsHandler = useMemo(() => {
    Object.values(remoteOperationsObject).forEach((item) => {
      if (item == undefined) {
        return false;
      }
    });
    return true;
  }, [remoteOperationsObject]);

  let hanldetableData = useCallback((data1) => {
    setData(data1);
  }, []);
  // console.log("Re-render");
  return (
    <div>
      {console.log("EditDeleteScroll")}
      <FilterQueryTable
        colAttributes={columnAttributes}
        height={"300px"}
        filterRow
        remoteOperations={removeApiMethod}
        apiMethod={APIMethod}
        // apiMethod={GET_EDIT_DELETE_DATA}
        apiPayload={apiPayloadDataObject}
        otherMethod={hanldetableData}
        // summaryItems={itemSummaryItems.current}
        allowExcel={true}
        allowPrint={true}
        onRowDoubleClick={handleDoubleClick}
        columnChooser={true}
        onSelectionChanged={handleSelection}
        allowDelete={editDeleteStatus === "delete" ? true : false}
        onRowRemoving={handleDelete}
      />
      {/* {console.log("EditDeleteInfiniteLoad")} */}
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
          text="إلغاء الأمر"
          type="danger"
          stylingMode="contained"
          onClick={close}
        />

        <ButtonExpress
          width={120}
          height={34}
          text="موافق"
          type="success"
          stylingMode="contained"
          onClick={handleOk}
        />
      </div>
    </div>
  );
}

export default React.memo(EditDelete);

/*
<InputTableEdit
dataSource={data}
colAttributes={columnAttributes}
remoteOperations={ remoteOperations}
apiMethod={APIMethod}
apiPayload={APIPayload}
removeApiMethod={removeApiMethod}
removeApiPayload ={removeApiPayload}
filterRow
onRowDoubleClick={handleDoubleClick}
height={"300px"}
columnChooser={true}
onSelectionChanged={handleSelection}
allowDelete={editDeleteStatus === "delete" ? true : false}
onRowRemoving={handleDelete}
/>
*/
