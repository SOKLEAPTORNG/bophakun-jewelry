import {typeAuth, typeTheme} from '../../constant/index';
import User from '../../models/auth';
import {Alert} from 'react-native';
import CompanyInfo from '../../models/company';
import Customer_Group from '../../models/customer_group';

const initialState = {
  userInfo: [],
  companyInfo: [],
  token: null,
  userId: null,
  code_lang: null,
  didTryAutoLogin: false,
  success_smg: null,
  transitions: [],
  customer_group: [],
  added_points: [],
};

const authReducer = (state = initialState, action) => {
  switch (action.type) {
    case typeAuth.AUTHENTICATE:
      return {
        ...state,
        token: action.token,
        userId: action.userId,
        didTryAutoLogin: true,
      };
    case typeAuth.SET_DID_TRY_AL:
      return {
        ...state,
        didTryAutoLogin: true,
      };

    case typeAuth.FETCH_USERINFO_SUCCESS:
      const res = action.payload;
      let userInfo = [];
      for (let i = 0; i < res.data.length; i++) {
        const userdata = res.data[i];
        userInfo.push(
          new User(
            userdata.id,
            userdata.uid,
            userdata.name,
            userdata.email,
            userdata.mobile,
            userdata.fcm_token,
            userdata.total_rp,
            userdata.image_url,
          ),
        );
      }
      let customer_group_data = [];
      for (let i = 0; i < res.data.length; i++) {
        const datax = res.data[i];
        customer_group_data.push(
          new Customer_Group(
            datax.customer_group_id,
            datax.customer_groups_name,
            datax.customer_groups_name_discount,
          ),
        );
      }
      // console.log(userInfo);
      return {
        ...state,
        userInfo: userInfo,
        customer_group: customer_group_data,
      };
    case typeAuth.CREATE_USER_FAILURE:
      const messagex = action.payload;
      Alert.alert('Error', messagex);
      return {
        ...state,
      };
    case typeAuth.UPDATE_CUSTOMER_PROFILE_FAILURE:
      const message = action.payload.message;
      Alert.alert('Error', message);
      return {...state};
    case typeAuth.UPDATE_CUSTOMER_PROFILE_SUCCESS:
      const success_smg = action.payload.message;
      return {
        ...state,
        success_smg: success_smg,
      };
    case typeAuth.FETCH_COMPANY_INFO_SUCCESS:
      const data = action.payload;
      let companyinfo = [];
      for (let i = 0; i < data.length; i++) {
        companyinfo.push(
          new CompanyInfo(
            data[i].id,
            data[i].name,
            data[i].email,
            data[i].mobile,
            data[i].website,
            data[i].company_website,
            data[i].facebook_link,
            data[i].telegram_chat,
            data[i].contact_us_link, //google_map_link
            data[i].google_map_link, //google_map_link
            data[i].country,
            data[i].state,
            data[i].city,
            data[i].zip_code,
            data[i].redeem_amount_per_unit_rp,
            data[i].description,
            data[i].address,
            data[i].exchange_to_riel,
            data[i].enable_rp,
            data[i].latitude,
            data[i].longitude,
            data[i].area_zone_free_delivery,
            data[i].over_zone_limit,
            data[i].over_zone_charge,
            data[i].operation_hour,
            data[i].open_hour,
            data[i].close_hour,
          ),
        );
      }
      __DEV__ && console.log(companyinfo);
      return {
        ...state,
        companyInfo: companyinfo,
      };
    case typeAuth.FETCH_COMPANY_INFO_FAILURE:
      const message2 = action.payload.message;
      Alert.alert('Error', message2);
      return {...state};
    case typeAuth.FETCH_TRANSITIONS_SUCCESS:
      return {
        ...state,
        transitions: action.payload,
      };
    case typeAuth.FETCH_TRANSITIONS_FAILURE:
      const message3 = action.payload;
      Alert.alert('Error', message3);
      return {
        ...state,
      };
    case typeAuth.FETCH_POINTS_ADDED_SUCCESS:
      return {
        ...state,
        added_points: action.payload,
      };
    case typeAuth.LOGOUT:
      return {
        ...initialState,
      };
    case typeTheme.SET_TOGGLE_CHANGE_LANGUAGE:
      return {
        ...state,
        token: null,
      };
    default:
      return state;
  }
};
export default authReducer;
