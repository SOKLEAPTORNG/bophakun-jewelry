import {Alert} from 'react-native';
import {typeNotification} from '../../constant/index';

const initailState = {
  notifications: [],
};

const notificationReducers = (state = initailState, action) => {
  switch (action.type) {
    case typeNotification.FETCH_NOTIFICATION_SUCCESS:
      return {
        ...state,
        notifications: action.payload,
      };
    case typeNotification.FETCH_NOTIFICATION_FAILURE:
      const message = action.payload;
      Alert.alert('Error', message);
      return {
        ...state,
      };
    default:
      return state;
  }
};

export default notificationReducers;
