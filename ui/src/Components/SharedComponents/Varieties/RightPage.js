import React, { useState, useEffect } from 'react';
import Form from './Form';
import UnitTable from './UnitTable';
import { TextArea } from '../Inputs';


const RightPage = () => {
  return (
    <div className='custom-card right-container' >
      <Form />
      <div className='right-container__items'>
        <UnitTable />
        <div>
          <div className='label'>
            تفاصيل عن الصنف
                        </div>
          <TextArea
            name='تفاصيل عن الصنف'
          />
        </div>
      </div>
    </div>
  );
};

export default RightPage;
