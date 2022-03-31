import React from "react";
import { Switch, Redirect, NavLink } from "react-router-dom";
import Login from "../Pages/Login/Login";
import ProtectedInRoute from "./ProtectedInRoute";

const NestedRoutes = () => {
  return (
    <div className="App">
      <>
        <Switch>
          <ProtectedInRoute path="/guest/Login" component={Login} />
          <Redirect to="/not-found" />
        </Switch>
      </>
    </div>
  );
};

export default NestedRoutes;
