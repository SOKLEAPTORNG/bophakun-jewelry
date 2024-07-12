import React, {useCallback, useEffect, useState, useRef} from 'react';
import {
  View,
  ScrollView,
  Platform,
  StyleSheet,
  AppState,
  Image,
} from 'react-native';
import {Colors as Color, PADDING_BOTTOM, icons} from '../../constant/index';
import {useSelector, useDispatch} from 'react-redux';
import Text from '../../components/UI/DefaultText';
import {HeaderBackIcon} from '../../components/UI/HeaderButton';
import moment from 'moment';
import {useTheme} from '@react-navigation/native';
import i18n from '../../../Translations/index';
import {goBack, navigate} from '../../navigation/RootNavigation';
import {typeOrders} from '../../constant/index';
import TouchableCmp from '../../components/UI/TouchableCmp';
import OrderItems from './items';
import * as Animated from 'react-native-animatable';
import {Colors} from 'react-native/Libraries/NewAppScreen';

const Index = props => {
  const [statusx, setStatus] = useState(null);
  const [image, setImage] = useState(icons.check);
  const [order_status, setOrder_status] = useState('');
  const [status_color, setStatus_color] = useState(Color.accent);
  const appState = useRef(AppState.currentState);
  const theme = useTheme();
  const {colors} = theme;
  const {transition_id, date, totalAmount, order_number, packing_charge} =
    props.route.params;
  const {check_out} = props.route.params.check_out ? props.route.params : {};
  const orderDate = moment(date).format('MMM Do YY, h:mm:ss');
  const dummydate = moment(new Date()).format('MMM Do YY, h:mm:ss');
  const orderDetailItems = useSelector(state =>
    state.orders.order_items_detail.filter(d => d.id === transition_id),
  );
  const extra_options_selected = useSelector(state =>
    state.orders.extra_options_selected.filter(
      d => d.transection_id == transition_id,
    ),
  );
  console.log('extra_options_selected');
  console.log(extra_options_selected);
  console.log(transition_id);
  const orders = useSelector(state =>
    state.orders.orders.filter(d => d.id === transition_id),
  );
  const cartItems = useSelector(state => {
    const transformedCartItems = [];
    for (const key in state.carts.cartItems) {
      const cart = state.carts.cartItems[key];
      transformedCartItems.push({
        productId: key,
        productTitle: cart.name,
        productPrice: cart.price,
        quantity: cart.qty,
        sum: cart.sum,
        size: cart.size,
        image: cart.image,
        cat_id: cart.cat_id,
        note: cart.note,
      });
    }
    return transformedCartItems.sort((a, b) =>
      a.productId > b.productId ? 1 : -1,
    );
  });
  const dispatch = useDispatch();
  useEffect(() => {
    if (check_out) return;
    let orders_status;
    const {is_suspend, status} = orders[0];
    if (status === 'draft') {
      orders_status = i18n.t('order.Requesting');
    } else if (status === 'final' && is_suspend === 0) {
      orders_status = i18n.t('order.Completed');
    } else if (status === 'final' && is_suspend === 1) {
      orders_status = i18n.t('order.Confirmed');
    } else {
      orders_status = i18n.t('order.Cancelled');
      setStatus_color('red');
      setImage(icons.un_check);
    }

    setStatus(orders_status);
    setOrder_status(status);
  }, [orders, check_out]);
  const _onPressBackHome = useCallback(() => {
    dispatch({
      type: typeOrders.SEND_ORDERS_SUCCESS,
    });
    navigate('Home');
  }, [dispatch]);
  useEffect(() => {
    props.navigation.setOptions({
      headerLeft: () => (
        <HeaderBackIcon
          onPress={check_out ? () => _onPressBackHome() : () => goBack()}
        />
      ),
    });
  }, [check_out, props.navigation, _onPressBackHome]);
  useEffect(() => {
    props.navigation.setOptions({
      headerRight: () => (
        <TouchableCmp>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              marginRight: 20,
            }}>
            <Image
              style={{
                width: 27,
                height: 27,
                resizeMode: 'contain',
              }}
              source={require('../../assets/refresh.png')}
            />
          </View>
        </TouchableCmp>
      ),
    });
  }, []);
  /**
   * check App current state or background state
   */
  // useEffect(() => {
  //   if (check_out) {
  //     AppState.addEventListener('change', _handleAppStateChange);

  //     return () => {
  //       AppState.removeEventListener('change', _handleAppStateChange);
  //     };
  //   }
  // }, []);

  // const _handleAppStateChange = (nextAppState) => {
  //   if (
  //     appState.current.match(/inactive|background/) &&
  //     nextAppState === 'active'
  //   ) {
  //     console.log('App has come to the foreground!');
  //   }
  //   dispatch({
  //     type: typeOrders.SEND_ORDERS_SUCCESS,
  //   });
  // };

  return (
    <>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={{...styles.container}}>
          <View
            style={{
              justifyContent: 'center',
              alignItems: 'center',
              shadowColor: '#000',
              shadowOffset: {
                width: 0,
                height: 2,
              },
              shadowOpacity: 0.25,
              shadowRadius: 3.84,

              elevation: 5,
            }}>
            {/* <Animated.Image
              animation="bounceIn"
              duraton="3000"
              source={image}
              style={{width: 100, height: 100}}
            /> */}
            {/* <Text
              style={{
                fontSize: 20,
                fontFamily: 'OpenSans-Bold',
              }}>
              {i18n.t('order.Thank You!!')}
            </Text> */}
          </View>
          <View style={{...styles.wrapper}}>
            <View
              style={{
                backgroundColor: Color.textLight,
                shadowColor: '#a1a1a1',
                borderRadius: 8,
                shadowOffset: {
                  width: 0,
                  height: 2,
                },
                shadowOpacity: 0.5,
                shadowRadius: 3.84,

                elevation: 10,

                paddingHorizontal: 20,
                paddingVertical: 10,
                marginBottom: 10,
              }}>
              <View style={styles.statusContainer}>
                <Text style={{...styles.titleStatus}}>
                  {i18n.t('order.Date & Time')}
                </Text>
                <Text>
                  {check_out ? (
                    <Text
                      style={{
                        ...styles.textStatus,
                        fontFamily: 'Roboto-Medium',
                      }}>
                      {dummydate}
                    </Text>
                  ) : (
                    <Text
                      style={{
                        ...styles.textStatus,
                        fontFamily: 'Roboto-Medium',
                      }}>
                      {orderDate}
                    </Text>
                  )}
                </Text>
              </View>
              <View
                style={{
                  ...styles.wrapper,
                }}>
                <View
                  style={{
                    ...styles.statusContainer,
                    paddingTop: 10,
                  }}>
                  <Text
                    style={{
                      ...styles.titleStatus,
                    }}>
                    {i18n.t('order.Your order status is')}
                  </Text>
                  <View style={{...styles.wrapper}}>
                    {check_out ? (
                      <Text style={{...styles.textStatus}}>
                        {i18n.t('orderdetail.Requesting')}
                      </Text>
                    ) : (
                      <Text style={{...styles.textStatus}}>{statusx}...</Text>
                    )}
                  </View>
                </View>
                <View
                  style={{
                    ...styles.statusContainer,
                  }}>
                  <Text style={{...styles.titleStatus}}>
                    {i18n.t('orderdetail.Order number')}
                  </Text>
                  <Text
                    style={{
                      ...styles.textStatus,
                      fontFamily: 'Roboto-Medium',
                    }}>
                    #{order_number}
                  </Text>
                </View>
              </View>
            </View>
            <View
              style={{
                ...styles.wrapper,
                marginTop: 20,
                paddingHorizontal: 15,
              }}>
              <Text
                style={{
                  fontSize: 16,
                  fontFamily: 'Roboto-Medium',

                  color: Color.text,
                }}>
                {i18n.t('order.Order Items Detail')}
              </Text>

              {!check_out && orders[0]['invoid_note'] && (
                <View
                  style={{
                    paddingTop: 10,
                    paddingBottom: 10,
                  }}>
                  <Text style={{color: '#000'}}>
                    Your Notice: {orders[0]['invoid_note']}
                  </Text>
                </View>
              )}
              {check_out
                ? cartItems.map(d => {
                    return (
                      <OrderItems
                        key={d.productId}
                        name={d.productTitle}
                        amount={d.sum}
                        quantity={d.quantity}
                        cat_id={d.cat_id}
                        extraOption={extra_options_selected}
                      />
                    );
                  })
                : orderDetailItems.map((d, index) => {
                    return (
                      <OrderItems
                        key={index}
                        name={d.name}
                        amount={d.sub_amount}
                        quantity={d.quantity}
                        note={d.item_note}
                        extraOption={extra_options_selected}
                      />
                    );
                  })}
            </View>
            <View
              style={{
                backgroundColor: Color.primary,
                borderRadius: 8,
                paddingVertical: 20,
                marginTop: 20,
                marginHorizontal: 10,
              }}>
              <View
                style={{
                  ...styles.flex,
                  paddingHorizontal: 16,
                }}>
                <Text
                  style={{
                    ...styles.textStatus,
                    color: '#fff',
                  }}>
                  {i18n.t('checkout.Delivery Fee is')}
                </Text>
                <Text
                  style={{
                    fontFamily: 'Roboto-Medium',
                    fontSize: 18,
                    color: '#fff',
                  }}>
                  ${Number(packing_charge).toFixed(2)}
                </Text>
              </View>
              <View
                style={{
                  ...styles.flex,
                  paddingHorizontal: 16,
                }}>
                <Text
                  style={{
                    ...styles.textStatus,
                    color: '#fff',
                  }}>
                  {i18n.t('order.Total')}
                </Text>
                <Text
                  style={{
                    fontFamily: 'Roboto-Medium',
                    fontSize: 18,
                    color: '#fff',
                  }}>
                  ${Number(totalAmount).toFixed(2)}
                </Text>
              </View>
            </View>
          </View>
        </View>
        <View style={{alignItems: 'center', marginTop: 60}}>
          <Text
            style={{
              fontFamily: 'Roboto-Medium',
              fontSize: 16,
              color: '#676767',
              width: '60%',
              textAlign: 'center',
            }}>
            {i18n.t(
              'orderdetail.Your Delivery is on the way Driver will contact you!',
            )}
          </Text>
        </View>
      </ScrollView>
    </>
  );
};

export default Index;
export const screenOptions = nav => {
  return {
    gestureResponseDistance: {vertical: 800},
    gestureEnabled: false,
    headerTitle: i18n.t('order.Orders Detail'),
  };
};
const styles = StyleSheet.create({
  itemContainter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 20,
  },
  container: {
    marginHorizontal: 13,
    marginTop: 20,
    borderRadius: 39,
    flex: 1,
  },
  wrapper: {
    // backgroundColor: '#282227',
  },
  subText: {
    fontSize: 14,
  },
  mainText: {
    fontFamily: 'Roboto-Medium',
  },
  flex: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  textStatus: {
    fontSize: 16,
    textTransform: 'capitalize',
    color: Color.primary,
    fontFamily: 'Roboto-Medium',
  },
  footer: {
    padding: 15,
    borderRadius: 0,
    paddingBottom: Platform.OS === 'ios' ? PADDING_BOTTOM : 10,
  },
  content: {
    backgroundColor: Color.accent,
    padding: 10,
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  textOrder: {
    color: '#fff',
    textTransform: 'capitalize',
    fontSize: 16,
    // paddingVertical: 15,
    fontFamily: 'Roboto-Medium',
  },
  statusContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  titleStatus: {
    fontFamily: 'Roboto-Medium',
    color: '#000',
    fontSize: 14,
  },
});
