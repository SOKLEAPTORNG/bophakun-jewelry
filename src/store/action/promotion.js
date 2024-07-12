import {
  typePromotion,
  BASE_URL,
  business_info,
  typeSlider,
} from '../../constant/index';
import Promotion from '../../models/promotion';
import axios from 'axios';
/**
 *
 * @param {*} data
 */
export const fetchPromotionSuccess = data => {
  // console.log(data);
  return {
    type: typePromotion.FETCH_PROMOTION_SUCCESS,
    payload: data,
  };
};
export const fetchPromtotionFailure = message => {
  return {
    type: typePromotion.FETCH_PROMOTION_FAILURE,
    payload: message,
  };
};
export const getPromotion = () => {
  return async (dispatch, getState) => {
    const company_data = getState().auth.companyInfo;
    const {id} = company_data[0];
    await axios
      .get(`${BASE_URL.GET_PROMOTIONS}${id}`)
      .then(response => {
        const {data} = response;
        const promoData = [];
        for (const key in data) {
          if (key !== 'success') {
            promoData.push(
              new Promotion(
                data[key].id,
                data[key].name,
                data[key].image,
                data[key].created_at,
                data[key].starts_at,
                data[key].ends_at,
                data[key].category_id,
                data[key].is_active,
                data[key].discount_amount,
                data[key].discount_type,
                data[key].description,
              ),
            );
          }
        }
        dispatch(fetchPromotionSuccess(promoData));
      })
      .catch(err => {
        fetchPromtotionFailure(err.message);
      });
  };
};
/**
 *
 * @param {*passing} data
 */
export const fetchSliderSuccess = data => {
  return {
    type: typeSlider.FETCH_SLIDER_SUCCESS,
    payload: data,
  };
};
export const fetchSliderFailure = () => {
  return {
    type: typeSlider.FETCH_SLIDER_FAILURE,
    payload: {
      message: 'An unexpected error!!',
    },
  };
};
export const setSlider = () => {
  return async dispatch => {
    try {
      await axios
        .get(`${BASE_URL.GET_SLIDER}${business_info.business_id}`)
        .then(response => {
          if (response.status !== 200) {
            dispatch(fetchSliderFailure());
            throw new Error('Something when wrong!!');
          }
          dispatch(fetchSliderSuccess(response.data));
        });
    } catch (err) {
      console.log(err);
    }
  };
};
