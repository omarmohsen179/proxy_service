import React, { useState, useEffect, useCallback } from "react";
import { NumberBox, SelectBox, TextBox } from "../../../Components/Inputs";
import { DateBox } from "devextreme-react";
import { GET_CASHIERS } from "../../../Services/ApiServices/SalesBillAPI";
import SystemTransactionsTable from "./Components/SystemTransactionsTable";
import { useTranslation } from "react-i18next";

const SystemTransactionsReport = () => {
	const { t, i18n } = useTranslation();

	const [fromDate, setFromDate] = useState(new Date());

	const [toDate, setToDate] = useState(new Date());

	const [cashiers, setCashiers] = useState([]);

	const [selectedCashier, setSelectedCashier] = useState(-1);

	const updateFromDate = useCallback((e) => {
		setFromDate(e.value);
	}, []);

	const updateToDate = useCallback((e) => {
		setToDate(e.value);
	}, []);

	useEffect(() => {
		let date = new Date();
		date.setMonth(date.getMonth() - 1);
		let from = new Date(date);
		setFromDate(from);

		// 2- Get Cashers
		GET_CASHIERS().then((cashiers) => {
			setCashiers([{ id: 0, name: "الكل" }, ...cashiers]);
		});
	}, []);

	return (
		<>
			<h1 className="invoiceName">{t("System Transactions Report")}</h1>
			<div className="container" dir="auto">
				<div className="card p-3">
					<div className="row">
						<div className="col-4">
							<div className="input-wrapper">
								<div className="label">{t("From")}</div>
								<DateBox
									key="from"
									name="FromDate"
									value={fromDate}
									max={toDate}
									dateOutOfRangeMessage={t(
										"Date out of range"
									)}
									onValueChanged={updateFromDate}
								/>
							</div>
						</div>
						<div className="col-4">
							<div className="input-wrapper">
								<div className="label">{t("To")}</div>
								<DateBox
									key="to"
									name="ToDate"
									value={toDate}
									max={new Date()}
									dateOutOfRangeMessage={t(
										"Date out of range"
									)}
									onValueChanged={updateToDate}
								/>
							</div>
						</div>
						<div className="col-4">
							<SelectBox
								label={t("User")}
								dataSource={cashiers}
								name="mosweq_id"
								value={selectedCashier}
								handleChange={(e) =>
									setSelectedCashier(e.value)
								}
							/>
						</div>
					</div>
					<div className="row py-2">
						<SystemTransactionsTable
							mosweq_id={selectedCashier}
							fromDate={fromDate}
							toDate={toDate}
						/>
					</div>
				</div>
			</div>
		</>
	);
};

export default SystemTransactionsReport;
