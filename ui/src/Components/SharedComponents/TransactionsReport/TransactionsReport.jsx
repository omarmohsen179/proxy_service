import React, { useMemo } from "react";
import { Popup } from "devextreme-react/popup";
import ScrollView from "devextreme-react/scroll-view";
import { NumberBox, TextBox } from "../../Inputs";
import TransactionsTable from "./Components/TransactionsTable";

const TransactionsReport = ({ visible, togglePopup, data }) => {
  const apiPayload = useMemo(
    () => ({
      MemberID: data.MemberID,
      FromDate: data.FromDate,
      ToDate: data.ToDate,
    }),
    [data.FromDate, data.MemberID, data.ToDate]
  );

  return (
    <>
      <Popup visible={visible} onHiding={togglePopup}>
        <ScrollView showScrollbar="onHover">
          <h1 className="text-center py-2">كشف حركة</h1>
          <div className="container-xxl rtlContainer mb-3">
            <div className="p-1">
              <div className="row">
                <div className="col-4">
                  <NumberBox
                    readOnly
                    required={false}
                    label="الرقم"
                    value={data.docno ?? 0}
                    name="num_mas"
                  />
                </div>
                <div className="col-4">
                  <TextBox
                    readOnly
                    required={false}
                    label="الاسم"
                    name="name"
                    value={data.s_name}
                  />
                </div>
                <div className="col-4">
                  <TextBox
                    readOnly
                    required={false}
                    label="الصافي"
                    name="net"
                    value={data.net ?? 0}
                  />
                </div>
              </div>
              <div className="row">
                <TransactionsTable apiPayload={apiPayload} />
              </div>
            </div>
          </div>
        </ScrollView>
      </Popup>
    </>
  );
};

export default React.memo(TransactionsReport);
