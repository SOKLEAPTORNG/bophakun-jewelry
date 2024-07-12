import {BASE_URL, business_info, typeProduct} from '../../constant/index';
import Categories from '../../models/Categories';
import Products from '../../models/Products';
import axios from 'axios';
export const fetchProductFailure = err => {
  return {
    type: typeProduct.FETCH_PRODUCT_FAILURE,
    payload: err,
  };
};
/**
 *
 * @param {*arr} loadedProducts
 * fetch product success and then reteun type
 */
export const fetchProductSucces = loadedProducts => {
  return {
    type: typeProduct.FETCH_PRODUCT_SUCCESS,
    items: loadedProducts,
  };
};
/**
 *
 * @param {*arry} categories;
 * fetching product category success
 */
export const fectchCategorySuccess = categories => {
  return {
    type: typeProduct.FETCH_CATEGORY_SUCCESS,
    payload: categories,
  };
};
/**
 * set all product and product category combine one endpoint request
 */
//HotPromotionSlider
export const fectchHotPromotionSliderSuccess = HotPromotionSlider => {
  return {
    type: typeProduct.FETCH_HOT_PROMOTION_SLIDER_SUCCESS,
    payload: HotPromotionSlider,
  };
};
//FETCH_PRODUCT_EXTRA_GROUP_SUCCESS
export const fectchProductExtraGroupSuccess = ProductExtraGroup => {
  return {
    type: typeProduct.FETCH_PRODUCT_EXTRA_GROUP_SUCCESS,
    payload: ProductExtraGroup,
  };
};
//FETCH_PRODUCT_EXTRA_OPTION_SUCCESS
export const fectchProductExtraOptionSuccess = ProductExtraOption => {
  return {
    type: typeProduct.FETCH_PRODUCT_EXTRA_OPTION_SUCCESS,
    payload: ProductExtraOption,
  };
};
export const setProducts = () => {
  return async (dispatch, getState) => {
    const user = getState().auth.userInfo;
    const uid = user.length > 0 ? user[0]['uid'] : '0';
    await axios
      .get(`${BASE_URL.PRODUCT}${uid}/${business_info.business_id}`)
      .then(response => {
        const {
          category,
          products,
          HotPromotionSlider,
          ProductExtraOption,
          ProductExtraGroup,
        } = response.data;
        const categories = [];
        for (let i = 0; i < category.length; i++) {
          categories.push(
            new Categories(
              category[i].business_id,
              category[i].category_type,
              category[i].id,
              category[i].name,
              category[i].parent_id,
              category[i].image,
              category[i].cover_url, //show_on_mobile
              category[i].show_on_mobile, //show_on_mobile
            ),
          );
        }
        const loadedProducts = [];
        for (let i = 0; i < products.length; i++) {
          if (products[i].price > 0) {
            loadedProducts.push(
              new Products(
                products[i].id,
                products[i].name,
                products[i].price,
                products[i].image,
                products[i].business_id,
                products[i].category_id,
                products[i].sub_category_id,
                products[i].description,
                products[i].is_favorites,
                products[i].is_new,
                products[i].is_popular,
                products[i].is_recommend,
              ),
            );
          }
        }
        dispatch(fetchProductSucces(loadedProducts));
        dispatch(fectchCategorySuccess(categories));
        dispatch(fectchHotPromotionSliderSuccess(HotPromotionSlider)); //HotPromotionSlider
        dispatch(fectchProductExtraGroupSuccess(ProductExtraGroup)); //HotPromotionSlider
        dispatch(fectchProductExtraOptionSuccess(ProductExtraOption)); //HotPromotionSlider
      })
      .catch(err => {
        dispatch(fetchProductFailure(err.message));
        throw err;
      });
  };
};
export const toggleAddFavoriteFailure = message => {
  return {
    type: typeProduct.TOGGLE_FAVORITE_FAILURE,
    message: message,
  };
};
/**
 *
 * @param {*} pid
 */
export const toggleAddFavorite = pid => {
  return async (dispatch, getState) => {
    const user = getState().auth.userInfo;
    const {uid} = user[0];
    await axios
      .post(`${BASE_URL.TOGGLE_FAVORITE}${uid}/${pid}`, {
        user_id: uid,
        product_id: pid,
      })
      .then(async () => {
        await dispatch(setProducts());
      })
      .catch(err => {
        dispatch(toggleAddFavoriteFailure(err));
        throw err;
      });
  };
};
