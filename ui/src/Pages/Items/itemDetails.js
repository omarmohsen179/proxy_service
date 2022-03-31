import React, { useState, useEffect } from 'react';
import TableCell from '../../Components/Items/tableCell';
import { Column } from 'devextreme-react/data-grid';
import { DataGrid } from 'devextreme-react/data-grid';

import {
    QUICK_ITEM_INFO,
    ITEM_MINMUM_LIMIT_QUANTITY
} from "../../Services/ApiServices/ItemsAPI";

import {
    GET_REPORT_ITEM_STORES_QUANTITY,
} from "../../Services/ApiServices/General/ReportsAPI";
import { NumberBox } from 'devextreme-react';
import UpperLabel from './../../Components/Items/upperLabel';

import { useSelector } from 'react-redux';
import {
    selectItem
} from "../../Store/Items/ItemsSlice";
import { useParams } from 'react-router';

const ItemDetails = () => {
    const { id } = useParams();
    let [item, setItem] = useState({
        SaleTransactions: []
    })
    let [itemStores, setItemStores] = useState([])
    let [minimum, setMinimum] = useState(0)
    let [store, setStore] = useState({})
    let { itemId } = useSelector(selectItem)

    useEffect(async () => {
        let data = await QUICK_ITEM_INFO(id);
        setItem(data);

        let stores = await GET_REPORT_ITEM_STORES_QUANTITY(id);
        setItemStores(stores);
        if (stores.length > 0) {
            setStore(stores[0]);
            setMinimum(parseFloat(stores[0].minimu));
        }
    }, []);

    let handleChange = async ({ value }) => {
        setMinimum(value);
        try {
            await ITEM_MINMUM_LIMIT_QUANTITY({
                StoreID: store.docno,
                MinimumLimitQuantity: value,
                Location: store.locate,
                ItemID: item.id
            })
        } catch (error) {
            console.log(error);
        }
    }

    return (
        <div className='container-xxl card p-3'>
            <UpperLabel label='تفاصيل الصنف' />

            <div className='border mx-3 p-3'>
                <div className='triple'>
                    <TableCell label='الرقم' value={item.item_no} />
                    <TableCell label='الإسم' value={item.item_name} />
                    <TableCell label='شفرة النوع' value={item.code_no} />
                    <TableCell label='التصنيف' value={item.description} />
                    <TableCell label='الرقم التجاري' value={item.PARCODE1} />
                    <TableCell label='الإسم الأجنبي' value={item.e_name} />
                </div>

                <div className='four-in-row mt-3'>
                    <TableCell label='الطول' value={item.tol} style='four ' />
                    <TableCell label='العرض' value={item.ord} style='four' />
                    <TableCell label='الإرتفاع' value={item.ert} style='four' />
                    <TableCell label='الوزن' value={item.wazn} style='four' />
                </div>

                <div className='d-flex' dir='rtl'>
                    <div style={{ fontWeight: 500 }}>معلومات علي الصنف</div>
                </div>
            </div>

            <div className='row mx-1 p-3'>

                <div className='col-7'>
                    <div style={{ fontWeight: 500, textAlign: 'center', marginBottom: '5px' }} className='blue'>عمليات البيع السابقه</div>
                    <DataGrid
                        dataSource={item.SaleTransactions}
                        showBorders={true}
                        height={'300px'}
                    >
                        <Column dataField="e_date" caption='التاريخ' alignment="right" />
                        <Column dataField="name" caption='الزبون' alignment="right" />
                        <Column dataField="price" caption='السعر' alignment="right" />
                    </DataGrid>
                </div>

                <div className='col-5'>
                    <div style={{ fontWeight: 500, textAlign: 'center', marginBottom: '5px' }} className='blue'>توزيع الكميه بالمخازن</div>
                    <DataGrid
                        dataSource={itemStores}
                        showBorders={true}
                        height={'200px'}
                        selection={{ mode: 'single' }}
                        onSelectionChanged={({ selectedRowsData }) => setStore(selectedRowsData[0])}
                    >
                        <Column dataField="kmea" caption='المخزن' alignment="right" />
                        <Column dataField="m_name" caption='الكميه' alignment="right" />
                    </DataGrid>

                    <div className='mt-2' dir='rtl'>
                        <div className='input-wrapper' >
                            <div className='label blue' style={{ fontWeight: 650 }}>
                                نقطة إعادة الطلب
                            </div>
                            <NumberBox value={minimum ?? 0} onValueChanged={handleChange} />
                        </div>
                        <TableCell label='مكان الصنف' value={store.locate} />
                    </div>
                </div>

            </div>

            <h6 dir='rtl' className='blue m-3 '>الأسعار </h6>
            <div className='border mx-3 p-3 triple'>
                <TableCell label='سعر القطعه' value={item.price} />
                <TableCell label='سعر الجمله' value={item.p_gmla} />
                <TableCell label='اخر شراء العمله' value={item.LastBuyPrice} />
                <TableCell label='اخر شراء محلي' value={item.LastBuyPriceBySystemMoneyType} />
                <TableCell label='شراء مبدئي' value={150000} />
                <TableCell label='الإجمالي' value={150000} />
            </div>

            <div className='my-2' dir='rtl'>
                <h6 dir='rtl' className='blue m-3 '>اخر معامله مع الزبون</h6>
                <div className='item-sales border mx-3 p-3'>
                    <TableCell label='السعر' value={item.LastSalePrice} />
                    <TableCell label='الكميه' value={item.LastSaleQuantity} />
                </div>
            </div>

        </div >
    );
}

export default ItemDetails;