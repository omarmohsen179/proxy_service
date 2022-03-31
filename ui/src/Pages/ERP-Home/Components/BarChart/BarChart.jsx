import React, { useEffect, useState } from "react";

import { Chart, Export, Legend, Series, Title } from "devextreme-react/chart";
import { DateBox } from "../../../../Components/Inputs";
import { useTranslation } from "react-i18next";
import { request } from "../../../../Services/CallAPI";

const BarChart = ({
	dataSource = [],
	keys = { X: "day", Y: "oranges" },
	name = "My Chart",
	title = "The British Monarchy",
	xName = "Royal Houses",
	withFilter = false,
	chartId,
}) => {
	const { t, i18n } = useTranslation();

	const [data, setData] = useState([]);

	const [fromDate, setFromDate] = useState();

	const [toDate, setToDate] = useState(new Date());

	useEffect(() => {
		if (withFilter) {
			let date = new Date();
			date.setMonth(date.getMonth() - 1);
			let from = new Date(date);
			setFromDate(from);
		}

		setData(dataSource);
	}, []);

	useEffect(() => {
		if (withFilter) {
			let config = {
				method: "post",
				url: `/ChartDataset/${chartId}`,
				data: {
					FromDate: fromDate,
					ToDate: toDate,
				},
			};

			request(config)
				.then((response) => {
					setData(response);
				})
				.catch((error) => {
					console.log(error);
				});
		}
	}, [fromDate, toDate]);

	return (
		<>
			<div className="chart__wrapper">
				{withFilter && (
					<div className="row">
						<div className="col-md-12 col-lg-6">
							<div className="input-wrapper">
								<div className="label">{t("From")}</div>
								<DateBox
									className="w-100"
									key="from"
									name="FromDate"
									value={fromDate}
									dateOutOfRangeMessage="التاريخ تجاوز تاريخ الى"
									onValueChanged={(e) => setFromDate(e.value)}
								/>
							</div>
						</div>
						<div className="col-md-12 col-lg-6">
							<div className="input-wrapper">
								<div className="label">{t("To")}</div>
								<DateBox
									key="to"
									name="ToDate"
									value={toDate}
									dateOutOfRangeMessage="التاريخ تجاوز تاريخ من"
									onValueChanged={(e) => setToDate(e.value)}
								/>
							</div>
						</div>
					</div>
				)}
				<div className="row">
					<Chart id="chart" dataSource={data}>
						<Series
							valueField={keys.Y}
							argumentField={keys.X}
							name={name}
							type="bar"
							color="#337ab7"
							barWidth={50}
						/>
						<Title text={title} />
						<Legend
							verticalAlignment="bottom"
							horizontalAlignment="center"
						>
							<Title text={xName} />
						</Legend>
						<Export enabled={true} />
					</Chart>
				</div>
			</div>
		</>
	);
};

export default React.memo(BarChart);
