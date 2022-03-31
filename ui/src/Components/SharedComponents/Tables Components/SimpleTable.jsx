import React, { useState, useEffect } from "react";
import DataGrid, { Column, HeaderFilter } from "devextreme-react/data-grid";

const SimpleTable = ({
  _className = "",
  selectionMode = "single",
  dataSource, // data [{},{},...]
  colAttributes, //  [{field:'id' , caption:'الرقم', widthRatio:'12' },{},...]
}) => {
  const [data, setData] = useState([]);
  useEffect(() => {
    setData(dataSource);
  }, []);

  return (
    <DataGrid
      width={"100%"}
      height={"100%"}
      dataSource={data}
      rtlEnabled={true}
      showBorders={true}
      remoteOperations={true}
      repaintChangesOnly={true}
      paging={false}
      showRowLines={true}
      hoverStateEnabled={true}
      allowColumnResizing={true}
      columnFixing={true}
      columnAutoWidth={true}
      wordWrapEnabled={true}
      selection={{ mode: selectionMode }}
      className={_className}
    >
      <HeaderFilter visible={true} />
      {colAttributes.map((col, index) => {
        return (
          <Column
            key={index}
            name={index}
            alignment={col.alignment ? col.alignment : "right"}
            dataField={col.field}
            caption={col.caption}
            width={col.widthRatio ? `${col.widthRatio}px` : "150px"}
          />
        );
      })}
    </DataGrid>
  );
};

export default SimpleTable;
