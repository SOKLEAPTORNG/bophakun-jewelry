import React from 'react';
import {View, StyleSheet} from 'react-native';
import Text from '../UI/DefaultText';
import TouchableCmp from '../UI/TouchableCmp';
import {Colors} from '../../constant/index';
import {cardView} from '../../constant/index';
import {useTheme} from '@react-navigation/native';
import {useSelector} from 'react-redux';
import i18n from '../../../Translations/index';
import FontAwesome5Icon from 'react-native-vector-icons/FontAwesome5';
import {
  navigate,
  loadRef,
  _onLoading,
  _onLoadingFinish,
} from '../../navigation/RootNavigation';
const OrderItems = props => {
  const [status, setStatus] = React.useState(null);
  const orderItems = useSelector(state =>
    state.orders.order_items_detail.filter(d => d.id === props.id),
  );
  // const displayCartItem = orderItems
  const _orderStatus = React.useCallback(() => {
    const {status, suspend} = props;
    let orders_status;
    if (status === 'draft') {
      orders_status = i18n.t('order.Requesting');
    } else if (status === 'final' && suspend === 0) {
      orders_status = i18n.t('order.Completed');
    } else if (status === 'final' && suspend === 1) {
      orders_status = i18n.t('order.Confirmed');
    } else {
      orders_status = i18n.t('order.Cancelled');
    }
    setStatus(orders_status);
  }, [props]);
  React.useEffect(() => {
    _orderStatus();
  }, [_orderStatus]);
  const theme = useTheme();
  const {colors} = theme;
  return (
    <TouchableCmp onPress={props.onSelect}>
      <View
        style={{
          ...styles.container,
          marginVertical: 20,
          borderBottomWidth: 1,
          borderBottomColor: '#E8E8E8',
          paddingBottom: 30,
        }}>
        <View
          style={{
            ...styles.wrapper,
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
          }}>
          <Text style={{...styles.subText, top: -5}}>{props.dateTime}</Text>
          <Text style={{...styles.totalAmount, top: -5}}>
            $
            {props.totalAmount ? Number(props.totalAmount).toFixed(2) : '25.00'}
          </Text>
          {/* <Text style={{...styles.mainText}}>{status}</Text> */}
        </View>
        {/* <View
          style={{...styles.flex, paddingVertical: 5, paddingHorizontal: 13}}>
          <Text
            style={{
              fontFamily: 'Poppins-Semibold',
              fontSize: 16,
              color: Colors.text,
            }}>
            {orderItems.length} x{' '}
          </Text>
          {orderItems.slice(0, 1).map((d, index) => {
            return (
              <Text
                key={index}
                style={{
                  fontFamily: 'Poppins-Semibold',
                  fontSize: 16,
                  color: Colors.text,
                }}>
                {d.name}
              </Text>
            );
          })}
          <Text
            style={{
              fontFamily:
                Platform.OS === 'ios'
                  ? 'Akbalthom Freehand'
                  : 'AKbalthom Freehand [Version 1.50] 082014',
              fontSize: 16,
            }}>
            {props.name}
          </Text>
        </View> */}

        <View style={{...styles.orderDate}}>
          <Text
            style={{
              ...styles.subText,
              color: Colors.accent,
              fontFamily: 'Roboto-Regular',
              bottom: 5,
            }}>
            {props.orderNumber}
          </Text>

          {/* <TouchableCmp onPress={() => navigate('reOrderDetails')}>
            <View
              style={{
                backgroundColor: Colors.primary,
                paddingHorizontal: 20,
                height: 31,
                top: 10,
                alignItems: 'center',
                justifyContent: 'center',
                borderRadius: 8,
              }}>
              <Text
                style={{
                  ...styles.mainText,
                  color: Colors.secondary,
                  fontSize: 11,
                  fontFamily: 'Raleway-Semibold',
                }}>
                Select Items to Re-Order
              </Text>
            </View>
          </TouchableCmp> */}
        </View>
      </View>
    </TouchableCmp>
  );
};
export default React.memo(OrderItems);
export const styles = StyleSheet.create({
  container: cardView,
  wrapper: {},
  mainText: {
    fontFamily: 'Roboto-Medium',
    fontSize: 16,
    color: Colors.textLight,
  },
  flex: {
    flexDirection: 'row',
    // justifyContent: 'space-between',
    alignItems: 'center',
  },
  subText: {
    fontFamily: 'Roboto-Regular',
    fontSize: 15,
    color: Colors.accent,
  },
  orderDate: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  totalAmount: {
    fontFamily: 'Roboto-Regular',
    fontSize: 16,
    color: '#585151',
  },
});
