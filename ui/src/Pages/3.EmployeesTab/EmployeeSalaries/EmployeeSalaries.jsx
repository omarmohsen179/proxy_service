import React, { useState, useCallback, useMemo } from "react";
import { TextBox, SelectBox, DateTime } from "../../../Components/Inputs";
import DateYM from "../../../Components/Inputs/DateYM";
import {
	GET_STUFF_SALARIES,
	EDIT_MEMBER_SALARY,
	DELETE_STAFF_SALARIESDELETE_STAFF_SALARIES,
	APPROVE_STUFF_SALARIES,
	DELETE_STAFF_SALARIES,
} from "./API.EmployeeSalaries";
import notify from "devextreme/ui/notify";
import "./DateYM.css";
import { Button } from "devextreme-react/button";
import InputTableEdit from "../../../Components/SharedComponents/Tables Components/InputTableEdit";
import { useTranslation } from "react-i18next";

function EmployeeSalaries() {
	const { t, i18n } = useTranslation();
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
	let [values, setValues] = useState({
		s_date: defualtdate,
		nots: "",
		salaryid: "",
		salaryDate: null,
	});
	let [salaryDate, setsalaryDate] = useState(null);
	let [data, setData] = useState([]);
	const colAttributes = useMemo(() => {
		return [
			{
				caption: "رقم الموظف",
				captionEn: "Number",
				field: "num",

				readOnly: true,
			},
			{
				caption: "اسم الموظف",
				captionEn: "Name",
				field: "name",
				readOnly: true,
			},
			{
				caption: "الأساسي",
				captionEn: "Basic",
				field: "asasy",
				readOnly: true,
			},
			{
				caption: "المرتب",
				captionEn: "Salary",
				field: "salary",
				readOnly: true,
			},
			{ caption: "الحساب", captionEn: "Account", field: "hsab" },
			{ caption: "ملاحظات", captionEn: "Note", field: "nots" },
		];
	}, []);

	let RequestTable = async (e, Text) => {
		await GET_STUFF_SALARIES(e)
			.then(async (res) => {
				setData(res);
				setValues({
					s_date: res.length > 0 ? res[0].s_date : defualtdate,
					salaryid: res.length > 0 ? res[0].salaryid : 0,
					MonthIndex: e.MonthIndex,
					Year: e.Year,
					nots: "",
				});

				notify({ message: Text, width: 600 }, "success", 3000);
			})
			.catch((err) => {
				notify(
					{ message: t("Failed Try again"), width: 450 },
					"error",
					2000
				);
			});
	};

	const handleChange = useCallback(({ name, value }) => {
		setValues((values) => ({ ...values, [name]: value }));
	}, []);

	const handleChangeYM = async ({ value, dateD }) => {
		setsalaryDate(value);
		await RequestTable(dateD, t("Search Successfully"));
	};

	let exit = async () => {
		await DELETE_STAFF_SALARIES(values.salaryid)
			.then(async (res) => {
				setValues({
					s_date: defualtdate,
					salaryDate: null,
					salaryid: 0,
					nots: "",
				});
				RequestTable(values, t("Calculation canceled successfully"));
				//   notify({ message: , width: 600 }, "success", 3000);
			})
			.catch(
				({
					response: {
						data: { Errors },
					},
				}) => {
					console.log(Errors);
					notify(
						{ message: t("Failed Try again"), width: 450 },
						"error",
						2000
					);
				}
			);
	};
	let begin = async () => {
		await APPROVE_STUFF_SALARIES(values)
			.then(async (res) => {
				//   notify({ message: , width: 600 }, "success", 3000);
				RequestTable(values, t("Saved Successfully"));
			})
			.catch(
				({
					response: {
						data: { Errors },
					},
				}) => {
					console.log(Errors);
					notify(
						{ message: t("Failed Try again"), width: 450 },
						"error",
						2000
					);
				}
			);
	};
	let update = async (e) => {
		// e.preventDefault();
		await EDIT_MEMBER_SALARY(e.data)
			.then(async (res) => {
				notify(
					{ message: t("Saved Successfully"), width: 600 },
					"success",
					3000
				);
			})
			.catch((err) => {
				notify(
					{ message: t("Failed Try again"), width: 450 },
					"error",
					2000
				);
			});
	};
	return (
		<div dir={i18n.language == "en" ? "ltr" : "rtl"}>
			<form className="row PaymentTypemain  ">
				<h1
					style={{
						width: "100%",
						textAlign: "center",
						padding: "2%",
					}}
				>
					{t("Salaries")}
				</h1>
				<div
					className="row"
					style={{
						padding: "2%",
						display: "flex",
						justifyContents: "center",
					}}
				>
					{" "}
					<div className="col-lg-6 col-md-6 col-sm-12">
						<DateYM
							label={t("Calculating the salary")}
							name="salaryDate"
							value={salaryDate}
							handleChange={handleChangeYM}
							required={false}
						/>
					</div>
					<div className="col-lg-6 col-md-6 col-sm-12">
						<Button
							width={120}
							style={{ margin: "10px" }}
							text={t("Uncount")}
							disabled={data.length > 0 ? false : true}
							type="normal"
							stylingMode="contained"
							onClick={exit}
						/>
						<Button
							width={120}
							text={t("Count")}
							type="normal"
							disabled={values.MonthIndex != null ? false : true}
							stylingMode="contained"
							onClick={begin}
						/>
					</div>
					<div className="col-lg-6 col-md-6 col-sm-12 DateYM">
						<DateTime
							label={t("Date")}
							value={values["s_date"]}
							name="s_date"
							handleChange={handleChange}
							required={false}
						/>
					</div>
					<div className="col-lg-6 col-md-6 col-sm-12">
						<TextBox
							label={t("Note")}
							value={values["nots"]}
							name="nots"
							handleChange={handleChange}
							required={false}
						/>
					</div>
					<div
						style={{
							textAlign: "center",
							justifyContent: "center",
						}}
						className="col-lg-12 col-md-12 col-sm-12"
					></div>
				</div>

				<InputTableEdit
					dataSource={data}
					selectionMode="single"
					colAttributes={colAttributes}
					height={83 / 2.5 + "vh"}
					canDelete={false}
					canUpdate={true}
					Uicon={true}
					onRowUpdated={(e) => {
						update(e);
					}}
				/>
			</form>
		</div>
	);
}

export default EmployeeSalaries;
