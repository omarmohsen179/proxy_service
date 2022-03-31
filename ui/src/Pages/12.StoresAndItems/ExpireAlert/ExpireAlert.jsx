import { SelectBox } from "devextreme-react";
import { debounce } from "lodash";
import React, {
  useState,
  useEffect,
  useCallback,
  useRef,
  useMemo,
} from "react";
import { useTranslation } from "react-i18next";
import { NumberBox } from "../../../Components/Inputs";
import ExpireAlertTable from "./Components/ExpireAlertTable";

const ExpireAlert = () => {
  const { t, i18n } = useTranslation();
  const selectData = [
    { id: 1, name: t("day") },
    { id: 7, name: t("week") },
    { id: 30, name: t("month") },
    { id: 365, name: t("year") },
  ];

  const [dateValue, setDateValue] = useState(1);

  const [selectedDate, setSelectedDate] = useState();

  const apiPayload = useMemo(() => {
    return { RangTypeValue: selectedDate, RangValue: dateValue };
  }, [dateValue, selectedDate]);

  return (
    <>
      <h1 className="invoiceName">{t("Indicate the validity")}</h1>
      <div className="container-xxl rtlContainer mb-3">
        <div className="card p-3">
          <div className="row">
            <div className="col-3 pl-0">
              <NumberBox
                required={false}
                label={t("within a period")}
                value={dateValue ?? 1}
                name="dateValue"
                handleChange={debounce((e) => setDateValue(e.value), 500)}
              />
            </div>
            <div className="col-4 pr-0">
              <SelectBox
                placeholder={t("Please choose")}
                height="38px"
                dataSource={selectData.current}
                displayExpr={"name"}
                valueExpr={"id"}
                value={selectedDate}
                showClearButton={false}
                onValueChange={(selectedItem) => setSelectedDate(selectedItem)}
                rtlEnabled={true}
              />
            </div>
            <div className="row">
              <ExpireAlertTable apiPayload={apiPayload} />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ExpireAlert;
