import React, { useEffect, useState } from "react";

import {
	Column,
	DataGrid,
	FilterRow,
	HeaderFilter,
	GroupPanel,
	Editing,
	Scrolling,
	Texts,
	Export,
	RequiredRule,
	AsyncRule,
	NumericRule,
} from "devextreme-react/data-grid";
import { CustomRule } from "devextreme-react/form";
import { useTranslation } from "react-i18next";

function CurrencyFileTable({
	disabled = false,
	//* "single" "multiple"
	selectionMode = "single",
	//* [{ }, ...]
	dataSource = [],
	width = "100%",
	height = "100%",
	filterRow = false,
	groupPanel = false,
	headerFilter = false,
	onSelectionChanged,
	onRowRemoving,
	onRowRemoved,
	onRowDoubleClick,
	onRowInserting,
	onRowUpdating,
	onSaving,
	onInitNewRow,
	onInsertButtonClicked,
}) {
	const { t, i18n } = useTranslation();

	let colAttributes = [
		{
			caption: "الرقم",
			captionEn: "Number",
			field: "number",
			alignment: "center",
			dataType: "number",
			required: true,
		},
		{
			caption: "البيان",
			captionEn: "Title",
			field: "description",
			alignment: "center",
			dataType: "string",
			required: true,
		},
		{
			caption: "الكود",
			captionEn: "Code",
			field: "code",
			alignment: "center",
			dataType: "string",
			required: true,
		},
		{
			caption: "الرقم العالمي",
			captionEn: "Global Number",
			field: "nationall",
			alignment: "center",
			dataType: "number",
			required: true,
		},
		{
			caption: "التقسيم",
			captionEn: "Dividing",
			field: "takseem",
			alignment: "center",
			dataType: "boolean",
			required: true,
		},
		{
			caption: "الكسر",
			captionEn: "Remain",
			field: "decim",
			alignment: "center",
			dataType: "string",
			required: true,
		},
		{
			caption: "التقريب",
			captionEn: "Floating Point",
			field: "numericc",
			alignment: "center",
			dataType: "number",
			required: true,
		},
		{
			caption: "م.التكلفة",
			captionEn: "Mean Cost",
			field: "p_tkl",
			alignment: "center",
			dataType: "number",
			required: true,
		},
	];

	return (
		<React.Fragment>
			<DataGrid
				id=""
				repaintChangesOnly={true}
				highlightChanges={true}
				disabled={disabled}
				width={width}
				height={"60vh"}
				showRowLines={true}
				rtlEnabled={true}
				hoverStateEnabled={true}
				dataSource={dataSource}
				showBorders={true}
				columnAutoWidth={true}
				allowColumnResizing={true}
				wordWrapEnabled={true}
				selection={{ mode: selectionMode }}
				onSelectionChanged={onSelectionChanged}
				onRowUpdating={onRowUpdating}
				onRowRemoving={onRowRemoving}
				onRowRemoved={onRowRemoved}
				onRowInserting={onRowInserting}
				onRowDblClick={onRowDoubleClick}
				onSaving={onSaving}
				onInitNewRow={onInitNewRow}
				onToolbarPreparing={
					onInsertButtonClicked &&
					((e) => onToolbarPreparing(e, onInsertButtonClicked))
				}
			>
				<FilterRow visible={filterRow} />
				<HeaderFilter visible={headerFilter} />
				<GroupPanel visible={groupPanel} />
				<Editing
					mode="form"
					useIcons={true}
					allowAdding={true}
					allowDeleting={true}
					allowUpdating={true}
				>
					<Texts
						exportAll="تصدير الكل"
						exportSelectedRows="تصدير المحدد"
						exportTo="تصدير الى"
						addRow="إضافة جديد"
						editRow="تعديل"
						saveRowChanges="حفظ"
						cancelRowChanges="إلغاء"
						deleteRow="حذف"
						confirmDeleteMessage="هل انت متأكد من حذف هذا الاختيار ؟"
					/>
				</Editing>
				<Scrolling mode="virtual" />
				{colAttributes &&
					colAttributes.map((col, index) => {
						//
						// console.log(col);
						return (
							<Column
								key={index}
								name={col.field}
								dataType={col.dataType || "string"}
								visible={col.isVisable}
								dataField={col.field}
								caption={
									i18n.language === "ar"
										? col.caption
										: col.captionEn
								}
								alignment={col.alignment || "right"}
								format={col.format}
								width={
									col.widthRatio
										? `${col.widthRatio}px`
										: `${
												(100 - col.widthRatio) /
												(colAttributes.length + 1)
										  }%`
								}
							>
								{col.required && (
									<RequiredRule
										message={
											i18n.language === "en"
												? "This field is required"
												: "هذا الحقل مطلوب"
										}
									/>
								)}
							</Column>
						);
					})}

				{/* <Export enabled={true} allowExportSelectedData={true} /> */}
			</DataGrid>
		</React.Fragment>
	);
}

const onToolbarPreparing = (e, onInsertButtonClicked) => {
	let toolbarItems = e.toolbarOptions.items;
	// Modifies an existing item
	toolbarItems.forEach(function (item) {
		if (item.name === "addRowButton") {
			const oo = item.options.onClick;
			item.options = {
				...item.options,
				// icon: "exportxlsx",
				text: "إضافة",
				onClick: async function (e) {
					await onInsertButtonClicked();
					oo(e);
				},
			};
		}
	});
};

export default React.memo(CurrencyFileTable);
