import React from 'react';
import MasterTable from './../../Components/SharedComponents/Tables Components/MasterTable';

const ItemTransactionsTable = React.memo(({ dataSource }) => {
    let transactionsColAttributes = [
        { field: "docno", caption: "رقم العملية" },
        { field: "mvType", caption: "نوع العملية" },
        { field: "DateMv", caption: "التاريخ" },
        { field: "bean", caption: "البيان" },
        { field: "kmea", caption: "الكمية" },
        { field: "bal", caption: "الرصيد" },
        { field: "price", caption: "السعر" },
        { field: "price", caption: "القيمه" },
        { field: "price", caption: "ملاحظات" },
    ];

    return (
        <>
            <MasterTable
                columnChooser={false}
                height={"300px"}
                width={"100%"}
                dataSource={dataSource}
                colAttributes={transactionsColAttributes}
            />
        </>
    );
});

export default ItemTransactionsTable;