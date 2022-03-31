import React from "react";
import { Popup } from "devextreme-react/popup";
import ScrollView from "devextreme-react/scroll-view";
import ItemMovements from "../../Pages/12.StoresAndItems/ItemMovements/ItemMovements";

const ItemMovementsPopup = ({ visable, togglePopup, itemId }) => {
  return (
    <Popup visible={visable} onHiding={togglePopup}>
      <ScrollView showScrollbar="onHover">
        <ItemMovements id={itemId} />
      </ScrollView>
    </Popup>
  );
};

export default React.memo(ItemMovementsPopup);
