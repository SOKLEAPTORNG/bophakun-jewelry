import React, {Fragment, useState, useEffect, useCallback} from 'react';
import {View, StyleSheet} from 'react-native';
import Text from '../UI/DefaultText';
import PropTypes from 'prop-types';
import {useSelector} from 'react-redux';
import {Colors} from '../../constant';
import {SCREEN_WIDTH} from '../../constant';
import {colors} from 'react-native-elements';
const propTypes = {
  name: PropTypes.string.isRequired,
  quantity: PropTypes.number.isRequired,
  sub_amount: PropTypes.number.isRequired,
  available_promotion: PropTypes.array,
  cat_id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  totalAmount: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
};

const OrderItem = ({
  name,
  quantity,
  sub_amount,
  available_promotion,
  cat_id,
}) => {
  const cartTotalAmount = useSelector(state => state.carts.totalAmount);
  const [initailState, setInitailState] = useState({
    discount_value: 0,
    new_sub_amount: 0,
  });
  const promotions = available_promotion.filter(d => d.category_id === cat_id);
  /**
   * first render calculate item price
   */

  const calulate_discount = useCallback(() => {
    if (promotions.length > 0) {
      promotions.map(d => {
        let total_sub_amount = 0;
        let discount;
        if (d.discount_type === 'fixed') {
          discount = d.discount_amount * quantity;
          total_sub_amount = cartTotalAmount - discount;
        } else {
          discount = (sub_amount * d.discount_amount) / 100;
        }
        total_sub_amount = sub_amount - initailState.discount_value; // calculate sum total amount
        setInitailState({
          ...initailState,
          discount_value: discount,
          new_sub_amount: total_sub_amount,
        });
      });
    }
  }, [sub_amount, initailState.new_sub_amount]); // accepted two dependencies for update initiastats
  useEffect(() => {
    calulate_discount();
  }, [calulate_discount]);
  return (
    <Fragment>
      <View style={styles.cartItem}>
        <View style={styles.wrapButtonSumary}>
          <View style={styles.wrapperx}>
            <Text style={{...styles.quantity}}> {quantity} x </Text>
          </View>
          <View style={styles.itemData}>
            <Text
              style={{
                ...styles.mainText,
              }}
              numberOfLines={1}>
              {name}
            </Text>
          </View>
        </View>
        <View style={styles.itemData}>
          {initailState.discount_value > 0 ? (
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
              <Text
                style={{
                  ...styles.numText,
                  fontFamily: 'Roboto-Regular',
                  textDecorationLine: 'line-through',
                  opacity: 0.4,
                }}>
                {Number.parseFloat(sub_amount).toFixed(2)}$
              </Text>
              <Text style={{...styles.numText, paddingLeft: 5}}>
                {Number.parseFloat(initailState.new_sub_amount).toFixed(2)}$
              </Text>
            </View>
          ) : (
            <Text style={{...styles.numText, }}>
              ${Number.parseFloat(sub_amount).toFixed(2)}
            </Text>
          )}
        </View>
      </View>
    </Fragment>
  );
};
OrderItem.propTypes = propTypes;
export default OrderItem;

const styles = StyleSheet.create({
  cartItem: {
    marginTop: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    flex: 1,
  },
  itemData: {
    alignItems: 'center',
  },
  wrapButtonSumary: {
    flexDirection: 'row',
    borderColor: '#dddd',
  },
  wrapperx: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  quantity: {
    color: Colors.accent,
    fontSize: 14,
    paddingRight: 3,
    fontFamily: 'Roboto-Regular',
  },
  mainText: {
    fontSize: 14,
    color: Colors.accent,
    fontFamily: 'Roboto-Regular',
  },
  numText: {
    fontFamily: 'Roboto-Regular',
    fontSize: 14,
    color: Colors.secondary,
  },
  deleteButton: {
    marginLeft: 10,
  },
  rightAction: {
    backgroundColor: 'red',
    justifyContent: 'center',
    alignItems: 'center',
  },
  wrapper: {
    paddingHorizontal: 20,
    alignItems: 'center',
    flexDirection: 'row',
  },
});
