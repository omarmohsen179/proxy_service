import React from "react";
import { NavLink } from "react-router-dom";

const NotFound = () => {
    return (
        <div id="notfound">
            <div className="notfound">
                <div className="notfound-404">
                    <h1>Oops!</h1>
                    <h2>404 - The Page can't be found</h2>
                </div>
                <NavLink to="/">Go TO Homepage</NavLink>
            </div>
        </div>
    );
};

export default NotFound;
