import {typeNotification, BASE_URL, business_info} from '../../constant/index';
import Notification from '../../models/notification';
import axios from 'axios';
export const fetchNotificationSuccess = (data) => {
  return {
    type: typeNotification.FETCH_NOTIFICATION_SUCCESS,
    payload: data,
  };
};
export const fetchNotificationFailure = (message) => {
  return {
    type: typeNotification.FETCH_NOTIFICATION_FAILURE,
    payload: message,
  };
};

export const fetchNotificationRequest = () => {
  return async (dispatch, getState) => {
    const user = getState().auth.userInfo;
    const id = user.length > 0 ? user[0]['id'] : 0;
    await axios
      .get(`${BASE_URL.GET_NOTIFICATION}/${business_info.business_id}/${id}`)
      .then((response) => {
        let notification = [];
        const {data} = response;
        for (const key in data) {
          if (key !== 'success') {
            notification.push(
              new Notification(
                key,
                data[key].title,
                data[key].content,
                data[key].created_date,
                data[key].image,
                data[key].type,
                data[key].uid,
              ),
            );
          }
        }
        dispatch(fetchNotificationSuccess(notification));
      })
      .catch((e) => {
        dispatch(fetchNotificationFailure(e.message));
      });
  };
};
