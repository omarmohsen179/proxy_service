import React, { useState } from "react";
// import "devextreme/dist/css/dx.common.css";
// import "devextreme/dist/css/dx.light.css";
import { Popup } from "devextreme-react/popup";
import { Button as ButtonExpress } from "devextreme-react/button";
import { useTranslation } from "react-i18next";

function DeletedHeader({ title }) {
  let [popup, setPopup] = useState(false);
  const { t, i18n } = useTranslation();
  let showPopup = () => {
    setPopup(!popup);
    console.log(popup);
  };
  return (
    <>
      <div className="deletedHeaderContainer">
        <div className="deletedHeaderTitle">{title}</div>

        <div className="deletedHeaderButtonContainer">
          <ButtonExpress
            className="deletedHeaderButton"
            text={t("empty the basket")}
            type="default"
            stylingMode="contained"
            onClick={showPopup}
          />
        </div>
      </div>
      <Popup
        maxWidth={500}
        minWidth={250}
        height={185}
        showTitle={true}
        dragEnabled={false}
        closeOnOutsideClick={true}
        visible={popup}
        onHiding={showPopup}
      >
        <div className="deletedHeaderMessage">
          {t("The basket will be permanently emptied Are you sure?")}
        </div>
        <div className="deletedHeaderButtons">
          <ButtonExpress
            width={120}
            text={t("Yes")}
            type="success"
            stylingMode="outlined"
          />
          <ButtonExpress
            width={120}
            text={t("No")}
            type="danger"
            stylingMode="outlined"
          />
        </div>
      </Popup>
    </>
  );
}

export default DeletedHeader;
