import React, { useEffect, useState } from "react";
import { Button } from "devextreme-react/button";
import AdvancedTable from "../Tables Components/AdvancedTable.jsx";
import SimpleDropdown from "./SimpleDropdown";

function GridWithDropdown({ data1, data2, colAttributes }) {
    return (
        <>
            <h6 className="py-2">test</h6>
            <div className="d-flex pb-2">
                <SimpleDropdown
                    placeHolder="المخازن"
                    data={data1}
                    size="col-8"
                />
                <Button className="col-4" icon="add" type={"success"} />
            </div>
            <AdvancedTable
                data={data2}
                colAttributes={colAttributes}
                height={"120px"}
                // onSelectionChanged={({ selectedRowsData }) =>
                //     onSelectionChanged(selectedRowsData[0])
                // }
                deleteMessage="هل أنت متأكد من حذف هذا المخزن ؟"
                filterRow={false}
                headerFilter={false}
            />
        </>
    );
}

export default GridWithDropdown;
