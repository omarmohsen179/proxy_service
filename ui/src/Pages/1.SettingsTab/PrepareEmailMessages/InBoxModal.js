// React
import React from "react";

// DevExpress
import { Button } from "devextreme-react/button";
import { Popup } from "devextreme-react/popup";
import ScrollView from "devextreme-react/scroll-view";

// Components
import MasterTable from "../.../../../../Components/SharedComponents/Tables Components/MasterTable";

function InBoxModal(props) {
	const { popupVisibility, handlePopupVisibility, title } = props;

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

	return (
		<Popup
			maxWidth={"100%"}
			minWidth={500}
			minHeight={"50%"}
			closeOnOutsideClick={true}
			visible={popupVisibility}
			onHiding={handlePopupVisibility}
			title={title}
		>
			<ScrollView className="container">
				<div className="triple mt-3">
					<Button
						text="الرسائل المعلقة"
						hoverStateEnabled
						width="100%"
						type="default"
						stylingMode="outlined"
						onClick={handlePopupVisibility}
					/>
					<Button
						text="الرسائل المرسلة"
						hoverStateEnabled
						width="100%"
						type="default"
						stylingMode="outlined"
						onClick={handlePopupVisibility}
					/>
					<Button
						text="صندوق الوارد"
						hoverStateEnabled
						width="100%"
						type="default"
						stylingMode="outlined"
						onClick={handlePopupVisibility}
					/>
				</div>

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
			</ScrollView>
		</Popup>
	);
}

export default InBoxModal;
