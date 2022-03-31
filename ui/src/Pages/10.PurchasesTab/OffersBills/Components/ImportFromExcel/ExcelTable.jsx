import React from "react";
import DataGrid, {
	Column,
	Editing,
	Paging,
	Texts,
	HeaderFilter,
} from "devextreme-react/data-grid";
import { useMemo } from "react";
import { Button } from "devextreme-react/button";

const ExcelTable = ({ dataSource, selectedColumnNames }) => {
	const tableRef = React.createRef();

	const excelOffersHeader = useMemo(() => {
		let columnsAttributes = [];
		for (const [key, value] of Object.entries(selectedColumnNames)) {
			let element = {
				caption: value,
				field: key,
				alignment: "center",
			};

			element.dataType = key === "Exp_Date" ? "date" : "string";

			columnsAttributes.push(element);
		}
		return columnsAttributes;
	}, [selectedColumnNames]);

	return (
		<>
			<DataGrid
				ref={tableRef}
				dataSource={dataSource}
				keyExpr="ExcelID"
				showBorders={true}
				allowColumnResizing={true}
				height={"80%"}
				rtlEnabled
			>
				<Paging enabled={true} />
				<HeaderFilter visible={true} />
				<Editing
					mode="batch"
					allowUpdating={true}
					allowAdding={true}
					allowDeleting={true}
					selectTextOnEditStart={true}
					startEditAction={"click"}
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
						undeleteRow="استعادة "
					/>
				</Editing>

				{excelOffersHeader?.length > 0 &&
					excelOffersHeader.map((col, index) => {
						return (
							<Column
								key={index}
								name={col.field}
								dataType={col.dataType}
								dataField={col.field}
								caption={col.caption}
								alignment={col.alignment || "right"}
							/>
						);
					})}
			</DataGrid>
		</>
	);
};

export default React.memo(ExcelTable);
