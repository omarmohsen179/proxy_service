import React, {
  useMemo,
  useRef,
  useState,
  useEffect,
  useCallback,
} from "react";
import { Button, CheckBox, DateBox } from "devextreme-react";
import { SelectBox } from "../../../Components/Inputs";
import { GET_SPECIFIC_LOOKUP } from "../../../Services/ApiServices/General/LookupsAPI";
import StaffAccountsTable from "./Components/StaffAccountsTable";
import TransactionsReport from "../../../Components/SharedComponents/TransactionsReport/TransactionsReport";
import { useTranslation } from "react-i18next";

const StaffAccountsReport = () => {
  const { t, i18n } = useTranslation();
  const [fromDate, setFromDate] = useState();

  const [toDate, setToDate] = useState(new Date());

  const [categories, setCategories] = useState([]);

  const [selectedCategory, setSelectedCategory] = useState();

  const [selectedAccount, setSelectedAccount] = useState({});

  const [showPopup, setShowPopup] = useState(false);

  const togglePopup = useCallback(() => {
    setShowPopup((prev) => !prev);
  }, []);

  const handleDoubleClick = useCallback(({ data }) => {
    setSelectedAccount(data);
    setShowPopup(true);
  }, []);

  useEffect(() => {
    let date = new Date();
    date.setMonth(date.getMonth() - 1);
    let from = new Date(date);
    setFromDate(from);
    GET_SPECIFIC_LOOKUP("تصنيــــف الـــموظفيــــن").then((categories) => {
      setCategories([{ id: 0, description: "الــكــل" }, ...categories]);
    });
  }, []);

  const data = useMemo(() => {
    return {
      MemberID: selectedAccount.s_no,
      docno: selectedAccount.docno,
      s_name: selectedAccount.s_name,
      net: selectedAccount.daen - selectedAccount.mden,
      FromDate: fromDate,
      ToDate: toDate,
    };
  }, [
    fromDate,
    selectedAccount.daen,
    selectedAccount.docno,
    selectedAccount.mden,
    selectedAccount.s_name,
    selectedAccount.s_no,
    toDate,
  ]);

  const apiPayload = useMemo(
    () => ({
      StaffCategoryID: selectedCategory,
      FromDate: fromDate,
      ToDate: toDate,
    }),
    [fromDate, selectedCategory, toDate]
  );

  return (
    <>
      {
        <TransactionsReport
          visible={showPopup}
          togglePopup={togglePopup}
          data={data}
        />
      }
      <h1 className="invoiceName">{t("Employee account statement")}</h1>
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
                  dateOutOfRangeMessage={t("date past date to")}
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
                  dateOutOfRangeMessage={t("date past date from")}
                  onValueChanged={(e) => setToDate(e.value)}
                />
              </div>
            </div>

            <div className="col-4">
              <SelectBox
                label={t("Categorize")}
                dataSource={categories}
                name="asset"
                value={selectedCategory}
                keys={{ id: "id", name: "description" }}
                handleChange={(e) => setSelectedCategory(e.value)}
              />
            </div>
          </div>

          <div className="row py-3">
            <StaffAccountsTable
              apiPayload={apiPayload}
              handleDoubleClick={handleDoubleClick}
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default React.memo(StaffAccountsReport);
