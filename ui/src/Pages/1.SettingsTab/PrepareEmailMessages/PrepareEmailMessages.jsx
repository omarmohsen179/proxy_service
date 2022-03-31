// React
import React, { useState } from "react";

// DevExpress
import { Button } from "devextreme-react/button";

// Components
import MasterTable from "../.../../../../Components/SharedComponents/Tables Components/MasterTable";
import { TextBox, SelectBox } from "../.../../../../Components/Inputs";
import ButtonRow from "../.../../../../Components/SharedComponents/buttonsRow";
import InBoxModal from "./InBoxModal";

function PrepareEmailMessages() {
  // ============================================================================================================================
  // ================================================= Lists ====================================================================
  // ============================================================================================================================

  // Table Column
  let columnsAttributes = [
    {
      caption: "الرقم",
      field: "num",
      alignment: "center",
      isVisable: true,
    },
    {
      caption: "التوقيت",
      field: "description",
      alignment: "center",
      isVisable: true,
    },
    {
      caption: "البيان",
      field: "description",
      alignment: "center",
      isVisable: true,
    },
  ];

  // ============================================================================================================================
  // ================================================= State ====================================================================
  // ============================================================================================================================

  const [popupVisibility, setPopupVisibility] = useState(false);

  // ============================================================================================================================
  // ================================================= Handle ===================================================================
  // ============================================================================================================================
  let handlePopupVisibility = () => {
    setPopupVisibility(!popupVisibility);
  };

  // ============================================================================================================================
  // ================================================= Return ===================================================================
  // ============================================================================================================================

  return (
    <div className="container">
      {/* Header */}
      {/* ------------------------------------------------------------------------ */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginTop: "50px",
        }}
      >
        <Button
          text="الوارد"
          hoverStateEnabled
          width="100px"
          type="default"
          stylingMode="outlined"
          onClick={handlePopupVisibility}
        />

        <div style={{ fontSize: "20px", fontWeight: "bold" }}>
          إعداد الإيميلات
        </div>
      </div>

      {/* Inputs */}
      {/* ------------------------------------------------------------------------ */}
      {/* First Line */}
      <div className="triple mt-4">
        <TextBox
          label="الرقم"
          // value={values["dane"]}
          name="dane"
          // handleChange={handleChange}
        />
        <SelectBox
          label="البيان"
          // // value={values["3om"]}
          name="3om"
          // // handleChange={handleChange}
        />
        <SelectBox
          label="نوع الإرسال"
          // // value={values["3om"]}
          name="3om"
          // // handleChange={handleChange}
        />
      </div>
      {/* Second Line */}
      <div className="triple mt-3">
        <TextBox
          label="مدة التقرير"
          // value={values["dane"]}
          name="dane"
          // handleChange={handleChange}
        />
        <TextBox
          label="كود"
          // value={values["dane"]}
          name="dane"
          // handleChange={handleChange}
        />
        <div className="double">
          <TextBox
            label="يرسل كل"
            // value={values["dane"]}
            name="dane"
            // handleChange={handleChange}
          />
          <SelectBox
            // // value={values["3om"]}
            name="3om"
            // // handleChange={handleChange}
          />
        </div>
      </div>

      {/* Table */}
      {/* ------------------------------------------------------------------------ */}
      <div className="mt-3">
        <MasterTable
          // dataSource={tableData}
          colAttributes={columnsAttributes}
          height={40 + "vh"}
          filterRow
          // summaryItems={
          // 	visibileFromAccountStatement ? itemSummaryItems.current : []
          // }
          // onRowDoubleClick={
          // 	props?.location?.pathname.split("/")[2] == "BanksCredits"
          // 		? handleAccountStatementPopupVisibility
          // 		: getHeaderDataOnDoubleClick
          // }
          // onSelectionChanged={getRowIdOnSelection}
          allowExcel={true}
          allowPrint={true}
        />
      </div>
      {/* SelectBox */}
      {/* ------------------------------------------------------------------------ */}
      <div dir={"auto"} className="mt-3">
        <SelectBox
          label={"العميل"}
          // // value={values["3om"]}
          name="3om"
          // // handleChange={handleChange}
        />
      </div>

      {/* Buttons Row */}
      {/* ------------------------------------------------------------------------ */}
      <div className="mt-4">
        <ButtonRow />
      </div>

      <InBoxModal
        popupVisibility={popupVisibility}
        handlePopupVisibility={handlePopupVisibility}
        title="صندوق الوارد"
      />
    </div>
  );
}

export default PrepareEmailMessages;
