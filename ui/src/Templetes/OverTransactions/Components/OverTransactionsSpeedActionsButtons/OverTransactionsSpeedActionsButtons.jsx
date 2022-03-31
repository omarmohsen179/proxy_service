import React, { useState, useEffect, useCallback } from "react";
import { SpeedDialAction } from "devextreme-react";
import config from "devextreme/core/config";
import repaintFloatingActionButton from "devextreme/ui/speed_dial_action/repaint_floating_action_button";
import OkDiscardFloatingButtons from "../../../../Components/OkDiscardFloatingButtons";
import OpenPDFWindow from "../../../../Components/SharedComponents/PDFReader/PDFwindowFunction";
import { GET_REPORT } from "../../API.OverTransactions";
import { useTranslation } from "react-i18next";

const OverTransactionsSpeedActionsButtons = ({
  receiptInformation,
  selectedAccountId,
  editBasicsInformation,
  setNew,
  openEditTable,
  acceptFloatingButtonHandle,
  discardFloatingButtonHandle,
}) => {
  const { t, i18n } = useTranslation();
  useEffect(() => {
    config({
      floatingActionButtonConfig: {
        icon: "add",
        closeIcon: "close",
        shading: false,
        direction: "up",
        maxSpeedDialActionCount: 15,
        position: {
          my: "right bottom",
          at: "right bottom",
          offset: "-30 -30",
        },
      },
    });
    repaintFloatingActionButton();
  }, []);

  // Print Invoice
  const printInvoice = useCallback(() => {
    GET_REPORT(receiptInformation.receiptType, { id: receiptInformation.id })
      .then((file) => {
        OpenPDFWindow(file);
      })
      .catch((error) => {
        console.log(error);
      });
  }, [receiptInformation.id, receiptInformation.receiptType]);

  return (
    <>
      {receiptInformation.id !== 0 &&
        (!receiptInformation.readOnly ? (
          <OkDiscardFloatingButtons
            okHandle={acceptFloatingButtonHandle}
            discardHandle={discardFloatingButtonHandle}
          />
        ) : (
          <>
            <SpeedDialAction
              icon="alignleft"
              label={t("basic modification")}
              index={3}
              visible={true}
              onClick={editBasicsInformation}
            />
            <SpeedDialAction
              icon="print"
              label={t("Print")}
              index={4}
              visible={true}
              onClick={printInvoice}
            />
          </>
        ))}
      <SpeedDialAction icon="add" label={t("New")} index={2} onClick={setNew} />
      <SpeedDialAction
        icon="edit"
        label={t("Update")}
        index={1}
        visible={true}
        onClick={openEditTable}
      />
    </>
  );
};

export default React.memo(OverTransactionsSpeedActionsButtons);
