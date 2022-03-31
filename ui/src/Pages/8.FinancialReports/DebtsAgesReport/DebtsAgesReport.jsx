import React, {
	useState,
	useEffect,
	useCallback,
	useMemo,
	useRef,
} from "react";
import RadioGroup from "devextreme-react/radio-group";
import { SelectBox } from "../../../Components/Inputs";
import { GET_CLASSIFICATIONS } from "../../../Services/ApiServices/General/ReportsAPI";
import "./DebtsAgesReport.css";
import DebtsAgesTable from "./Components/DebtsAgesTable";
import MovementSheet from "../../FinancialReports/DebtsStatement/MovementSheet";
import { useTranslation } from "react-i18next";

const DebtsAgesReport = () => {
	const { t, i18n } = useTranslation();

	const radioGroup = [
		{ id: 1, name: t("Debtor") },
		{ id: 0, name: t("Creditors") },
	];

	const ageRanges = useRef([
		{ id: -1, name: "الــــكــــل", nameEn: "All" },
		{ id: 0, name: "أقل من 30 %", nameEn: "less than 30%" },
		{ id: 30, name: "أكثر من 30 %", nameEn: "more than 30%" },
		{ id: 45, name: "أكثر من 45 %", nameEn: "more than 45%" },
		{ id: 60, name: "أكثر من 60 %", nameEn: "More than 60%" },
		{ id: 90, name: "أكثر من 90 %", nameEn: "More than 90%" },
		{ id: 180, name: "أكثر من 180 %", nameEn: "More than 180%" },
	]);
	const [categories, setCategories] = useState([]);

	const [selectedCategoryId, setSelectedCategoryId] = useState();

	const [selectedRange, setSelectedRange] = useState(-1);

	const [selectedDebitType, setSelectedDebitType] = useState(0);

	const [movementSheetHeaderData, setMovementSheetHeaderData] = useState({});

	const [popupVisibility, setPopupVisibility] = useState(false);

	let handlePopupVisibility = useCallback(() => {
		setPopupVisibility((prev) => !prev);
	}, []);

	let handleDoubleClick = useCallback((e) => {
		let { cust_id, name, mden1, daen1, tel } = e.data;
		setMovementSheetHeaderData({
			s_no: cust_id,
			s_name: name,
			daen: daen1,
			mden: mden1,
			tel,
		});
		setPopupVisibility((prev) => !prev);
	}, []);

	useEffect(() => {
		GET_CLASSIFICATIONS().then((response) => {
			setCategories([...response]);
		});
	}, []);

	const apiPayload = useMemo(() => {
		return {
			AccountType: selectedCategoryId,
			DebitType: selectedDebitType,
			DebitTime: selectedRange,
		};
	}, [selectedCategoryId, selectedDebitType, selectedRange]);
	return (
		<>
			<MovementSheet
				popupVisibility={popupVisibility}
				handlePopupVisibility={handlePopupVisibility}
				title="كشف حركة"
				headerData={movementSheetHeaderData}
			/>
			<h1 className="invoiceName">
				{t("Disclosure of the age of the debt")}
			</h1>
			<div className="container-xxl rtlContainer mb-3">
				<div className="card p-3">
					<div className="row">
						<div className="col-4">
							<SelectBox
								label={t("Categorize")}
								dataSource={categories}
								value={selectedCategoryId}
								handleChange={(e) =>
									setSelectedCategoryId(e.value)
								}
								keys={{ id: "class", name: "class" }}
								name="typ_id"
							/>
						</div>
						<div className="col-4">
							<SelectBox
								label={t("Age")}
								dataSource={ageRanges.current}
								keys={{
									id: "id",
									name: "name",
									nameEn: "nameEn",
								}}
								name="ageRange"
								value={selectedRange}
								handleChange={(e) => setSelectedRange(e.value)}
							/>
						</div>
						<div className="col-4 d-flex justify-content-start align-items-center mb-2">
							<RadioGroup
								items={radioGroup.current}
								value={selectedDebitType}
								valueExpr={"id"}
								displayExpr={"name"}
								onValueChange={(e) => setSelectedDebitType(e)}
								layout="horizontal"
							/>
						</div>
					</div>

					<div className="row">
						<DebtsAgesTable
							apiPayload={apiPayload}
							handleDoubleClick={handleDoubleClick}
						/>
					</div>
				</div>
			</div>
		</>
	);
};

export default DebtsAgesReport;
