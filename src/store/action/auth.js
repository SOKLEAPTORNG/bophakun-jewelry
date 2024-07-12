import AsyncStorage from '@react-native-community/async-storage';
import {typeAuth, business_info, BASE_URL} from '../../constant/index';
import {LoginManager} from 'react-native-fbsdk';
import message from '@react-native-firebase/messaging';
import {setProducts} from './product';
import {getPromotion} from './promotion';
import axios from 'axios';
export const SIGNUP = 'SIGNUP';
export const LOGIN = 'LOGIN';
let timer;
export const setDidTryAL = () => {
  return {type: typeAuth.SET_DID_TRY_AL};
};

export const authenticate = (userId, token) => {
  return dispatch => {
    // dispatch(setLogoutTimer(expiryTime));
    dispatch({type: typeAuth.AUTHENTICATE, userId: userId, token: token});
  };
};
/**
 * fetch user information successful actions
 *
 */

export const fetchUserSuccess = data => {
  return {
    type: typeAuth.FETCH_USERINFO_SUCCESS,
    payload: data,
  };
};
export const fetchUserFailure = msg => {
  return {
    type: typeAuth.FETCH_USERINFO_FAILURE,
    payload: {
      message: 'Something when wrong!',
    },
  };
};
export const getUserInfo = uid => {
  return async (dispatch, getState) => {
    try {
      await axios
        .get(`${BASE_URL.CUSTOMER_ONFO}${business_info.business_id}/${uid}`)
        .then(response => {
          const data = response.data;
          dispatch(fetchUserSuccess(data));
        });
    } catch (error) {
      fetchUserFailure(error.message);
      throw error;
    }
  };
};
/**
 * update user information successful and failure
 * @param {*} res
 * @param {*} data
 */
export const updateCustomerProfileSuccess = msg => {
  return {
    type: typeAuth.UPDATE_CUSTOMER_PROFILE_SUCCESS,
    payload: {
      message: msg,
    },
  };
};
export const updateCustomerProfileFailure = message => {
  // console.log('this working');
  return {
    type: typeAuth.UPDATE_CUSTOMER_PROFILE_FAILURE,
    payload: {
      message: 'Something when wrong!!',
    },
  };
};
export const updateCustomerProfile = (name, email, mobile) => {
  return async (dispatch, getState) => {
    const user = getState().auth.userInfo;
    const {id} = user[0];
    try {
      await axios
        .post(BASE_URL.UPDATE_CONTACT, {
          id: id,
          email: email,
          mobile: mobile,
          name: name,
        })
        .then(res => {
          if (!res.data.success) {
            dispatch(updateCustomerProfileFailure(res.data.msg));
          } else {
            dispatch(updateCustomerProfileSuccess(res.data.msg));
          }
        });
    } catch (err) {
      throw err;
    }
  };
};
/**
 *
 * @param {*} messagex
 */
export const createCustomerInfoFailure = messagex => {
  return {
    type: typeAuth.CREATE_USER_FAILURE,
    payload: messagex,
  };
};
/**
 *
 * @param {*} name
 * @param {*} uid
 * @param {*} email
 * @param {*} imageUrl
 * @param {*} token
 */

export const createCustomerInfo = (name, uid, email, imageUrl, token) => {
  return async dispatch => {
    const tokenx = await message().getToken();
    try {
      await axios
        .post(BASE_URL.CREATE_CONTACT, {
          business_id: business_info.business_id,
          type: 'customer',
          name: name,
          image_url: imageUrl,
          email: email,
          uid: uid,
          fcm_token: tokenx,
          mobile: '',
          created_by: business_info.created_by,
          total_rp: 0,
          total_rp_used: 0,
          total_rp_expired: 0,
          is_default: 0,
          contact_status: 'active',
        })
        .then(async () => {
          await dispatch(getUserInfo(uid));
          await dispatch(setProducts());
          await dispatch(setCompanyInfo());
          await dispatch(getPromotion());
          await dispatch(authenticate(uid, token));
          await dispatch(saveDataToStorage(token, uid));
        });
    } catch (err) {
      dispatch(createCustomerInfoFailure(err.message));
      throw err;
    }
  };
};
export const login = (name, id, email, imageUrl, token) => {
  return async (dispatch, getState) => {
    const userInfo = getState().auth.userInfo;
    try {
      if (userInfo.length === 0) {
        await dispatch(createCustomerInfo(name, id, email, imageUrl, token));
      } else {
        dispatch(authenticate(id, token));
        dispatch(saveDataToStorage(token, id));
      }
    } catch (error) {
      throw error;
    }
  };
};

export const logout = () => {
  clearLogoutTimer();
  AsyncStorage.removeItem('userData');
  LoginManager.logOut();
  return {
    type: typeAuth.LOGOUT,
  };
};

const clearLogoutTimer = () => {
  if (timer) {
    clearTimeout(timer);
  }
};

const setLogoutTimer = expirationTime => {
  return dispatch => {
    timer = setTimeout(() => {
      dispatch(logout());
    }, expirationTime);
  };
};
const saveDataToStorage = (token, userId) => {
  return async dispatch => {
    await AsyncStorage.setItem(
      'userData',
      JSON.stringify({
        token: token,
        userId: userId,
      }),
    );
  };
};
/**
 * GET Company conformation specific on company id
 */
export const fetchCompanyInfoSuccess = data => {
  return {
    type: typeAuth.FETCH_COMPANY_INFO_SUCCESS,
    payload: data,
  };
};
export const fetchCompanyInfoFailure = () => {
  return {
    type: typeAuth.FETCH_COMPANY_INFO_FAILURE,
    payload: {
      message: 'Something when wrong!!',
    },
  };
};
export const setCompanyInfo = () => {
  return async (dispatch, getState) => {
    try {
      await axios
        .get(`${BASE_URL.GET_COMPANY_INFO}${business_info.business_id}`)
        .then(res => {
          if (!res.data.success) {
            dispatch(fetchCompanyInfoFailure());
          }
          dispatch(fetchCompanyInfoSuccess(res.data.data));
        });
    } catch (err) {
      console.log(err);
    }
  };
};

/**
 *
 * @param {*} code
 */
export const setDefaultLanguage = code => {
  return async dispatch => {
    await AsyncStorage.setItem('LANGUAGE_CODE', code);
    dispatch({
      type: typeAuth.SET_USER_LANGUAGE_SELECTED,
    });
  };
};
/**
 * fetch customer transitions successful
 *
 */
export const fetchTransitionsSuccess = data => {
  return {
    type: typeAuth.FETCH_TRANSITIONS_SUCCESS,
    payload: data,
  };
};

/**
 * fetch customer transition failure
 *
 */

export const fetchTransitionsFailure = message => {
  return {
    type: typeAuth.FETCH_TRANSITIONS_FAILURE,
    payload: message,
  };
};
/**
 * set Transitions
 */

export const setTransitions = () => {
  return async (dispatch, getState) => {
    const {id} = getState().auth.userInfo[0];
    await axios
      .get(`${BASE_URL.GET_TRANSITIONS}${id}`)
      .then(({data}) => {
        dispatch(fetchTransitionsSuccess(data.data));
      })
      .catch(e => {
        dispatch(fetchTransitionsFailure(e.message));
      });
  };
};
/**
 *
 * @param {*} data
 *fetch added points success and return data as param
 */
const fetchPointsAddedSuccess = data => {
  return {
    type: typeAuth.FETCH_POINTS_ADDED_SUCCESS,
    payload: data,
  };
};
/**
 * set points added by returning dispatch
 */
export const setPointAdded = () => {
  return async (dispatch, getState) => {
    const {id} = getState().auth.userInfo[0];
    await axios
      .get(`${BASE_URL.GET_POINTS_ADDED}${id}`)
      .then(({data}) => {
        dispatch(fetchPointsAddedSuccess(data.data));
      })
      .catch(e => {
        dispatch(fetchTransitionsFailure(e.message));
      });
  };
};
