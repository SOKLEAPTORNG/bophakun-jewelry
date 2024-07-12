import React, {useState, useEffect, useCallback} from 'react';
import {View, StyleSheet} from 'react-native';
import Text from '../../components/UI/DefaultText';
import {useSelector} from 'react-redux';
import {Colors, SCREEN_WIDTH} from '../../constant';
const RenderItems = ({
  quantity,
  name,
  amount,
  cat_id,
  note,
  extraOption,
  order_number,
}) => {
  const [statex, setState] = useState({
    discount_value: 0,
    new_sub_amount: 0,
  });
  const {available_promotions} = useSelector(state => state.promotion);
  const promotions = available_promotions.filter(
    promo => promo.category_id === cat_id,
  );
  const totalAmount = useSelector(state => state.carts.totalAmount);
  const calulate_discount = useCallback(() => {
    if (promotions.length > 0) {
      promotions.map(d => {
        let total_sub_amount = 0;
        let discount;
        if (d.discount_type === 'fixed') {
          discount = d.discount_amount * quantity;
          total_sub_amount = totalAmount - discount;
        } else {
          discount = (amount * d.discount_amount) / 100;
        }
        total_sub_amount = amount - statex.discount_value; // calculate sum total amount
        setState({
          ...statex,
          discount_value: discount,
          new_sub_amount: total_sub_amount,
        });
      });
    }
  }, [amount, statex.new_sub_amount]); // accepted two dependencies for update initiastats
  /**
   *
   */
  useEffect(() => {
    calulate_discount();
  }, [calulate_discount]);
  return (
    <View style={{...styles.itemContainter}}>
      <View>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            width: SCREEN_WIDTH / 1,
            paddingHorizontal: 20
          }}>
          <Text style={{...styles.subText}} numberOfLines={1}>
            <Text numberOfLines={1} style={{...styles.subText}}>
              {Number(Math.round(quantity).toFixed(2) * 100) / 100} x
            </Text>{' '}
            {name}
          </Text>
          <View>
            {statex.discount_value > 0 ? (
              <Text
                style={{
                  ...styles.subText,
                  fontFamily: 'Roboto-Regular',
                  fontSize: 14,
                  color: Colors.secondary
                }}>
                ${Number(statex.new_sub_amount).toFixed(2)}
              </Text>
            ) : (
              <Text
                style={{
                  ...styles.subText,
                  fontFamily: 'Roboto-Regular',
                  color: Colors.secondary,
                  fontSize: 14,
                  
                }}>
                ${Number(amount).toFixed(2)}
              </Text>
            )}
          </View>
        </View>
        {note !== null && (
          <Text style={{fontSize: 12, paddingLeft: 5, opacity: 0.5}}>
            {note}
          </Text>
        )}
        {extraOption.length > 0 && (
          <Text style={{fontSize: 12, paddingLeft: 5, opacity: 0.5}}>
            (
            {extraOption.map(d => {
              return d.name + ', ';
            })}
            )
          </Text>
        )}
      </View>
    </View>
  );
};
const styles = StyleSheet.create({
  itemContainter: {
    justifyContent: 'space-between',
    paddingTop: 10,
  },
  container: {
    padding: 20,
    backgroundColor: '#fff',
    flex: 1,
  },
  wrapper: {
    paddingTop: 20,
  },
  subText: {
    fontSize: 14,
    fontFamily: 'Roboto-Regular',
    color: Colors.accent,
  },
  mainText: {
    fontFamily: 'Roboto-Medium',
  },
  flex: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: 10,
  },

  textOrder: {
    color: '#fff',
    textTransform: 'capitalize',
    fontSize: 16,
    // paddingVertical: 15,
    fontFamily: 'Roboto-Medium',
  },
});

export default RenderItems;
