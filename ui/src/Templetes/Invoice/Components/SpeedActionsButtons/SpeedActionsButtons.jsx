import React, { useState, useEffect, useCallback } from "react";
import { SpeedDialAction } from "devextreme-react";
import config from "devextreme/core/config";
import repaintFloatingActionButton from "devextreme/ui/speed_dial_action/repaint_floating_action_button";
import OkDiscardFloatingButtons from "../../../../Components/OkDiscardFloatingButtons";
import OpenPDFWindow from "../../../../Components/SharedComponents/PDFReader/PDFwindowFunction";
import { GET_PDF_FILE } from "./API.SpeedActionsButtons";
import { useTranslation } from "react-i18next";

const SpeedActionsButtons = ({
	billInformation,
	selectedAccountId,
	editInvoiceBasicsInformations,
	setNewInvoice,
	openBillsTable,
	acceptFloatingButtonHandle,
	discardFloatingButtonHandle,
	showBasicsEditButton = true,
	openOffersBillsTable,
	handHeldHandle,
	purchaseExpensesHandle,
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
					my: i18n.language === "en" ? "right bottom" : "left bottom",
					at: i18n.language === "en" ? "right bottom" : "left bottom",
					offset: i18n.language === "en" ? "-30 -30" : "30 -30",
				},
			},
		});
		repaintFloatingActionButton();
	}, [i18n.language]);

	// Print Invoice
	const printInvoice = useCallback(() => {
		GET_PDF_FILE(billInformation.invoiceType, { id: billInformation.id })
			.then((file) => {
				OpenPDFWindow(file);
			})
			.catch((error) => {
				console.log(error);
			});
	}, [billInformation.id, billInformation.invoiceType]);

	return (
		<>
			{billInformation.id !== 0 &&
				(!billInformation.readOnly ? (
					<OkDiscardFloatingButtons
						okHandle={acceptFloatingButtonHandle}
						discardHandle={discardFloatingButtonHandle}
					/>
				) : (
					<>
						<SpeedDialAction
							icon="alignleft"
							label="تعديل أساسي"
							index={3}
							visible={showBasicsEditButton}
							onClick={editInvoiceBasicsInformations}
						/>
						<SpeedDialAction
							icon="print"
							label="طباعة الفاتورة"
							index={4}
							visible={true}
							onClick={printInvoice}
						/>
						{billInformation.invoiceType === "Purchases" && (
							<SpeedDialAction
								icon="repeat"
								label="تحميل المصاريف"
								index={8}
								visible={true}
								onClick={purchaseExpensesHandle}
							/>
						)}
					</>
				))}
			<SpeedDialAction
				icon="add"
				label={t("New Invoice")}
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

			<SpeedDialAction
				icon="link"
				label={t("Refund from Offer Invoice")}
				index={6}
				visible={
					(billInformation.invoiceType === "Sales" ||
					billInformation.invoiceType === "Purchases"
						? true
						: false) && selectedAccountId
				}
				onClick={openOffersBillsTable}
			/>

			<SpeedDialAction
				icon="activefolder"
				label="HandHeld"
				index={7}
				visible={
					billInformation.mosweq_id && selectedAccountId
						? true
						: false
				}
				onClick={handHeldHandle}
			/>
		</>
	);
};

export default React.memo(SpeedActionsButtons);
