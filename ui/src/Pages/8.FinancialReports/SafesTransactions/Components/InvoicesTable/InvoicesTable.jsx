import React, { useRef } from "react";
import MasterTable from "../../../../../Components/SharedComponents/Tables Components/MasterTable";
import { GET_SAFE_INVOICES } from "../../API.SafesTransactions";
import "./invoicesTable.css";

const InvoicesTable = ({
	toDate,
	fromDate,
	mosweq_id,
	safeId,
	updateSummeryData,
	onRowDoubleClickHandle,
}) => {
	const transactionsColAttributes = useRef([
		{
			field: "docno",
			caption: "رقم العملية",
			captionEn: "Transaction Number",
		},
		{
			field: "mvType",
			caption: "نوع العملية",
			captionEn: "Transaction Type",
		},
		{ field: "DateMv", caption: "التاريخ", captionEn: "Date" },
		{ field: "bean", caption: "الحساب", captionEn: "Account" },
		{
			field: "daen",
			caption: "الايرادات",
			captionEn: "Revenues",
			cssClass: "greenCell",
		},
		{
			field: "mden",
			caption: "المصروفات",
			captionEn: "Expenses",
			cssClass: "redCell",
		},
		{ field: "nots", caption: "ملاحظات", captionEn: "Note" },
	]);

	return (
		<>
			<MasterTable
				allowExcel
				columnChooser={false}
				colAttributes={transactionsColAttributes.current}
				remoteOperations={safeId ? true : false}
				apiKey="sno"
				apiMethod={safeId ? GET_SAFE_INVOICES : null}
				apiPayload={{ safeId, mosweq_id, fromDate, toDate }}
				otherMethod={safeId ? updateSummeryData : null}
				height={"300px"}
				onRowDoubleClick={onRowDoubleClickHandle}
			/>
		</>
	);
};

export default React.memo(InvoicesTable);
