import React, { memo } from 'react';

const TableCell = ({ color, label, value, style = 'input-wrapper' }) => {
    return (
        <div className={style}>
            <div className='label'>
                {label}
            </div>
            <div className={`border py-1 ${color}`} style={{ minHeight: '30px' }}>
                {value}
            </div>
        </div>
    )
}
export default memo(TableCell);