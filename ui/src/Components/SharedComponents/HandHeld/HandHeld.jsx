import React, { useEffect, useState } from "react";
import { Button } from "devextreme-react/button";
import MasterTable from "../Tables Components/MasterTable";
import notify from "devextreme/ui/notify";

import { Popup } from "devextreme-react/popup";
import ScrollView from "devextreme-react/scroll-view";
import {
  GET_HAND_HELD_INVOICES,
  GET_HAND_HELD_INVOICES_ITEMS,
  IMPORT_FROM_HAND_HELD,
} from "../../SharedComponents/HandHeld/API.HandHeld";

function HandHeld(props) {
  const {
    title,
    invoiceType,
    AgentID,
    AccountID,
    isVisable,
    handleVisibility,
  } = props;

  let firstTableColAttr = [
    {
      caption: "التاريخ",
      field: "datee",
      alignment: "center",
      isVisable: true,
    },
    {
      caption: "الحساب",
      field: "name",
      alignment: "center",
      isVisable: true,
    },
  ];

  let secondTableColAttr = [
    {
      caption: "رقم الصنف",
      field: "item_no",
      alignment: "center",
      isVisable: true,
    },
    {
      caption: "اسم الصنف",
      field: "item_name",
      alignment: "center",
      isVisable: true,
    },
    {
      caption: "رقم القطعة",
      field: "code_no",
      alignment: "center",
      isVisable: true,
    },
    {
      caption: "الكمية",
      field: "Qunt",
      alignment: "center",
      isVisable: true,
    },
    {
      caption: "السعر",
      field: "Price",
      alignment: "center",
      isVisable: true,
    },
  ];

  const [importObject, setImportObject] = useState({
    AgentID: AgentID,
    AccountID: AccountID,
    HandHeldsInoviesIDs: [],
  });
  const [firstTableData, setFirstTableData] = useState({});
  const [secondTableData, setSecondTableData] = useState({});

  useEffect(async () => {
    await GET_HAND_HELD_INVOICES(invoiceType)
      .then((res) => {
        setFirstTableData(res);
        return res;
      })
      .then((res) => GET_HAND_HELD_INVOICES_ITEMS(res[0].Hand_id))
      .then((res) => setSecondTableData(res))
      .catch((err) => {
        console.log(err);
      });
  }, []);

  let handleSelection = (event) => {
    console.log("HANDHELD-handleSelection");
    let selectedItemsIdsArray = [];
    event &&
      event.selectedRowKeys.map((element) =>
        selectedItemsIdsArray.push(element.Hand_id)
      );

    setImportObject((prevState) => ({
      ...prevState,
      HandHeldsInoviesIDs: selectedItemsIdsArray,
    }));

    if (event.selectedRowKeys[0] != undefined) {
      console.log("enter");
      event.selectedRowKeys.length > 1
        ? setSecondTableData({})
        : GET_HAND_HELD_INVOICES_ITEMS(event.selectedRowKeys[0].Hand_id)
            .then((res) => setSecondTableData(res))
            .catch((err) => console.log(err));
    }
  };

  let handleImport = () => {
    var Data = { Data: importObject };
    IMPORT_FROM_HAND_HELD(invoiceType, Data)
      .then((res) => console.log(res))
      .then(() => {
        setFirstTableData(
          firstTableData.filter(
            (element) =>
              !importObject.HandHeldsInoviesIDs.includes(element.Hand_id)
          )
        );
        setSecondTableData({});
        notify({ message: "تم الاعتماد بنجاح", width: 600 }, "success", 3000);
      })
      .catch((err) => console.log(err));
  };

  return (
    <Popup
      maxWidth={"50%"}
      minWidth={500}
      minHeight={"50%"}
      closeOnOutsideClick={true}
      visible={isVisable}
      onHiding={handleVisibility}
    >
      <ScrollView>
        <div>
          {/* Header */}
          {console.log(firstTableData)}
          <div
            className={"container my-3"}
            style={{
              width: "100%",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              direction: "rtl",
              flexWrap: "wrap",
            }}
          >
            <div style={{ fontSize: "20px" }}>{title}</div>
            <div
              style={{
                width: "30%",
                display: "flex",
                justifyContent: "space-between",
              }}
            >
              <Button onClick={handleImport} text="اعتماد المحدد" />
            </div>
          </div>

          {/* First Table */}
          <div className="my-3 container">
            <MasterTable
              onSelectionChanged={handleSelection}
              dataSource={firstTableData}
              colAttributes={firstTableColAttr}
              selectionMode="multiple"
            />
          </div>
          {/* Second Table */}
          <div className="container">
            <MasterTable
              dataSource={secondTableData}
              colAttributes={secondTableColAttr}
            />
          </div>
        </div>
      </ScrollView>
    </Popup>
  );
}

export default HandHeld;
