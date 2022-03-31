import React, { useState, useEffect } from "react";
import notify from "devextreme/ui/notify";

// API
import {
	GET_EDIT_LIST as getEditList,
	GET_EDIT_ITEM as getEditItem,
	DELETE_ROW as deleteItem,
} from "../../Services/ApiServices/Basics/AccountsGuide";

// Devexpress
import MasterTable from "../../Components/SharedComponents/Tables Components/MasterTable";
import { CheckBox } from "../../Components/Inputs";
import { SelectBox as SelectExpress } from "devextreme-react";
import { Button as ButtonExpress } from "devextreme-react/button";
import { confirm } from "devextreme/ui/dialog";

function Edit(props) {
	// Destructing props
	const { toggleEditDelete, getEditData, data, close, dataList, listItem } =
		props;
	// console.log(data);

	// Mapping Table data to be shown in the table
	// controling its name, converting it from name from database to new name,
	// and defining if its shown of the table directly or in the side list of not shown columns
	let columnAttributes = [
		{ field: "num", caption: "الرقم", isVisable: true },
		{ field: "name", caption: "الاسم", isVisable: true },
		{ field: "hesab", caption: "الرصيد", isVisable: true },
		{ field: "tel", caption: "الهاتف", isVisable: true },
		{ field: "class", caption: "التصنيف", isVisable: false },
		{ field: "mosweq_name", caption: "المسوق", isVisable: false },
	];

	// Modal State
	// 1- Storage to save Edit list data to be shown in the table
	const [editData, setEditData] = useState();
	// 2- Storage to save the selected item of the drop down list that came in props.
	const [lisSelectedItem, setLisSelectedItem] = useState();
	// 3- Bolean storage to save state of إظهار المخفي
	// to be able to set it to false after closing the modal.
	const [showHidden, setShowHidden] = useState(false);
	// 4- Storage of id of the selected item ro use it delete the row for example.
	const [id, setId] = useState();

	// Setting page data
	useEffect(() => {
		setEditData(data);
	}, [data]);

	// Setting listing item
	useEffect(() => {
		setLisSelectedItem(listItem);
	}, [listItem]);

	// Handle change function
	let handleChange = async ({ value }) => {
		// keeping selected item in storage on selection changes
		setLisSelectedItem(value);
		// get edit data list on chnage list selection
		var data1 = await getEditList(value, showHidden);
		// setting data to state
		setEditData(data1);
	};

	//Handle behaviour on check or un check إظهار المخفي
	let handleShowHidden = async ({ value }) => {
		// setting value of the checkbox to the state to be set in checkbox input value
		setShowHidden(value);
		// calling API on changing checkbox value
		var data1 = await getEditList(lisSelectedItem, value);
		// setting data to state after calling API
		setEditData(data1);
	};

	// Handle double click on row of the table , mostly look like handle Ok except for parameter.
	let handleDoubleClick = async ({ key: { id } }) => {
		// checks if we need modal for delete or edit to handle functionality.
		// true: delete --  false: edit
		if (toggleEditDelete) {
			let result = confirm("هل أنت متأكد من حذف هذا الإختيار؟");
			// Deleting and closing on pressing ok
			await result.then(async (dialogResult) => {
				if (dialogResult) {
					await deleteItem(id)
						.then((res) => {
							setShowHidden(false);
							close();
						})
						.catch((err) => {
							notify(
								{ message: "لا يمكن مسح هذا الحساب", width: 600 },
								"error",
								3000
							);
						});
				}
			});
		} else {
			//
			var data1 = await getEditItem(id);
			data1.ID = data1.id;
			getEditData(data1);
			setShowHidden(false);
			close();
		}
	};

	let handleOk = async () => {
		if (toggleEditDelete) {
			let result = confirm("هل أنت متأكد من حذف هذا الإختيار؟");
			await result.then(async (dialogResult) => {
				if (dialogResult) {
					await deleteItem(id)
						.then((res) => {
							setShowHidden(false);
							close();
						})
						.catch((err) => {
							notify(
								{ message: "لا يمكن مسح هذا الحساب", width: 600 },
								"error",
								3000
							);
						});
				}
			});
		} else {
			// on edit state we get data of selected row and setting it to state of "ACCOUNTS GUIDE" state
			var data1 = await getEditItem(id);
			// Adding this ID will differenciate between Save and Update
			// Update has ID -- Save dont have
			data1.ID = data1.id;
			getEditData(data1);
			setShowHidden(false);
			close();
		}
	};

	// Handle selection and setting selected row id to id storage
	let handleSelection = ({ currentSelectedRowKeys }) => {
		if (currentSelectedRowKeys[0] != undefined) {
			setId(currentSelectedRowKeys[0].id);
			// console.log(currentSelectedRowKeys[0].id);
		}
	};

	// handle delete function depending on id of row
	let handleDelete = async (event) => {
		// console.log(event);
		event.cancel = true;
		await deleteItem(event.data.id)
			.then((res) => {
				let data = [...editData];
				let index = editData.indexOf(event.data);
				if (~index) {
					data.splice(index, 1);
					setEditData(data);
				}
				setShowHidden(false);
				close();
			})
			.catch((err) => {
				notify(
					{ message: "لا يمكن مسح هذا الحساب", width: 600 },
					"error",
					3000
				);
			});
	};

	return (
		<div>
			<MasterTable
				dataSource={editData}
				filterRow
				onRowDoubleClick={handleDoubleClick}
				height={"300px"}
				columnChooser={true}
				colAttributes={columnAttributes}
				onSelectionChanged={handleSelection}
				allowDelete={toggleEditDelete}
				onRowRemoving={handleDelete}
			/>

			<div>
				<div className="double  mt-4 mx-4">
					<SelectExpress
						dataSource={dataList}
						hoverStateEnabled={true}
						valueExpr={"id"}
						displayExpr={"description"}
						name="typ_class1"
						value={lisSelectedItem}
						onValueChange={(selectedItem) =>
							handleChange({
								name: "typ_class1",
								value: selectedItem,
							})
						}
						searchEnabled={true}
					/>
				</div>
				<div className="double mt-4 mx-4">
					<CheckBox
						label="إظهار المخفي"
						keys={{ id: "id", name: "description" }}
						name="إظهار"
						value={showHidden}
						handleChange={handleShowHidden}
					/>
				</div>
			</div>
			<div
				style={{
					width: "40%",
					display: "flex",
					justifyContent: "space-around",
					flexWrap: "wrap",
				}}
			>
				<ButtonExpress
					width={120}
					height={34}
					text="إلغاء الأمر"
					type="danger"
					stylingMode="contained"
					onClick={close}
				/>

				<ButtonExpress
					width={120}
					height={34}
					text="موافق"
					type="success"
					stylingMode="contained"
					onClick={handleOk}
				/>
			</div>
		</div>
	);
}

export default Edit;
