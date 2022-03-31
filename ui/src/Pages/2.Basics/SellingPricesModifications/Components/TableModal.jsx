// React
import React, { useMemo } from "react";

import MasterTable from "../../../../Components/SharedComponents/Tables Components/MasterTable";

import { GET_SEARCH_ITEMS } from "../API.SellingPricesModifications";

function TableModal({ classificationValue, SearchNameValue, renderTable }) {
  const columnAttributes = useMemo(() => {
    return [
      {
        caption: "رقم الصنف",
        captionEn: "Item No.",
        field: "item_no",
        alignment: "center",
      },
      {
        caption: "اسم الصنف",
        captionEn: "Item Name",
        field: "item_name",
        alignment: "center",
      },
      {
        caption: "رقم القطعه",
        captionEn: "Unit Number",
        field: "code_no",
        alignment: "center",
      },
      {
        caption: "العبوه",
        captionEn: "packaging",
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
        captionEn: "segmental",
        field: "price",
        alignment: "center",
      },
      {
        caption: "الجمله",
        captionEn: "Wholesale",
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
        field: "qunt_tafsel",
        alignment: "center",
        isVisable: false,
      },
      {
        caption: "التصنيف",
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
    <>
      <MasterTable
        height={40 + "vh"}
        remoteOperations={
          classificationValue != undefined && SearchNameValue != undefined
        }
        apiMethod={
          classificationValue != undefined && SearchNameValue != undefined
            ? GET_SEARCH_ITEMS
            : null
        }
        apiPayload={{
          data: {
            FilterQuery: "",
            ItemNumber: "",
            SearchName: "",
            code_no: "",
            addres: "",
            qunt: 0,
            m_no: 0,
            PageNumber: 0,
            PageSize: 20,
            state: 0,
            sno_id: 0,
            msdar: "",
            clas: "",
            emp_id: 0,
            ItemName: SearchNameValue,
            typ_id: classificationValue,
          },
        }}
        colAttributes={columnAttributes}
        allowExcel={true}
        allowPrint={true}
      />
    </>
  );
}

export default React.memo(TableModal);
