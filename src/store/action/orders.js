import moment from 'moment';
import CartOrder, {OrderType} from '../../models/order';
import CartItemsDetail from '../../models/cartOrderItems';
import OrderItems from '../../models/orderItems';
import {typeOrders, business_info, BASE_URL} from '../../constant/index';
import axios from 'axios';
export const sendOrderFailaure = message => {
  return {
    type: typeOrders.SEND_ORDERS_FAILURE,
    payload: message,
  };
};
/**
 *
 * @param {*} cartItems
 * @param {*} totalAmount
 * @param {*} pay_method
 * add order request
 * include cart items
 * total amount
 * payment method
 * order number
 */
export const addOrder = (
  cartItems,
  totalAmount,
  pay_method,
  order_number,
  orderType_id,
  additional_note,
  extraOptionStore,
  latitude,
  longitude,
  packing_charge,
) => {
  return async (dispatch, getState) => {
    const {pointExchange} = getState().auth.companyInfo[0];
    const {id, total_rp} = getState().auth.userInfo[0];
    const promotions = getState().promotion.available_promotions;
    // const extraOptions = getState().cart.extraOption;
    //extraOption
    const date = moment(new Date()).format('YYYY-MM-DD hh:mm:ss');
    let addeOrderCartItems = [];
    let total_discount = 0;
    let discount = 0;
    let discount_typex = '';
    let unit_price = 0;
    for (const key in cartItems) {
      const item = cartItems[key];
      const note = item.note;
      const cat_id = item.cat_id;
      const qty = item.quantity;
      const sum_item_price = item.sum;
      const item_price = item.productPrice;
      const checkPromo = promotions.findIndex(
        ({category_id}) => category_id === cat_id,
      );
      if (checkPromo > -1) {
        let discount_amount = promotions[checkPromo]['discount_amount'];
        let discount_type = promotions[checkPromo]['discount_type'];
        if (discount_type === 'fixed') {
          unit_price = sum_item_price - discount_amount;
        } else {
          total_discount = (sum_item_price * discount_amount) / 100;
          unit_price = sum_item_price - total_discount;
        }
        addeOrderCartItems.push(
          new OrderItems(
            item.productId,
            item.variations_id,
            qty,
            sum_item_price,
            unit_price,
            discount_type,
            discount_amount,
            item_price,
            note,
          ),
        );
      } else {
        // product no discount
        unit_price = sum_item_price;
        addeOrderCartItems.push(
          new OrderItems(
            item.productId,
            item.variations_id,
            qty,
            sum_item_price,
            unit_price,
            discount_typex,
            discount,
            item_price,
            note,
          ),
        );
      }
    }

    /**
     * it work only if payment method equal to point
     * calculate total point
     * calculate final total amount
     */
    let total_rp_redeemed = 0;
    let point_after_exchange = 0;
    let total_rp_redeemed_amount = 0;
    let final_total = totalAmount;
    if (pay_method === 'point') {
      point_after_exchange = 1 / pointExchange;
      total_rp_redeemed = totalAmount * point_after_exchange;
      total_rp_redeemed_amount = total_rp_redeemed / point_after_exchange;
      final_total = final_total - total_rp_redeemed_amount;
    }
    // /**
    //  * push data as order item after calculated to server
    //  */
    await axios
      .post(BASE_URL.CREATE_ORDERS, {
        business_id: business_info.business_id.toString(),
        status: 'draft',
        payment_status: 'paid',
        is_quotation: '0',
        transaction_date: date,
        total_before_tax: totalAmount,
        tax_amount: '0',
        rp_redeemed: total_rp_redeemed, // calculate point
        rp_redeemed_amount: total_rp_redeemed_amount, //after calculate point as amount
        shipping_charges: '0',
        round_off_amount: totalAmount,
        final_total: final_total,
        is_direct_sale: '0',
        is_suspend: '0',
        exchange_rate: '1',
        created_by: business_info.created_by.toString(),
        is_created_from_api: '0',
        essentials_duration: '0',
        essentials_amount_per_unit_duration: '0',
        rp_earned: '0',
        is_recurring: '0',
        created_at: date,
        updated_at: date,
        location_id: business_info.location_id.toString(),
        type: 'sell',
        contact_id: id,
        customer_group_id: '',
        invoice_no: order_number,
        ref_no: '',
        tax_id: '',
        discount_type: 'percentage',
        discount_amount: '0',
        additional_notes: additional_note,
        staff_note: '',
        commission_agent: '',
        shipping_details: '',
        shipping_address: '',
        shipping_status: '',
        delivered_to: '',
        latitude: latitude,
        longitude: longitude,
        selling_price_group_id: '0',
        pay_term_number: '',
        pay_term_type: '',
        recur_interval: '',
        recur_interval_type: 'days',
        subscription_repeat_on: '',
        subscription_no: '',
        recur_repetitions: '0',
        order_addresses: '',
        sub_type: '',
        types_of_service_id: orderType_id,
        packing_charge: packing_charge,
        packing_charge_type: '',
        service_custom_field_1: '',
        service_custom_field_2: '',
        service_custom_field_3: '',
        service_custom_field_4: '',
        import_batch: '',
        import_time: '',
        transaction_type: 'sell',
        pay_method: pay_method,
        cash_register_id: '1',
        products: addeOrderCartItems,
        extraOption: extraOptionStore,
      })
      .then(async () => {
        await dispatch(getOrderItems());
        await dispatch(getOrderDetail());
      })
      .catch(err => {
        dispatch(sendOrderFailaure(err));
      });
  };
};

/**
 *
 * @param {*} orderData
 */
export const fetchOrderItemSuccess = orderData => {
  return {
    type: typeOrders.FETCH_ORDERS_SUCCESS,
    payload: orderData,
  };
};
/**
 * fetching orders items successfull and error handle
 */
export const fetchOrderItemFailure = message => {
  return {
    type: typeOrders.SEND_ORDERS_FAILURE,
    payload: message,
  };
};
/**
 *
 */
export const getOrderItems = () => {
  return async (dispatch, getState) => {
    const userData = getState().auth.userInfo;
    const {id} = userData[0];
    await axios
      .get(`${BASE_URL.GET_ORDERS}${id}`)
      .then(response => {
        const data = response.data.data;
        const orderData = [];
        console.log('data', data);
        for (let i = 0; i < data.length; i++) {
          orderData.push(
            new CartOrder(
              data[i].id,
              data[i].status,
              data[i].total_before_tax,
              data[i].created_at,
              data[i].is_suspend,
              data[i].delivered_to,
              data[i].method,
              data[i].saving_points,
              data[i].service_type,
              data[i].invoice_no,
              data[i].final_total,
              data[i].invoice_note,
              data[i].packing_charge,
            ),
          );
        }
        dispatch(fetchOrderItemSuccess(orderData));
      })
      .catch(err => {
        dispatch(fetchOrderItemFailure(err.message));
      });
  };
};
/**
 *
 * @param {*} cart_id
 */
export const fetchOrdersItemDetailSuccess = payload => {
  return {
    type: typeOrders.FETCH_ORDERS_DETAIL_SUCCESS,
    payload: payload,
  };
};
export const fetchOrdersExtraOptionsSuccess = payload => {
  return {
    type: typeOrders.FETCH_EXTRAOPTION_SUCCESS,
    payload: payload,
  };
};
export const fetchOrderItemDetailFailure = message => {
  return {
    type: typeOrders.FETCH_ORDERS_DETAIL_FAILURE,
    payload: message,
  };
};
/**
 *
 * @param {*} cart_id
 * get orders item detail
 */
export const getOrderDetail = cart_id => {
  return async (dispatch, getState) => {
    const userData = getState().auth.userInfo;
    const {id} = userData[0];
    await axios
      .get(`${BASE_URL.GET_ORDERS_DETAIL}${id}`)
      .then(response => {
        const data = response.data.data;
        const extra_options = response.data.extra_options;
        let cartOrderItemsData = [];
        for (let i = 0; i < data.length; i++) {
          console.log('datax', data);
          cartOrderItemsData.push(
            new CartItemsDetail(
              data[i].transaction_id,
              data[i].name,
              data[i].price,
              data[i].quantity,
              data[i].sub_amount,
              data[i].discount_amount,
              data[i].discount_type,
              data[i].unit_price_before_discount,
              data[i].item_note,
              data[i].image,
            ),
          );
        }
        dispatch(fetchOrdersItemDetailSuccess(cartOrderItemsData));
        dispatch(fetchOrdersExtraOptionsSuccess(extra_options));
      })
      .catch(err => {
        dispatch(fetchOrderItemDetailFailure(err.message));
      });
  };
};
/**
 * GET Oreders type spacific on company id
 */
export const fetchOrderTypeSuccess = orderType => {
  return {
    type: typeOrders.FETCH_ORDERS_TYPE_SUCCESS,
    payload: orderType,
  };
};
export const fetchOrderTypeFailure = error => {
  return {
    type: typeOrders.FETCH_ORDERS_TYPE_FAILURE,
    payload: error,
  };
};
/**
 * get order item type
 */
export const getOrderType = () => {
  return async (dispatch, getState) => {
    const {id} = getState().auth.companyInfo[0];

    await axios
      .get(`${BASE_URL.GET_ORDERS_TYPE}${id}`)
      .then(res => {
        const data = res.data;
        let order_type_data = [];
        for (let i = 0; i < data.length; i++) {
          order_type_data.push(
            new OrderType(
              data[i].id,
              data[i].name,
              data[i].description,
              data[i].packing_charge_type,
              data[i].packing_charge,
            ),
          );
        }
        dispatch(fetchOrderTypeSuccess(order_type_data));
      })
      .catch(err => {
        dispatch(fetchOrderTypeFailure(err.message));
      });
  };
};
