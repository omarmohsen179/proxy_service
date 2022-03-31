import React, { useState, useEffect, useCallback } from "react";
import { SpeedDialAction } from "devextreme-react";
import config from "devextreme/core/config";
import repaintFloatingActionButton from "devextreme/ui/speed_dial_action/repaint_floating_action_button";
import OkDiscardFloatingButtons from "../../../../../Components/OkDiscardFloatingButtons";
import { useTranslation } from "react-i18next";

const SpeedActionsButtons = ({
  billInformation,
  editInvoiceBasicsInformations,
  setNewInvoice,
  openBillsTable,
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
        position: {
          my: "right bottom",
          at: "right bottom",
          offset: "-30 -30",
        },
      },
    });
    repaintFloatingActionButton();
  }, []);

  return (
    <>
      {billInformation.id !== 0 &&
        (!billInformation.readOnly ? (
          <OkDiscardFloatingButtons
            okHandle={acceptFloatingButtonHandle}
            discardHandle={discardFloatingButtonHandle}
          />
        ) : (
          <SpeedDialAction
            icon="alignleft"
            label={t("basic modification")}
            index={3}
            onClick={editInvoiceBasicsInformations}
          />
        ))}
      <SpeedDialAction
        icon="add"
        label={t("Add Invoice")}
        index={2}
        onClick={setNewInvoice}
      />
      <SpeedDialAction
        icon="edit"
        label={t("Update Invoice")}
        index={1}
        visible={true}
        onClick={openBillsTable}
      />
    </>
  );
};

export default React.memo(SpeedActionsButtons);
