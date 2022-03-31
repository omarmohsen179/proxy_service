import React, { useState, useEffect, useCallback, useRef } from "react";
import { Button, CheckBox, DateBox } from "devextreme-react";
import { NumberBox, SelectBox, TextBox } from "../../../Components/Inputs";
import DropDownButton from "devextreme-react/drop-down-button";
import Tabs from "devextreme-react/tabs";
import ProfitsTable from "./Components/ProfitsTable";
import { GET_PROFITS_REPORT } from "./API.ProfitsReport";
import ItemsProfitsTable from "./Components/ItemsProfitsTable";
import AccountsProfitsTable from "./Components/AccountsProfitsTable";
import "./profitsReport.css";
import { useMemo } from "react";
import { useTranslation } from "react-i18next";

const ProfitsReport = () => {
	const { t, i18n } = useTranslation();
	const tabs = useMemo(
		(e) => [
			{
				id: 0,
				text: t("brief detection"),
				icon: "orderedlist",
			},
			{
				id: 1,
				text: t("earnings"),
				icon: "contentlayout",
			},
			{
				id: 2,
				text: t("Detailing by Items"),
				icon: "smalliconslayout",
			},
			{
				id: 3,
				text: t("Tailor made to customers"),
				icon: "rowproperties",
			},
		],
		[t]
	);

	const [selectedTabIndex, setSelectedTabIndex] = useState(-1);

	const [fromDate, setFromDate] = useState();

	const [toDate, setToDate] = useState(new Date());

	const [allNodes, setAllNodes] = useState(false);

	const [data, setData] = useState({
		AllProfilts: 0,
		AllSalesDiscount: 0,
		Costs: 0,
		DemageLosses: 0,
		TotalDebit: 0,
		TotalPayable: 0,
		TotalSalaries: 0,
		PureProfits: 0,
		TotalAssetsValues: 0,
		AllPurchasesDiscount: 0,
	});

	useEffect(() => {
		let date = new Date();
		date.setMonth(date.getMonth() - 1);
		let from = new Date(date);
		setFromDate(from);
	}, []);

	useEffect(() => {
		fromDate &&
			selectedTabIndex === 0 &&
			GET_PROFITS_REPORT({
				ToDate: toDate,
				FromDate: fromDate,
				AllNodes: allNodes,
			}).then((data) => {
				setData({ ...data });
			});
	}, [fromDate, toDate, allNodes, selectedTabIndex]);

	return (
		<>
			<h1 className="invoiceName">{t("profit statement")}</h1>
			<div className="container-xxl rtlContainer mb-3" dir="auto">
				<div className="card p-3" dir="auto">
					<div className="row">
						<div className="col-4">
							<div className="input-wrapper">
								<div className="label">{t("From")}</div>
								<DateBox
									key="from"
									name="FromDate"
									value={fromDate}
									dateOutOfRangeMessage="التاريخ تجاوز تاريخ الى"
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

						<div className="my-2 d-flex col-4">
							<CheckBox
								value={allNodes}
								onValueChanged={({ value }) =>
									setAllNodes((prev) => !prev)
								}
							/>
							<div className="mx-2">{t("All branches")}</div>
						</div>
					</div>

					<div className="row ">
						<div className="col-4">
							<button
								className="col-12 btn btn-outline-info btn-outline"
								// onClick={printHandle}
								// disabled={!selectedBranch}
							>
								<span> {t("Print")}</span>
							</button>
						</div>
					</div>
					<div className="row py-3">
						<div id="tabs">
							<Tabs
								dataSource={tabs}
								selectedIndex={selectedTabIndex}
								onSelectedItemChange={(e) =>
									e && e.id >= 0 && setSelectedTabIndex(e.id)
								}
							/>
							<div className="content py-2">
								{selectedTabIndex === 0 ? (
									<div className="row py-3">
										<div className="col-4">
											<NumberBox
												label={t("total profit")}
												readOnly
												value={data.AllProfits}
												cssClass="greenInput "
											/>
										</div>
										<div className="col-4">
											<NumberBox
												label={t(
													"Discounts on Purchases"
												)}
												readOnly
												value={
													data.AllPurchasesDiscount
												}
												cssClass="greenInput "
											/>
										</div>
										<div className="col-4">
											<NumberBox
												label={t("credit settlements")}
												readOnly
												value={data.TotalDebit}
												cssClass="greenInput "
											/>
										</div>
										<div className="col-4">
											<NumberBox
												label={t("Expenses")}
												readOnly
												value={data.Costs}
												cssClass="redInput "
											/>
										</div>
										<div className="col-4">
											<NumberBox
												label={t("Sales Discounts")}
												readOnly
												value={data.AllSalesDiscount}
												cssClass="redInput "
											/>
										</div>
										<div className="col-4">
											<NumberBox
												label={t("City settlements")}
												readOnly
												value={data.TotalPayable}
												cssClass="redInput "
											/>
										</div>
										<div className="col-4">
											<NumberBox
												label={t("total alignment")}
												readOnly
												value={data.DemageLosses}
												cssClass="redInput "
											/>
										</div>
										<div className="col-4">
											<NumberBox
												label={t("Depreciation rate")}
												readOnly
												value={data.TotalAssetsValues}
												cssClass="redInput "
											/>
										</div>
										<div className="col-4">
											<NumberBox
												label={t("Employee benefits")}
												readOnly
												value={data.TotalSalaries}
												cssClass="redInput "
											/>
										</div>
										<div className="col-4">
											<NumberBox
												label={t("Net")}
												readOnly
												value={data.PureProfits}
												cssClass={
													parseFloat(
														data.PureProfits
													) < 0
														? "redInput "
														: "greenInput "
												}
											/>
										</div>
									</div>
								) : selectedTabIndex === 1 ? (
									<ProfitsTable
										apiPayload={{
											ToDate: toDate,
											FromDate: fromDate,
											AllNodes: allNodes,
										}}
									/>
								) : selectedTabIndex === 2 ? (
									<ItemsProfitsTable
										apiPayload={{
											ToDate: toDate,
											FromDate: fromDate,
											AllNodes: allNodes,
										}}
									/>
								) : selectedTabIndex === 3 ? (
									<AccountsProfitsTable
										apiPayload={{
											ToDate: toDate,
											FromDate: fromDate,
											AllNodes: allNodes,
										}}
									/>
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

export default ProfitsReport;
