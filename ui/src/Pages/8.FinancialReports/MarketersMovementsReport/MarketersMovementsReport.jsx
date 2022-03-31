import React, { useRef, useState, useEffect, useCallback } from "react";
import { Button, CheckBox, DateBox } from "devextreme-react";
import Tabs from "devextreme-react/tabs";
import { GET_CASHIERS } from "../../../Templetes/Invoice/Components/InvoiceInformation/API.InvoiceInformation";
import { SelectBox } from "../../../Components/Inputs";
import MarketersFollowUpTable from "./Components/MarketersFollowUpTable";
import AgentsSalesTable from "./Components/AgentsSalesTable";
import { useTranslation } from "react-i18next";

const MarketersMovementsReport = () => {
	const { t, i18n } = useTranslation();
	const tabs = React.useMemo(() => {
		return [
			{
				id: 0,
				text: t("Following Marketers"),
				icon: "orderedlist",
			},
			{
				id: 1,
				text: t("The movement of sales of items to marketers"),
				icon: "contentlayout",
			},
		];
	}, [t]);

	const [fromDate, setFromDate] = useState();

	const [toDate, setToDate] = useState(new Date());

	const [cashiers, setCashiers] = useState([]);

	const [selectedCashierId, setSelectedCashierId] = useState(0);

	useEffect(() => {
		let date = new Date();
		date.setMonth(date.getMonth() - 1);
		let from = new Date(date);
		setFromDate(from);
		GET_CASHIERS().then((cashiers) => {
			setCashiers([{ id: 0, name: t("All") }, ...cashiers]);
		});
	}, []);

	const [selectedTabIndex, setSelectedTabIndex] = useState(-1);
	return (
		<>
			<h1 className="invoiceName">{t("marketers movement")}</h1>
			<div className="container-xxl rtlContainer mb-3">
				<div className="card p-3">
					<div className="row">
						<div className="col-4">
							<div className="input-wrapper">
								<div className="label">{t("From")}</div>
								<DateBox
									key="from"
									name="FromDate"
									value={fromDate}
									dateOutOfRangeMessage={t(
										"date past date to"
									)}
									onValueChanged={(e) => setFromDate(e.value)}
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
									dateOutOfRangeMessage={t(
										"date past date from"
									)}
									onValueChanged={(e) => setToDate(e.value)}
								/>
							</div>
						</div>
						{selectedTabIndex === 1 && (
							<div className="col-4">
								<SelectBox
									label={t("marketer")}
									dataSource={cashiers}
									name="mosweq_id"
									value={selectedCashierId}
									handleChange={(e) =>
										setSelectedCashierId(e.value)
									}
								/>
							</div>
						)}
					</div>

					<div className="row py-3">
						<div id="tabs">
							<Tabs
								dataSource={tabs}
								selectedIndex={selectedTabIndex}
								onSelectedItemChange={(e) =>
									setSelectedTabIndex(e.id)
								}
							/>
							<div className="content py-2">
								{selectedTabIndex === 0 ? (
									<div className="row py-3">
										<MarketersFollowUpTable
											apiPayload={{
												ToDate: toDate,
												FromDate: fromDate,
											}}
										/>
									</div>
								) : selectedTabIndex === 1 ? (
									<div className="row py-3">
										<AgentsSalesTable
											apiPayload={{
												AgentID: selectedCashierId,
												FromDate: fromDate,
												ToDate: toDate,
											}}
										/>
									</div>
								) : (
									<div className="selectReport">
										{t("Please select a detection type")}
									</div>
								)}
							</div>
						</div>
					</div>
				</div>
			</div>
		</>
	);
};

export default MarketersMovementsReport;
