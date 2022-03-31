// React
import React, {
  useRef,
  useState,
  useEffect,
  useCallback,
  useMemo,
} from "react";

// DevExpress
// import "devextreme/dist/css/dx.common.css";
// import "devextreme/dist/css/dx.light.css";
import notify from "devextreme/ui/notify";
import { Popup } from "devextreme-react/popup";
import ScrollView from "devextreme-react/scroll-view";

// Components
import {
  TextBox,
  NumberBox,
  SelectBox,
  DateBox,
  CheckBox,
} from "../../../Components/Inputs";
import EditDelete1 from "../../../Components/SharedComponents/EditDelete1";
import ButtonRow from "../../../Components/SharedComponents/buttonsRow";
import { Validation } from "../../../Services/services";
// API

import {
  // Geting Data of edit or delete popup
  GET_EDIT_DELETE_DATA,
  // API to delete item in delete pop up
  DELETE_ITEM,
  // API to insert or update data depending on this object has ID or not
  // Has ID : update.
  // No ID : insert.
  INSERT_UPDATE,
  // Get Assets look up to fill الأصل
  GET_ASSETS_LOOK_UP,
  // get Next Number
  GET_NEXT_NUMBER,
} from "./API.FixedAssets";
import { useTranslation } from "react-i18next";

function FixedAssets() {
  const { t, i18n } = useTranslation();
  // ============================================================================================================================
  // ================================================= Lists ===================================================================
  // ============================================================================================================================
  // "ID": 1,
  // "num": 1,             الإيصال
  // "asl_id": 1,          الأصل
  // "dte": "7/6/2021",     التاريخ
  // "kema": "100",          قيمة الأصل
  // "nots": "erwer",       بيان الأصل
  // "type": false,
  // "state": false,          قيمة افتتاحية
  // "ehlak": "1",            قيمة الإهلاك
  // "mbe_id": 0,
  // "mbe_kema": "0",
  // "mbe_date": "",
  // "mbe_note": "",
  // "mbe_type": false,
  // "kiod_id": 0,
  // "year_id": 1,
  // "name_cust": "",
  // "number": 1,
  // "description": "1"

  // Initial data of the page
  let initialData = {
    num: 0, //    الإيصال
    asl_id: "", // الأصل
    dte: Date.now(), //  التاريخ
    kema: 0, //   قيمة الأصل
    nots: "", //  بيان الأصل
    type: false,
    state: false, //     قيمة افتتاحية
    ehlak: 0, //    قيمة الإهلاك
    mbe_id: 0,
    mbe_kema: 0,
    mbe_date: "",
    mbe_note: "",
    mbe_type: false,
    kiod_id: 0,
    year_id: 0,
    name_cust: "",
    number: 0,
    description: 0,
  };

  let columnAttributes = useMemo(() => {
    return [
      { field: "num", caption: "الرقم", captionEn: "Number", isVisable: true },
      { field: "dte", caption: "التاريخ", captionEn: "Date", isVisable: true },
      {
        field: "description",
        captionEn: "Type",
        caption: "نوع الأصل",
        isVisable: true,
      },
      {
        field: "nots",
        captionEn: "Note",
        caption: "الملاحظات",
        isVisable: true,
      },
      {
        field: "kema",
        caption: "القيمة",
        captionEn: "Quantity",
        isVisable: true,
      },
    ];
  }, []);

  // ============================================================================================================================
  // ================================================= States ===================================================================
  // ============================================================================================================================
  // main data of the page
  const [data, setData] = useState(initialData);
  // Error Object
  const [errors, setErrors] = useState([]);
  // Handle close and openn delete and edit popups
  const [editDelete, setEditDelete] = useState(false);
  // Check if we pressed edit or delete buttons and pass this to popups
  const [editDeleteStatus, setEditDeleteStatus] = useState("");
  // Edit and delete popup data list
  const [editDeleteData, setEditDeleteData] = useState();

  const [assetsList, setAssetsList] = useState([]);

  // ============================================================================================================================
  // ================================================= Effects ==================================================================
  // ============================================================================================================================

  useEffect(async () => {
    // Getting Next Number
    await handleNextNumber();
    // Getting Expens Data list المصروف
    await GET_ASSETS_LOOK_UP()
      .then((res) => setAssetsList(res))
      .catch((err) => console.log(err));
  }, []);

  // ============================================================================================================================
  // ================================================= handelers ================================================================
  // ============================================================================================================================

  // Handle Change
  let handleChange = ({ name, value }) => {
    setData((prevState) => ({ ...prevState, [name]: value }));
  };

  let handleEditDelete = useCallback(
    async (buttonType) => {
      setErrors([]);
      setEditDeleteStatus(buttonType);
      setEditDelete((prevState) => !prevState);
      await GET_EDIT_DELETE_DATA()
        .then((res) => {
          console.log("res", res);
          setEditDeleteData(res);
        })
        .catch((err) => console.log(err));
    },
    [editDelete]
  );

  let handleNextNumber = async () => {
    await GET_NEXT_NUMBER()
      .then((res) => {
        setData((prevState) => ({ ...prevState, num: res.NextNumber }));
      })
      .catch((err) => console.log(err));
  };

  let handleSubmit = async () => {
    // let errArr = [];

    let labelsObject = {
      num: "الإيصال",
      asl_id: "الأصل",
      dte: "التاريخ",
      kema: "قيمة الأصل",
    };

    let errArr = Validation(data, labelsObject, [
      "type",
      "mbe_id",
      "mbe_kema",
      "mbe_date",
      "mbe_note",
      "mbe_type",
      "kiod_id",
      "year_id",
      "name_cust",
      "number",
      "state",
      "nots",
      "description",
      "ehlak",
    ]);

    if (errArr.length > 0) {
      setErrors(errArr);
    } else {
      let updateData = data;
      updateData.dte = new Date(data.dte);
      var Data = { Data: [updateData] };

      if ("ID" in data) {
        await INSERT_UPDATE(Data)
          .then(async (res) => {
            setErrors([]);
            notify(
              { message: t("Updated Successfully"), width: 600 },
              "success",
              3000
            );

            await handleReset();
          })
          .catch((err) => {
            err.response.data.Errors.map((element) => {
              errArr.push(element.Error);
            });
            setErrors(errArr);
          });
      } else {
        await INSERT_UPDATE(Data)
          .then(async (res) => {
            setErrors([]);
            notify(
              { message: t("Saved Successfully"), width: 600 },
              "success",
              3000
            );
            await handleReset();
          })
          .catch((err) => {
            console.log(err.response.data.Errors);
            err.response.data.Errors.map((element) => {
              errArr.push(element.Error);
            });
            setErrors(errArr);
          });
      }
    }
  };

  let handleTitle = useCallback(() => {
    return editDeleteStatus === "edit" ? t("Edit") : t("Remove");
  }, [editDeleteStatus, t]);
  // Reseting Form
  let handleReset = useCallback(async () => {
    setErrors([]);
    setData({ ...initialData });
    await handleNextNumber();
  });

  // Holding the setState that is sent to the EditDelete popup to get data to be edited
  let handleGettingData = useCallback((data) => {
    setData({ ...data });
  }, []);

  // Edit Delete POP UP...
  // Holding the API that is sent to the EditDelete popup to make deletes
  let handleDeleteItem = useCallback((id) => {
    return DELETE_ITEM(id);
  }, []);

  return (
    <>
      <div className="container mt-5">
        <div className="mb-2">
          <div
            className="mb-5 w-100 d-flex justify-content-center h2 "
            style={{ fontWeight: "bold" }}
          >
            {t("Fixed assets")}
          </div>
          {/* Row1 */}
          <div className="double">
            <NumberBox
              label={t("Receipt")}
              value={data["num"]}
              name="num"
              handleChange={handleChange}
            />
            <SelectBox
              label={t("the origin")}
              dataSource={assetsList}
              value={data["asl_id"]}
              name="asl_id"
              handleChange={handleChange}
            />
            {/* Row2 */}
            <DateBox
              label={t("Date")}
              name="dte"
              value={data["dte"]}
              handleChange={handleChange}
            />
            <TextBox
              label={t("Note")}
              value={data["nots"]}
              name="nots"
              handleChange={handleChange}
              required={false}
            />
            {/* Row3 */}
            <NumberBox
              label={t("Asset value")}
              value={data["kema"]}
              name="kema"
              handleChange={handleChange}
            />
            <NumberBox
              label={t("Depreciation value")}
              value={data["ehlak"]}
              name="ehlak"
              handleChange={handleChange}
            />
            {/* Row4 */}
            <CheckBox
              label={t("opening value")}
              value={data["state"]}
              name="state"
              handleChange={handleChange}
            />
          </div>
        </div>
        <div className="error mb-3" dir="rtl">
          {errors && errors.map((element) => <li>{element}</li>)}
        </div>

        <ButtonRow
          isSimilar={false}
          isExit={false}
          onNew={handleReset}
          onUndo={handleReset}
          onSubmit={handleSubmit}
          onEdit={handleEditDelete}
          onDelete={handleEditDelete}
        />

        <Popup
          maxWidth={"50%"}
          minWidth={250}
          minHeight={"50%"}
          closeOnOutsideClick={true}
          visible={editDelete}
          onHiding={handleEditDelete}
          title={handleTitle}
        >
          <ScrollView>
            {/* Edit and delete Modal  */}
            <EditDelete1
              data={editDeleteData}
              columnAttributes={columnAttributes}
              deleteItem={handleDeleteItem}
              close={handleEditDelete}
              getEditData={handleGettingData}
              editDeleteStatus={editDeleteStatus}
            />
          </ScrollView>
        </Popup>
      </div>
    </>
  );
}

export default FixedAssets;
