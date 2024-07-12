import {typeCart} from '../../constant/index';
export const addToCart = (
  id,
  qty,
  price,
  size,
  name,
  image,
  note,
  cat_id,
  variations_id,
  old_var_id,
  isUpdate,
) => {
  return async (dispatch, getState) => {
    const CartItemsData = {
      id: id,
      qty: qty,
      price: price,
      size: size,
      name: name,
      image: image,
      note: note,
      cat_id: cat_id,
      variations_id,
      old_var_id,
      isUpdate,
    };
    dispatch({
      type: typeCart.ADD_TO_CART,
      payload: CartItemsData,
    });
  };
};
export const updateCartItems = (oldId, newId) => {
  const updateCart = {
    old_var_id: oldId,
    new_var_id: newId,
  };
  return {
    type: typeCart.UPDATE_CART_ITEM,
    cart: updateCart,
  };
};
export const addExtraOption = data => {
  return {
    type: typeCart.ADD_EXTRA_OPTION,
    payload: data,
  };
};
export const removeFromCart = productId => {
  return {
    type: typeCart.REMOVE_FROM_CART,
    pid: productId,
  };
};
export const incrementQuantity = productId => {
  return {
    type: typeCart.INCREMENT_CART_QUANTITY,
    pid: productId,
  };
};
export const decrementQuantity = productId => {
  return {
    type: typeCart.DECREMENT_CART_QUANTITY,
    pid: productId,
  };
};
export const clearCart = () => {
  const cart_date = {};
  return {
    type: typeCart.CLEAR_CART,
    payload: cart_date,
  };
};
export const AddArrItemCart = value => {
  return {
    type: typeCart.ADD_ARR_TO_CARD,
    payload: value,
  };
};
