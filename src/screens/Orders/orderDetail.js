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
import Fontisto from 'react-native-vector-icons/Fontisto';
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
import CartCount from '../../components/Product/CartCount';
import * as Animated from 'react-native-animatable';
import {Colors} from 'react-native/Libraries/NewAppScreen';

const Index = props => {
  const [statusx, setStatus] = useState(null);
  const [image, setImage] = useState(icons.check);
  const [order_status, setOrder_status] = useState('');
  console.log('order_status', order_status);
  const [status_color, setStatus_color] = useState(Color.accent);
  const appState = useRef(AppState.currentState);
  const theme = useTheme();
  const {colors} = theme;
  const {transition_id, date, totalAmount, order_number, packing_charge} =
    props.route.params;
  const {check_out} = props.route.params.check_out ? props.route.params : {};
  console.log('check_out', check_out);
  const orderDate = moment(date).format('MMM D, YYYY, h:mm:ss');
  const dummydate = moment(new Date()).format('MMM D YY, h:mm:ss');
  const orderDetailItems = useSelector(state =>
    state.orders.order_items_detail.filter(d => d.id === transition_id),
  );
  console.log('orderDetailItems', orderDetailItems);
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
      headerStyle: {
        shadowOffset: {height: 0, width: 0},
        backgroundColor: Color.primary,
        height: Platform.OS === 'android' ? 75 : 120,
      },
      // headerRight: () => (
      //   <TouchableCmp onPress={() => navigate('Cart')}>
      //     <View
      //       style={{
      //         flexDirection: 'row',
      //         alignItems: 'center',
      //         marginRight: 20,
      //       }}>
      //       <Image
      //         style={{
      //           width: 24,
      //           height: 24,
      //           resizeMode: 'contain',
      //           tintColor: Color.secondary,
      //         }}
      //         source={require('../../assets/cart.png')}
      //       />
      //       <CartCount
      //         style={{
      //           left: -4,
      //           top: -6,
      //         }}
      //       />
      //     </View>
      //   </TouchableCmp>
      // ),
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
              alignItems: 'center',
              backgroundColor: '#fff',
              width: '100%',
              paddingBottom: 20,
            }}>
            <Text
              style={{
                fontFamily: 'Roboto-Bold',
                fontSize: 25,
                color: Color.secondary,
              }}>
              {i18n.t('order.Thank You!!')}
            </Text>
            <Text
              style={{
                fontFamily: 'Roboto-Regular',
                fontSize: 16,
                color: Color.secondary,
                marginTop: 6,
              }}>
              We're reviewing your orders!
            </Text>
          </View>
          <View
            style={{
              alignItems: 'center',
              justifyContent: 'center',
              paddingBottom: 10,
            }}></View>
          {/* <View
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
            <Animated.Image
              animation="bounceIn"
              duraton="3000"
              source={image}
              style={{width: 100, height: 100}}
            />
            <Text
              style={{
                fontSize: 20,
                fontFamily: 'OpenSans-Bold',
              }}>
              {i18n.t('order.Thank You!!')}
            </Text>
          </View> */}
          <View
            style={{
              ...styles.wrapper,
            }}>
            <View
              style={{
                marginHorizontal: 20,
                paddingVertical: 10,
                borderTopWidth: 1,
                borderTopColor: '#E3E3E3',
                marginBottom: 10,
                paddingTop: 20,
              }}>
              <View style={styles.statusContainer}>
                <Text
                  style={{
                    ...styles.titleStatus,
                    color: Color.secondary,
                  }}>
                  {i18n.t('order.Date & Time')}
                </Text>
                <Text>
                  {check_out ? (
                    <Text
                      style={{
                        ...styles.textStatus,
                        fontFamily: 'Roboto-Regular',
                        fontSize: 15,
                        color: Color.secondary,
                      }}>
                      {dummydate}
                    </Text>
                  ) : (
                    <Text
                      style={{
                        ...styles.textStatus,
                        fontFamily: 'Roboto-Regular',
                        color: Color.secondary,
                      }}>
                      {orderDate}
                    </Text>
                  )}
                </Text>
              </View>
              <View
                style={{
                  ...styles.wrapper,
                  borderBottomWidth: 1,
                  borderBottomColor: '#E3E3E3',
                }}>
                <View style={{}}>
                  <View
                    style={{
                      flexDirection: 'row',
                      paddingVertical: 10,
                      paddingTop: 20,
                      alignItems: 'center',
                    }}>
                    <Image
                      source={require('../../assets/checkbox-active.png')}
                      style={{width: 21, height: 21, resizeMode: 'contain'}}
                    />
                    <View style={{...styles.wrapper, paddingLeft: 10}}>
                      <Text style={{...styles.textStatus}}>
                        Your Order {statusx}
                      </Text>
                    </View>
                  </View>
                  {/* <View
                    style={{
                      flexDirection: 'row',
                      paddingVertical: 10,
                    }}>
                    <Image
                      source={require('../../assets/checkbox-passive.png')}
                      style={{width: 21, height: 21, resizeMode: 'contain'}}
                    />
                    <View
                      style={{
                        ...styles.wrapper,
                        paddingLeft: 10,
                      }}>
                      {check_out ? (
                        <Text style={{...styles.textStatus}}>
                          Your Orders Confirmed
                        </Text>
                      ) : (
                        <Text style={{...styles.textStatus}}>
                          Your Orders Confirmed
                        </Text>
                      )}
                    </View>
                  </View> */}
                  {/* <View
                    style={{
                      flexDirection: 'row',
                      paddingVertical: 10,
                      paddingBottom: 20,
                    }}>
                    <Image
                      source={require('../../assets/checkbox-passive.png')}
                      style={{width: 21, height: 21, resizeMode: 'contain'}}
                    />
                    <View style={{...styles.wrapper, paddingLeft: 10}}>
                      {check_out ? (
                        <Text style={{...styles.textStatus}}>
                          {i18n.t('orderdetail.Requesting')}
                        </Text>
                      ) : (
                        <Text style={{...styles.textStatus}}>Delivered</Text>
                      )}
                    </View>
                  </View> */}
                </View>
              </View>
            </View>
            <View
              style={{
                ...styles.wrapper,
                paddingBottom: 30,
              }}>
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginHorizontal: 20,
                }}>
                <Text
                  style={{
                    fontSize: 16,
                    fontFamily: 'Roboto-Bold',
                    color: Color.accent,
                  }}>
                  {i18n.t('order.Order Items Detail')}
                </Text>
                <Text
                  style={{
                    fontFamily: 'Roboto-Regular',
                    fontSize: 16,
                    color: Color.accent,
                  }}>
                  #{order_number}
                </Text>
              </View>

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
              <View
                style={{
                  flexDirection: 'row',
                  flexWrap: 'wrap',
                  marginTop: 20,
                  width: '100%',
                  alignItems: 'center',
                  borderBottomWidth: 1,
                  borderBottomColor: '#E3E3E3',
                  paddingBottom: 20,
                }}>
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
                          image={d.image}
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
                          image={d.image}
                          extraOption={extra_options_selected}
                        />
                      );
                    })}
              </View>
            </View>
            <View
              style={{
                ...styles.flex,
                paddingHorizontal: 16,
                marginTop: -10,
              }}>
              <Text style={{...styles.subText, color: '#585151'}}>
                {i18n.t('checkout.Delivery Fee is')}
              </Text>
              <Text
                style={{
                  fontFamily: 'Roboto-Regular',
                  fontSize: 14,
                  color: Color.accent,
                }}>
                ${Number(packing_charge).toFixed(2)}
              </Text>
            </View>
            <View
              style={{
                ...styles.flex,
                paddingHorizontal: 16,
                marginTop: 10,
              }}>
              <Text style={{...styles.subText, color: '#585151'}}>
                {i18n.t('order.Total')}
                {' (US)'}
              </Text>

              <View style={{alignItems: 'flex-end'}}>
                <Text
                  style={{
                    fontFamily: 'Roboto-Regular',
                    fontSize: 14,
                    color: Color.accent,
                  }}>
                  {/* <Text
                    style={{
                      ...styles.textStatus,
                      fontSize: 18,
                      color: '#848484',
                    }}>
                    {cartItems.length} Items total:
                  </Text> */}
                  {'   '}${Number(totalAmount).toFixed(2)}
                </Text>
              </View>
            </View>
          </View>
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
    marginTop: 20,
    flex: 1,
    paddingBottom: 50,
    backgroundColor: Color.background,
    borderBottomLeftRadius: 39,
    borderBottomRightRadius: 39,
  },
  wrapper: {},
  subText: {
    fontSize: 14,
  },
  mainText: {
    fontFamily: 'Roboto-Medium',
  },
  flex: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  textStatus: {
    fontSize: 16,
    textTransform: 'capitalize',
    color: Color.textGrey,
    fontFamily: 'Roboto-Regular',
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
    fontFamily: 'Roboto-Regular',
    color: '#000',
    fontSize: 15,
  },
});
