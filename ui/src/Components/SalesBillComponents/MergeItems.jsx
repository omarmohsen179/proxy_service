import React from "react";
import { Button, Popup } from "devextreme-react";

const MergeItems = ({ mergeItemsHandle }) => {
  return (
    <Popup
      visible={true}
      animationEnabled={false}
      dragEnabled={false}
      showCloseButton={false}
      showTitle={true}
      title="تنبيه"
      rtlEnabled={true}
      container=".dx-viewport"
      width={500}
      height={220}
    >
      <h5 className="pt-2">هذا الصنف تمت اضافته من قبل لهذه الفاتورة</h5>
      <div className="d-flex justify-content-around pt-5">
        {/* Return false to handle */}
        <Button className="p-2" onClick={() => mergeItemsHandle(false)}>
          اضافة مرة أخرى
        </Button>
        {/* Return true to handle */}
        <Button className="p-2" onClick={() => mergeItemsHandle(true)}>
          دمج مع الصنف الاخر
        </Button>
      </div>
    </Popup>
  );
};

export default MergeItems;
