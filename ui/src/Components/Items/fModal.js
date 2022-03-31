import React from 'react';
import { Button } from "devextreme-react/button";
import { useHistory } from 'react-router-dom';


const FModal = ({ opened = true, id }) => {
    let history = useHistory();

    let handleClick = (url) => {
        history.push(`/${url}`);
    }
    return (
        <div className={opened ? 'f f-click' : 'f'}>

            < Button
                className='mx-1'
                stylingMode="contained"
                icon="far fa-file-alt"
                width={'100%'}
                text="كشف الحركه"
                type="default"
                onClick={() => handleClick(`item-movement/${id}`)}
                rtlEnabled={true}
            />

            < Button
                className='mx-1'
                stylingMode="outlined"
                icon="fas fa-info-circle"
                onClick={() => handleClick(`item-details/${id}`)}
                width={'100%'}
                type="default"
                text="تفاصيل الصنف"
                rtlEnabled={true}
            />

        </div>
    );
}


export default FModal;