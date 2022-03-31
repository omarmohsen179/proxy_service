// React
import React, {
  useEffect,
  useState,
  useRef,
  useCallback,
  useMemo,
} from "react";

// Devexpress
import { SpeedDialAction } from "devextreme-react/speed-dial-action";
import Popup from "devextreme-react/popup";
import { ScrollView } from "devextreme-react";
import notify from "devextreme/ui/notify";

// API
import {
  // API for getting all data of marketers - الليست الخاصة بالمسوق
  GET_MARKETERS_LIST,
  // API for updating regulation item "rows of table"
  UPDATE_MARKETERS_REGULATION,
  // API for getting data of edit or delete popup "regulations that is to be edited or deleted"
  GET_EDIT_DELETE_DATA,
  // API for getting regulation rows to be set in master table and to be edited
  GET_EDIT_DATA,
  // Delete a full regulation throug delete popup
  DELETE_REGULATION,
  // Delete a regulation item throug master table
  DELETE_REGULATION_ITEM,
} from "./API.MarketersRegulations";

// Components
import LookupTbale from "../../../Components/SharedComponents/Tables Components/LookupsTable";
import ButtonRow from "../../../Components/SharedComponents/buttonsRow";
import EditDelete from "../../../Components/SharedComponents/EditDelete";
import { SelectBox, TextBox } from "../../../Components/Inputs";

// Css
import "./marketersRegulations.css";
import { t } from "i18next";

function MarketersRegulations() {
  // =========================================================================================================================
  // ====================================================== Lists ============================================================
  // =========================================================================================================================

  // Columns names and details of the Lookup table.. // main table
  let mainTableColumnsAttributes = [
    {
      caption: t("From"),
      field: "fromm",
      alignment: "center",
      dataType: "number",
      required: true,
      isVisable: true,
    },
    {
      caption: t("To"),
      field: "too",
      alignment: "center",
      dataType: "number",
      required: true,
      isVisable: true,
    },
    {
      caption: t("Percentage"),
      field: "mosweq_nesba",
      alignment: "center",
      dataType: "number",
      required: true,
      isVisable: true,
    },
  ];

  // Columns names and details of the Lookup table.. // Edit and delete table
  let editDeleteTableColumnAttributes = [
    { field: "mosweq_id", caption: t("Number"), isVisable: true },
    { field: "name", caption: t("البيان"), isVisable: true },
  ];

  // Object sent in submiting new and updated data.
  let submitObject = {
    Data: [
      {
        ID: "0", // in case of adding id =0; in case of editing we will get id and it will be considered as the id of the whole screen
        RegulationBasicInfo: {
          name: "",
          mosweq_id: "",
        },
        RegulationsList: [{ id: "", fromm: "", too: "", mosweq_nesba: "" }], // id wont be in this object in case of adding
      },
    ],
  };
  // =========================================================================================================================
  // ====================================================== state ============================================================
  // =========================================================================================================================

  // getting and setting the data of the marketeres in the drop downlist
  const [marketersListData, setMarketersListData] = useState();
  // getting and setting the dataSource of the Lookup Table ...// data of main table
  const [tableData, setTableData] = useState([]);
  // data list that is listed in edit or delete tables
  const [editDeleteData, setEditDeleteData] = useState();
  // Object contains the edit data that is selected from the edit data list
  const [editDataObject, setEditDataObject] = useState({});
  // State of the select box that is used to toggle between المسوق as alabel from select box to text box and vice versa
  // and this is because we need it to be disabled sometime so we switch it to text box and disabel it
  const selectBoxStatue = useRef(true);
  // Object that defines id and name of marketer to be put in submit object
  const marketersValue = useRef({
    mosweq_id: "",
    name: "",
  });
  // error object
  const [errors, setErrors] = useState([]);
  // edit and delete popup open or close toggle
  const [editDeleteOpenClose, setEditDeleteOpenClose] = useState(false);
  // to determine if current opening of the popup is for edit or delete!
  const editDeleteStatus = useRef("");
  // the ID of the submit object
  const submitObjectID = useRef("");

  // =========================================================================================================================
  // ====================================================== effects ==========================================================
  // =========================================================================================================================

  //..
  // setting marketers data in the drop down list in first render of the component
  useEffect(async () => {
    console.log("InitialEffect");
    // Function that calls get GET_MARKETERS_LIST API
    await getMarketersList("حدث خطا في تحميل قائمة المسوقين");
  }, []);

  // Choosing any regulation from popup effect
  useEffect(() => {
    if (Object.keys(editDataObject).length > 0) {
      // Very important tip!!!!
      // if you wanted for any reaseon remove calling api, replace useref by usestate for
      // submitObjectID and marketersValue

      // when getting edit data to the master table, select box is turned into textbox and disbled.
      selectBoxStatue.current = false;
      let { ID, name, mosweq_id } = editDataObject;
      // Setting props to submit object depending on edit data
      submitObjectID.current = ID;
      marketersValue.current = {
        name: name,
        mosweq_id: mosweq_id,
      };

      // Every Regulation has its data, so after choosing one regulation from edit list we get its ID
      // and get its data from this API
      GET_EDIT_DATA(ID)
        .then((res) => {
          setTableData(res);
        })
        .catch((err) => {
          showNotifyError(
            t("An error occurred fetching marketer data for the table")
          );
          console.log(err);
        });
    }
  }, [editDataObject]);

  // =========================================================================================================================
  // ====================================================== handelers ========================================================
  // =========================================================================================================================

  // handeling chnages depeneding on choosing regulations fro selectbox
  // and make necessary resets
  let handleChange = useCallback(
    async ({ value }) => {
      console.log("HandleChange");
      marketersValue.current = {
        name: marketersListData?.filter((item) => item.mosweq_id == value)[0]
          ?.name,
        mosweq_id: value,
      };

      submitObjectID.current = "";
      console.log(errors.length);
      console.log(tableData.length);

      setErrors([]);
      if (tableData.length > 0) setTableData([]);

      // Function for calling GET_MARKETERS_LIST API
      await getMarketersList(
        t("An error occurred fetching the marketer's data for the table")
      );
    },
    [marketersListData]
  );

  // Submit and update
  let onRowInserting = useCallback((e) => {
    console.log("onRowInserting");
    console.log(e);
    e.cancel = true;
    // console.log("hi");

    if (marketersValue.current.mosweq_id === "") {
      let error = [t("The marketer must be chosen first.")];
      setErrors(error);
      return;
    } else {
      let regulationsListObject;

      // Making submit or edit object
      // e.data is submit object from devexpress
      // else will get you e.key which is edit object from devexpress
      if (e.data) {
        regulationsListObject = e.data;
        submitObject.Data[0].RegulationsList[0] = {
          fromm: regulationsListObject.fromm,
          too: regulationsListObject.too,
          mosweq_nesba: regulationsListObject.mosweq_nesba,
        };
      } else {
        regulationsListObject = e.key;
        let newData = e.newData;
        submitObject.Data[0].RegulationsList[0] = {
          id: regulationsListObject.id,
          fromm: newData.fromm ?? regulationsListObject.fromm,
          too: newData.too ?? regulationsListObject.too,
          mosweq_nesba:
            newData.mosweq_nesba ?? regulationsListObject.mosweq_nesba,
        };
      }

      submitObject.Data[0].RegulationBasicInfo = marketersValue.current;
      submitObjectID.current === ""
        ? (submitObject.Data[0].ID = 0)
        : (submitObject.Data[0].ID = submitObjectID.current);
      ////////////////
      // submit or update API
      UPDATE_MARKETERS_REGULATION(submitObject)
        .then(async (res) => {
          console.log(res);
          selectBoxStatue.current = false;
          submitObjectID.current = res.id;
          submitObject.Data[0].ID = submitObjectID.current;
          // e.data for submit, else will be e.key is for update
          if (e.data) {
            setTableData((prevState) => [...prevState, res.RegulationsList]);
          } else {
            setTableData((prevState) => {
              let editedObjectIndex = tableData.findIndex(
                (element) => element.id === e.key.id
              );
              console.log(editedObjectIndex);
              let _data = prevState;
              _data[editedObjectIndex] = res.RegulationsList;
              console.log(_data);

              return _data;
            });
          }

          await e.component.refresh(true);
          await e.component.cancelEditData();
          setErrors([]);
        })
        .catch(async (err) => {
          let errObj = [];
          // console.log(err.response.data.Errors);
          // console.log(err.response.status);

          if (err.response != undefined) {
            if (err.response.status == 400) {
              err.response.data.Errors.map(
                (element, index) => (errObj[index] = element.Error)
              );
              await e.component.refresh(true);
              e.component.cancelEditData();
              // console.log(errObj);
              setErrors(errObj);
            } else {
              notify(
                { message: t("Failed Try again"), width: 600 },
                "error",
                3000
              );
            }
          } else {
            notify(
              { message: t("Failed Try again"), width: 600 },
              "error",
              3000
            );
          }
        });
    }
  });

  // Handeler for
  // 1- Open and close edit or delete popup
  // 2- Define Edit or delete Status
  // 3- get data to pe poped up.

  let handleEditDelete = useCallback(
    async (buttonType) => {
      console.log("handleEditDelete");

      // To determine button clicked type if delete or edit.
      // which defines state in EditDelete Components.
      if (buttonType === "edit") {
        editDeleteStatus.current = "edit";
      } else if (buttonType === "delete") {
        editDeleteStatus.current = "delete";
      }

      // Open or close Toggler setter
      setEditDeleteOpenClose(!editDeleteOpenClose);

      // Get data to pop up.
      await GET_EDIT_DELETE_DATA()
        .then((res) => {
          setEditDeleteData(res);
        })
        .catch((err) => {
          showNotifyError(
            t("An error occurred fetching the marketer's data for the table")
          );
          console.log(err);
        });
    },
    [editDeleteOpenClose]
  );

  // Deleting a regulation item
  let OnRemoving = async (e) => {
    console.log("OnRemoving");

    e.cancel = true;
    let regulationId =
      Object.keys(editDataObject).length > 0
        ? editDataObject.ID
        : submitObjectID.current;

    let regulationItemId = e.data.id;

    await DELETE_REGULATION_ITEM(regulationId, regulationItemId)
      .then((res) =>
        setTableData((prevState) =>
          prevState.filter((element) => element.id != regulationItemId)
        )
      )
      .catch((err) => {
        showNotifyError(t("An error occurred deleting the item"));
        console.log(err);
      });
  };

  // Deleting and dependent logic on deleting
  //
  let handleReset = async () => {
    console.log("handleReset");
    tableData.length > 0 && setTableData([]);
    selectBoxStatue.current = true;
    submitObjectID.current = "";
    marketersValue.current = {
      mosweq_id: "",
      name: "",
    };

    // Function for calling GET_MARKETERS_LIST API
    await getMarketersList(
      t("An error occurred fetching the marketer's data for the table")
    );
  };
  let handleDelete = useCallback(
    async (id) => {
      console.log("handleDelete");
      DELETE_REGULATION(id)
        .then()
        .catch((err) => {
          showNotifyError(t("Failed Try again"));
          console.log(err);
        });
      setEditDeleteOpenClose(!editDeleteOpenClose);
      await handleReset();
    },
    [editDeleteOpenClose, handleReset]
  );

  // Reseting

  // Clearing errors in case of pressing add button
  let onInsertButtonClicked = (e) => {
    console.log("onInsertButtonClicked");

    return setErrors([]);
  };

  // Error popup function
  let showNotifyError = (message = t("Failed Try again")) => {
    notify({ message: message, width: 600 }, "error", 3000);
  };

  // Function for calling GET_MARKETERS_LIST API
  let getMarketersList = async (erroMessage = t("Failed Try again")) => {
    await GET_MARKETERS_LIST()
      .then((res) => {
        {
          setMarketersListData(res);
        }
      })
      .catch((err) => {
        showNotifyError(erroMessage);
        console.log(err);
      });
  };

  // =========================================================================================================================
  // ====================================================== return ===========================================================
  // =========================================================================================================================
  return (
    <div className="container ">
      <div className="marketersregulationsTitle">{t("Price lists")}</div>
      <div className="card p-5 mt-3">
        {/* SelectBox */}
        <div className="double mt-4">
          {selectBoxStatue.current ? (
            <SelectBox
              dataSource={marketersListData}
              label={t("Marketer")}
              keys={{ id: "mosweq_id", name: "name" }}
              name="mosweq_id"
              value={marketersValue.current.mosweq_id}
              handleChange={handleChange}
              required={false}
            />
          ) : (
            <TextBox
              label={t("Marketer")}
              value={marketersValue.current.name}
              name="mosweq_id"
              handleChange={handleChange}
              required={false}
              readOnly={true}
            />
          )}
        </div>
        {/* Table */}

        <LookupTbale
          dataSource={tableData}
          height={40 + "vh"}
          colAttributes={mainTableColumnsAttributes}
          onRowInserting={(e) => onRowInserting(e)}
          onInsertButtonClicked={(e) => onInsertButtonClicked(e)}
          onRowUpdating={(e) => onRowInserting(e)}
          onRowRemoving={(e) => OnRemoving(e)}
        />

        <div className="marketersregulationsErrors" dir={"auto"}>
          {errors.length > 0 && errors.map((element) => <li>{element}</li>)}
        </div>

        <div className="mt-5">
          <ButtonRow
            isExit={false}
            isSimilar={false}
            isSubmit={false}
            isBack={false}
            onEdit={handleEditDelete}
            onDelete={handleEditDelete}
            onNew={handleReset}
          />
        </div>
      </div>
      <Popup
        maxWidth={"50%"}
        minWidth={250}
        minHeight={"50%"}
        closeOnOutsideClick={true}
        visible={editDeleteOpenClose}
        onHiding={handleEditDelete}
        title={editDeleteStatus.current}
      >
        <ScrollView>
          {/* Edit and delete Modal  */}
          <EditDelete
            data={editDeleteData}
            columnAttributes={editDeleteTableColumnAttributes}
            deleteItem={handleDelete}
            close={handleEditDelete}
            getEditData={setEditDataObject}
            editDeleteStatus={editDeleteStatus.current}
          />
        </ScrollView>
      </Popup>
    </div>
  );
}

export default MarketersRegulations;
