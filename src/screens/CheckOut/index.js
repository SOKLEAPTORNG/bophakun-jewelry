import React, {useState, useEffect, Fragment, useCallback, useRef} from 'react';
import {
  View,
  ScrollView,
  Alert,
  ActivityIndicator,
  Image,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
} from 'react-native';
import {
  Colors as Color,
  cardView,
  business_info,
  SCREEN_WIDTH,
  SCREEN_HEIGHT,
} from '../../constant/index';
import axios from 'axios';
import {BASE_URL} from '../../constant/index';
import styles from './styles';
import OrderItems from '../../components/Product/OrderItems';
import {useSelector, useDispatch} from 'react-redux';
import Card from '../../components/UI/Card';
import * as authActions from '../../store/action/auth';
import * as actionOrders from '../../store/action/orders';
import {useTheme} from '@react-navigation/native';
import i18n from '../../../Translations/index';
import TouchableCmp from '../../components/UI/TouchableCmp';
import CartCount from '../../components/Product/CartCount';
import * as actionCart from '../../store/action/cart';
import * as cartActions from '../../store/action/cart';
import {
  navigation,
  _onLoading,
  _onLoadingFinish,
  onSheetOpen,
  onSheetClose,
  navigate,
} from '../../navigation/RootNavigation';
import Text from '../../components/UI/DefaultText';
import {guidGenerator} from '../../utils/index';
import EvilIcons from 'react-native-vector-icons/EvilIcons';
import Entypo from 'react-native-vector-icons/Entypo';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import {TextInput} from 'react-native-paper';
import Fontisto from 'react-native-vector-icons/Fontisto';
import BottomSheet from '../../components/UI/BottomSheet';
import {state} from 'react-native-push-notification/component';
import Modal from 'react-native-modal';
import getDistance from 'geolib/es/getDistance';
import Geolocation from '@react-native-community/geolocation';
import {Colors} from '../../constant/index';
const payOptions = [
  {
    id: 1,
    title: i18n.t('checkout.Point'),
    value: 'point',
  },
  {
    id: 2,
    title: i18n.t('checkout.Cash'),
    value: 'cash',
  },
];
const orderOptions = [
  {
    id: 1,
    title: 'Pick up at shop',
    value: 'Pick up at shop',
  },
  {
    id: 2,
    title: 'Delivery',
    value: 'Delivery',
  },
  {
    id: 3,
    title: 'Dine In',
    value: 'Dine In',
  },
];
const Index = props => {
  const [visible, setVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [rp_amount, set_rp_amount] = useState(0);
  const [status, setStatus] = useState(i18n.t('checkout.Cash'));
  const [visibleModal, setVisbleModal] = useState(null);
  const [orderType_id, setOrderType_id] = useState(null);
  const [group_discountx, setGroup_discout] = useState(0);
  const [isCheck_order, setIsCheck_order] = useState(true);
  const [selectedOptions, setSelectedOptions] = useState('');
  const [payment_status, setPayment_status] = useState('cash');
  const [grand_totalAmount, setGrand_TotalAmount] = useState(0);
  const [discount_percentage, setDiscount_percentage] = useState(0);
  const [order_type_status, setOrder_type_status] = useState(
    i18n.t('checkout.Select'),
  );
  const [visibleBottomSheet, setVisibalBottomSheet] = useState(false);
  const [grand_totalAmount_Riel, setGrand_TotalAmount_Riel] = useState(0);
  const [initState, setInitState] = useState({
    additional_note: '',
  });
  const [distance, setDistance] = useState(0);
  const [latitudeState, setLatitude] = useState(0);
  const [longitudeState, setLongitude] = useState(0);
  const [deliveryFee, setDeliveryFee] = useState(0);
  const {total_rp} = useSelector(state =>
    !state.auth.userInfo.length ? {} : state.auth.userInfo[0],
  );
  const {
    pointExchange,
    exchange_riel,
    latitude,
    longitude,
    area_zone_free_delivery,
    over_zone_limit,
    over_zone_charge,
    operation_hour,
    open_hour,
    close_hour,
  } = useSelector(state =>
    !state.auth.companyInfo.length ? {} : state.auth.companyInfo[0],
  );
  const contact = useSelector(state => state.auth.userInfo);
  const {email, name, mobile} = contact[0];
  const {totalAmount, discount_amount} = props.route.params;
  const order_number = `${business_info.order_number}-${guidGenerator()}`;
  // const sheetRef = useRef(null);
  // const [id, totalAmount, date] = orders[0];
  // const cartTotalAmount = useSelector(state => state.carts.totalAmount);
  const cartTotalAmount = useSelector(state => state.carts.totalAmount);
  const {group_discount} = useSelector(state =>
    !state.auth.customer_group.length ? {} : state.auth.customer_group[0],
  );
  const {available_promotions} = useSelector(state => state.promotion);
  const orderTypes = useSelector(state => state.orders.order_type);
  const extraOptionStore = useSelector(state => state.carts.extraOption);
  const [cartItems, setCartItems] = useState([]);
  const cartItem = useSelector(s => {
    return s.carts.cartItems;
  });
  // const cartItems = useSelector(state => {
  //   console.log('cartItemsx', state.carts.cartItems);
  //   const transformedCartItems = [];
  //   for (const key in state.carts.cartItems) {
  //     const cart = state.carts.cartItems[key];
  //     transformedCartItems.push({
  //       image: cart.image,
  //       productId: cart.id,
  //       productTitle: cart.name,
  //       productPrice: cart.price,
  //       quantity: cart.qty,
  //       sum: cart.sum,
  //       cat_id: cart.cat_id,
  //       note: cart.note,
  //       variations_id: cart.variations_id,
  //     });
  //   }
  //   return transformedCartItems.sort((a, b) =>
  //     a.productId > b.productId ? 1 : -1,
  //   );
  // });

  //add for double check before check out final
  const timer = () => setLoading(false);
  const cartList = async (recheck = false) => {
    const transformedCartItems = [];
    let outStock = [];

    for (const key in cartItem) {
      const cart = cartItem[key];
      //get realtime price
      await axios
        .get(
          `${BASE_URL.GET_PRODUCT_AVAILABILITY}/${cart.id}/${cart.variations_id}`,
        )
        .then(response => {
          const data = response.data;
          const {qty_available, price, name, productName, variation_id} =
            data[0];
          transformedCartItems.push({
            productId: cart.id,
            productTitle: cart.name,
            productPrice: data[0].price,
            quantity: cart.qty,
            sum: data[0].price,
            size: cart.size,
            image: cart.image,
            note: cart.note,
            cat_id: cart.cat_id,
            variations_id: cart.variations_id,
          });
          if (qty_available < 1) {
            outStock.push({
              productName: productName,
              variation_id: variation_id,
            });
            // console.log('outStock', outStock);
          } else {
          }
        });
      //end get price
    }
    //check outstock
    if (outStock.length > 0) {
      //back to checkout
      let NameOutStock = '';
      outStock.map(d => {
        NameOutStock = NameOutStock + d.productName + ',';
      });

      Alert.alert(
        NameOutStock +
          ' ' +
          i18n.t(
            'cart.just out of stock, please back to check out and re-submit!',
          ),
        '',
        [
          {
            text: i18n.t('drawer.Cancel'),
            onPress: () => console.log('Canceled'),
          },
          {
            text: i18n.t('drawer.Ok'),
            onPress: () => props.navigation.navigate('Cart'),
          },
        ],
      );
    }
    //end check outstock
    if (transformedCartItems.length > 0) {
      if (recheck == true && outStock.length == 0) {
        // ====loop add product to store======
        dispatch(cartActions.clearCart());
        transformedCartItems.map(d => {
          // dispatch(cartActions.removeFromCart(d.variations_id));
          dispatch(
            actionCart.addToCart(
              d.productId,
              1,
              d.sum,
              d.size,
              d.productTitle,
              d.image,
              d.note,
              d.cat_id,
              d.variations_id,
              d.variations_id,
              false,
            ),
          );
        });
        // ====end loop add product to store======
        //final check out
        const {additional_note} = initState;
        await dispatch(
          actionOrders.addOrder(
            transformedCartItems,
            grand_totalAmount,
            // totalAmount, maco changed to gtrand total amount
            payment_status,
            order_number,
            orderType_id,
            additional_note,
            extraOptionStore,
            latitudeState,
            longitudeState,
            deliveryFee,
          ),
        );
        setTimeout(() => {
          _onLoadingFinish();
          onNavigateCheckOutCompleteHandler();
        }, 1000);
        //end final check out
      }
      setCartItems(
        transformedCartItems.sort((a, b) =>
          a.productId < b.productId ? 1 : -1,
        ),
      );
    }
    setTimeout(timer, 1000);
  };
  useEffect(() => {
    // console.log(cartItems);
    cartList();
  }, []); //when cart total amount was trigger or change value will effect calculate functions | recalculate again
  //end check befor final
  const onEditProfileHandler = () => {
    return navigation.navigate('EditProfile');
  };
  const theme = useTheme();
  const dispatch = useDispatch();
  const fetchOrderTypes = useCallback(async () => {
    try {
      await dispatch(actionOrders.getOrderType());
    } catch (e) {
      console.log(e);
    }
  }, [dispatch]);
  getCurrentLocation = () => {
    try {
      Geolocation.getCurrentPosition(info => {
        const coords = info.coords;
        // if(coords.latitude == )
        setLatitude(coords.latitude);
        setLongitude(coords.longitude);
        const distance = getDistance(
          {latitude: latitude, longitude: longitude},
          {latitude: coords.latitude, longitude: coords.longitude},
        );
        // const distance = getDistance(
        //   {latitude: latitude, longitude: longitude},
        //   {latitude: 13.44850662405535, longitude: 103.72938263942824},
        // );
        // console.log('distance',distance / 1000) 13.44850662405535, 103.72938263942824
        setDistance(distance / 1000);
        const distancex = distance / 1000;
        if (distancex == 0) {
          Alert.alert(
            i18n.t('cart.Sorry'),
            i18n.t('checkout.location warning'),
          );
        }
      });
    } catch (error) {
      console.log('error', error);
    }
    // Geolocation.requestAuthorization();
  };

  useEffect(() => {
    setLoading(true);
    fetchOrderTypes().then(() => {
      setLoading(false);
      setTimeout(() => {}, 1000);
    });
  }, [dispatch, fetchOrderTypes]);

  useEffect(() => {
    const unsubcribe = props.navigation.addListener('focus', fetchOrderTypes);
    return () => {
      unsubcribe();
    };
  }, [fetchOrderTypes, props.navigation]);
  const _sendOrderHandler = async () => {
    _onLoading();
    const {additional_note} = initState;
    try {
      if (
        (order_type_status == 'Delivery' && distance > over_zone_limit) ||
        (order_type_status == 'delivery' && distance > over_zone_limit)
      ) {
        Alert.alert(
          i18n.t('checkout.Information'),
          i18n.t('checkout.Over zoon limit'),
        );
        _onLoadingFinish();
      } else if (
        (order_type_status == 'Delivery' && distance == 0) ||
        (order_type_status == 'delivery' && distance == 0)
      ) {
        Alert.alert(i18n.t('cart.Sorry'), i18n.t('checkout.location warning'));
        if (Platform.OS === 'ios') {
          Geolocation.requestAuthorization();
        }
        _onLoadingFinish();
      } else {
        if (email === null || mobile === null) {
          Alert.alert(
            i18n.t('checkout.Information'),
            i18n.t(
              'checkout.Please complete your contact information before check out',
            ),
            [
              {
                text: i18n.t('checkout.Cancel'),
                onPress: () => console.log('Canceled'),
              },
              {
                text: i18n.t('checkout.Ok'),
                onPress: () => onEditProfileHandler(),
              },
            ],
          );
          _onLoadingFinish();
        } else if (isCheck_order) {
          setVisbleModal(1);
          _onLoadingFinish();
        } else {
          // alert('recheck before finish order');
          _onLoadingFinish();
          cartList(true);
          // await dispatch(
          //   actionOrders.addOrder(
          //     cartItems,
          //     grand_totalAmount,
          //     // totalAmount, maco changed to gtrand total amount
          //     payment_status,
          //     order_number,
          //     orderType_id,
          //     additional_note,
          //     extraOptionStore,
          //     latitudeState,
          //     longitudeState,
          //     deliveryFee,
          //   ),
          // );
          // setTimeout(() => {
          //   _onLoadingFinish();
          //   onNavigateCheckOutCompleteHandler();
          // }, 1000);
        }
      }
    } catch (err) {
      _onLoadingFinish();
      console.log(err);
    }
  };
  const onNavigateCheckOutCompleteHandler = () => {
    navigation.navigate('OrderDetail', {
      check_out: true,
      totalAmount: grand_totalAmount,
      packing_charge: deliveryFee,
      // totalAmount: totalAmount,
      order_number: order_number,
    });
  };

  // useEffect(() => {
  //   const order = orderTypes[0];
  //   setOrderType_id(order.id);
  // }, []);
  useEffect(() => {
    const calulatePrice = async () => {
      let total_us = 0;
      let total_riel = 0;
      let discount_by_group;
      let discount_by_promo = Number.parseFloat(discount_amount).toFixed(2);
      //get discount group
      await dispatch(authActions.getUserInfo(contact[0].uid));
      //end get discount group
      if (group_discount < 0) {
        discount_by_group = Number.parseFloat(group_discount * -1).toFixed(2); // if group discount less that 0 then slice first - of number
      } else {
        discount_by_group = group_discount;
      }
      setGroup_discout(discount_by_group);
      if (discount_by_group >= discount_by_promo) {
        const discount = (cartTotalAmount * group_discount) / 100;
        if (!!discount.length) {
          // note this will work when discount value less than 0
          total_us = cartTotalAmount - discount;
          total_riel = total_us * exchange_riel;
        } else {
          total_us = cartTotalAmount + discount;
          total_riel = total_us * exchange_riel;
        }
        setGrand_TotalAmount(total_us);
        setGrand_TotalAmount_Riel(total_riel);
        setDiscount_percentage(group_discount);
      } else {
        total_riel = totalAmount * exchange_riel;
        setGrand_TotalAmount(totalAmount);
        setGrand_TotalAmount_Riel(total_riel);
        setDiscount_percentage(discount_amount);
      }
    };
    return calulatePrice();
  }, [cartTotalAmount, group_discount]);
  /**
   * on change text additional notes
   */
  const handleChaneText = value => {
    setInitState({
      ...state,
      additional_note: value,
    });
  };
  /**
   * calculate existing points
   */
  const calculatePoint = () => {
    let total_amount = 0;
    let point_after_exchange = 0;
    point_after_exchange = 1 / pointExchange;
    total_amount = total_rp / point_after_exchange;
    set_rp_amount(total_amount);
  };
  useEffect(() => {
    const calculatePoint = () => {
      let total_amount = 0;
      let point_after_exchange = 0;
      point_after_exchange = 1 / pointExchange;
      total_amount = total_rp / point_after_exchange;
      set_rp_amount(total_amount);
      // console.log(total_amount);
    };
    return calculatePoint;
  }, [calculatePoint]);
  /**
   * on select payment options
   */
  const onSelectPayment = ({title, value}) => {
    if (value === 'point') {
      if (rp_amount >= totalAmount) {
        setPayment_status(value);
        setStatus(title);
        onSheetClose();
        setVisibalBottomSheet(false);
      } else {
        Alert.alert(
          i18n.t('cart.Sorry'),
          i18n.t('cart.Your Points is not enough, Please pay by cash'),
        );
      }
    } else {
      setPayment_status(value);
      setStatus(title);
      onSheetClose();
      setVisibalBottomSheet(false);
    }
  };
  const onSelectOrderType = value => {
    setOrder_type_status(value.name);
    setOrderType_id(value.id);
  };
  const calculateDeliveryFee = () => {
    //calculate delivery fee
    // setDeliveryFee
    if (
      (order_type_status == 'Delivery' && distance <= over_zone_limit) ||
      (order_type_status == 'delivery' && distance <= over_zone_limit)
    ) {
      if (distance > area_zone_free_delivery) {
        const over_free_zoon = distance - area_zone_free_delivery;
        let deliveryFee = over_free_zoon * over_zone_charge;

        setDeliveryFee(deliveryFee.toFixed(0));
        const deliveryFeeInRiel = deliveryFee * exchange_riel;
        setGrand_TotalAmount(grand_totalAmount + deliveryFee);
        setGrand_TotalAmount_Riel(grand_totalAmount_Riel + deliveryFeeInRiel);
      } else {
        const deliveryFeeInRiel = deliveryFee * exchange_riel;
        setDeliveryFee(0);
        setGrand_TotalAmount(grand_totalAmount - deliveryFee);
        setGrand_TotalAmount_Riel(grand_totalAmount_Riel - deliveryFeeInRiel);
      }
    } else {
      const deliveryFeeInRiel = deliveryFee * exchange_riel;
      setDeliveryFee(0);
      setGrand_TotalAmount(grand_totalAmount - deliveryFee);
      setGrand_TotalAmount_Riel(grand_totalAmount_Riel - deliveryFeeInRiel);
    }
  };

  const handleApply = () => {
    orderTypes.map(d => {
      if (d.name === order_type_status) {
        setOrderType_id(d.id);
        // xxxxx
        if (
          order_type_status == 'Delivery' ||
          order_type_status == 'delivery'
        ) {
          getCurrentLocation();
        }
        calculateDeliveryFee();
      }
    });
    setIsCheck_order(false);
    setVisbleModal(null);
  };
  const onVisibleBottomSheet = () => {
    setVisibalBottomSheet(true);
    onSheetOpen();
  };
  const onPressCloseBottomSheet = () => {
    setVisible(!visible);
    onSheetClose();
    setVisibalBottomSheet(false);
  };
  // useEffect(() => {
  //   return handleApply();
  // }, [orderTypes]);
  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener(
      'keyboardDidShow',
      () => {
        setVisibalBottomSheet(false); // or some other action
      },
    );
    const keyboardDidHideListener = Keyboard.addListener(
      'keyboardDidHide',
      () => {
        setVisibalBottomSheet(false); // or some other action
      },
    );

    return () => {
      keyboardDidHideListener.remove();
      keyboardDidShowListener.remove();
    };
  }, []);
  useEffect(() => {
    props.navigation.setOptions({
      headerTitle: (
        <View>
          <Image
            style={{
              width: 80,
              height: 40,
              resizeMode: 'contain',
            }}
            source={require('../../assets/logo.png')}
          />
        </View>
      ),
      headerStyle: {
        shadowOffset: {height: 0, width: 0},
        backgroundColor: Colors.background,
        height: Platform.OS === 'android' ? 75 : 120,
        borderBottomWidth: 1,
      },
      headerRight: () => (
        <TouchableCmp onPress={() => setVisbleModal(1)}>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              marginRight: 20,
            }}>
            <Text
              style={{
                fontFamily: 'Roboto-Regular',
                marginRight: 6,
                color: '#5D5D5D',
              }}>
              {order_type_status}
            </Text>
            <Image
              style={{
                width: 14,
                height: 14,
                resizeMode: 'contain',
                tintColor: Colors.secondary,
              }}
              source={require('../../assets/chevron-down.png')}
            />
          </View>
        </TouchableCmp>
      ),
    });
  }, [order_type_status]);
  const keyboardVerticalOffset =
    Platform.OS === 'ios' && SCREEN_HEIGHT > 820
      ? 84
      : Platform.OS === 'ios'
      ? 54
      : 0;
  const renderBottomSheet = () => (
    <BottomSheet>
      {payOptions
        .sort((a, b) => b.id - a.id)
        .map(d => (
          <TouchableCmp onPress={() => onSelectPayment(d)} key={d.id}>
            <View style={styles.sheetView}>
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  paddingVertical: 10,
                }}>
                <Image
                  source={
                    d.title === i18n.t('checkout.Cash')
                      ? require('../../assets/cash.png')
                      : require('../../assets/cash_pay_icon.png')
                  }
                  style={{width: 40, height: 40, resizeMode: 'contain'}}
                />
                <View>
                  <Text
                    style={{
                      paddingLeft: 10,
                      fontFamily: 'OpenSans-Bold',
                    }}>
                    {d.title}
                  </Text>
                  {d.value === 'cash' ? (
                    <Text
                      style={{
                        paddingLeft: 10,
                      }}>
                      Give cash to our cashier
                    </Text>
                  ) : (
                    <Text
                      style={{
                        paddingLeft: 10,
                      }}>
                      Your points must be available
                    </Text>
                  )}
                </View>
              </View>
              <Fontisto
                name={
                  d.value === payment_status
                    ? 'radio-btn-active'
                    : 'radio-btn-passive'
                }
                size={18}
                color={d.value === payment_status ? Color.secondary : '#B9B9B9'}
              />
            </View>
          </TouchableCmp>
        ))}
    </BottomSheet>
  );

  const renderButton = () => (
    <Card
      style={{
        ...styles.footer,
        backgroundColor: theme.dark ? '#333' : '#fff',
        zIndex: 1,
      }}>
      {new Date().getHours() > close_hour.slice(0, 2) ||
      new Date().getHours() < open_hour.slice(0, 2) ? (
        <View
          style={{
            ...styles.content,
            backgroundColor: Color.primary,
          }}>
          <Text style={styles.textOrder}>{i18n.t('checkout.Over Time')}</Text>
        </View>
      ) : (
        <TouchableCmp onPress={_sendOrderHandler}>
          <View
            style={{
              ...styles.content,
              backgroundColor: Color.primary,
              paddingBottom: Platform.OS === 'android' ? 6 : 0,
            }}>
            <Text style={styles.textOrder}>
              {i18n.t('checkout.Continue to order')}
            </Text>
          </View>
        </TouchableCmp>
      )}
    </Card>
  );
  const renderModalContent = () => {
    return (
      <View
        style={{
          // ...cardView,
          borderRadius: 16,
          margin: 0,
          paddingVertical: 20,
          paddingHorizontal: 10,
          backgroundColor: '#fff',
        }}>
        <View
          style={{
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: 30,
          }}>
          <Text
            style={{
              fontFamily: 'Roboto-Regular',
              fontSize: 14,
              color: Colors.text,
            }}>
            {i18n.t('checkout.Please select order type')}
          </Text>
        </View>
        {orderTypes.map((d, index) => {
          return (
            <TouchableCmp key={index} onPress={() => onSelectOrderType(d)}>
              <View
                style={{
                  padding: 10,
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  backgroundColor: Color.background,
                  marginVertical: 5,
                  borderRadius: 5,
                  borderWidth: 1,
                  borderColor: '#E8E8E8',
                }}>
                <Text
                  style={{
                    fontFamily: 'Roboto-Regular',
                    color: Colors.darkGrey,
                    fontSize: 14,
                  }}>
                  {d.name}
                </Text>
                <Fontisto
                  name={
                    order_type_status === d.name
                      ? 'radio-btn-active'
                      : 'radio-btn-passive'
                  }
                  size={18}
                  color={
                    order_type_status === d.name ? Colors.secondary : '#B9B9B9'
                  }
                />
              </View>
            </TouchableCmp>
          );
        })}
        <View
          style={{
            alignItems: 'center',
            justifyContent: 'center',
            // paddingVertical: 10,
          }}>
          <TouchableCmp onPress={handleApply}>
            <View
              style={{
                padding: 10,
                justifyContent: 'center',
                borderRadius: 10,
              }}>
              <Text
                style={{
                  fontFamily: 'Roboto-Bold',
                  color: Color.text,
                }}>
                {i18n.t('setting.Apply')}
              </Text>
            </View>
          </TouchableCmp>
        </View>
      </View>
    );
  };
  if (loading) {
    return (
      <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
        <ActivityIndicator color={Color.primary} size="large" />
      </View>
    );
  }
  return (
    <Fragment>
      <ScrollView showsVerticalScrollIndicator={false} style={{paddingTop: 20}}>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'position' : 'padding'}
          keyboardVerticalOffset={keyboardVerticalOffset}
          style={{
            flex: 1,
            borderTopLeftRadius: 30,
            borderTopRightRadius: 30,
            paddingBottom: 40,
          }}
          backgroundColor={'#fff'}>
          <TouchableWithoutFeedback onPress={onPressCloseBottomSheet}>
            <View
              style={{
                backgroundColor: theme.dark ? '#000' : '#fff',
                marginBottom: Platform.OS === 'android' ? 40 : 0,
              }}>
              <View style={{}}>
                <View style={{}}>
                  <View
                    style={{
                      marginTop: 10,
                      marginHorizontal: 20,
                      paddingBottom: 10,
                      borderBottomColor: '#E3E3E3',
                      borderBottomWidth: 1,
                      paddingBottom: 20,
                    }}>
                    <Text
                      style={{
                        ...styles.mainText,
                        // color: textColors,
                      }}>
                      {i18n.t('checkout.Your order items')}
                    </Text>
                    {cartItems.map(d => {
                      return (
                        <OrderItems
                          key={d.productId}
                          name={d.productTitle}
                          sub_amount={Number(d.sum)}
                          quantity={d.quantity}
                          available_promotion={available_promotions}
                          cat_id={d.cat_id}
                          image={d.image}
                        />
                      );
                    })}
                  </View>
                  <View
                    style={{
                      marginHorizontal: 20,
                    }}>
                    <View
                      style={{
                        paddingTop: 16,
                        marginBottom: 10,
                      }}>
                      <Text
                        style={{
                          ...styles.mainText,
                          marginBottom: 10,
                        }}>
                        {i18n.t('checkout.contact info')}
                      </Text>
                      <View style={{...styles.discount}}>
                        <Text style={{...styles.subText}}>
                          {i18n.t('checkout.Name')}
                        </Text>
                        <Text
                          style={{
                            ...styles.subTextdetails,
                            textTransform: 'capitalize',
                          }}>
                          {name}
                        </Text>
                      </View>
                      <View style={styles.discount}>
                        <Text style={{...styles.subText}}>
                          {i18n.t('checkout.Email')}
                        </Text>
                        <Text
                          style={{
                            ...styles.subTextdetails,
                            textTransform: 'lowercase',
                          }}>
                          {email}
                        </Text>
                      </View>
                      <View style={styles.discount}>
                        <Text
                          style={{
                            ...styles.subText,
                          }}>
                          {i18n.t('checkout.Phone')}
                        </Text>
                        <Text
                          style={{
                            ...styles.subTextOdetails,
                          }}>
                          {mobile}
                        </Text>
                      </View>
                    </View>
                  </View>
                </View>
                <View
                  style={{
                    ...styles.contact_info,
                  }}>
                  <View style={{...styles.summary}}>
                    {group_discount < 0 && (
                      <View style={styles.discount}>
                        <Text style={{...styles.subText}}>
                          {i18n.t('checkout.Discount')}
                        </Text>
                        <Text style={{...styles.subText}}>
                          {discount_percentage} %
                        </Text>
                      </View>
                    )}
                    <View
                      style={{
                        borderBottomWidth: 1,
                        borderColor: '#E3E3E3',
                        paddingBottom: 10,
                      }}>
                      <View style={styles.grandTotal}>
                        <Text style={{...styles.subText}}>
                          {i18n.t('checkout.Delivery Fee is')}
                          <Text
                            style={{textTransform: 'uppercase', color: '#000'}}>
                            {' '}
                          </Text>
                        </Text>
                        <Text
                          style={{
                            ...styles.subText,
                            fontFamily: 'HomepageBaukasten-Book',
                            color: Colors.accent,
                            textTransform: 'uppercase',
                          }}>
                          ${Number.parseFloat(deliveryFee).toFixed(2)}
                        </Text>
                      </View>
                      <View style={styles.grandTotal}>
                        <Text style={{...styles.subText}}>
                          {i18n.t('checkout.Grand total')}
                          <Text
                            style={{
                              textTransform: 'uppercase',
                              color: '#000',
                            }}></Text>
                        </Text>
                        <View style={{alignItems: 'flex-end'}}>
                          <Text
                            style={{
                              ...styles.subText,
                              textTransform: 'uppercase',
                              color: Colors.accent,
                            }}>
                            ${Number.parseFloat(grand_totalAmount).toFixed(2)}
                          </Text>
                        </View>
                      </View>
                    </View>
                    <View
                      style={{
                        ...styles.payment,
                        backgroundColor: theme.dark ? '#0000' : '#fff',
                        paddingVertical: 10,
                        borderTopColor: '#e2e2e2',
                        marginTop: 10,
                      }}>
                      <View>
                        <Text style={{...styles.mainText}}>
                          {i18n.t('checkout.Payment method')}
                        </Text>
                      </View>
                      <View
                        style={{
                          flexDirection: 'row',
                          alignItems: 'flex-end',
                          justifyContent: 'space-between',
                          marginTop: 10,
                        }}>
                        <Text
                          style={{
                            ...styles.subText,
                            color: Colors.secondary,
                            fontSize: 14,
                          }}>
                          {status}
                        </Text>
                        <TouchableCmp onPress={onVisibleBottomSheet}>
                          <View style={{...styles.payment_method}}>
                            <View
                              style={{
                                flexDirection: 'row',
                                alignItems: 'flex-end',
                              }}>
                              <Text
                                style={{
                                  color: '#585151',
                                  fontFamily: 'Roboto-Bold',
                                  fontSize: 14,
                                }}>
                                ${' '}
                                {Number.parseFloat(grand_totalAmount).toFixed(
                                  2,
                                )}
                              </Text>
                              <Entypo
                                name="chevron-down"
                                size={20}
                                color={Color.secondary}
                                style={{paddingLeft: 5}}
                              />
                            </View>
                          </View>
                        </TouchableCmp>
                      </View>
                    </View>
                  </View>
                </View>

                <View
                  style={{
                    backgroundColor: Colors.primary,
                    padding: 10,
                    marginHorizontal: 20,
                    marginVertical: 10,
                    marginBottom: 20,
                    alignContent: 'center',
                    borderRadius: 17,
                  }}>
                  <Text
                    style={{
                      ...styles.policyTxt,
                      fontFamily: 'Raleway-Bold',
                    }}>
                    {i18n.t('checkout.Delivery Information')}:
                  </Text>
                  {order_type_status == 'Delivery' ||
                  order_type_status == 'delivery' ? (
                    <Text
                      style={{
                        ...styles.policyTxt,
                        marginTop: 10,
                      }}>
                      - {i18n.t('checkout.You are about')} {distance} KM{' '}
                      {i18n.t('checkout.from our Shop')}.
                    </Text>
                  ) : (
                    <Text></Text>
                  )}

                  <Text
                    style={{
                      ...styles.policyTxt,
                      fontFamily: 'Raleway-Bold',
                      marginVertical: 10,
                    }}>
                    {i18n.t('checkout.Our Policy')}:
                  </Text>
                  <Text
                    style={{
                      ...styles.policyTxt,
                    }}>
                    - {i18n.t('checkout.Free Delivery')}{' '}
                    {area_zone_free_delivery} KM{' '}
                    {i18n.t('checkout.from our Shop')}.
                  </Text>
                  {/* {over_zone_limit > area_zone_free_delivery ? ( */}
                  <View>
                    <Text
                      style={{
                        ...styles.policyTxt,
                      }}>
                      - {i18n.t('checkout.If your location over')}{' '}
                      {area_zone_free_delivery} KM{' '}
                      {i18n.t('checkout.but lower than')} {over_zone_limit} KM,{' '}
                      {i18n.t('checkout.Delivery Fee is')} {over_zone_charge} $
                      / KM.
                    </Text>
                    <Text
                      style={{
                        ...styles.policyTxt,
                      }}>
                      - {i18n.t('checkout.Maximum limit zoon is')}{' '}
                      {over_zone_limit} KM.
                    </Text>
                  </View>

                  <Text
                    style={{
                      ...styles.policyTxt,
                    }}>
                    - {i18n.t('checkout.The waiting hours is')} {operation_hour}{' '}
                    {i18n.t('checkout.Minuts')}.
                  </Text>
                  <Text
                    style={{
                      ...styles.policyTxt,
                    }}>
                    - {i18n.t('checkout.Working hour from')} {open_hour} -{' '}
                    {close_hour}.
                  </Text>
                </View>
                <View style={{paddingHorizontal: 20}}>
                  <TextInput
                    // mode="outlined"
                    style={styles.inputContainerStyle}
                    borderRadius={10}
                    borderWidth={0}
                    outlineColor="#E3E3E3"
                    mode="flat"
                    underlineColor={'transparent'}
                    label="Special Instruction"
                    placeholder="Special Instruction"
                    multiline
                    theme={{
                      colors: {
                        primary: Colors.text,
                        background: '#fff',
                        underlineColor: 'transparent',
                      },
                    }}
                    onChangeText={value => handleChaneText(value)}
                  />
                </View>
              </View>
            </View>
          </TouchableWithoutFeedback>
        </KeyboardAvoidingView>
      </ScrollView>
      <Modal
        isVisible={visibleModal === 1}
        animationIn={'fadeInUp'}
        animationOut={'fadeOutDown'}>
        {renderModalContent()}
      </Modal>
      {Platform.OS === 'android'
        ? visibleBottomSheet === false && renderButton()
        : renderButton()}
      {renderBottomSheet()}
    </Fragment>
  );
};

export default Index;
export const screenOptions = nav => {
  return {
    headerTitle: i18n.t('checkout.Check Out'),
  };
};
