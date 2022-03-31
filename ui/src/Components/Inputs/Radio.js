import React from 'react';
import RadioGroup from 'devextreme-react/radio-group';

const Input = ({ name, items, handleChange, value }) => {
    return (
        <RadioGroup
            items={items}
            value={value}
            onValueChange={(value) => handleChange({ name, value })}
        />
    );
}

export default Input;