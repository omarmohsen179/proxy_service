import React, { useState, useEffect } from "react";
import MasterTable from "../MasterTable";
import { GET_REPORT_ITEM_STORES_QUANTITY } from "./API.ItemsStorageQuantityTable";

export const ItemsStorageQuantityTable = React.memo(({ itemId }) => {
  let storageQuantityColAttributes = [
    { field: "m_name", caption: "المخزن", captionEn: "Inventory" },
    { field: "kmea", caption: "الكمية", captionEn: "Quantity" },
  ];

  const [data, setData] = useState([]);

  useEffect(() => {
    itemId
      ? GET_REPORT_ITEM_STORES_QUANTITY(itemId).then((itemReport) => {
          setData(itemReport);
        })
      : setData([]);
  }, [itemId]);

  return (
    <MasterTable
      dataSource={data}
      height={"300px"}
      columnChooser={false}
      colAttributes={storageQuantityColAttributes}
    />
  );
});
