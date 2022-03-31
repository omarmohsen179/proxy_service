import React from 'react';
import { useHistory } from 'react-router-dom';

const UpperLabel = ({ label }) => {
    let history = useHistory()
    let backUrl = sessionStorage.getItem('backUrl');
    return (
        <div className='center' dir='rtl'>
            <h4 className='blue mx-3 mb-3' >{label}</h4>
            <button className='btn btn-outline-success mx-3 mb-3 '
                onClick={() => {
                     history.goBack() 
                     }}>
                رجوع للقائمة <i className="fas fa-arrow-left"></i></button>
        </div>
    );
}

export default React.memo(UpperLabel);