// React
import React, { useState, useEffect, useCallback } from "react";
// Components
import SimpleDealEdit from "./SimpleDealEdit";
import { TextBox, SelectBox, CheckBox } from "../../../../Components/Inputs";
import ButtonRow from "../../../../Components/SharedComponents/buttonsRow";
// DevExpress
import notify from "devextreme/ui/notify";
import { Popup } from "devextreme-react/popup";
import { SelectBox as SelectExpress } from "devextreme-react";
import ScrollView from "devextreme-react/scroll-view";

// API
import {
	GET_FINANCIAL_TRANSACTIONS_TYPES,
	CHECK_FINANCIAL_TRANSACTIONSDATA,
	FINANCIAL_TRANSACTIONS,
} from "../../../../Services/ApiServices/Settings/SystemSettingsAPI";
import { useTranslation } from "react-i18next";

function SimpleDeal(props) {
	const { closeModal } = props;
	const { t, i18n } = useTranslation();
	// ============================================================================================================================
	// ================================================= Lists ====================================================================
	// ============================================================================================================================
	// Initial Data of the pop up
	let initialData = {
		S1: "0",
		S2: "1",
		S_ReadOnly: false,
		byan_F: "",
		byanEn_F: "",
		byan_S: "",
		byanEn_S: "",
		hesab_static: "",
		id: "",
		name_hesab: "",
		name_moaamla: "",
		str_F: "",
		str_S: "",
	};

	// Right Side Initial Data
	let firstSideInitialData = {
		customers_f: false,
		suppliers_f: false,
		storages_f: false,
		other_accounts_f: false,
		banks_f: false,
		employees_f: false,
		spendings_f: false,
		main_accounts_f: false,
		fixed_assests_f: false,
	};
	// Left Side Initial Data
	let secondSideInitialData = {
		customers_s: false,
		suppliers_s: false,
		storages_s: false,
		other_accounts_s: false,
		banks_s: false,
		employees_s: false,
		spendings_s: false,
		main_accounts_s: false,
		fixed_assests_s: false,
	};

	// List of first or second part
	let partyList = [
		{ id: "0", description: t("Debit") },
		{ id: "1", description: t("Creditor") },
	];

	// ============================================================================================================================
	// ================================================= State ====================================================================
	// ============================================================================================================================

	// Show or hide Edit Delete Modal of this page.
	const [editDeleteVisibility, setEditDeleteVisibility] = useState(false);
	// set selected item of edit modal
	const [selectedItem, setSelectedItem] = useState("");
	// set main modal data
	const [data, setData] = useState(initialData);
	// set data of selected item from edit modal
	const [currentEditData, setCurrentEditData] = useState(initialData);
	// Setting First Part data or Right part Data
	const [firstSideData, setFirstSideData] = useState(firstSideInitialData);
	// Setting Second Part data or left part Data
	const [secondSideData, setSecondSideData] = useState(secondSideInitialData);
	// Know if the button we clicked is edit or delete
	const [buttonType, setButtonType] = useState("");

	// ============================================================================================================================
	// ================================================= Effects ==================================================================
	// ============================================================================================================================

	// First render get data function
	useEffect(() => {
		// console.log("effect get data render");
		GET_FINANCIAL_TRANSACTIONS_TYPES()
			.then((res) => {
				setData(res);
			})
			.catch((err) => console.log(err));
	}, []);

	// To change Debitor and Creditor select box depending on changing in right side select box.
	useEffect(() => {
		// console.log("right selectbox rendered");
		parseInt(currentEditData.S1) === 0
			? setCurrentEditData({ ...currentEditData, S2: "1" })
			: setCurrentEditData({ ...currentEditData, S2: "0" });
	}, [currentEditData.S1]);

	// To change Debitor and Creditor select box depending on changing in lef side select box.
	useEffect(() => {
		// console.log("left selectbox rendered");
		parseInt(currentEditData.S2) === 0
			? setCurrentEditData({ ...currentEditData, S1: "1" })
			: setCurrentEditData({ ...currentEditData, S1: "0" });
	}, [currentEditData.S2]);

	// To create Submit obkect shape after any edits as it consists of 3 separate objects
	useEffect(() => {
		// console.log("effect because first or second item changed render");

		var firstSide = "(" + Object.values(firstSideData).toString() + ")";

		var secondSide = "(" + Object.values(secondSideData).toString() + ")";
		setCurrentEditData({
			...currentEditData,
			str_F: firstSide,
			str_S: secondSide,
		});
	}, [firstSideData, secondSideData]);

	// Set data to form after choosing edit list item
	useEffect(() => {
		// console.log("effect get data render");

		if (selectedItem != "") {
			var item = data.find(
				(element) => element.name_moaamla === selectedItem
			);
			setCurrentEditData({ ...item });

			var firstSide = item.str_F
				.replace("(", "")
				.replace(")", "")
				.split(",");
			var secondSide = item.str_S
				.replace("(", "")
				.replace(")", "")
				.split(",");
			var firstSideKeys = Object.keys(firstSideInitialData);
			var secondSideKeys = Object.keys(secondSideInitialData);
			let firstSideObj = {};
			let secondSideObj = {};

			for (let i = 0; i < firstSideKeys.length; i++) {
				firstSideObj[firstSideKeys[i]] = JSON.parse(firstSide[i]);
				secondSideObj[secondSideKeys[i]] = JSON.parse(secondSide[i]);
			}

			// Setting data after submitting any edit list option from edit list
			setCurrentEditData({
				...item,
			});

			setFirstSideData({ ...firstSideData, ...firstSideObj });
			setSecondSideData({ ...secondSideData, ...secondSideObj });
		}
	}, [selectedItem]);

	// ============================================================================================================================
	// ================================================= Handelers ====================================================================
	// ============================================================================================================================

	// Handle edit and delete
	let handleEditDelete = useCallback(
		async (title) => {
			// console.log("editdeleteVisibility rendered");

			if (editDeleteVisibility) {
				// console.log(editDeleteVisibility);
				setEditDeleteVisibility(!editDeleteVisibility);
				setSelectedItem("");
			} else {
				// console.log(editDeleteVisibility);
				setEditDeleteVisibility(!editDeleteVisibility);
				setButtonType(title);

				await GET_FINANCIAL_TRANSACTIONS_TYPES().then((res) => {
					setData(res);
				});
			}
		},
		[editDeleteVisibility]
	);

	// Handle change
	let handleChange = ({ name, value }) => {
		// console.log("change rendered");

		if (name.includes("_f")) {
			setFirstSideData({ ...firstSideData, [name]: value });
		} else if (name.includes("_s")) {
			setSecondSideData({ ...secondSideData, [name]: value });
		} else {
			setCurrentEditData({ ...currentEditData, [name]: value });
		}
	};

	// Handle reset and reset general function
	let handleReset = useCallback(() => {
		// console.log("reset rendered");
		setCurrentEditData(initialData);
		setFirstSideData(firstSideInitialData);
		setSecondSideData(secondSideInitialData);
	}, []);

	// handling submit and update
	let handleSubmit = useCallback(() => {
		// Check object to check if name_moaamla has value
		var CheckDataObj = {
			ID: currentEditData["ID"],
			CheckData: { name_moaamla: currentEditData["name_moaamla"] },
		};

		// console.log(currentEditData);

		// console.log(CheckDataObj);
		CHECK_FINANCIAL_TRANSACTIONSDATA(CheckDataObj)
			.then(async (res) => {
				if (res.Check) {
					if (currentEditData.ID === undefined) {
						// console.log("حفظ");
						await FINANCIAL_TRANSACTIONS(currentEditData)
							.then((res) =>
								notify(
									{ message: "تم الحفظ بنجاح", width: 600 },
									"success",
									3000
								)
							)
							.catch((err) => console.log(err));

						handleReset();
					} else {
						await FINANCIAL_TRANSACTIONS(currentEditData)
							.then((res) => {
								notify(
									{ message: "تم التحديث بنجاح", width: 600 },
									"success",
									3000
								);
								handleReset();
							})
							.catch((err) => console.log(err));
					}
				} else {
					if (currentEditData["name_moaamla"] == "") {
						notify(
							{
								message: "يجب تسجيل قيمة في بيان المعاملة",
								width: 600,
							},
							"error",
							3000
						);
					} else {
						notify(
							{
								message:
									"سبق استخدام نفس القيمة ل بيان المعاملة",
								width: 600,
							},
							"error",
							3000
						);
					}
				}
			})
			.catch((err) => console.log(err));
	}, [currentEditData]);

	let handleSettingSelectedItem = useCallback((data) => {
		// console.log(["data", data]);
		setSelectedItem(data);
	}, []);
	let GridDisplayCols = "col-lg-4 col-md-6 col-sm-12";
	return (
		<div dir="auto">
			<div className="row">
				<div className={GridDisplayCols}>
					<TextBox
						label={t("Transaction statement")}
						required={false}
						name="name_moaamla"
						value={currentEditData["name_moaamla"]}
						handleChange={handleChange}
					/>
				</div>

				<div className={GridDisplayCols}>
					<SelectBox
						label={t("primary account")}
						value={currentEditData["ss"]}
						name="ss"
						handleChange={handleChange}
					/>
				</div>
			</div>
			<div className="d-flex flex-column">
				<div className="d-flex flex-column justify-content-start">
					<div className="row">
						<div className={GridDisplayCols}>
							<TextBox
								label={t("First Side")}
								required={false}
								value={currentEditData["byan_F"]}
								name="byan_F"
								handleChange={handleChange}
							/>
						</div>
						<div className={GridDisplayCols}>
							<TextBox
								label={t("First Side English")}
								required={false}
								value={currentEditData["byanEn_F"]}
								name="byanEn_F"
								handleChange={handleChange}
							/>
						</div>

						<div className={GridDisplayCols}>
							<SelectBox
								label={t("First Side Type")}
								dataSource={partyList}
								keys={{ id: "id", name: "description" }}
								name="S2"
								defaultValue={partyList[1].id}
								value={currentEditData["S2"].toString()}
								handleChange={handleChange}
							/>
						</div>
					</div>
					<div className="row">
						<div className={GridDisplayCols}>
							<CheckBox
								label={t("Customers")}
								value={firstSideData["customers_f"]}
								name="customers_f"
								handleChange={handleChange}
								required={false}
							/>
						</div>
						<div className={GridDisplayCols}>
							<CheckBox
								label={t("Suppliers")}
								value={firstSideData["suppliers_f"]}
								name="suppliers_f"
								handleChange={handleChange}
								required={false}
							/>
						</div>
						<div className={GridDisplayCols}>
							<CheckBox
								label={t("Safes")}
								value={firstSideData["storages_f"]}
								name="storages_f"
								handleChange={handleChange}
								required={false}
							/>
						</div>
						<div className={GridDisplayCols}>
							<CheckBox
								label={t("Other accounts")}
								value={firstSideData["other_accounts_f"]}
								name="other_accounts_f"
								handleChange={handleChange}
								required={false}
							/>
						</div>
						<div className={GridDisplayCols}>
							<CheckBox
								label={t("Banks")}
								value={firstSideData["banks_f"]}
								name="banks_f"
								employees_f
								required={false}
								handleChange={handleChange}
							/>
						</div>
						<div className={GridDisplayCols}>
							<CheckBox
								label={t("Employees")}
								value={firstSideData["employees_f"]}
								name="employees_f"
								handleChange={handleChange}
								required={false}
							/>
						</div>
						<div className={GridDisplayCols}>
							<CheckBox
								label={t("Expenses")}
								value={firstSideData["spendings_f"]}
								name="spendings_f"
								handleChange={handleChange}
								required={false}
							/>
						</div>
						<div className={GridDisplayCols}>
							<CheckBox
								label={t("Basic Accounts")}
								value={firstSideData["main_accounts_f"]}
								name="main_accounts_f"
								handleChange={handleChange}
								required={false}
							/>
						</div>
						<div className={GridDisplayCols}>
							<CheckBox
								label={t("Fixed assets")}
								value={firstSideData["fixed_assests_f"]}
								name="fixed_assests_f"
								handleChange={handleChange}
								required={false}
							/>
						</div>
					</div>
				</div>

				<div className="d-flex flex-column justify-content-start">
					<div className="row">
						<div className={GridDisplayCols}>
							<TextBox
								label={t("Second Side")}
								value={currentEditData["byan_S"]}
								name="byan_S"
								handleChange={handleChange}
								required={false}
							/>
						</div>

						<div className={GridDisplayCols}>
							<TextBox
								label={t("Second Side English")}
								value={currentEditData["byanEn_S"]}
								name="byanEn_S"
								handleChange={handleChange}
								required={false}
							/>
						</div>

						<div className={GridDisplayCols}>
							<SelectBox
								label={t("Second Side Type")}
								dataSource={partyList}
								keys={{ id: "id", name: "description" }}
								name="S1"
								defaultValue={partyList[1].id}
								value={currentEditData["S1"].toString()}
								handleChange={handleChange}
							/>
						</div>
					</div>
					<div className="row">
						<div className={GridDisplayCols}>
							<CheckBox
								label="الزبائن"
								value={secondSideData["customers_s"]}
								name="customers_s"
								handleChange={handleChange}
								required={false}
							/>
						</div>
						<div className={GridDisplayCols}>
							<CheckBox
								label={t("Suppliers")}
								value={secondSideData["suppliers_s"]}
								name="suppliers_s"
								handleChange={handleChange}
								required={false}
							/>
						</div>
						<div className={GridDisplayCols}>
							<CheckBox
								label={t("Safes")}
								value={secondSideData["storages_s"]}
								name="storages_s"
								handleChange={handleChange}
								required={false}
							/>
						</div>
						<div className={GridDisplayCols}>
							<CheckBox
								label={t("Other accounts")}
								value={secondSideData["other_accounts_s"]}
								name="other_accounts_s"
								handleChange={handleChange}
								required={false}
							/>
						</div>
						<div className={GridDisplayCols}>
							<CheckBox
								label={t("Banks")}
								value={secondSideData["banks_s"]}
								name="banks_s"
								employees_f
								required={false}
								handleChange={handleChange}
							/>
						</div>
						<div className={GridDisplayCols}>
							<CheckBox
								label={t("Employees")}
								value={secondSideData["employees_s"]}
								name="employees_s"
								handleChange={handleChange}
								required={false}
							/>
						</div>
						<div className={GridDisplayCols}>
							<CheckBox
								label={t("Expenses")}
								value={secondSideData["spendings_s"]}
								name="spendings_s"
								handleChange={handleChange}
								required={false}
							/>
						</div>
						<div className={GridDisplayCols}>
							<CheckBox
								label={t("Basic Accounts")}
								value={secondSideData["main_accounts_s"]}
								name="main_accounts_s"
								handleChange={handleChange}
								required={false}
							/>
						</div>
						<div className={GridDisplayCols}>
							<CheckBox
								label={t("Fixed assets")}
								value={secondSideData["fixed_assests_s"]}
								name="fixed_assests_s"
								handleChange={handleChange}
								required={false}
							/>
						</div>
						<div className={GridDisplayCols}>
							<CheckBox
								label={t("default fixed")}
								value={currentEditData["S_ReadOnly"]}
								name="S_ReadOnly"
								handleChange={handleChange}
								required={false}
							/>
						</div>
					</div>
				</div>
			</div>

			<div className="mt-5 ">
				<ButtonRow
					onEdit={handleEditDelete}
					onNew={handleReset}
					onUndo={handleReset}
					onSubmit={handleSubmit}
					onDelete={handleEditDelete}
					onExit={closeModal}
					isSimilar={false}
				/>
			</div>
			{/* Edit Popup */}
			<Popup
				maxWidth={"30%"}
				minWidth={250}
				minHeight={"50%"}
				closeOnOutsideClick={true}
				visible={editDeleteVisibility}
				onHiding={handleEditDelete}
			>
				<ScrollView>
					{/* Edit  */}
					<SimpleDealEdit
						selectedItem={handleSettingSelectedItem}
						close={handleEditDelete}
						list={data}
						statue={buttonType}
					/>
				</ScrollView>
			</Popup>
		</div>
	);
}

export default React.memo(SimpleDeal);
