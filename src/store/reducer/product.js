import {typeProduct, typeAuth, typeTheme} from '../../constant/index';
import {Alert} from 'react-native';
const initailState = {
  product_type: [],
  product_categories: [],
  products: [],
  drink_item: [],
  food_items: [],
  bakery_item: [],
  favorite: [],
  popularItems: [],
  recommend_items: [],
  HotPromotionSlider: {},
  ProductExtraGroup: {},
  ProductExtraOption: {},
};
export default (state = initailState, action) => {
  switch (action.type) {
    case typeProduct.FETCH_PRODUCT_SUCCESS:
      const foods = action.items;
      const popular_items = action.items;
      const recommend_items = action.items;
      console.log('action');
      console.log(action);
      return {
        ...state,
        products: action.items,
        food_items: foods,
        popularItems: popular_items,
        recommend_items: recommend_items,
      };
    case typeProduct.FETCH_CATEGORY_SUCCESS:
      const prod_type = action.payload.filter(d => d.parent_id === 0);
      return {
        ...state,
        product_type: prod_type,
        product_categories: action.payload,
      };
    case typeProduct.FETCH_HOT_PROMOTION_SLIDER_SUCCESS:
      return {
        ...state,
        HotPromotionSlider: action.payload,
      };
    //ProductExtraGroup
    case typeProduct.FETCH_PRODUCT_EXTRA_GROUP_SUCCESS:
      return {
        ...state,
        ProductExtraGroup: action.payload,
      };
    //FETCH_PRODUCT_EXTRA_OPTION_SUCCESS
    case typeProduct.FETCH_PRODUCT_EXTRA_OPTION_SUCCESS:
      return {
        ...state,
        ProductExtraOption: action.payload,
      };
    case typeProduct.FETCH_PRODUCT_FAILURE:
      const message = action.payload;
      Alert.alert('Error', message);
      return {
        ...state,
      };
    case typeProduct.TOGGLE_FAVORITE_FAILURE:
      const messagex = action.message;
      Alert.alert('Error', messagex);
      return {
        ...state,
      };
    case typeAuth.LOGOUT:
      return {...initailState};
    case typeTheme.SET_TOGGLE_CHANGE_LANGUAGE:
      return {
        ...initailState,
      };
    default:
      return state;
  }
};
