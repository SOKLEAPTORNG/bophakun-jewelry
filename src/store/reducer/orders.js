import {typeOrders} from '../../constant/index';
import {OrderType} from '../../models/order';
import {Alert} from 'react-native';
const initialState = {
  orders: [],
  order_items_detail: [],
  order_type: [],
  orders_last_index: [],
  extra_options_selected: [],
};

export default (state = initialState, action) => {
  switch (action.type) {
    case typeOrders.FETCH_ORDERS_SUCCESS:
      const orderItems = action.payload.sort((a, b) => b.id - a.id).slice(0)[0];
      return {
        ...state,
        orders: action.payload,
        orders_last_index: orderItems,
      };
    case typeOrders.FETCH_ORDERS_FAILURE:
      const errMessage = action.payload;
      Alert.alert('Error', errMessage);
      return {...state};
    case typeOrders.SEND_ORDERS_FAILURE:
      const msg = action.payload;
      Alert.alert('Error', msg);
      return {...state};
    case typeOrders.FETCH_ORDERS_DETAIL_SUCCESS:
      return {
        ...state,
        order_items_detail: action.payload,
      };
    case typeOrders.FETCH_EXTRAOPTION_SUCCESS:
      return {
        ...state,
        extra_options_selected: action.payload,
      };
    case typeOrders.FETCH_ORDERS_DETAIL_FAILURE:
      const messagex = action.payload;
      Alert.alert('Error', messagex);
      return {...state};
    case typeOrders.FETCH_ORDERS_TYPE_SUCCESS:
      const data = action.payload;
      return {
        ...state,
        order_type: data,
      };
    case typeOrders.FETCH_ORDERS_TYPE_FAILURE:
      const message = action.payload.message;
      Alert.alert('Error', message);
      return {...state};
    default:
      return state;
  }
};
