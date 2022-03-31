import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { groupsSelector, addNewGroup } from "../../Store/groups.js";
import notify from "devextreme/ui/notify";
import TextBox from "devextreme-react/text-box";
import { Popup } from "devextreme-react/popup";
import { Button } from "devextreme-react/button";
import SimpleDropdown from "../SharedComponents/Dropdown Components/SimpleDropdown";
import { useTranslation } from "react-i18next";

const AddGroupPopup = ({ showPopup, changeShowPopup }) => {
	const { t, i18n } = useTranslation();
	const dispatch = useDispatch();
	//? State
	const [addGroupForm, setAddGroupForm] = useState({
		groupName: "",
		getFromId: "-1",
	});

	//? Selectors
	const groups = useSelector(groupsSelector.selectAll);

	//? Handlers
	const getPermissionsFromGroupHandle = (e) => {
		setAddGroupForm({ ...addGroupForm, getFromId: e.value });
	};

	const addGroupHandle = (e) => {
		const nameExist = groups.find(
			(group) => group.name === addGroupForm.groupName
		);
		if (!nameExist) {
			dispatch(addNewGroup(addGroupForm));
			setAddGroupForm({ ...addGroupForm, groupName: "" });
			changeShowPopup();
			notify(
				{
					message: t("Group Added successfully"),
					width: 450,
				},
				"success",
				2000
			);
		} else {
			notify(
				{
					message: t("This name already exists"),
					width: 450,
				},
				"error",
				2000
			);
		}
	};

	return (
		<Popup
			visible={showPopup}
			onHiding={changeShowPopup}
			dragEnabled={false}
			showTitle={true}
			title={t("Add Group")}
			rtlEnabled={true}
			width={500}
			height={300}
		>
			<div className="contianer">
				<div className="p-3 row">
					<div className="col-4 align-self-center">
						{t("Group Name")}
					</div>
					<div className="col-8">
						<TextBox
							value={addGroupForm.groupName}
							placeholder={t("Group Name")}
							onInput={({ event }) => {
								setAddGroupForm({
									...addGroupForm,
									groupName: event.target.value,
								});
							}}
						/>
					</div>
				</div>
				<div className="p-3 row">
					<div className="col-4 align-self-center">
						{t("Initial Permissions")}
					</div>
					<div className="col-8">
						<SimpleDropdown
							dropdownValue={addGroupForm.getFromId}
							onValueChanged={(e) =>
								getPermissionsFromGroupHandle(e)
							}
							data={[
								{ id: "-1", name: t("No Permissions") },
								{ id: "0", name: t("All Permissions") },
							].concat(groups)}
						/>
					</div>
				</div>
				<div className="formButtons d-flex justify-content-around pt-3">
					<Button
						disabled={addGroupForm.groupName ? false : true}
						text={t("Ok")}
						icon="check"
						type="success"
						rtlEnabled={true}
						width={"33%"}
						onClick={addGroupHandle}
					/>
					<Button
						text={t("Cancel")}
						icon="close"
						type="danger"
						rtlEnabled={true}
						width={"33%"}
						onClick={changeShowPopup}
					/>
				</div>
			</div>
		</Popup>
	);
};

export default AddGroupPopup;
