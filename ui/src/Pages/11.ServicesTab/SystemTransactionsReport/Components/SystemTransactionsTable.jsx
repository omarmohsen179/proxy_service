import React, { useRef } from "react";
import MasterTable from "../../../../Components/SharedComponents/Tables Components/MasterTable";
import { GET_SYSTEM_TRANSACTIONS } from "../API.SystemTransactions";

const SystemTransactionsTable = ({ toDate, fromDate, mosweq_id }) => {
	const transactionsColAttributes = useRef([
		{
			field: "op_type",
			caption: "نوع العملية",
			captionEn: "Transaction type",
		},
		{ field: "form_name", caption: "اسم الشاشة", captionEn: "Form name" },
		{ field: "byan", caption: "البيان", captionEn: "Title" },
		{ field: "op_details", caption: "تفاصيل", captionEn: "Details" },
		{
			field: "read_date",
			caption: "التاريخ",
			captionEn: "Date",
			dataType: "datetime",
		},
	]);

	return (
		<>
			<MasterTable
				allowExcel
				columnChooser={false}
				colAttributes={transactionsColAttributes.current}
				remoteOperations={mosweq_id >= 0 ? true : false}
				apiMethod={mosweq_id >= 0 ? GET_SYSTEM_TRANSACTIONS : null}
				apiPayload={{ mosweq_id, fromDate, toDate }}
				height={"500px"}
			/>
		</>
	);
};

export default React.memo(SystemTransactionsTable);
