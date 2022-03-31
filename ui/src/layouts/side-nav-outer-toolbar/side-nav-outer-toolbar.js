import Drawer from 'devextreme-react/drawer';
import ScrollView from 'devextreme-react/scroll-view';
import React, { useState, useCallback, useRef, useMemo, useEffect } from 'react';
import { useHistory, useParams } from 'react-router';
import { Header, SideNavigationMenu, Footer } from '../../Components';
import './side-nav-outer-toolbar.scss';
import { useScreenSize } from '../../utils/media-query';
import { Template } from 'devextreme-react/core/template';
import { useMenuPatch } from '../../utils/patches';
import { useTranslation } from 'react-i18next';
import { GET_MAIN_SUB_BUTTONS } from '../../Services/ApiServices/General/ButtonsAPI';
import { setVisible } from '../../Store/Items/ItemsSlice';
import { useDispatch } from 'react-redux';

export default function SideNavOuterToolbar({ title, children }) {
  const { t, i18n } = useTranslation();
  const scrollViewRef = useRef();
  const history = useHistory();
  const dispatch = useDispatch();
  const { isXSmall, isLarge } = useScreenSize();
  const [patchCssClass, onMenuReady] = useMenuPatch();
  const [menuStatus, setMenuStatus] = useState(
    isLarge ? MenuStatus.Opened : MenuStatus.Closed
  );
  const [navigation, setNavigation] = useState([])

  useEffect(() => {
    GET_MAIN_SUB_BUTTONS().then((navigation) => {
      setNavigation([{
        id: "{1CAB8025-B3AF-42B7-9F97-DF423644ABA2}",
        path: "/Home",
        icon: "fas fa-home",
        text: "الرئيسية",
        textEn: "Home"
      }, ...navigation])

    }).catch((error) => {
      console.log(error)
    })
  }, [])

  const toggleMenu = useCallback(({ event }) => {
    setMenuStatus(
      prevMenuStatus => prevMenuStatus === MenuStatus.Closed
        ? MenuStatus.Opened
        : MenuStatus.Closed
    );
    event.stopPropagation();
  }, []);

  const temporaryOpenMenu = useCallback(() => {
    setMenuStatus(
      prevMenuStatus => prevMenuStatus === MenuStatus.Closed
        ? MenuStatus.TemporaryOpened
        : prevMenuStatus
    );
  }, []);

  const onOutsideClick = useCallback(() => {
    setMenuStatus(
      prevMenuStatus => prevMenuStatus !== MenuStatus.Closed && !isLarge
        ? MenuStatus.Closed
        : prevMenuStatus
    );
  }, [isLarge]);

  const onNavigationChanged = useCallback(({ itemData: { path }, event, node }) => {
    if (menuStatus === MenuStatus.Closed || !path || node.selected) {
      event.preventDefault();
      return;
    }

    // We can remove all of that and make it more clean by adding item-movement as a popup in seracItems popup 
    dispatch(setVisible(false));
    if (history.location.pathname.includes("item-movement/") || history.location.pathname.includes("item-details/")) history.location.pathname = `/${path}`


    history.push(`${path}`);
    scrollViewRef.current.instance.scrollTo(0);

    if (!isLarge || menuStatus === MenuStatus.TemporaryOpened) {
      setMenuStatus(MenuStatus.Closed);
      event.stopPropagation();
    }
  }, [menuStatus, dispatch, history, isLarge]);

  const drawerLocation = useMemo(() => {
    return i18n.language === 'ar' ? 'after' : 'before'
  }, [i18n.language])

  return (
    <div className={'side-nav-outer-toolbar'}>
      <Header
        className={'layout-header'}
        menuToggleEnabled
        toggleMenu={toggleMenu}
        title={title}
      />
      <Drawer
        className={['drawer', patchCssClass].join(' ')}
        position={drawerLocation}
        closeOnOutsideClick={onOutsideClick}
        openedStateMode={isLarge ? 'shrink' : 'overlap'}
        revealMode={isXSmall ? 'slide' : 'expand'}
        minSize={isXSmall ? 0 : 60}
        maxSize={250}
        shading={isLarge ? false : true}
        opened={menuStatus === MenuStatus.Closed ? false : true}
        template={'menu'}
      >
        <div className={'container'}>
          <ScrollView ref={scrollViewRef} className={'layout-body with-footer'}>
            <div className={'m-3 content'}>
              {React.Children.map(children, item => {
                return item.type !== Footer && item;
              })}
            </div>
            <div className={'content-block'}>
              {React.Children.map(children, item => {
                return item.type === Footer && item;
              })}
            </div>
          </ScrollView>
        </div>
        <Template name={'menu'}>
          <SideNavigationMenu
            compactMode={menuStatus === MenuStatus.Closed}
            selectedItemChanged={onNavigationChanged}
            openMenu={temporaryOpenMenu}
            onMenuReady={onMenuReady}
            navigation={navigation}
          >
          </SideNavigationMenu>
        </Template>
      </Drawer>
    </div>
  );
}

const MenuStatus = {
  Closed: 1,
  Opened: 2,
  TemporaryOpened: 3
};
