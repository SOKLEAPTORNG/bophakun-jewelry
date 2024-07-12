import {Dimensions, Platform} from 'react-native';
import {getStatusBarHeight} from 'react-native-status-bar-height';
export const SCREEN_HEIGHT = Math.round(Dimensions.get('window').height);
export const SCREEN_WIDTH = Dimensions.get('window').width;
export const STATUSBAR_HEIGHT = getStatusBarHeight();
export const PADDING_BOTTOM =
  Platform.OS === 'ios' && SCREEN_HEIGHT < 812 ? 10 : 50;
/**
 * custom card view defaul styles
 */
export const cardView = {
  padding: 10,
  marginHorizontal: 5,
  marginVertical: 2.5,
  marginBottom: 5,
};
export const business_info = {
  // business_id: 16,
  // created_by: 42,
  // location_id: 17,

  business_id: 56,
  created_by: 172,
  location_id: 97,
  order_number: 'CYJ',
};
export const Colors = {
  primary: '#f3e2ff',
  secondary: '#C8766B',
  accent: '#5D5D5D',
  background: '#fff',
  text: '#262626',
  textLight: '#fff',
  textGrey: '#B9B9B9',
  darkGrey: '#848484',
};
export const SIZES = {
  // global sizes
  base: 8,
  font: 14,
  radius: 30,
  padding: 10,
  padding2: 12,

  // font sizes
  largeTitle: 50,
  h1: 30,
  h2: 22,
  h3: 20,
  h4: 18,
  body1: 30,
  body2: 20,
  body3: 16,
  body4: 14,
  body5: 12,
};
const LOGO = require('../assets/logo.png');
export const icons = {
  check: require('../assets/checkicons.png'),
  un_check: require('../assets/uncheck.png'),
};
export const FONTS = {
  largeTitle: {
    fontFamily: 'Roboto-regular',
    fontSize: SIZES.largeTitle,
    lineHeight: 55,
  },
  h1: {fontFamily: 'Roboto-Black', fontSize: SIZES.h1, lineHeight: 36},
  h2: {fontFamily: 'Roboto-Bold', fontSize: SIZES.h2, lineHeight: 30},
  h3: {fontFamily: 'Roboto-Bold', fontSize: SIZES.h3, lineHeight: 22},
  h4: {fontFamily: 'Roboto-Bold', fontSize: SIZES.h4, lineHeight: 22},
  body1: {fontFamily: 'Roboto-Regular', fontSize: SIZES.body1, lineHeight: 36},
  body2: {fontFamily: 'Roboto-Regular', fontSize: SIZES.body2, lineHeight: 30},
  body3: {fontFamily: 'Roboto-Regular', fontSize: SIZES.body3, lineHeight: 22},
  body4: {fontFamily: 'Roboto-Regular', fontSize: SIZES.body4, lineHeight: 22},
  body5: {fontFamily: 'Roboto-Regular', fontSize: SIZES.body5, lineHeight: 22},
};
//   export const icons = {
//     check: require('../assets/checkicons.png'),
//     un_check: require('../assets/uncheck.png'),
//   };

export const GOOGLE_AUTH_CLIENT_ID =
  '582455528652-evaf2i8laggcl4u6f2ec3ge5cmel0i9q.apps.googleusercontent.com';
export const IMAGE_PATH = 'https://pos.eocambo.com/';
export const DISCOUNT_PATH = 'https://pos.eocambo.com/uploads/discount/';
export const CATEGORY_PATH = 'https://pos.eocambo.com/uploads/category/';
export const SLIDER_PATH = 'https://pos.eocambo.com/uploads/slider/';
export const SLIDER_GALLERY_PATH =
  'https://pos.eocambo.com/uploads/product_gallery/';
export const BASE_URL = {
  PRODUCT: 'https://pos.eocambo.com/api/products/',
  TOGGLE_FAVORITE: 'https://pos.eocambo.com/api/favourites/create/',
  GET_ORDERS_TYPES: 'https://pos.eocambo.com/api/ordertype/search/',
  CREATE_CONTACT: 'https://pos.eocambo.com/api/contact/create',
  UPDATE_CONTACT: 'https://pos.eocambo.com/api/contact/update',
  CUSTOMER_ONFO: 'https://pos.eocambo.com/api/customer/search/',
  CREATE_ORDERS: 'https://pos.eocambo.com/api/checkout',
  GET_ORDERS: 'https://pos.eocambo.com/api/order/search/',
  GET_ORDERS_DETAIL: 'https://pos.eocambo.com/api/order/searchSpecific/',
  GET_COMPANY_INFO: 'https://pos.eocambo.com/api/company/search/',
  GET_ORDERS_TYPE: 'https://pos.eocambo.com/api/ordertype/search/',
  GET_SLIDER: 'https://pos.eocambo.com/api/slider/search/',
  GET_PROMOTIONS: 'https://pos.eocambo.com/api/discount/search/',
  GET_TRANSITIONS: 'https://pos.eocambo.com/api/savingpoint/search/',
  GET_PRODUCT_PRICE: 'https://pos.eocambo.com/api/product/search/',
  GET_PRODUCT_AVAILABILITY: 'https://extranet.eocambo.com/api/stock-available',
  GET_PRODUCT_SOLD_AVAILABILITY:
    'https://extranet.eocambo.com/api/product-count-sold/',
  GET_NOTIFICATION: 'https://pos.eocambo.com/api/notification/search',
  GET_POINTS_ADDED: 'https://pos.eocambo.com/api/addingpoints/search/',
};

/**
 * product type
 */
export const typeProduct = {
  FETCH_PRODUCT_FAILURE: 'FETCH_PRODUCT_FAILURE',
  FETCH_PRODUCT_SUCCESS: 'FETCH_PRODUCT_SUCCESS',
  FETCH_CATEGORY_SUCCESS: 'FETCH_CATEGORY_SUCCESS',
  TOGGLE_FAVORITE_FAILURE: 'TOGGLE_FAVORITE_FAILURE',
  FETCH_HOT_PROMOTION_SLIDER_SUCCESS: 'FETCH_HOT_PROMOTION_SLIDER_SUCCESS',
  FETCH_PRODUCT_EXTRA_GROUP_SUCCESS: 'FETCH_PRODUCT_EXTRA_GROUP_SUCCESS',
  FETCH_PRODUCT_EXTRA_OPTION_SUCCESS: 'FETCH_PRODUCT_EXTRA_OPTION_SUCCESS',
};
/**
 * authentication types
 */
export const typeAuth = {
  LOGOUT: 'LOGOUT',
  AUTHENTICATE: 'AUTHENTICATE',
  SET_DID_TRY_AL: 'SET_DID_TRY_AL',
  CREATE_USER_SUCCESS: 'CREATE_USER_SUCCESS',
  CREATE_USER_FAILURE: 'CREATE_USER_FAILURE',
  FETCH_USERINFO_SUCCESS: 'FETCH_USERINFO_SUCCESS',
  FETCH_USERINFO_FAILURE: 'FETCH_USERINFO_FAILURE',
  UPDATE_CUSTOMER_PROFILE_SUCCESS: 'UPDATE_CUSTOMER_PROFILE_SUCCESS',
  UPDATE_CUSTOMER_PROFILE_FAILURE: 'UPDATE_CUSTOMER_PROFILE_FAILURE',
  FETCH_COMPANY_INFO_SUCCESS: 'FETCH_COMPANY_INFO_SUCCESS',
  FETCH_COMPANY_INFO_FAILURE: 'FETCH_COMPANY_INFO_FAILURE',
  SET_USER_LANGUAGE_SELECTED: ' SET_USER_LANGUAGE_SELECTED',
  FETCH_TRANSITIONS_SUCCESS: 'FETCH_TRANSITIONS_SUCCESS',
  FETCH_TRANSITIONS_FAILURE: 'FETCH_TRANSITIONS_FAILURE',
  FETCH_POINTS_ADDED_SUCCESS: 'FETCH_POINTS_ADDED_SUCCESS',
  FETCH_POINTS_ADDED_FAILURE: 'FETCH_POINTS_ADDED_FAILURE',
};
/**
 *
 * orders type
 */
export const typeOrders = {
  SEND_ORDERS_SUCCESS: 'SEND_ORDERS_SUCCESS',
  SEND_ORDERS_FAILURE: 'SEND_ORDERS_FAILURE',
  FETCH_ORDERS_SUCCESS: 'FETCH_ORDERS_SUCCESS',
  FETCH_ORDERS_FAILURE: 'FETCH_ORDERS_FAILURE',
  SENDER_ORDER_FAILURE: 'SENDER_ORDER_FAILURE',
  FETCH_ORDERS_DETAIL_SUCCESS: 'FETCH_ORDERS_DETAIL_SUCCESS',
  FETCH_ORDERS_DETAIL_FAILURE: 'FETCH_ORDERS_DETAIL_FAILURE',
  FETCH_ORDERS_TYPE_SUCCESS: 'FETCH_ORDERS_TYPE_SUCCESS',
  FETCH_ORDERS_TYPE_FAILURE: 'FETCH_ORDERS_TYPE_FAILURE',
  FETCH_EXTRAOPTION_SUCCESS: 'FETCH_EXTRAOPTION_SUCCESS',
};

/**
 * promotion types
 *
 */
export const typePromotion = {
  FETCH_PROMOTION_SUCCESS: 'FETCH_PROMOTION_SUCCESS',
  FETCH_PROMOTION_FAILURE: 'FETCH_PROMOTION_FAILURE',
};
/**
 * fetch slider types
 */
export const typeSlider = {
  FETCH_SLIDER_SUCCESS: 'FETCH_SLIDER_SUCCESS',
  FETCH_SLIDER_FAILURE: 'FETCH_SLIDER_FAILURE',
};
/**
 * type add item to cart
 */
export const typeCart = {
  ADD_TO_CART: 'ADD_TO_CART',
  INCREMENT_CART_QUANTITY: 'INCREMENT_CART_QUANTITY',
  DECREMENT_CART_QUANTITY: 'DECREMENT_CART_QUANTITY',
  REMOVE_FROM_CART: 'REMOVE_FROM_CART',
  ADD_EXTRA_OPTION: 'ADD_EXTRA_OPTION',
  CLEAR_CART: 'CLEAR_CART',
  ADD_ARR_TO_CARD: 'ADD_ARR_TO_CARD',
};
/**
 * type notification
 *
 */
export const typeNotification = {
  FETCH_NOTIFICATION_SUCCESS: 'FETCH_NOTIFICATION_SUCCESS',
  FETCH_NOTIFICATION_FAILURE: 'FETCH_NOTIFICATION_FAILURE',
};
/**
 * custom dark theme type
 */
export const typeTheme = {
  SET_TOGGLE_THEME: 'SET_TOGGLE_THEME',
  SET_TOGGLE_CHANGE_LANGUAGE: 'SET_TOGGLE_CHANGE_LANGUAGE',
};
export {LOGO};
