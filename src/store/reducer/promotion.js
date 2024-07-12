import {typePromotion, typeSlider} from '../../constant/index';
import {Alert} from 'react-native';
import Slider from '../../models/slider';
import moment from 'moment';
const initailState = {
  promotion: [],
  sliders: [],
  available_promotions: [],
};

export default (state = initailState, action) => {
  switch (action.type) {
    case typePromotion.FETCH_PROMOTION_SUCCESS:
      const promotions = action.payload;
      let available_promotions = [];
      promotions.filter((d) => {
        const today = new Date();
        const current_date = moment(today).format('YYYY-MM-DD');
        const end_date = moment(d.end_at).format('YYYY-MM-DD');
        if (end_date >= current_date) {
          available_promotions.push(d);
        }
      });
      return {
        ...state,
        promotion: action.payload,
        available_promotions: available_promotions,
      };
    case typePromotion.FETCH_PROMOTION_FAILURE:
      const message = action.payload;
      Alert.alert('Error', message);
      return {
        ...state,
      };
    case typeSlider.FETCH_SLIDER_SUCCESS:
      const data = action.payload;
      let slider = [];
      for (const key in data) {
        if (key !== 'success') {
          slider.push(
            new Slider(data[key].id, data[key].name, data[key].title),
          );
        }
      }
      const statex = {
        ...state,
        sliders: slider,
      };
      return statex;
    case typeSlider.FETCH_SLIDER_FAILURE:
      const message1 = action.payload.message;
      Alert.alert('Error', message1);
      return {
        ...state,
      };
    default:
      return state;
  }
};
