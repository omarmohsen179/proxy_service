import React from 'react';

const CellError = ({ message }) => {
    return (
        <div className="btn-group mx-1">
            <div type="button" className="error"
                data-bs-toggle="dropdown" aria-expanded="false">
                <i class="fas fa-exclamation-circle"></i>
            </div>
            <ul className="dropdown-menu ">
                <li className="dropdown-item error">{message}</li>
            </ul>
        </div>
    );
}

export default CellError;