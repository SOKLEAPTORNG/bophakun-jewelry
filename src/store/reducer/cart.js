import {typeCart, typeOrders} from '../../constant/index';
import CartItem from '../../models/cart';
const initialState = {
  cartItems: {},
  totalAmount: 0,
  cart_count: 1,
  extraOption: [],
};
const cartItems = (state = initialState, action) => {
  switch (action.type) {
    case typeCart.ADD_TO_CART:
      const addedProduct = action.payload;
      const id = addedProduct.id;
      const prodPrice = addedProduct.price;
      const name = addedProduct.name;
      const prodQty = addedProduct.qty;
      const size = addedProduct.size;
      const image = addedProduct.image;
      const price = Number.parseFloat(prodPrice);
      const sum = prodQty * price;
      const note = addedProduct.note;
      const cat_id = addedProduct.cat_id;
      const variations_id = addedProduct.variations_id;
      let updatedOrNewCartItem;
      const existing = state.cartItems[variations_id];
      let existing_sum_price;
      let existing_quantity;
      let totalAmount = 0;
      let cartItem = {...state.cartItems};
      // console.log(cartItem);
      if (addedProduct.isUpdate !== 1) {
        // on product detail screen
        if (existing) {
          // prodcut exiting
          // console.log(existing);
          // console.log('product exiting');
          if (addedProduct.old_var_id === variations_id) {
            // same size
            existing_sum_price = existing.sum + sum;
            existing_quantity = existing.qty + prodQty;
            // console.log(`${state.totalAmount}  ${cartItem[addedProduct.old_var_id].sum} ${sum}`);
            totalAmount =
              state.totalAmount -
              cartItem[addedProduct.old_var_id].sum +
              existing_sum_price;
          } else {
            // not same size
          }
          // add to cart after check
          updatedOrNewCartItem = new CartItem(
            id,
            existing_quantity,
            price,
            name,
            existing_sum_price,
            size,
            image,
            note,
            cat_id,
            variations_id,
          );
        } else {
          // not exiting product
          // console.log('product not exiting');
          totalAmount = state.totalAmount + sum;
          updatedOrNewCartItem = new CartItem(
            id,
            prodQty,
            price,
            name,
            sum,
            size,
            image,
            note,
            cat_id,
            variations_id,
          );
        }
      } else {
        // update screen
        if (addedProduct.old_var_id === variations_id) {
          // same size
          // console.log('update item')
          existing_sum_price =
            existing.sum - cartItem[addedProduct.old_var_id].sum + sum;
          existing_quantity = prodQty;
          totalAmount =
            state.totalAmount -
            cartItem[addedProduct.old_var_id].sum +
            existing_sum_price;
          updatedOrNewCartItem = new CartItem(
            id,
            existing_quantity,
            price,
            name,
            existing_sum_price,
            size,
            image,
            note,
            cat_id,
            variations_id,
          );
        } else {
          // update screen with not same size
          if (existing) {
            // console.log('not same size');
            existing_sum_price = existing.sum + sum;
            existing_quantity = existing.qty + prodQty;
            totalAmount =
              state.totalAmount - cartItem[addedProduct.old_var_id].sum + sum;
            delete cartItem[addedProduct.old_var_id];
            updatedOrNewCartItem = new CartItem(
              id,
              existing_quantity,
              price,
              name,
              existing_sum_price,
              size,
              image,
              note,
              cat_id,
              variations_id,
            );
          } else {
            // console.log('if item have two size and change to other size');
            totalAmount =
              state.totalAmount - cartItem[addedProduct.old_var_id].sum + sum;
            delete cartItem[addedProduct.old_var_id];
            updatedOrNewCartItem = new CartItem(
              id,
              prodQty,
              price,
              name,
              sum,
              size,
              image,
              note,
              cat_id,
              variations_id,
            );
          }
        }
      }

      return {
        ...state,
        cartItems: {
          ...cartItem,
          [variations_id]: updatedOrNewCartItem,
        },
        totalAmount: totalAmount,
      };
    // case typeCart.UPDATE_CART_ITEM:
    //   const { old_var_id, new_var_id } = action.cart;
    //   const oldCartItem = state.cartItems[old_var_id];
    //   const old_sum = oldCartItem.sum;
    //   let updateCartTotalAmount = state.totalAmount;
    //   const updateCartItemSelected = state.cartItems[new_var_id];
    //   let newCartItem = { ...state.cartItems };
    //   if (old_var_id !== new_var_id) {
    //     delete newCartItem[old_var_id];
    //     updateCartTotalAmount = state.totalAmount - old_sum;
    //   } else {
    //     updatedOrNewCartItem = new CartItem(
    //       id,
    //       existing_quantity,
    //       price,
    //       name,
    //       existing_sum_price,
    //       size,
    //       image,
    //       note,
    //       cat_id,
    //       variations_id,
    //     );
    //   }
    //   // console.log(newCartItem);
    //   // console.log(updateCartItemSelected);
    //   return {
    //     ...state,
    //     cartItems: {
    //       ...newCartItem,
    //     },
    //     totalAmount: updateCartTotalAmount,
    //   };
    case typeCart.ADD_EXTRA_OPTION:
      return {
        ...state,
        extraOption: action.payload,
      };
    case typeCart.CLEAR_CART:
      return {
        ...state,
        cartItems: {},
        totalAmount: 0,
      };

    case typeCart.REMOVE_FROM_CART:
      const selectedItems = state.cartItems[action.pid];
      const selected_item_price = selectedItems.sum;
      let oldCartItems;
      oldCartItems = {
        ...state.cartItems,
      };
      const willDelete = oldCartItems[action.pid];
      const checkRemoveExtraOption = state.extraOption.filter(
        d => d.product_id !== willDelete.id,
      );
      delete oldCartItems[action.pid];
      return {
        ...state,
        cartItems: oldCartItems,
        totalAmount: state.totalAmount - selected_item_price, // delete cart item then remove totalAmount by minus selected item sum price
        extraOption: checkRemoveExtraOption,
      };
    case typeCart.DECREMENT_CART_QUANTITY:
      // const selectedData = state.cartItems[action.pid];
      const selectedCartItem = state.cartItems[action.pid];
      const currentQty = selectedCartItem.qty;
      let updatedCartItems;
      if (currentQty > 1) {
        const updatedCartItem = new CartItem(
          selectedCartItem.id,
          selectedCartItem.qty - 1,
          selectedCartItem.price,
          selectedCartItem.name,
          selectedCartItem.sum - selectedCartItem.price,
          selectedCartItem.size,
          selectedCartItem.image,
          selectedCartItem.note,
          selectedCartItem.cat_id,
          selectedCartItem.variations_id,
        );
        updatedCartItems = {
          ...state.cartItems,
          [action.pid]: updatedCartItem,
        };
      } else {
        updatedCartItems = {
          ...state.cartItems,
        };
        delete selectedCartItem[action.pid];
      }
      return {
        ...state,
        cartItems: updatedCartItems,
        totalAmount:
          currentQty === 1
            ? state.totalAmount
            : state.totalAmount - selectedCartItem.price,
      };
    case typeCart.INCREMENT_CART_QUANTITY:
      const selectedCartItemData = state.cartItems[action.pid];
      let IncrementCartItems;
      const updatedCartItem = new CartItem(
        selectedCartItemData.id,
        selectedCartItemData.qty + 1,
        selectedCartItemData.price,
        selectedCartItemData.name,
        selectedCartItemData.sum + selectedCartItemData.price,
        selectedCartItemData.size,
        selectedCartItemData.image,
        selectedCartItemData.note,
        selectedCartItemData.cat_id,
        selectedCartItemData.variations_id,
      );
      IncrementCartItems = {
        ...state.cartItems,
        [action.pid]: updatedCartItem,
      };
      return {
        ...state,
        cartItems: IncrementCartItems,
        totalAmount: state.totalAmount + selectedCartItemData.price,
      };
    case typeOrders.SEND_ORDERS_SUCCESS:
      return initialState;
    // case typeAuth.LOGOUT:
    //   return initialState;
    default:
      return state;
  }
};

export default cartItems;
