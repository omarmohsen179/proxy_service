import React, {
	useState,
	useEffect,
	useCallback,
	useMemo,
	useRef,
} from "react";
import NumberBox from "../../../Components/Inputs/NumberBox";
import Joi from "joi";
import { TextBox, SelectBox, DateTime } from "../../../Components/Inputs";
import {
	GET_STUFF,
	NEXT_NUMBER,
	CHECKER,
	DELETE,
	GET_DISCOUNT,
	TRANSACTION,
	LOCKUPS,
} from "./API.DiscountEmployee";
import { Popup } from "devextreme-react/popup";
import notify from "devextreme/ui/notify";
import ButtonRow from "../../../Components/SharedComponents/buttonsRow";
import EditDelete from "../../../Components/SharedComponents/EditDelete1";
import { validateForm } from "../../../Services/services";
import { current } from "@reduxjs/toolkit";
import { useTranslation } from "react-i18next";
function EmployeeDiscount() {
	const today = useMemo(() => {
		let defualtdateValue = new Date();
		return (
			(parseInt(defualtdateValue.getMonth()) + 1).toString() +
			"/" +
			defualtdateValue.getDate() +
			"/" +
			defualtdateValue.getFullYear()
		).toString();
	}, []);

	let initialValue = useRef({
		num: 0,
		emp_id: 0,
		t_date: today,
		ksm_id: 0,
		kema: 0,
		nots: "",
	});

	const { t, i18n } = useTranslation();
	const [dailog, setdialog] = useState(false);
	const [errors, setErrors] = useState({});
	const [values, setValues] = useState({ ...initialValue.current });
	const [employeelist, setemployeelist] = useState([]);
	const [type, settype] = useState([]);
	const [editDeleteStatus, setEditDeleteStatus] = useState("");
	const [data, setData] = useState([]);

	const columnAttributes = useMemo(() => {
		return [
			{ caption: "رقم ", captionEn: "Number", field: "num" },
			{ caption: "الاسم", captionEn: "Name", field: "MemberName" },
			{ caption: "التاريخ", captionEn: "Date", field: "t_date" },
			{ caption: "النوع", captionEn: "Type", field: "DeductionType" },
			{ caption: "القيمه", captionEn: "Quantity", field: "kema" },
		];
	}, []);

	const schema = useMemo(() => {
		return {
			num: Joi.number().greater(0).required().messages({
				"any.required": "Number is Required ",
				"number.greater": "This number must be greater than zero.",
			}),
			emp_id: Joi.number().required().greater(0).required().messages({
				"any.required": "This Input is Required",
				"number.greater": "This Input is Required",
			}),
			t_date: Joi.date().required().messages({
				"any.required": "This Input is Required",
			}),
			ksm_id: Joi.number().required().greater(0).required().messages({
				"any.required": "This Input is Required",
				"number.greater": "This Input is Required",
			}),
			kema: Joi.number().required().greater(0).required().messages({
				"any.required": "This Input is Required",
				"number.greater": "This Input is Required",
			}),
		};
	}, []);

	const closePopup = useCallback(async () => {
		setdialog(false);
	}, []);
	const handleChange = useCallback(({ name, value }) => {
		setValues((values) => ({ ...values, [name]: value }));
	}, []);

	let submit = async (e) => {
		e.preventDefault();
		let err = validateForm(values, schema);
		console.log(err);
		if (Object.keys(err).length != 0) {
			setErrors(err);
			notify(
				{ message: t("Continue the missing data"), width: 600 },
				"error",
				3000
			);
			return;
		}
		await TRANSACTION(values)
			.then(async () => {
				let id = await NEXT_NUMBER();
				setValues({ ...initialValue.current, num: id.NextNumber });
				setErrors({});
				notify(
					{ message: t("Saved Successfully"), width: 600 },
					"success",
					3000
				);
			})
			.catch(
				({
					response: {
						data: { Errors },
					},
				}) => {
					let responseErrors = {};
					Errors.forEach(({ Column, Error }) => {
						responseErrors = { ...responseErrors, [Column]: Error };
					});

					setErrors(responseErrors);
					notify(
						{ message: t("Failed Try again"), width: 450 },
						"error",
						2000
					);
				}
			);
	};

	const onUpdate = useCallback(
		async (title) => {
			setEditDeleteStatus(title);
			setData(await GET_DISCOUNT(0, 100));
			setdialog(!dailog);
		},
		[dailog]
	);
	const onDelete = useCallback(
		async (title) => {
			setEditDeleteStatus(title);
			setData(await GET_DISCOUNT(0, 100));
			setdialog(!dailog);
		},
		[dailog]
	);
	const onNew = useCallback(async () => {
		setValues({
			...initialValue.current,
			num: (await NEXT_NUMBER()).NextNumber,
		});
	}, []);
	useEffect(async () => {
		setValues({
			...initialValue.current,
			num: (await NEXT_NUMBER()).NextNumber,
		});
		let Lookupdata = await LOCKUPS("أنـــــــواع الخصميـــــــات");
		settype(
			Lookupdata.map((R) => {
				return { ...R, name: R.description };
			})
		);
		setemployeelist(await GET_STUFF());
	}, []);
	let onUndo = useCallback(() => {
		setValues({ ...initialValue.current });
		setErrors({});
	}, []);
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
					{t("Discounts")}
				</h1>
				<div
					className="row"
					style={{
						padding: "2%",
						display: "flex",
						justifyContent: "center",
					}}
				>
					<h1
						style={{
							width: "100%",
							textAlign: "center",
							padding: "2%",
						}}
					>
						{""}
					</h1>{" "}
					<div className="col-lg-6 col-md-6 col-sm-12">
						<NumberBox
							label={t("Number")}
							value={values["num"]}
							name="num"
							handleChange={handleChange}
							required={false}
							nonNegative
							required={false}
							validationErrorMessage={t(errors.num)}
						/>
					</div>
					<div className="col-lg-6 col-md-6 col-sm-12">
						<SelectBox
							label={t("Employee")}
							value={values["emp_id"]}
							name="emp_id"
							handleChange={handleChange}
							dataSource={employeelist}
							required={false}
							validationErrorMessage={t(errors.emp_id)}
						/>
					</div>
					<div className="col-lg-6 col-md-6 col-sm-12 datein">
						{console.log(values["t_date"])}
						<DateTime
							label={t("Date")}
							value={values["t_date"]}
							name="t_date"
							handleChange={handleChange}
							required={false}
							validationErrorMessage={t(errors.t_date)}
						/>
					</div>
					<div className="col-lg-6 col-md-6 col-sm-12">
						<SelectBox
							label={t("Discount type")}
							value={values["ksm_id"]}
							name="ksm_id"
							handleChange={handleChange}
							dataSource={type}
							required={false}
							validationErrorMessage={t(errors.ksm_id)}
						/>
					</div>
					<div className="col-lg-6 col-md-6 col-sm-12">
						<NumberBox
							label={t("Amount")}
							value={values["kema"]}
							name="kema"
							handleChange={handleChange}
							nonNegative
							required={false}
							validationErrorMessage={t(errors.kema)}
						/>
					</div>
					<div className="col-lg-6 col-md-6 col-sm-12">
						<TextBox
							label={t("Note")}
							value={values["nots"]}
							name="nots"
							handleChange={handleChange}
							required={false}
							validationErrorMessage={t(errors.nots)}
						/>
					</div>
				</div>

				<ButtonRow
					onNew={onNew}
					onEdit={onUpdate}
					onCopy={null}
					onDelete={onDelete}
					onUndo={onUndo}
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

export default EmployeeDiscount;
