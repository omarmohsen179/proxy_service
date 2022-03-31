import React from "react";
import { Button } from "devextreme-react/button";
import { TextBox } from "../../../../Components/Inputs";
import { SelectBox as SelectExpress } from "devextreme-react";
import List from "devextreme-react/list";

function SetFinancialTransaction() {
	let handleChange = ({ name, value }) => {};

	let tasks = [
		"Prepare 2016 Financial",
		"Prepare 2016 Marketing Plan",
		"Update Personnel Files",
	];

	let onSelectedItemsChange = (args) => {
		if (args.name === "selectedItems") {
			// this.setState({
			// 	selectedItems: args.value,
			// });
		}
	};
	return (
		<div>
			{/* {console.log("SetFinancialTransaction")} */}
			{/* Row 1 */}
			<div className="double my-3 d-flex justify-content-end container">
				<SelectExpress />
				<Button text="إضافة" type="success" stylingMode="contained" />
			</div>

			{/* Row 2 */}
			<div className="double  my-4 container">
				<div className="w-50">
					<TextBox
						label="اسم المعاملة"
						value={""}
						name="moamla"
						handleChange={handleChange}
					/>
				</div>
				<div className="d-flex justify-content-end">
					<Button
						text="إدراج معاملة"
						type="default"
						width="30%"
						stylingMode="contained"
						height="38px"
					/>
				</div>
			</div>

			{/* List 1 */}

			<div className="d-flex justify-content-center mt-2 container">
				<List
					dataSource={tasks}
					height={200}
					width="30%"
					showSelectionControls={true}
					selectedItems={"selectedItems"}
					onOptionChanged={onSelectedItemsChange}
				></List>
			</div>

			<div className="d-flex justify-content-between mt-4 container">
				<div>
					<div
						style={{
							fontSize: "20px",
							fontWeight: "bold",
							textAlign: "right",
							marginBottom: "10px",
						}}
					>
						الطرف الثاني
					</div>
					<List
						dataSource={tasks}
						height={200}
						width="90%"
						showSelectionControls={true}
						selectedItems={"selectedItems"}
						onOptionChanged={onSelectedItemsChange}
					></List>
				</div>

				<div>
					<div
						style={{
							fontSize: "20px",
							fontWeight: "bold",
							textAlign: "right",
							marginBottom: "10px",
						}}
					>
						الطرف الأول
					</div>
					<List
						dataSource={tasks}
						height={200}
						width="90%"
						showSelectionControls={true}
						selectedItems={"selectedItems"}
						onOptionChanged={onSelectedItemsChange}
					></List>
				</div>
			</div>
		</div>
	);
}

export default React.memo(SetFinancialTransaction);
