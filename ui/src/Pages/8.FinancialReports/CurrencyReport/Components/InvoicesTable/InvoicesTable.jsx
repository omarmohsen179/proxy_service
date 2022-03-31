import React, { useRef } from "react";
import MasterTable from "../../../../../Components/SharedComponents/Tables Components/MasterTable";
import { GET_MONEY_TYPE_INVOICES } from "../../API.CurrencyReport";
import "./invoicesTable.css";

const InvoicesTable = ({
	toDate,
	fromDate,
	mosweq_id,
	moneyId,
	updateSummeryData,
	onRowDoubleClickHandle,
}) => {
	const transactionsColAttributes = useRef([
		{
			field: "docno",
			caption: "رقم العملية",
			captionEn: "Transaction No.",
		},
		{
			field: "mvType",
			caption: "نوع العملية",
			captionEn: "Transaction Type",
		},
		{ field: "DateMv", caption: "التاريخ", captionEn: "Date" },
		{ field: "bean", caption: "الحساب", captionEn: "Account" },
		{
			field: "mden",
			caption: "الايرادات",
			captionEn: "Incomes",
			cssClass: "greenCell",
		},
		{
			field: "daen",
			caption: "المصروفات",
			captionEn: "Outcomes",
			cssClass: "redCell",
		},
		{ field: "nots", caption: "ملاحظات", captionEn: "Notes" },
	]);

	return (
		<>
			<MasterTable
				allowExcel
				columnChooser={false}
				colAttributes={transactionsColAttributes.current}
				remoteOperations={moneyId ? true : false}
				apiKey="sno"
				apiMethod={moneyId ? GET_MONEY_TYPE_INVOICES : null}
				apiPayload={{ moneyId, mosweq_id, fromDate, toDate }}
				otherMethod={moneyId ? updateSummeryData : null}
				height={"300px"}
				onRowDoubleClick={onRowDoubleClickHandle}
			/>
		</>
	);
};

export default React.memo(InvoicesTable);
