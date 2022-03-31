import React, { memo, useEffect, useMemo, useCallback } from "react";
import {
  GET_SEARCH_ITEMS,
  ALL_STORE_ITEMS,
} from "../MiscellaneousButtonBarAPI";
import MasterTable from "../../../SharedComponents/Tables Components/MasterTable";

const ItemsTable = ({ apiPayload, handleRowClicked }) => {
  const all_store = useCallback((e) => {
    console.log("rerender");
    return ALL_STORE_ITEMS(e);
  }, []);

  const cols = useMemo(() => {
    return [
      {
        caption: "رقم الصنف",
        field: "item_no",
        alignment: "center",
      },
      {
        caption: "اسم الصنف",
        field: "item_name",
        alignment: "center",
      },
      {
        caption: "المخذنت",
        field: "StoreName",
        alignment: "center",
      },
      {
        caption: "الكميه",
        field: "qunt",
        alignment: "center",
      },
      {
        caption: "الصلاحيه",
        field: "exp_date",
        alignment: "center",
      },
    ];
  });

  return (
    <MasterTable
      remoteOperations
      apiMethod={all_store}
      apiPayload={apiPayload}
      colAttributes={cols}
      onRowDoubleClick={handleRowClicked}
    />
  );
};

export default memo(ItemsTable);
