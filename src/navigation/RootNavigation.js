import * as React from 'react';
import {StackActions} from '@react-navigation/native';
export const loadRef = React.createRef();
export const sheetRef = React.createRef();
export const navigationRef = React.createRef();
// export const navigation = navigationRef.current
export function navigate(name, params) {
  navigationRef.current?.navigate(name, params);
}
export function dispatch(action) {
  navigationRef.current?.dispatch(action);
}
export function jumpTo(name, params) {
  navigationRef.current?.jumpTo(name, params);
}
export function replace(name, params) {
  navigationRef.current?.dispatch(StackActions.replace(name, params));
}
export function push(name, params) {
  navigationRef.current?.dispatch(StackActions.push(name, params));
}
export function goBack() {
  navigationRef.current?.goBack();
}
export const _onLoading = () => {
  const load = loadRef.current;
  if (load) {
    load.show();
  }
};
export const _onLoadingFinish = () => {
  const load = loadRef.current;
  if (load) {
    load.close();
  }
};
export const onSheetOpen = () => sheetRef.current.snapTo(0);
export const onSheetClose = () => sheetRef.current.snapTo(1);
export const navigation = {
  navigate,
  dispatch,
  jumpTo,
  replace,
  push,
  goBack,
};
