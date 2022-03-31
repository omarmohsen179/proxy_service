// React
import React, { useState, useEffect, useCallback, useMemo } from "react";

// DevExpress
// import "devextreme/dist/css/dx.common.css";
// import "devextreme/dist/css/dx.light.css";
import notify from "devextreme/ui/notify";
import { Popup } from "devextreme-react/popup";
import ScrollView from "devextreme-react/scroll-view";

// Components
import {
	TextBox,
	NumberBox,
	SelectBox,
	DateBox,
} from "../../../Components/Inputs";
import ButtonRow from "../../../Components/SharedComponents/buttonsRow";
import EditDelete1 from "../../../Components/SharedComponents/EditDelete1";
import { Validation } from "../../../Services/services";

// API
import {
	// getting data of banks المصارف
	GET_BANKS_DATA,
	// get Next Number
	GET_NEXT_NUMBER,
	// API to delete item in delete pop up
	DELETE_ITEM,
	// Geting Data of edit or delete popup
	GET_EDIT_DELETE_DATA,
	// API to insert or update data depending on this object has ID or not
	// Has ID : update.
	// No ID : insert.
	INSERT_UPDATE,
} from "./API.AccountOpening";
import { GET_MONEYTYPES_LOOKUP } from "../../../Services/ApiServices/General/LookupsAPI";
import { useTranslation } from "react-i18next";

function AccountOpening() {
	// ============================================================================================================================
	// ================================================= Lists ===================================================================
	// ============================================================================================================================

	// Initial data of the page
	let initialData = {
		CurrentBalance: "",
		balance: "",
		bank_id: "",
		description: "",
		dte: Date.now(),
		ex_rate: 1,
		id: 0,
		nots: "",
		num: 0,
		omla: "",
		_0: "",
	};

	let columnAttributes = useMemo(() => {
		return [
			{
				field: "num",
				captionEn: "Number",
				caption: "الرقم",
				isVisable: true,
			},
			{
				field: "omla",
				captionEn: "Currancy",
				caption: "العملة",
				isVisable: true,
			}, ///
			{
				field: "description",
				captionEn: "The Bank Name",
				caption: "اسم المصرف",
				isVisable: true,
			}, ///
			{
				field: "nots",
				captionEn: "Statement",
				caption: "البيان",
				isVisable: true,
			},
			{
				field: "dte",
				caption: "التاريخ",
				captionEn: "Date",
				isVisable: true,
			},
			{
				field: "balance",
				captionEn: "Initial Balance",
				caption: "الرصيد الافتتاحي",
				isVisable: true,
			},
			{
				field: "CurrentBalance",
				caption: "الرصيد الحالي",
				caption: "Currant Balance",
				isVisable: true,
			},
		];
	}, []);

	// ============================================================================================================================
	// ================================================= States ===================================================================
	// ============================================================================================================================
	// Main data of the form
	const [data, setData] = useState(initialData);
	// Data list of banks المصارف
	const [banksList, setBanksList] = useState([]);
	// Handle close and openn delete and edit popups
	const [editDelete, setEditDelete] = useState(false);
	// Error Object
	const [errors, setErrors] = useState([]);
	// Check if we pressed edit or delete buttons and pass this to popups
	const [editDeleteStatus, setEditDeleteStatus] = useState("");
	// Edit and delete popup data list
	const [editDeleteData, setEditDeleteData] = useState();
	// Accounts الحساب
	const [moneyTypesList, setMoneyTypesList] = useState();
	const { t, i18n } = useTranslation();
	// ============================================================================================================================
	// ================================================= Effects ==================================================================
	// ============================================================================================================================

	useEffect(async () => {
		// Getting Next Number
		await handleNextNumber();
		// Getting Expens Data list العملة
		await GET_BANKS_DATA()
			.then((res) => {
				setBanksList(res);
			})
			.catch((err) => console.log(err));
		// Getting Currency data list العملة
		await GET_MONEYTYPES_LOOKUP()
			.then((res) => {
				setMoneyTypesList([
					{
						description: " ",
						id: 0,
					},
					...res,
				]);
			})
			.catch((err) => console.log(err));
	}, []);

	// ============================================================================================================================
	// ================================================= handelers ================================================================
	// ============================================================================================================================

	// Handle Change
	let handleChange = ({ name, value }) => {
		console.log([name, value]);
		setData((prevState) => ({ ...prevState, [name]: value }));
	};

	let handleEditDelete = useCallback(
		async (buttonType) => {
			setErrors([]);
			setEditDeleteStatus(buttonType);
			setEditDelete((prevState) => !prevState);

			let Data;
			console.log(["Data:", data["omla"]]);
			Data = {
				MoneyTypeName:
					data["omla"] === undefined || data["omla"] === ""
						? ""
						: moneyTypesList?.find(
								(element) => element.id == data["omla"]
						  ) &&
						  moneyTypesList?.find(
								(element) => element.id == data["omla"]
						  ).description,
			};

			!editDelete &&
				(Data.MoneyTypeName || Data.MoneyTypeName == "") &&
				GET_EDIT_DELETE_DATA(Data)
					.then((res) => {
						setEditDeleteData(res);
						console.log(data);
					})
					.catch((err) => console.log(err));
		},
		[editDelete, data["omla"]]
	);

	let handleSubmit = async () => {
		let labelsObject = {
			num: "الرقم",
			bank_id: "المصرف",
			dte: "التاريخ",
			balance: "الرصيد الافتتاحي",
			omla: "العملة",
			ex_rate: "معدل التحويل",
		};

		let errArr = Validation(data, labelsObject, [
			"CurrentBalance",
			"description",
			"id",
			"nots",
			"_0",
		]);

		if (errArr.length > 0) {
			setErrors(errArr);
		} else {
			// Editing data before submiting
			let updateData = { ...data };
			console.log(data);
			updateData.omla = !(typeof updateData.omla === "string")
				? moneyTypesList.find((element) => element.id == data["omla"])
						.description
				: updateData.omla;

			updateData.description = !(
				typeof updateData.description === "string"
			)
				? banksList.find((element) => element.id == data["bank_id"])
						.description
				: updateData.description;

			updateData.dte = new Date(updateData.dte);

			updateData.ex_rate = parseFloat(updateData.ex_rate);
			updateData.balance = parseFloat(updateData.balance);

			var Data = { Data: [updateData] };
			///

			if ("ID" in data) {
				await INSERT_UPDATE(Data)
					.then(async (res) => {
						setErrors([]);
						notify(
							{ message: t("Updated Successfully"), width: 600 },
							"success",
							3000
						);

						await handleReset();
					})
					.catch((err) => {
						err.response.data.Errors.map((element) => {
							errArr.push(element.Error);
						});
						setErrors(errArr);
					});
			} else {
				await INSERT_UPDATE(Data)
					.then(async (res) => {
						setErrors([]);
						notify(
							{ message: "تم الحفظ بنجاح", width: 600 },
							"success",
							3000
						);
						await handleReset();
					})
					.catch((err) => {
						console.log(err.response.data.Errors);
						err.response.data.Errors.map((element) => {
							errArr.push(element.Error);
						});
						setErrors(errArr);
					});
			}
		}
	};

	let handleTitle = useMemo(() => {
		if (editDeleteStatus === "edit") {
			return "تعديل";
		} else if (editDeleteStatus === "delete") {
			return "حذف";
		}
	}, [editDeleteStatus]);

	// Edit Delete POP UP...
	// Holding the API that is sent to the EditDelete popup to make deletes
	let handleDeleteItem = useCallback((id) => {
		return DELETE_ITEM(id);
	}, []);

	// Holding the setState that is sent to the EditDelete popup to get data to be edited
	let handleGettingData = useCallback((data) => {
		setData({ ...data });
	}, []);

	let handleNextNumber = async () => {
		await GET_NEXT_NUMBER()
			.then((res) => {
				setData((prevState) => ({ ...prevState, num: res.NextNumber }));
			})
			.catch((err) => console.log(err));
	};

	// Reseting Form
	let handleReset = useCallback(async () => {
		setErrors([]);
		setData({ ...initialData });
		await handleNextNumber();
	});

	return (
		<>
			<div dir="auto" className="container">
				{console.log(data)}
				<div className="mb-3">
					<div
						className="mb-5 w-100 d-flex justify-content-center h2 mt-5"
						style={{ fontWeight: "bold" }}
						dir="auto"
					>
						{t("Account Opening")}
					</div>
					<div dir="auto" className="double">
						{/* Row1 */}
						<NumberBox
							label={t("Number")}
							value={data["num"]}
							name="num"
							handleChange={handleChange}
							required={false}
						/>
						<SelectBox
							label={t("The bank")}
							dataSource={banksList}
							keys={{ id: "id", name: "description" }}
							value={data["bank_id"]}
							name="bank_id"
							handleChange={handleChange}
							required={false}
						/>
						{/* Row2 */}
						<DateBox
							label={t("Date")}
							handleChange={handleChange}
							name="dte"
							value={data["dte"]}
							required={false}
						/>
						<TextBox
							label={t("Intial Balance")}
							value={data["balance"]}
							name="balance"
							handleChange={handleChange}
							required={false}
						/>
						{/* Row3 */}
						<SelectBox
							label={t("Currency")}
							dataSource={moneyTypesList}
							keys={{ id: "id", name: "description" }}
							value={data["omla"]}
							name="omla"
							handleChange={handleChange}
							required={false}
						/>
						<NumberBox
							label={t("conversion rate")}
							value={data["ex_rate"]}
							name="ex_rate"
							handleChange={handleChange}
							required={false}
						/>
					</div>
					<div dir="auto">
						<TextBox
							label={t("Note")}
							value={data["nots"]}
							name="nots"
							handleChange={handleChange}
							required={false}
						/>
					</div>
				</div>
				<div className="error mb-3" dir="auto">
					{errors && errors.map((element) => <li>{element}</li>)}
				</div>

				<ButtonRow
					isSimilar={false}
					isExit={false}
					onNew={handleReset}
					onUndo={handleReset}
					onSubmit={handleSubmit}
					onEdit={handleEditDelete}
					onDelete={handleEditDelete}
				/>

				<Popup
					maxWidth={"50%"}
					minWidth={250}
					minHeight={"50%"}
					closeOnOutsideClick={true}
					visible={editDelete}
					onHiding={handleEditDelete}
					title={editDeleteStatus == "edit" ? t("Edit") : t("Delete")}
				>
					<ScrollView>
						{/* Edit and delete Modal  */}
						<EditDelete1
							data={editDeleteData}
							columnAttributes={columnAttributes}
							deleteItem={handleDeleteItem}
							close={handleEditDelete}
							getEditData={handleGettingData}
							editDeleteStatus={editDeleteStatus}
						/>
					</ScrollView>
				</Popup>
			</div>
		</>
	);
}

export default AccountOpening;
