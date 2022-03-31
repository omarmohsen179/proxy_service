import React from "react";
import { Position, ToolbarItem } from "devextreme-react/popup";
import { Button, Popup } from "devextreme-react";

const DebitAlert = ({ acceptHandle, resetHandle, visible }) => {
  return (
    <div className="debitAlert">
      <Popup
        visible={visible}
        className="debitAlert"
        onHiding={acceptHandle}
        animationEnabled={false}
        dragEnabled={false}
        showCloseButton={false}
        showTitle={true}
        title="تحذير"
        rtlEnabled={true}
        container=".dx-viewport"
        width={500}
        height={250}
      >
        <Position at="center" my="center" />
        <ToolbarItem
          widget="dxButton"
          toolbar="bottom"
          location="before"
          options={{
            text: "اعادة تعيين الفاتورة",
            onClick: () => {
              resetHandle();
              acceptHandle();
            },
          }}
        />

        <ToolbarItem
          widget="dxButton"
          toolbar="bottom"
          location="after"
          options={{
            text: "سماح",
            elementAttr: {
              class: "dxAlert",
            },
            onClick: () => {
              acceptHandle();
            },
          }}
        />
        <i className="alertIcon fas fa-exclamation-triangle fa-5x d-block text-center pb-3 text-danger" />

        <h5 className="text-center">
          هذا العميل تجاوز الحد الأقصى للدين المسموح به
        </h5>
      </Popup>
    </div>
  );
};

export default DebitAlert;
