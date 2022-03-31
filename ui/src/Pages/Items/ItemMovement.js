import React, { useEffect, useState } from 'react';
import { Button } from "devextreme-react/button";
import DateBox from "devextreme-react/date-box";
import { SelectBox } from '../../Components/Inputs';
import ItemTransactionsTable from './ItemTransactionsTable';
import { GET_REPORT_ITEM_TRANSACTIONS } from '../../Services/ApiServices/General/ReportsAPI';
import { CheckBox } from 'devextreme-react';
import TableCell from '../../Components/Items/tableCell';
import UpperLabel from './../../Components/Items/upperLabel';
import { GET_CASHIER_STORES } from '../../Services/ApiServices/SalesBillAPI';
import { useCallback } from 'react';


let subtractMonthes = (num) => {
    let date = new Date(Date.now());
    let month = date.getMonth() - num;
    date.setMonth(month);
    return date;
}

const ItemMovement = ({ match }) => {

    let [values, setValues] = useState({
        storeID: 0,
        toDate: new Date(Date.now()).toLocaleDateString(),
        fromDate: subtractMonthes(1).toLocaleDateString(),
    })

    let id = match.params.id;

    let [data, setData] = useState({})
    let [stores, setStores] = useState([])

    useEffect(async () => {
        let stores = await GET_CASHIER_STORES();
        setStores(stores)
    }, [])

    useEffect(async () => {
        let { storeID, fromDate, toDate } = values;
        let data = await GET_REPORT_ITEM_TRANSACTIONS({ itemId: id, storeID, fromDate, toDate });
        setData(data);
    }, [values])

    let handleDateChange = ({ name, value }) => {
        let date = new Date(value)
        setValues((values) => ({ ...values, [name]: date.toLocaleDateString() }))
    }

    let handleStoreChange = useCallback(({ name, value }) => {
        setValues((values) => ({ ...values, [name]: value }))
    }, []);

    return (
        <div className='container-xxl card p-3'>
            <UpperLabel label='كشف حركة الصنف' />

            <div className='row mx-3' dir='rtl'>
                <div className='one col-3'>
                    <div className='label' >من</div>
                    <DateBox
                        defaultValue={values.fromDate}
                        onValueChanged={({ value }) => handleDateChange({ name: 'fromDate', value })}
                    />
                </div>
                <div className='one col-3'>
                    <div className='label'>إلي</div>
                    <DateBox
                        defaultValue={values.toDate}
                        onValueChanged={({ value }) => handleDateChange({ name: 'toDate', value })}
                        min={values.fromDate}
                    />
                </div>
                <div dir='rtl ' className='col-4'>
                    <SelectBox
                        dataSource={stores}
                        label='المخزن'
                        name='storeID'
                        handleChange={handleStoreChange}
                        value={values.storeID} />
                </div>
            </div>


            <div className='row m-3' dir='rtl'>
                <div className='col-5'>
                    <TableCell label=' الإسم' value={data.ItemName} />
                </div>
                <div className='col-2'>
                    <TableCell label='الكمية ' value={data.ItemQuantity} />
                </div>
                <div className='col-3'>
                    <Button
                        type="default"
                        className='mx-1'
                        stylingMode="outlined"
                        text="متوسط سعر التكلفه"
                        icon="fas fa-chart-bar"
                        width={'100%'}
                        rtlEnabled={true}
                    />
                </div>
                <div className='col-2'>
                    <Button
                        type="default"
                        className='mx-1'
                        stylingMode="outlined"
                        text="متوسط سعر البيع"
                        icon="fas fa-chart-bar"
                        width={'100%'}
                        rtlEnabled={true}
                    />
                </div>
            </div>

            <div className='row px-3' >
                <ItemTransactionsTable dataSource={data.Data} />
            </div>

            <div className='double center m-3' dir='rtl'>

                <div className=" d-flex">
                    <CheckBox
                        // value={values["Subject_to_validity"] || false}
                        value={false}
                    // onValueChanged={({ value }) =>
                    //     handleChange({ name: "Subject_to_validity", value })
                    // }
                    />
                    <div className="mx-2">تحديث جميع الأصناف</div>
                </div>

                <div className='double'>
                    <div className='double'>
                        <div className='label'>
                            إجمالي الوارد
                        </div>
                        <div className='border py-1 green'>
                            {data.EnterQuantity || 0}
                        </div>
                    </div>

                    <div className='double'>
                        <div className='label '>
                            إجمالي المنصرف
                        </div>
                        <div className='border py-1 red'>
                            {data.OutQuantity || 0}
                        </div>
                    </div>

                </div>
            </div>


            <div className='item-transaction border mx-3 p-3'>
                <TableCell label='إجمالي مشتريات' value={data.PurchasesTotal || 0} color='green' />
                <TableCell label='إجمالي مبيعات' value={data.SalesTotal || 0} color='red' />
                <TableCell label='إعاده ترصيد +' value={data.OverQuantity || 0} color='green' />
                <TableCell label='إتلاف مواد' value={data.DamageTotal || 0} color='red' />
                <TableCell label='إرجاع مبيعات' value={data.ReturnSalesTotal || 0} color='green' />
                <TableCell label='إرجاع مشتريات' value={data.ReturnPurchasesTotal || 0} color='red' />
                <TableCell label='إعاده ترصيد -' value={data.UnderQuantity || 0} color='red' />
                <TableCell label='قيمه الموجود' value={data.ItemQuantity || 0} color='green' />
                <TableCell label='رصيد البدايه' value={data.BeginAmount || 0} color='green' />
                <TableCell label='ربح الصنف' value={data.ItemProfite || 0} color='green' />
                <TableCell label='متوسط البيع' value={data.AvergeSales || 0} />
                <TableCell label='التكلفه' value={data.ItemCost || 0} />
                {/* <div className='double'>
                    <Button
                        stylingMode="outlined"
                        type='default'
                        text="تحديث الكميات"
                        width={'100%'}
                        rtlEnabled={true}
                    />
                    <Button
                        stylingMode="outlined"
                        type='default'
                        text="تحديث"
                        width={'100%'}
                        rtlEnabled={true}
                    />
                </div> */}
            </div>
        </div >

    );
}

export default ItemMovement;