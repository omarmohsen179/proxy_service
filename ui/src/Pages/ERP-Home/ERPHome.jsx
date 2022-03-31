import React, { useCallback, useEffect, useMemo, useState } from "react";
import "./ERPHome.css";

import Tabs from "devextreme-react/tabs";
import _ from "lodash";

import Chart, {
	ArgumentAxis,
	CommonSeriesSettings,
	Legend,
	Series,
	Tooltip,
	ValueAxis,
	ConstantLine,
	Label,
	Export,
	Margin,
	Title,
	Subtitle,
	Grid,
	Format,
	Reduction,
} from "devextreme-react/chart";

import { SeriesTemplate, Animation, Tick } from "devextreme-react/chart";
import { useTranslation } from "react-i18next";
import BarChart from "./Components/BarChart/BarChart";
import { request } from "../../Services/CallAPI";

const ERPHome = () => {
	const { t, i18n } = useTranslation();
	const [tabs, setTabs] = useState([]);
	const [selectedIndex, setSelectedIndex] = useState(0);
	const [tabsCharts, setTabsCharts] = useState([]);

	const onSelectionChanged = useCallback((args) => {
		if (args >= 0) {
			console.log(args);
			setSelectedIndex(args);
		}
	}, []);

	useEffect(() => {
		let config = {
			url: `/GetTabsCharts/${i18n.language === "ar" ? 0 : 1}`,
			method: "POST",
		};

		request(config)
			.then((response) => {
				if (response && response.length > 0) {
					let groupedData = _.groupBy(response, (e) => e.TabName);
					setTabs(_.keys(groupedData));
					setTabsCharts(_.values(groupedData));
				}
			})
			.catch((error) => {
				console.log(error);
			});
	}, [i18n.language]);

	return (
		<>
			<div dir="auto">
				{tabs && tabs.length > 0 && (
					<Tabs
						dataSource={tabs}
						width={"100%"}
						selectedIndex={selectedIndex}
						onSelectedIndexChange={onSelectionChanged}
					/>
				)}
				<div className="home container">
					<div className="row my-3">
						{tabsCharts[selectedIndex] &&
							tabsCharts[selectedIndex].length > 0 &&
							tabsCharts[selectedIndex].map((chart) => {
								return (
									<div className="col-12 col-lg-6 py-3 card">
										<BarChart
											dataSource={chart.Dataset}
											title={chart.Title}
											xName={chart.XTitle}
											name={chart.YTitle}
											keys={{ X: "X", Y: "Y" }}
											withFilter={chart.WithFilter}
											chartId={chart.ChartTypeID}
										/>
									</div>
								);
							})}
					</div>
				</div>
			</div>
		</>
	);
};

export default React.memo(ERPHome);
