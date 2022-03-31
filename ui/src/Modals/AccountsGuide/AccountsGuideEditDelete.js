import React, { useState, useEffect, useCallback, useRef } from "react";
import notify from "devextreme/ui/notify";
import { Button as ButtonExpress } from "devextreme-react/button";
import { confirm } from "devextreme/ui/dialog";
import MasterTable from "../../Components/SharedComponents/Tables Components/MasterTable";
import { SelectBox as SelectExpress } from "devextreme-react";
import { CheckBox } from "../../Components/Inputs";
// API
import {
  GET_EDIT_LIST,
  GET_ACCOUNTS_GUIDE_SELCECTED_DATA,
} from "../../Services/ApiServices/Basics/AccountsGuide";
import { useTranslation } from "react-i18next";

function AccountsGuideEditDelete(props) {
  const { t, i18n } = useTranslation();
  const {
    data, // Data Source
    columnAttributes, // Columns Names
    editDeleteStatus, // Determine if it's a delete or edit and on this adding recycle bin icon in delete case
    getEditData, // Setstate from your primary page to get on it the selected data
    close, // close function on deleteing خروج
    deleteItem, // Deleting row API ... you are to give it id only, regarding this data object has the id as "ID"
    typeClassStatus,
    dataList,
    listItem,
  } = props;

  let currentDataObject = {
    _typ_class: listItem,
    _showHidden: false,
  };

  const [currentPageData, setCurrentPageData] = useState(currentDataObject);
  const [selectBoxList, setSelectBoxList] = useState(data);

  // To set the id of the selected row in it to enable deleting or editing on clicking ok.
  const selectedRowID = useRef("");

  useEffect(() => {
    setCurrentPageData(currentDataObject);
  }, [listItem]);

  let handleChange = useCallback(({ name, value }) => {
    setCurrentPageData((prevState) => ({ ...prevState, [name]: value }));
  }, []);

  useEffect(() => {
    currentPageData._typ_class &&
      GET_EDIT_LIST(currentPageData._typ_class, currentPageData._showHidden)
        .then((res) => {
          setSelectBoxList(res);
        })
        .catch((err) => console.log(err));
  }, [currentPageData]);
  // Handelers
  // Handle selection and setting selected row id to id storage
  let handleSelection = useCallback((event) => {
    if (event.currentSelectedRowKeys[0] != undefined) {
      selectedRowID.current = event.currentSelectedRowKeys[0].id;
    }
  }, []);

  // Handle double click on row of the table , mostly look like handle Ok except for parameter.
  let handleDoubleClick = async (event) => {
    // checks if we need modal for delete or edit to handle functionality.
    if (editDeleteStatus === "delete") {
      let result = confirm(t("Are you sure you want to delete this check?"));
      //	Deleting and closing on pressing ok
      await result.then(async (dialogResult) => {
        if (dialogResult) {
          await deleteItem(event.key.id)
            .then((res) => {
              setSelectBoxList(
                selectBoxList.filter((element) => element.id != event.key.id)
              );
              deletedPopUp();
            })
            .catch((err) => notDeletedpopUp());
        }
      });
    } else {
      GET_ACCOUNTS_GUIDE_SELCECTED_DATA(event.data.id).then((res) => {
        // console.log(res);
        if (res.typ_class == 0) {
          res.zbonState = true;
        } else if (res.typ_class == 1) {
          res.mordState = true;
        }
        getEditData(res);
      });

      typeClassStatus.current = true;
      close();
      setCurrentPageData((prevState) => ({
        ...prevState,
        _showHidden: false,
      }));
    }
  };

  // Handle Pressing Ok
  let handleOk = async () => {
    if (editDeleteStatus === "delete") {
      let result = confirm(t("Are you sure you want to delete this option?"));
      await result.then(async (dialogResult) => {
        if (dialogResult) {
          await deleteItem(selectedRowID.current)
            .then((res) => {
              deletedPopUp();
              setSelectBoxList(
                selectBoxList.filter(
                  (element) => element.id != selectedRowID.current
                )
              );
            })
            .catch((err) => {
              notDeletedpopUp();
            });
        }
      });
    } else {
      GET_ACCOUNTS_GUIDE_SELCECTED_DATA(selectedRowID.current).then((res) => {
        getEditData(res);
      });
      typeClassStatus.current = true;
      close();
      setCurrentPageData((prevState) => ({ ...prevState, _showHidden: false }));
    }
  };

  // handle delete function depending on id of row "on clicking on recycle bin icon"
  let handleDelete = async (event) => {
    event.cancel = true;
    await deleteItem(event.data.id)
      .then((res) => {
        deletedPopUp();
        setSelectBoxList(
          selectBoxList.filter((element) => element.id != event.data.id)
        );
      })
      .catch((err) => {
        notDeletedpopUp();
      });
  };

  // helpers
  // Can delete popup
  let deletedPopUp = () => {
    notify({ message: t("Deleted Successfully"), width: 600 }, "success", 3000);
    close();
    setCurrentPageData((prevState) => ({ ...prevState, _showHidden: false }));
  };

  // Canot delete popup

  let notDeletedpopUp = () => {
    notify(
      { message: t("Cannot delete this item"), width: 600 },
      "error",
      3000
    );
  };

  return (
    <div>
      {/* {console.log(currentPageData)} */}
      <MasterTable
        dataSource={selectBoxList}
        colAttributes={columnAttributes}
        filterRow
        onRowDoubleClick={handleDoubleClick}
        height={"300px"}
        columnChooser={true}
        onSelectionChanged={handleSelection}
        allowDelete={editDeleteStatus === "delete" ? true : false}
        onRowRemoving={handleDelete}
      />
      <div className="double  mt-4 mx-4">
        <SelectExpress
          dataSource={dataList}
          hoverStateEnabled={true}
          valueExpr={"id"}
          displayExpr={"description"}
          name="_typ_class"
          value={currentPageData["_typ_class"]}
          onValueChange={(selectedItem) =>
            handleChange({
              name: "_typ_class",
              value: selectedItem,
            })
          }
          searchEnabled={true}
        />
      </div>
      <div className="double mt-4 mx-4">
        <CheckBox
          label={t("Show hidden")}
          name="_showHidden"
          value={currentPageData["_showHidden"]}
          handleChange={handleChange}
        />
      </div>
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

export default React.memo(AccountsGuideEditDelete);
