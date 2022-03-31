import React, {
	useState,
	useEffect,
	useCallback,
	useMemo,
	useRef,
} from "react";
import {
	TextBox,
	NumberBox,
	SelectBox,
	CheckBox,
	DateTime,
} from "../../../Components/Inputs";
import {
	setSelectedGroupId,
	getGroups,
	groupsSelector,
} from "../../../Store/groups";
import { useDispatch, useSelector } from "react-redux";
import ButtonRow from "../../../Components/SharedComponents/buttonsRow";
import Joi from "joi";
import { useValidator } from "react-joi";
import {
	GET_STUFF,
	NEXT_NUMBER,
	CHECKER,
	DELETE,
	TRANSACTION,
	LOCKUPS,
} from "./API.EmployeeFile";
import { Popup } from "devextreme-react/popup";
import notify from "devextreme/ui/notify";
import EditDelete from "../../../Components/SharedComponents/EditDelete1";

import { validateForm } from "../../../Services/services";
import { useTranslation } from "react-i18next";
function EmployeesFile() {
	const { t, i18n } = useTranslation();
	const [errors, setErrors] = useState({});
	let dispatch = useDispatch();
	let groupsselector = useSelector(groupsSelector.selectAll);
	let [groups, setgroups] = useState([]);
	let [dailog, setdialog] = useState(false);
	let [data, setDataStuff] = useState(false);
	let [nationalty, setnationalty] = useState([]);
	let [emtype, setemtype] = useState([]);
	let [editDeleteStatus, setEditDeleteStatus] = useState("");
	let defualtdate = useMemo(() => {
		let defualtdateValue = new Date();
		return (
			(parseInt(defualtdateValue.getMonth()) + 1).toString() +
			"/" +
			defualtdateValue.getDate() +
			"/" +
			defualtdateValue.getFullYear()
		).toString();
	}, []);
	let [values, setValues] = useState({});

	const blood = useMemo(() => {
		return [
			{ id: 0, name: "A+" },
			{ id: 1, name: "A-" },
			{ id: 2, name: "B+" },
			{ id: 3, name: "B-" },
			{ id: 4, name: "O+" },
			{ id: 5, name: "O-" },
			{ id: 6, name: "AB+" },
			{ id: 7, name: "AB-" },
		];
	}, []);
	const halaList = useMemo(() => {
		return [
			{ id: 0, name: t("Single") },
			{ id: 1, name: t("Married") },
			{ id: 2, name: t("Divorced") },
			{ id: 3, name: t("Widower") },
		];
	}, []);
	let initialValue = useRef({
		num: 0,
		name: "",
		b_date: new Date("1/1/1992"),
		nationality_id: 0,
		emptype_id: 0,
		group_net: 0,
		salary: 0,
		mosawiq_nesba: 0,
		daen_open: 0,
		mden_open: 0,
		six: false,
		a_date: defualtdate,
	});
	const columnAttributes = useMemo(() => {
		return [
			{
				caption: "رقم ",
				captionEn: "Number",
				field: "num",
			},
			{ caption: "الاسم", captionEn: "Name", field: "name" },
		];
	}, []);
	var schema = useMemo(() => {
		return {
			num: Joi.number().greater(0).required().messages({
				"number.greater": `رقم الصنف يجب أن يكون أكبر من صفر`,
			}),
			name: Joi.string().required().messages({
				"string.empty": `هذا الحقل مطلوب `,
			}),
			b_date: Joi.date().required().messages({
				"any.required": `"lastName" is a required.`,
			}),

			emptype_id: Joi.number().required().greater(0).required().messages({
				"any.required": `هذا الحقل مطلوب `,
				"number.greater": `هذا الحقل مطلوب `,
			}),
			group_net: Joi.number().required().greater(0).required().messages({
				"any.required": `هذا الحقل مطلوب `,
				"number.greater": `هذا الحقل مطلوب `,
			}),
			nationality_id: Joi.number()
				.required()
				.greater(0)
				.required()
				.messages({
					"any.required": `هذا الحقل مطلوب `,
					"number.greater": `هذا الحقل مطلوب `,
				}),
			salary: Joi.number().required().greater(-1).required().messages({
				"any.required": `هذا الحقل مطلوب `,
				"number.greater": "لا يمكن أن تكون القيمة اقل من صفر",
			}),
			mosawiq_nesba: Joi.number()
				.required()
				.greater(-1)
				.required()
				.messages({
					"any.required": `هذا الحقل مطلوب `,
					"number.greater": "لا يمكن أن تكون القيمة اقل من صفر",
				}),
			daen_open: Joi.number().required().greater(-1).required().messages({
				"any.required": `هذا الحقل مطلوب `,
				"number.greater": "لا يمكن أن تكون القيمة اقل من صفر",
			}),
			mden_open: Joi.number().required().greater(-1).required().messages({
				"any.required": `هذا الحقل مطلوب `,
				"number.greater": "لا يمكن أن تكون القيمة اقل من صفر",
			}),
		};
	}, []);
	const closePopup = useCallback(async () => {
		setdialog(false);
	}, []);
	let submit = async (e) => {
		e.preventDefault();

		let err = validateForm(values, schema);
		if (Object.keys(err).length != 0) {
			console.log(err);
			setErrors(err);
			notify(
				{ message: t("Continue the missing data"), width: 600 },
				"error",
				3000
			);
			return;
		}
		if (values.id == 0) {
			delete values.id;
		}

		await TRANSACTION({ ...values })
			.then(async () => {
				setErrors({});
				let x = await NEXT_NUMBER();
				setValues({ ...initialValue.current, num: x.NextNumber });
				notify(
					{ message: t("Saved Successfully"), width: 600 },
					"success",
					3000
				);
			})
			.catch(({ response }) => {
				try {
					let responseErrors = {};
					response.data.Error.forEach(({ Column, Error }) => {
						responseErrors = { ...responseErrors, [Column]: Error };
					});
					setErrors(responseErrors);
					notify(
						{ message: t("Failed Try again"), width: 450 },
						"error",
						2000
					);
				} catch (err) {
					console.log(err);
				}
			});
	};

	useEffect(async () => {
		dispatch(await getGroups());
		let x = await LOCKUPS("الجنسيــــــــــــــــــــــات");
		for (let i = 0; i < x.length; i++) {
			x[i].name = x[i].description;
		}

		setnationalty(x);
		let y = await LOCKUPS("تصنيــــف الـــموظفيــــن");
		for (let i = 0; i < y.length; i++) {
			y[i].name = y[i].description;
		}

		setemtype(y);
	}, []);
	useEffect(async () => {
		setgroups(groupsselector);
		let x = await NEXT_NUMBER();

		setValues({ ...initialValue.current, num: x.NextNumber });
	}, [groupsselector]);
	async function onDelete(title) {
		setEditDeleteStatus(title);
		setDataStuff(
			(await GET_STUFF()).map((data) => {
				return { ...data, ID: data.id };
			})
		);
		setdialog(!dailog);
	}
	async function onUpdate(title) {
		setEditDeleteStatus(title);

		setDataStuff(
			(await GET_STUFF()).map((data) => {
				return { ...data, ID: data.id };
			})
		);
		setdialog(!dailog);
	}

	const onNew = useCallback(async () => {
		setValues({
			...initialValue.current,
			num: (await NEXT_NUMBER()).NextNumber,
		});
	}, []);

	const handleChange = useCallback(
		({ name, value }) => {
			setValues((values) => ({ ...values, [name]: value }));
		},
		[values]
	);
	let onDeleteFun = useCallback(async (id) => {
		await DELETE(id);
		onNew();
	}, []);
	return (
		<div dir={i18n.language == "en" ? "ltr" : "rtl"}>
			<form onSubmit={submit} className="row PaymentTypemain  ">
				<h1
					style={{
						width: "100%",
						textAlign: "center",
						padding: "2%",
					}}
				>
					{t("Employee Files")}
				</h1>
				<div
					className="row"
					style={{
						padding: "2%",
						display: "flex",
						justifyContent: "center",
					}}
				>
					<div className="col-lg-4 col-md-6 col-sm-12">
						<NumberBox
							label={t("Number")}
							value={values["num"]}
							name="num"
							handleChange={handleChange}
							required={false}
							validationErrorMessage={errors.num}
							nonNegative
						/>
					</div>
					<div className="col-lg-4 col-md-6 col-sm-12">
						<TextBox
							label={t("Name")}
							value={values["name"]}
							name="name"
							handleChange={handleChange}
							validationErrorMessage={errors.name}
							required={false}
						/>
					</div>
					<div className="col-lg-4 col-md-6 col-sm-12 datein">
						<DateTime
							placeholder="10/16/2018"
							type="date"
							label={t("Date Of Birth")}
							value={values["b_date"]}
							name="b_date"
							handleChange={handleChange}
							required={false}
							validationErrorMessage={errors.b_date}
						/>
					</div>
					<div className="col-lg-4 col-md-6 col-sm-12">
						<TextBox
							label={t("Place Of Birth")}
							value={values["b_place"]}
							name="b_place"
							handleChange={handleChange}
							required={false}
						/>
					</div>
					<div className="col-lg-4 col-md-6 col-sm-12">
						<NumberBox
							label={t("Identification Number")}
							value={values["card_no"]}
							name="card_no"
							handleChange={handleChange}
							required={false}
							nonNegative
						/>
					</div>
					<div className="col-lg-4 col-md-6 col-sm-12">
						<NumberBox
							label={t("Passport Number")}
							value={values["pas_no"]}
							name="pas_no"
							handleChange={handleChange}
							required={false}
							nonNegative
						/>
					</div>
					<div className="col-lg-4 col-md-6 col-sm-12">
						<SelectBox
							label={t("Blood type")}
							value={values["fsela"]}
							name="fsela"
							keys={{ id: "name", name: "name" }}
							handleChange={handleChange}
							dataSource={blood}
							required={false}
						/>
					</div>
					<div className="col-lg-4 col-md-6 col-sm-12">
						<SelectBox
							label={t("Gender")}
							value={values["six"]}
							name="six"
							handleChange={handleChange}
							dataSource={[
								{ id: false, name: t("Male") },
								{ id: true, name: t("Female") },
							]}
							required={false}
						/>
					</div>
					<div className="col-lg-4 col-md-6 col-sm-12">
						<SelectBox
							label={t("Nationality")}
							value={values["nationality_id"]}
							name="nationality_id"
							handleChange={handleChange}
							dataSource={nationalty}
							validationErrorMessage={errors.nationality_id}
							required={false}
						/>
					</div>
					<div className="col-lg-4 col-md-6 col-sm-12">
						<SelectBox
							label={t("Social status")}
							value={values["hala"]}
							name="hala"
							dataSource={halaList}
							handleChange={handleChange}
							required={false}
						/>
					</div>
					<div className="col-lg-4 col-md-6 col-sm-12">
						<TextBox
							label={t("Address")}
							value={values["adress"]}
							name="adress"
							handleChange={handleChange}
							required={false}
						/>
					</div>
					<div className="col-lg-4 col-md-6 col-sm-12">
						<DateTime
							label={t("Employee Hiring date ")}
							value={values["a_date"]}
							name="a_date"
							handleChange={handleChange}
							required={false}
						/>
					</div>
					<div className="col-lg-4 col-md-6 col-sm-12">
						<SelectBox
							label={t("Jop Type")}
							value={values["emptype_id"]}
							name="emptype_id"
							handleChange={handleChange}
							dataSource={emtype}
							validationErrorMessage={errors.emptype_id}
							required={false}
						/>
					</div>
					<div className="col-lg-4 col-md-6 col-sm-12">
						<SelectBox
							label={t("Work Group")}
							value={values["group_net"]}
							name="group_net"
							handleChange={handleChange}
							dataSource={groups}
							validationErrorMessage={errors.group_net}
							required={false}
						/>
					</div>
					<div className="col-lg-4 col-md-6 col-sm-12">
						<TextBox
							label={t("Qualification")}
							value={values["mohl"]}
							name="mohl"
							handleChange={handleChange}
							required={false}
							validationErrorMessage={errors.mohl}
						/>
					</div>
					<div className="col-lg-4 col-md-6 col-sm-12">
						<NumberBox
							label={t("Entry Code")}
							value={values["finger_id"]}
							name="finger_id"
							handleChange={handleChange}
							required={false}
							nonNegative
							validationErrorMessage={errors.finger_id}
						/>
					</div>
					<div className="col-lg-4 col-md-6 col-sm-12">
						<NumberBox
							label={t("Salary")}
							value={values["salary"]}
							name="salary"
							handleChange={handleChange}
							required={false}
							nonNegative
							validationErrorMessage={errors.salary}
						/>
					</div>
					<div className="col-lg-4 col-md-6 col-sm-12">
						<CheckBox
							label={t("Stop salary")}
							value={values["stop"]}
							name="stop"
							handleChange={handleChange}
						/>
					</div>
					<div className="col-lg-4 col-md-6 col-sm-12">
						<NumberBox
							label={t("Marketer percentage")}
							value={values["mosawiq_nesba"]}
							name="mosawiq_nesba"
							handleChange={handleChange}
							nonNegative
							required={false}
							validationErrorMessage={errors.mosawiq_nesba}
						/>
					</div>
					<div className="col-lg-4 col-md-6 col-sm-12">
						<NumberBox
							label={t("Intial Balance")}
							value={values["daen_open"]}
							name="daen_open"
							handleChange={handleChange}
							nonNegative
							required={false}
							validationErrorMessage={errors.daen_open}
						/>
					</div>
					<div className="col-lg-4 col-md-6 col-sm-12">
						<NumberBox
							label="مدين "
							value={values["mden_open"]}
							name="mden_open"
							handleChange={handleChange}
							nonNegative
							required={false}
							validationErrorMessage={errors.mden_open}
						/>
					</div>
					<div className="col-lg-4 col-md-6 col-sm-12">
						<TextBox
							label={t("Phone Number")}
							value={values["phone_active"]}
							name="phone_active"
							handleChange={handleChange}
							required={false}
						/>
					</div>
					<div className="col-lg-4 col-md-6 col-sm-12">
						<TextBox
							label={t("E-mail")}
							value={values["cust_mail"]}
							name="cust_mail"
							handleChange={handleChange}
							required={false}
						/>
					</div>
					<div className="col-lg-4 col-md-6 col-sm-12">
						<TextBox
							label={t("Username")}
							value={values["user_name"]}
							name="user_name"
							handleChange={handleChange}
							required={false}
						/>
					</div>
					<div className="col-lg-4 col-md-6 col-sm-12">
						<TextBox
							label={t("Password")}
							value={values["password"]}
							name="password"
							handleChange={handleChange}
							required={false}
						/>
					</div>
				</div>{" "}
				<ButtonRow
					onUndo={() => {
						setValues(initialValue.current);
						setErrors({});
					}}
					onNew={onNew}
					onEdit={onUpdate}
					onDelete={onDelete}
					isSimilar={false}
					isExit={false}
				/>
				<Popup
					maxWidth={1000}
					title={editDeleteStatus == "edit" ? t("Edit") : t("Delete")}
					minWidth={150}
					minHeight={500}
					showTitle={true}
					dragEnabled={false}
					closeOnOutsideClick={true}
					visible={dailog}
					onHiding={closePopup}
				>
					<EditDelete
						data={data}
						columnAttributes={columnAttributes}
						deleteItem={onDeleteFun}
						close={closePopup}
						getEditData={setValues}
						editDeleteStatus={editDeleteStatus}
					/>
				</Popup>
			</form>
		</div>
	);
}

export default EmployeesFile;
