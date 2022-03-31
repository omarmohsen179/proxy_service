import React, { useState, useEffect, useCallback, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setSelectedGroupId } from "../../../Store/groups.js";
import {
  getNodesIn,
  getOtherPermissions,
} from "../../../Store/otherPermissions.js";
import DateTime from "../../../Components/Inputs/DateTime";
import SelectBox from "../../../Components/Inputs/SelectBox";
import MasterTable from "../../../Components/SharedComponents/Tables Components/MasterTable.jsx";
import { setItem, setVisible } from "../../../Store/Items/ItemsSlice";
import SearchItem from "../../Items/SearchItem";
import "./ExportsAndImportstyle.css";
import {
  selectCategories,
  fetchCategories,
} from "../../../Store/Items/CategoriesSlice";
import { ITEMS_VALUES } from "./ExportsAndImportsApi";
import ColumnsTable from "../../../Components/SharedComponents/Tables Components/ColumnsTable.jsx";
import { useTranslation } from "react-i18next";
function ExportsAndImports(props) {
  let categories = useSelector(selectCategories);
  const { t, i18n } = useTranslation();
  const [categoriesList, setcategoriesList] = useState([]);
  let dispatch = useDispatch();
  const tabCol = useMemo(() => {
    return [
      { caption: "رقم الصنف", captionEn: "Number", field: "item_no" },
      { caption: "اسم الصنف", captionEn: "Name", field: "item_name" },
      {
        caption: "يناير",
        captionEn: "January",
        incol: [
          {
            caption: "صادر",
            captionEn: "export",
            field: "s1",
            cssClass: "colorColumnsSadr",
          },
          {
            caption: "وارد",
            captionEn: "take",
            field: "w1",
            cssClass: "colorColumnsWard",
          },
        ],
      },
      {
        caption: "فبرير",
        captionEn: "February",
        incol: [
          {
            caption: "صادر",
            captionEn: "export",

            field: "s2",
            cssClass: "colorColumnsSadr",
          },
          {
            caption: "وارد",
            captionEn: "take",
            field: "w2",
            cssClass: "colorColumnsWard",
          },
        ],
      },
      {
        caption: "مارس",
        captionEn: "March",
        incol: [
          {
            caption: "صادر",
            captionEn: "export",
            field: "s3",
            cssClass: "colorColumnsSadr",
          },
          {
            caption: "وارد",
            captionEn: "take",
            field: "w3",
            cssClass: "colorColumnsWard",
          },
        ],
      },
      {
        caption: "ابريل",
        captionEn: "April",
        incol: [
          {
            caption: "صادر",
            captionEn: "export",
            field: "s4",
            cssClass: "colorColumnsSadr",
          },
          {
            caption: "وارد",
            captionEn: "take",
            field: "w4",
            cssClass: "colorColumnsWard",
          },
        ],
      },
      {
        caption: "مايو",
        captionEn: "May",
        incol: [
          {
            caption: "صادر",
            captionEn: "export",
            field: "s5",
            cssClass: "colorColumnsSadr",
          },
          {
            caption: "وارد",
            captionEn: "take",
            field: "w5",
            cssClass: "colorColumnsWard",
          },
        ],
      },
      {
        caption: "يونيو",
        captionEn: "June",
        incol: [
          {
            caption: "صادر",
            captionEn: "export",
            field: "s6",
            cssClass: "colorColumnsSadr",
          },
          {
            caption: "وارد",
            captionEn: "take",
            field: "w6",
            cssClass: "colorColumnsWard",
          },
        ],
      },
      {
        caption: "يوليو",
        captionEn: "June",
        incol: [
          {
            caption: "صادر",
            captionEn: "export",
            field: "s7",
            cssClass: "colorColumnsSadr",
          },
          {
            caption: "وارد",
            captionEn: "take",
            field: "w7",
            cssClass: "colorColumnsWard",
          },
        ],
      },
      {
        caption: "اغسطس",
        incol: [
          {
            caption: "صادر",
            captionEn: "export",
            field: "s8",
            cssClass: "colorColumnsSadr",
          },
          {
            caption: "وارد",
            captionEn: "take",
            field: "w8",
            cssClass: "colorColumnsWard",
          },
        ],
      },
      {
        caption: "سبتمبر ",
        incol: [
          {
            caption: "صادر",
            captionEn: "export",
            field: "s9",
            cssClass: "colorColumnsSadr",
          },
          {
            caption: "وارد",
            captionEn: "take",
            field: "w9",
            cssClass: "colorColumnsWard",
          },
        ],
      },
      {
        caption: "اكتوبر",
        incol: [
          {
            caption: "صادر",
            captionEn: "export",
            field: "s10",
            cssClass: "colorColumnsSadr",
          },
          {
            caption: "وارد",
            captionEn: "take",
            field: "w10",
            cssClass: "colorColumnsWard",
          },
        ],
      },
      {
        caption: "نوفمبر",
        incol: [
          {
            caption: "صادر",
            captionEn: "export",
            field: "s11",
            cssClass: "colorColumnsSadr",
          },
          {
            caption: "وارد",
            captionEn: "take",
            field: "w11",
            cssClass: "colorColumnsWard",
          },
        ],
      },
    ];
  }, []);
  let [values, setvalues] = useState({
    CategoryID: 0,
  });

  let handleChange = useCallback(
    ({ name, value }) => {
      setvalues((prevState) => ({ ...prevState, [name]: value }));
    },
    [values]
  );
  useEffect(async () => {
    dispatch(fetchCategories());
  }, []);
  useEffect(async () => {
    setcategoriesList([{ name: "كل", id: 0 }, ...categories]);
  }, [categories]);
  return (
    <div
      className="row"
      dir="auto"
      style={{ display: "flex", justifyContent: "center", margin: 0 }}
    >
      <h1 style={{ width: "100%", textAlign: "center", padding: "2%" }}>
        {t("Incoming and outgoing details")}
      </h1>
      <div className="row" style={{ width: "80%", padding: "4px" }}>
        <div className="col-12 col-md-6 col-lg-3">
          <SelectBox
            label={t("According to Category")}
            dataSource={categoriesList}
            value={values.CategoryID}
            name="CategoryID"
            handleChange={handleChange}
            required={false}
          />
        </div>
      </div>
      <div style={{ width: "95%" }}>
        <ColumnsTable
          remoteOperations
          apiMethod={ITEMS_VALUES}
          apiPayload={values}
          height="400px"
          colAttributes={tabCol}
        />
      </div>
    </div>
  );
}
export default ExportsAndImports;
