import React, { useState, useEffect, useCallback, useRef } from "react";
import notify from "devextreme/ui/notify";
import { Button as ButtonExpress } from "devextreme-react/button";
import { confirm } from "devextreme/ui/dialog";
import MasterTable from "../../Components/SharedComponents/Tables Components/MasterTable";

function EditDelete(props) {
	const {
		data, // Data Source
		columnAttributes, // Columns Names
		editDeleteStatus, // Determine if it's a delete or edit and on this adding recycle bin icon in delete case
		getEditData, // Setstate from your primary page to get on it the selected data
		close, // close function on deleteing خروج
		deleteItem, // Deleting row API ... you are to give it id only, regarding this data object has the id as "ID"
	} = props;

	// To set the id of the selected row in it to enable deleting or editing on clicking ok.
	const selectedRowID = useRef("");

	// Handelers
	// Handle selection and setting selected row id to id storage
	let handleSelection = useCallback((event) => {
		// console.log("EDITDELETE-handleSelection");
		if (event.currentSelectedRowKeys[0] != undefined) {
			selectedRowID.current = event.currentSelectedRowKeys[0].ID;
		}
	}, []);

	// Handle double click on row of the table , mostly look like handle Ok except for parameter.
	let handleDoubleClick = async (event) => {
		// console.log("EDITDELETE-handleDoubleClick");

		// checks if we need modal for delete or edit to handle functionality.
		if (editDeleteStatus === "delete") {
			let result = confirm("هل أنت متأكد من حذف هذا الاختيار؟");
			//	Deleting and closing on pressing ok
			await result.then(async (dialogResult) => {
				if (dialogResult) {
					console.log(event.key.ID);
					await deleteItem(event.key.ID)
						.then((res) => {
							deletedPopUp();
						})
						.catch((err) => notDeletedpopUp());
				}
			});
		} else {
			getEditData(event.data);
			close();
		}
	};

	// Handle Pressing Ok
	let handleOk = async () => {
		// console.log("EDITDELETE-handleOk");

		if (editDeleteStatus === "delete") {
			let result = confirm("هل أنت متأكد من حذف هذا الإختيار؟");
			await result.then(async (dialogResult) => {
				if (dialogResult) {
					await deleteItem(selectedRowID.current)
						.then((res) => {
							deletedPopUp();
						})
						.catch((err) => {
							notDeletedpopUp();
						});
				}
			});
		} else {
			var data1 = data.find((element) => element.ID === selectedRowID.current);
			getEditData(data1);
			close();
		}
	};

	// handle delete function depending on id of row "on clicking on recycle bin icon"
	let handleDelete = async (event) => {
		// console.log("EDITDELETE-handleDelete");
		event.cancel = true;
		console.log(event);
		await deleteItem(event.data.ID)
			.then((res) => {
				deletedPopUp();
			})
			.catch((err) => {
				notDeletedpopUp();
			});
	};

	// helpers
	// Can delete popup
	let deletedPopUp = () => {
		notify({ message: "تم مسح هذا العنصر ", width: 600 }, "success", 3000);
		close();
	};

	// Canot delete popup

	let notDeletedpopUp = () => {
		notify({ message: "لا يمكن مسح هذا العنصر", width: 600 }, "error", 3000);
	};

	return (
		<div>
			{/* {console.log("EDITDELETE")} */}
			<MasterTable
				dataSource={data}
				colAttributes={columnAttributes}
				filterRow
				onRowDoubleClick={handleDoubleClick}
				height={"300px"}
				columnChooser={true}
				onSelectionChanged={handleSelection}
				allowDelete={editDeleteStatus === "delete" ? true : false}
				onRowRemoving={handleDelete}
			/>

			<div
				style={{
					width: "40%",
					display: "flex",
					justifyContent: "space-around",
					flexWrap: "wrap",
					marginTop: "5%",
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

export default React.memo(EditDelete);
