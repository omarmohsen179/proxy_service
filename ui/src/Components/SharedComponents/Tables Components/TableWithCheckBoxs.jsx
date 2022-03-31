import React, { useRef } from "react";
import {
	Column,
	DataGrid,
	HeaderFilter,
	GroupPanel,
	Scrolling,
	Editing,
} from "devextreme-react/data-grid";
import { useDispatch } from "react-redux";
import notify from "devextreme/ui/notify";
import { updateSubPermissions } from "../../../Store/permissions";
import { useTranslation } from "react-i18next";

function TableWithCheckBoxs({
	data,
	colAttributes,
	width = "100%",
	height = "100%",
	groupPanel = false,
	headerFilter = true,
	disable = false,
	onSelectionChanged,
}) {
	const { t, i18n } = useTranslation();

	const dataGridRef = useRef();

	const dispatch = useDispatch();

	const onSaving = React.useCallback(
		async (e) => {
			e.cancel = true;
			if (e.changes.length) {
				await dispatch(updateSubPermissions(e.changes));
			}
			await e.component.refresh(true);
			e.component.cancelEditData();
			notify(
				{
					message: t("Saved Successfully"),
					width: 450,
				},
				"success",
				2000
			);
		},
		[dispatch, t]
	);

	return (
		<>
			<DataGrid
				id="gridContainer"
				ref={dataGridRef}
				remoteOperations={true}
				repaintChangesOnly={true}
				onSaving={onSaving}
				width={width}
				height={height}
				showRowLines={true}
				hoverStateEnabled={true}
				dataSource={data}
				rtlEnabled={i18n.language === "ar"}
				showBorders={true}
				allowColumnResizing={true}
				onSelectionChanged={onSelectionChanged}
				disabled={disable}
			>
				<HeaderFilter visible={headerFilter} />
				<GroupPanel visible={groupPanel} />
				<Scrolling mode="virtual" />
				<Editing
					mode="batch"
					allowUpdating={true}
					startEditAction={"click"}
				></Editing>
				{colAttributes.map((attr, index) => {
					return (
						<Column
							allowEditing={index > 0 ? true : false}
							key={index}
							name={index}
							dataField={attr[0]}
							headerCellRender={() => (
								<>
									<i className={attr[2]} />
									<i className="px-1 dx-datagrid-text-content">
										{attr[1]}
									</i>
								</>
							)}
							dataType={index > 0 ? "boolean" : "string"}
							width={index !== 0 ? "120px" : null}
						/>
					);
				})}
			</DataGrid>
		</>
	);
}

export default TableWithCheckBoxs;
