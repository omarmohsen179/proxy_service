import React, { Suspense, useMemo } from "react";
import { Route, Redirect } from "react-router-dom";
import { getWithExpiry } from "../Services/LocalStorageService";
import Spinner from "./SharedComponents/Spinner/Spinner";
import NavBar from "./MainPageComponents/NavBar";
import SideNav from "./MainPageComponents/SideNav";
import config from "../config.js";

const { localStorageTokenKey, localStorageReadIdKey } = config;

const ProtectedRoute = ({
  path,
  component: Component,
  componentProps,
  render,
  ...rest
}) => {
  let flag = useMemo(() => {
    return getWithExpiry(localStorageTokenKey) ? true : false;
  }, []);

  flag = true;
  return (
    <Suspense
      fallback={
        <div>
          <h5>Loading ...</h5>
        </div>
      }
    >
      <Route
        {...rest}
        render={(props) => {
          if (!flag) return <Redirect to="/" />;
          return Component ? (
            <>
              <Component {...props} {...componentProps} />
            </>
          ) : (
            render(props)
          );
        }}
      />
    </Suspense>
  );
};

export default ProtectedRoute;
