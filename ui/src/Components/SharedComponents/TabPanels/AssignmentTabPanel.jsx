import React, { useEffect, useState } from "react";
import notify from "devextreme/ui/notify";
import Accordion from "devextreme-react/accordion";
import { Button } from "devextreme-react";
import AdvancedTable from "../Tables Components/AdvancedTable";
import MasterTable from "../Tables Components/MasterTable";
import SelectBox from "devextreme-react/select-box";
import { useDispatch, useSelector } from "react-redux";
import {
	getOtherPermissionsEntities_IN_OUT,
	updateOtherPermissions,
	deleteOtherPermissions,
} from "../../../Store/otherPermissions";
import { useTranslation } from "react-i18next";

function AssignmentTabPanel() {
	const { t, i18n } = useTranslation();
	const dispatch = useDispatch();
	const otherPermissions = useSelector(getOtherPermissionsEntities_IN_OUT);
	const [selectedIndexs, setSelectedIndexs] = useState({});
	const [selectedItems, setSelectedItems] = useState([otherPermissions[0]]);

	const onValueChanged = (e) => {
		setSelectedIndexs({ ...selectedIndexs, [e.element.id]: e.value });
	};

	const addClickHandle = (e, element) => {
		let type = e.element.id;
		let id = selectedIndexs[type];
		dispatch(
			updateOtherPermissions({
				type: element.type,
				name: element.name,
				id,
			})
		);
		delete selectedIndexs[type];
		notify(
			{
				message: t("Added Successfully"),
				width: 450,
			},
			"success",
			2000
		);
	};

	const onRowRemoving = React.useCallback(
		async (e, element) => {
			e.cancel = true;
			await dispatch(
				deleteOtherPermissions({
					id: e.data.id,
					type: element.type,
					name: element.name,
				})
			);
			await e.component.refresh(true);
			e.component.cancelEditData();
			notify(
				{
					message: t("Removed Successfully"),
					width: 450,
				},
				"success",
				2000
			);
		},
		[dispatch, t]
	);

	const selectionChanged = (e) => {
		let newItems = [...selectedItems];
		e.removedItems.forEach((item) => {
			let index = newItems.indexOf(item);
			if (index >= 0) {
				newItems.splice(index, 1);
			}
		});
		if (e.addedItems.length) {
			newItems = [...newItems, ...e.addedItems];
		}
		setSelectedItems(newItems);
	};

	const CustomTitle = (data) => {
		return (
			<h6
				style={{
					fontWeight: "bold",
					lineHeight: "normal",
				}}
			>
				{i18n.language === "ar"
					? data.title
					: data.titleEn ?? data.title}
			</h6>
		);
	};

	// Data details
	// id => group id
	// [] => permissions detials
	const colAttributes = [
		{
			field: "num",
			caption: "الرقم",
			captionEn: "Number",
			widthRatio: "70",
		},
		{
			field: "name",
			caption: "بيان",
			captionEn: "Name",
			widthRatio: "150",
		},
	];

	const CustomBody = (data) => {
		let id = data.type;
		return (
			<>
				<div>
					<div className="d-flex pb-2">
						<SelectBox
							disabled={data.out && data.out[0] ? false : true}
							id={data.type}
							name={data.type}
							placeholder={t("Please Select")}
							dataSource={data.out}
							displayExpr={"name"}
							valueExpr={"id"}
							showClearButton={false}
							value={selectedIndexs[id]}
							onValueChanged={onValueChanged}
							rtlEnabled={true}
							searchEnabled={true}
							width={"100%"}
						/>
						<Button
							className="col-2"
							id={id}
							icon="add"
							disabled={selectedIndexs[id] ? false : true}
							onClick={(e) => addClickHandle(e, data)}
							type={"success"}
						/>
					</div>
					<div className="py-auto">
						<AdvancedTable
							dataSource={data.in}
							id={id}
							selectionMode="none"
							disabled={data.in && data.in[0] ? false : true}
							colAttributes={colAttributes}
							height={83 / 2.5 + "vh"}
							onRowRemoving={(e) => onRowRemoving(e, data)}
							deleteMessage={t(
								"Are you sure you want to delete this ?"
							)}
							filterRow={false}
							headerFilter={false}
						/>
					</div>
				</div>
			</>
		);
	};

	return (
		<div>
			<Accordion
				height={"83vh"}
				dataSource={otherPermissions}
				collapsible={false}
				multiple={false}
				animationDuration={0}
				selectedItems={selectedItems}
				onSelectionChanged={selectionChanged}
				itemTitleRender={CustomTitle}
				itemRender={CustomBody}
			/>
		</div>
	);
}

export default React.memo(AssignmentTabPanel);
