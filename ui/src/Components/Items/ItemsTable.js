import React, { memo, useEffect, useMemo, useCallback } from "react";
import { GET_SEARCH_ITEMS } from "../../Services/ApiServices/ItemsAPI";
import MasterTable from "../SharedComponents/Tables Components/MasterTable";

const ItemsTable = ({
  apiPayload,
  handleRowClicked,
  handleRowSelected,
  allowDelete,
  onRowRemoving,
}) => {
  let get_search = useCallback((e) => {
    return GET_SEARCH_ITEMS(e);
  }, []);
  const cols = useMemo(() => {
    return [
      {
        caption: "رقم الصنف",
        captionEn: "Number",
        field: "item_no",
        alignment: "center",
      },
      {
        caption: "اسم الصنف",
        captionEn: "Name",
        field: "item_name",
        alignment: "center",
      },
      {
        caption: "الاسم الأجنبي",
        captionEn: "English Name",
        field: "e_name",
        alignment: "center",
      },
      {
        caption: "رقم القطعه",
        captionEn: "Part Number",
        field: "code_no",
        alignment: "center",
      },
      {
        caption: "العبوه",
        captionEn: "Package",
        field: "box",
        alignment: "center",
      },
      {
        caption: "الكميه",
        captionEn: "Quantity",
        field: "qunt",
        alignment: "center",
      },
      {
        caption: "الوحده",
        captionEn: "Unit",
        field: "unit1",
        alignment: "center",
      },
      {
        caption: "القطاعي",
        captionEn: "Price",
        field: "price",
        alignment: "center",
      },
      {
        caption: "الجمله",
        captionEn: "Total",
        field: "p_gmla",
        alignment: "center",
      },
      {
        caption: "التكلفه",
        captionEn: "Cost",
        field: "p_tkl",
        alignment: "center",
      },
      {
        caption: "الكميه المفصله",
        captionEn: "Detailed quantity",
        field: "qunt_tafsel",
        alignment: "center",
        isVisable: false,
      },
      {
        caption: "التصنيف",
        captionEn: "Category",
        field: "cunt",
        alignment: "center",
        isVisable: false,
      },
      {
        caption: "التصنيف",
        field: "description",
        alignment: "center",
        isVisable: false,
      },
      {
        caption: "المورد",
        field: "cust_name",
        alignment: "center",
        isVisable: false,
      },

      {
        caption: "كميه الفرع",
        field: "quntpoint",
        alignment: "center",
        isVisable: false,
      },
      {
        caption: "جمله الجمله",
        field: "p_gmla_2",
        alignment: "center",
        isVisable: false,
      },
      {
        caption: "اقل سعر",
        field: "des",
        alignment: "center",
        isVisable: false,
      },

      {
        caption: "المصدر",
        field: "msdar",
        alignment: "center",
        isVisable: false,
      },
      {
        caption: "الشركه",
        field: "comp",
        alignment: "center",
        isVisable: false,
      },
      {
        caption: "الخصم",
        field: "dis",
        alignment: "center",
        isVisable: false,
      },
      {
        caption: "الصوره",
        field: "image",
        alignment: "center",
        isVisable: false,
      },
      {
        caption: "مكان الصنف",
        field: "item_place",
        alignment: "center",
        isVisable: false,
      },
      {
        caption: "الكميه لأكبر عبوه",
        field: "qunt_box",
        alignment: "center",
        isVisable: false,
      },
      {
        caption: "التكلفه لأكبر عبوه",
        field: "p_tkl_box",
        alignment: "center",
        isVisable: false,
      },
    ];
  });
  return (
    <MasterTable
      remoteOperations
      apiMethod={get_search}
      apiPayload={apiPayload}
      apiKey={"id"}
      height={"400px"}
      allowExcel={true}
      allowDelete={allowDelete}
      onRowRemoving={onRowRemoving}
      colAttributes={cols}
      onRowDoubleClick={handleRowClicked}
      onSelectionChanged={handleRowSelected}
    />
  );
};

export default memo(ItemsTable);
