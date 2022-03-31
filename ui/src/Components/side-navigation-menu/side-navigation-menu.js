import React, { useEffect, useRef, useCallback, useMemo, useState } from 'react';
import TreeView from 'devextreme-react/tree-view';
import { useNavigation } from '../../contexts/navigation';
import { useScreenSize } from '../../utils/media-query';
import './side-navigation-menu.scss';
import logo from "../../assets/images/logo.png"
import * as events from 'devextreme/events';
import { GET_MAIN_SUB_BUTTONS } from '../../Services/ApiServices/General/ButtonsAPI';
import { ScrollView } from 'devextreme-react/scroll-view';
import { useTranslation } from 'react-i18next';

export default function SideNavigationMenu(props) {
  const {
    children,
    selectedItemChanged,
    openMenu,
    compactMode,
    onMenuReady,
    navigation
  } = props;

  const { t, i18n } = useTranslation();

  const { isLarge } = useScreenSize();

  const normalizePath = useCallback(
    () => {
      return navigation.map((item) => {
        if (item.path && !(/^\//.test(item.path))) {
          item.path = `/${item.path}`;
        }

        return { ...item, expanded: isLarge };
      });
    },
    [isLarge, navigation])

  const items = useMemo(
    normalizePath,
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [normalizePath]
  );

  const { navigationData: { currentPath } } = useNavigation();

  const treeViewRef = useRef();
  const wrapperRef = useRef();
  const getWrapperRef = useCallback((element) => {
    const prevElement = wrapperRef.current;
    if (prevElement) {
      events.off(prevElement, 'dxclick');
    }

    wrapperRef.current = element;
    events.on(element, 'dxclick', e => {
      openMenu(e);
    });
  }, [openMenu]);

  useEffect(() => {
    const treeView = treeViewRef.current && treeViewRef.current.instance;
    if (!treeView) {
      return;
    }

    if (currentPath !== undefined) {
      treeView.selectItem(currentPath);
      treeView.expandItem(currentPath);
    }

    if (compactMode) {
      treeView.collapseAll();
    }
  }, [currentPath, compactMode]);

  const displayExpr = useMemo(() => {
    return i18n.language === 'ar' ? "text" : "textEn"
  }, [i18n.language])

  return (
    <div
      className={'dx-swatch-additional side-navigation-menu'}
      ref={getWrapperRef}
      dir='auto'
    >
      <div className="logo-img"><img src={logo} width="100%" alt="Al-MedadSoft" /></div>

      {children}
      <ScrollView id="drawer__scroll">
        <div className={'menu-container'} dir='auto'>
          <TreeView
            ref={treeViewRef}
            items={items}
            displayExpr={displayExpr}
            keyExpr={'id'}
            selectionMode={'single'}
            focusStateEnabled={false}
            expandEvent={'click'}
            onItemClick={selectedItemChanged}
            onContentReady={onMenuReady}
            // itemRender={renderTreeViewItem}
            width={'100%'}
          />
        </div>

      </ScrollView>
    </div >
  );
}

function renderTreeViewItem(item) {
  return (
    <>
      <div className='d-flex align-items-center mx-2'>
        <i className={`${item.icon}`}></i>
        <span className="mx-2">{item.text}</span>
      </div>
    </>);
}
