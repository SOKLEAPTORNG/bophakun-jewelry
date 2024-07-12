import {Dimensions, Platform} from 'react-native';

const {width, height} = Dimensions.get('window');

export function guidGenerator() {
  var S4 = function () {
    return (((1 + Math.random()) * 0x10000) | 0).toString(10).substring(1);
  };
  return S4() + S4();
}
export const formatCurrency = (value) => {
  return new Intl.NumberFormat('KH', {
    style: 'currency',
    currency: 'KHR',
  }).format(value);
};

export function isIphoneX() {
  return (
    Platform.OS === 'ios' &&
    !Platform.isPad &&
    !Platform.isTVOS &&
    (height === 812 || width === 812)
  );
}

export function ifIphoneX(iphoneXStyle, regularStyle) {
  if (isIphoneX()) {
    return iphoneXStyle;
  }
  return regularStyle;
}

export function isAndroid() {
  return Platform.OS === 'android';
}

export function ifAndroid(androidStyle, regularStyle) {
  if (isAndroid()) {
    return androidStyle;
  }
  return regularStyle;
}

const isFunction = (input) => typeof input === 'function';
export function renderIf(predicate) {
  return function (elemOrThunk) {
    return predicate
      ? isFunction(elemOrThunk)
        ? elemOrThunk()
        : elemOrThunk
      : null;
  };
}
