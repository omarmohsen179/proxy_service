import React, { useCallback } from 'react';
import Toolbar, { Item } from 'devextreme-react/toolbar';
import Button from 'devextreme-react/button';
import UserPanel from '../user-panel/user-panel';
import './header.scss';
import { Template } from 'devextreme-react/core/template';
import FavouritesBar from '../favourites-bar/favourites-bar';

import { useTranslation } from "react-i18next";

function Header({ menuToggleEnabled, title, toggleMenu }) {

  const { t, i18n } = useTranslation();

  const changeLanguage = useCallback(
    (e) => {
      i18n.language === "en"
        ? i18n.changeLanguage("ar")
        : i18n.changeLanguage("en")

      document.documentElement.setAttribute("lang", i18n.language);
    },
    [i18n]
  );

  const goToMedadSoft = useCallback(
    () => {
      window.open('https://www.almedadsoft.com/');
    },
    [],
  )

  return (
    <header className={'header-component'}>
      <Toolbar className={'header-toolbar'}>

        <Item cssClass={"px-3"} location={'center'}>
          <FavouritesBar />
        </Item>


        <Item
          visible={menuToggleEnabled}
          location={i18n.language === 'en' ? 'before' : 'after'}
          widget={'dxButton'}
          cssClass={'menu-button'}
        >
          <Button icon="menu" stylingMode="text" onClick={toggleMenu} />
        </Item>

        <Item
          location={i18n.language === 'en' ? 'before' : 'after'}
          cssClass={'header-title'}
          text={title}
          visible={!!title}
        >
          <div onClick={goToMedadSoft}>
            {title}
          </div>
        </Item>

        <Item
          location={i18n.language === 'en' ? 'after' : 'before'}
          cssClass={'lang__button px-lg-5'}
          text={t("lang")}
        >
          <div onClick={changeLanguage} className={"lang__button px-lg-5"}>
            {t("lang")}
          </div>
        </Item>

        <Item
          location={i18n.language === 'en' ? 'after' : 'before'}
          locateInMenu={'auto'}
          menuItemTemplate={'userPanelTemplate'}
        >
          <Button
            className={'user-button authorization'}
            width={210}
            height={'100%'}
            stylingMode={'text'}
          >
            <UserPanel menuMode={'context'} />
          </Button>
        </Item>
        <Template name={'userPanelTemplate'}>
          <UserPanel menuMode={'list'} />
        </Template>
      </Toolbar>
    </header>
  )
}

export default React.memo(Header);
