import React, {
	useState,
	useCallback,
	useEffect,
	useRef,
	useMemo,
} from "react";
import { Button, SelectBox as SelectExpress } from "devextreme-react";
import MasterTable from "../../Components/SharedComponents/Tables Components/MasterTable";

import { TRANSACTIONS_PARTS_DATA } from "../../Services/ApiServices/Bills/BillsTabAPI";
import { useTranslation } from "react-i18next";

function FirstSecondParts(props) {
	// Props
	const {
		setMainPageData,
		close,
		setFisrtSecondPartsData,
		marketerInitialId,
		selectBoxData,
		definedPart,
		submitStateHandeler,
		submitState,
		visable,
	} = props;

	// List
	// Column names of the table
	let columnAttributes = useMemo(() => {
		return [
			{
				field: "num1",
				caption: "الرقم",
				captionEn: "Number",
				isVisable: true,
			},
			{
				field: "name",
				caption: "الاسم",
				captionEn: "Name",
				isVisable: true,
			},
			{
				field: "rased",
				caption: "الرصيد",
				captionEn: "Balance",
				isVisable: true,
			},
		];
	}, []);

	//State
	// define data to be displayed in the table.
	const [partData, setPartData] = useState([]);
	// Curent value of the select box
	const [value, setValue] = useState();
	// table data state
	const [tableData, setTableData] = useState();
	// Data when select any row, data of this row
	const [selectedRowData, setSelectedRowData] = useState({});
	// Defines key of table from the main data object, we use this key to save data to it properly
	const partItemsKey = useRef("");

	useEffect(async () => {
		if (value != undefined) {
			setMainPageData((prevState) => ({
				...prevState,
				[partItemsKey.current]: value,
			}));
			await TRANSACTIONS_PARTS_DATA(marketerInitialId, value)
				.then((res) => setTableData(res))
				.catch((err) => console.log(err));
		}

		submitStateHandeler(false);
	}, [value, submitState === true]);

	// Effects
	// Set table data depending on whic pop up we are opening first of second part popup.
	useEffect(() => {
		if (definedPart === "FirstSide") {
			setPartData(selectBoxData.FirstSide);
			partItemsKey.current = "st_table1";
		} else {
			setPartData(selectBoxData.SecondSide);
			partItemsKey.current = "st_table2";
		}
	}, []);

	useEffect(() => {
		if (!visable) setTableData([]);
	}, [visable]);

	// Defines select box Initial value, because if we opened the pop up and dont choose any thing from select box
	// as we wanted the current selection of it, its value is already submited here
	useEffect(() => {
		partData && partData.length > 0 && setValue(partData[0].Index);
	}, [partData]);
	const { t, i18n } = useTranslation();
	// changing selectbox value
	let handleChange = useCallback(({ value }) => {
		setValue(value);
	}, []);
	// handle double click to edit or delete
	let handleDoubleClick = useCallback(
		(event) => {
			definedPart === "FirstSide"
				? setFisrtSecondPartsData(event.key)
				: setFisrtSecondPartsData(event.key);
			close();
		},
		[definedPart]
	);
	// handle clicking ok
	let handleOk = useCallback(() => {
		setFisrtSecondPartsData(selectedRowData);
		close();
	}, [selectedRowData]);

	// handling selection of any row
	let handleSelection = useCallback(
		(event) => {
			setSelectedRowData(event.currentSelectedRowKeys[0]);
		},
		[selectedRowData]
	);

	return (
		<div className="m-1">
			<div className="double mb-2">
				<SelectExpress
					dataSource={partData}
					hoverStateEnabled={true}
					valueExpr={"Index"}
					required={true}
					displayExpr={"Type"}
					name="select_box"
					value={value}
					onValueChange={(selectedItem) =>
						handleChange({
							name: "select_box",
							value: selectedItem,
						})
					}
					searchEnabled={true}
				/>
			</div>
			{/* {console.log(definedPart)} */}
			<div>
				<MasterTable
					dataSource={tableData}
					filterRow
					onRowDoubleClick={handleDoubleClick}
					height={"400px"}
					columnChooser={false}
					colAttributes={columnAttributes}
					onSelectionChanged={handleSelection}
				/>
			</div>
			<div
				style={{
					display: "flex",
					justifyContent: "space-between",
					marginTop: "5px",
				}}
			>
				<div className="double">
					<Button
						width={100}
						text={t("Ok")}
						type="normal"
						stylingMode="outlined"
						onClick={handleOk}
					/>
					<Button
						width={100}
						text={t("Cancel")}
						type="normal"
						stylingMode="outlined"
						onClick={close}
					/>
				</div>
				<Button
					width={100}
					text="جديد"
					type="normal"
					stylingMode="outlined"
				/>
			</div>
		</div>
	);
}

export default React.memo(FirstSecondParts);
