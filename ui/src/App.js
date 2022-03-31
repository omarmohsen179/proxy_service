import './themes/generated/theme.base.css';
import "./css/main.css";
import 'devextreme/dist/css/dx.common.css';
import './themes/generated/theme.additional.css';
import './themes/generated/edits.css';
import React, { useEffect } from 'react';
import { HashRouter, HashRouter as Router } from 'react-router-dom';
import './dx-styles.scss';
import LoadPanel from 'devextreme-react/load-panel';
import { NavigationProvider } from './contexts/navigation';
import { AuthProvider, useAuth } from './contexts/auth';
import { useScreenSizeClass } from './utils/media-query';

import "./i18n";
import { useTranslation } from "react-i18next";
import { LanguageProvider } from './Services/LanguageContext';

import Content from './Content';
import UnauthenticatedContent from './UnauthenticatedContent';

import "../node_modules/bootstrap/dist/css/bootstrap.min.css";
import "../node_modules/bootstrap/dist/js/bootstrap.bundle.js";
import "../node_modules/popper.js/dist/popper";

import { Provider } from 'react-redux';
import configureStore from "./Store/configureStore";
import axios from 'axios';
import { request } from './Services/CallAPI';


function App() {
  const { user, loading } = useAuth();
  const { i18n } = useTranslation();

  useEffect(() => {
    if (
      localStorage.getItem("i18nextLng") !== "en" &&
      localStorage.getItem("i18nextLng") !== "ar"
    ) {
      i18n.changeLanguage("en");
    }
  }, [i18n]);

  useEffect(() => {
    document.documentElement.setAttribute("lang", i18n.language);
  }, [i18n.language])

  if (loading) {
    return <LoadPanel visible={true} />;
  }

  if (user) {
    return <Content />;
  }

  return <UnauthenticatedContent />;
}

export default function Root() {
  const screenSizeClass = useScreenSizeClass();

  return (
    <Router>
      <Provider store={configureStore()}>
        <LanguageProvider>
          <AuthProvider>
            <NavigationProvider>
              <div className={`app ${screenSizeClass}`}>
                <App />
              </div>
            </NavigationProvider>
          </AuthProvider>
        </LanguageProvider>
      </Provider>
    </Router>
  );
}
