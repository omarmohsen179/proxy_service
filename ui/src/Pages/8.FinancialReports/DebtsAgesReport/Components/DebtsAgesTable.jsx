import React, { useRef } from "react";
import MasterTable from "../../../../Components/SharedComponents/Tables Components/MasterTable";
import { GET_DEBITS_VALUE_REPORT } from "../API.DebtsAgesReport";

const DebtsAgesTable = ({ apiPayload, handleDoubleClick }) => {
	const colAttributes = useRef([
		{
			caption: "الرقم",
			captionEn: "Number",
			field: "cust_id",
		},
		{
			captionEn: "Account",
			caption: "الحساب",
			field: "name",
		},
		{
			captionEn: "Less Than 30",
			caption: "أقل من 30",
			field: "sum0",
		},
		{
			captionEn: "More Than 30",
			caption: "أكثر من 30",

			field: "sum30",
		},
		{
			caption: "أكثر من 45",
			captionEn: "More than 45",
			field: "sum45",
		},
		{
			caption: "أكثر من 60",
			captionEn: "More than 60",
			field: "sum60",
		},
		{
			caption: "أكثر من 90",
			captionEn: "More than 90",
			field: "sum90",
		},
		{
			caption: "أكثر من 180",
			captionEn: "More than 180",
			field: "sum180",
		},
		{
			caption: "التصنيف",
			captionEn: "Categorize",
			field: "class",
		},
	]);

	return (
		<>
			<MasterTable
				columnChooser={false}
				colAttributes={colAttributes.current}
				height={"300px"}
				remoteOperations={apiPayload.AccountType ? true : false}
				allowExcel
				// filterRow
				apiMethod={GET_DEBITS_VALUE_REPORT}
				apiPayload={apiPayload}
				onRowDoubleClick={handleDoubleClick}
			/>
		</>
	);
};

export default React.memo(DebtsAgesTable);
