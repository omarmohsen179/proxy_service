import React, { useState, useEffect } from "react";
import List from "devextreme-react/list";
import MasterTable from "../../../../Components/SharedComponents/Tables Components/MasterTable";
import { confirm } from "devextreme/ui/dialog";
import { DELETE_FINANCIAL_TRANSACTIONS as deleteFinancialTransactions } from "../../../../Services/ApiServices/Settings/SystemSettingsAPI";
import notify from "devextreme/ui/notify";

function SimpleDealEdit(props) {
	const { list, close, selectedItem, statue } = props;

	let handleDoubleClick = async (event) => {
		console.log(event);

		if (statue === "edit") {
			selectedItem(event.data.name_moaamla);
			close();
		} else if (statue === "delete") {
			let result = confirm("هل أنت متأكد من حذف هذا الإختيار؟");
			await result.then(async (dialogResult) => {
				if (dialogResult) {
					await deleteFinancialTransactions(event.key.ID)
						.then((res) => {
							close();
							notify(
								{ message: "تم مسح هذه المعاملة", width: 600 },
								"success",
								3000
							);
						})
						.catch((err) => {
							notify(
								{ message: "لا يمكن مسح هذه المعاملة", width: 600 },
								"error",
								3000
							);
						});
				}
			});
		}
	};

	let columnAttributes = [
		{ field: "name_moaamla", caption: "المعاملة المالية" },
	];

	return (
		<>
			<MasterTable
				filterRow
				colAttributes={columnAttributes}
				dataSource={list}
				onRowDoubleClick={handleDoubleClick}
			/>
		</>
	);
}

export default React.memo(SimpleDealEdit);
