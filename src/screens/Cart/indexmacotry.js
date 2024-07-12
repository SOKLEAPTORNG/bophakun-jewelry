import React, {useEffect, useCallback, useState} from 'react';
import {
  View,
  ScrollView,
  RefreshControl,
  StyleSheet,
  Image,
  StatusBar,
  Platform,
  Alert,
  ActivityIndicator,
} from 'react-native';
import HeaderButton from '../../components/UI/HeaderButton';
import {HeaderButtons, Item} from 'react-navigation-header-buttons';
import {
  STATUSBAR_HEIGHT,
  SCREEN_WIDTH,
  SCREEN_HEIGHT,
} from '../../constant/index';
import axios from 'axios';
import moment from 'moment';
import Promotion from '../../models/promotion';
import {BASE_URL} from '../../constant/index';
import AntDesign from 'react-native-vector-icons/AntDesign';
import SimpleLineIcons from 'react-native-vector-icons/SimpleLineIcons';
import TouchableCmp from '../../components/UI/TouchableCmp';
import {useSelector, useDispatch} from 'react-redux';
import CartItems from '../../components/Product/CartItems';
import Cards from '../../components/UI/Card';
import {PADDING_BOTTOM, Colors} from '../../constant/index';
import * as cartActions from '../../store/action/cart';
import i18n from '../../../Translations/index';
import CartCount from '../../components/Product/CartCount';
import Spiner from '../../components/UI/Spiner';
import ExtraTouchable from '../../components/UI/TouchableCmp';
import * as actionCart from '../../store/action/cart';
import {navigate, push} from '../../navigation/RootNavigation';
import Text from '../../components/UI/DefaultText';
import {useTheme} from '@react-navigation/native';
const CartScreen = props => {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = React.useState(false);
  const [totalAmount, setTotalAmount] = useState(0);
  const [outStockState, setOutStockState] = useState([]);
  const [discount_value_percentage, setDiscount_value_percentage] = useState(0);
  const [discount_value_fixed, setDiscount_value_fixed] = useState(0);
  const cartTotalAmount = useSelector(state => state.carts.totalAmount);
  // const promotions = useSelector(state => state.promotion.available_promotions); // original
  const promotionsFromStore = useSelector(
    state => state.promotion.available_promotions,
  ); // original
  const [promotions, setPromotions] = useState(promotionsFromStore);
  const isUser = useSelector(state => state.auth.userInfo);
  const dispatch = useDispatch();
  const {colors} = useTheme();
  const cartItem = useSelector(s => {
    return s.carts.cartItems;
  });
  const timer = () => setLoading(false);
  const cartList = () => {
    const transformedCartItems = [];
    for (const key in cartItem) {
      const cart = cartItem[key];
      transformedCartItems.push({
        productId: cart.id,
        productTitle: cart.name,
        productPrice: cart.price,
        quantity: cart.qty,
        sum: cart.sum,
        size: cart.size,
        image: cart.image,
        note: cart.note,
        cat_id: cart.cat_id,
        variations_id: cart.variations_id,
      });
    }
    setCartItems(
      transformedCartItems.sort((a, b) => (a.productId < b.productId ? 1 : -1)),
    );
    setTimeout(timer, 1000);
  };

  /**
   * calculate if have any promotions in cart items
   */
  const calculate = () => {
    let price_percentage = 0;
    let total_discount = 0;
    let arr_price = [];
    let new_arr_price = 0;
    let discount_percentage = 0;
    let discount_fixed = 0;
    if (promotions.length > 0) {
      for (let i = 0; i < cartItems.length; i++) {
        const cat_id = cartItems[i].cat_id;
        const qty = cartItems[i].quantity;
        const sum = cartItems[i].sum;
        promotions.map(promo => {
          const {discount_amount} = promo;
          if (promo.category_id === cat_id) {
            if (promo.discount_type === 'fixed') {
              total_discount = discount_amount * qty;
              discount_fixed = discount_amount;
              arr_price.push(total_discount);
            } else {
              total_discount = discount_amount / 100;
              price_percentage = sum * total_discount;
              arr_price.push(price_percentage);
              discount_percentage =
                Number.parseFloat(discount_amount).toFixed(2);
            }
          }
        });
      }

      new_arr_price = arr_price.reduce(
        (previousPrice, currentPrice, index) => previousPrice + currentPrice, // reduce sum price item as array data
        0,
      );
      const total_amount = cartTotalAmount - new_arr_price;
      setTotalAmount(total_amount);
      setTotalPrice(total_amount);
      setDiscount_value_percentage(discount_percentage);
      setDiscount_value_fixed(discount_fixed);
    } else {
      return;
    }
  };
  useEffect(() => {
    // console.log(cartItems);
    cartList();
    calculate();
  }, [cartTotalAmount]); //when cart total amount was trigger or change value will effect calculate functions | recalculate again
  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
    }, 1500);
  }, []);
  const handleCheckOut = async () => {
    if (isUser.length === 0) {
      Alert.alert(
        i18n.t('cart.Sign In Require'),
        i18n.t('cart.Please sign in before you can check out'),
        [
          {
            text: 'Cancel',
          },
          {
            text: 'Sign In',
            onPress: () => navigate('SignIn'),
          },
        ],
      );
    } else {
      //check price again + promotion + availibity
      setTimeout(() => {
        calculateTotal(true);
      }, 1000);
      // navigate('CheckOut', {
      //   totalAmount: totalAmount > 0 ? totalAmount : cartTotalAmount,
      //   discount_amount:
      //     discount_value_percentage > 0
      //       ? discount_value_percentage
      //       : discount_value_fixed,
      // });
    }
  };
  const handleNavigateDetail = (
    id,
    title,
    amount,
    size,
    qty,
    cat_id,
    variations_id,
  ) => {
    push('ProductDetail', {
      prod_id: id,
      headerTitle: title,
      cat_id: cat_id,
      variations_id: variations_id,
    });
  };
  const company_data = useSelector(state => state.auth.companyInfo[0]);
  const company_id = company_data.id;
  const [totalPrice, setTotalPrice] = useState(0);
  const calculateTotal = async (checkOut = false) => {
    alert(1);
    let totalAmountPay = 0;
    let arr_price_checked = [];
    let new_arr_price_checked = 0;
    const promoData = [];
    let discountPriceCheckedTotal = 0;
    //get promotion
    await axios
      .get(`${BASE_URL.GET_PROMOTIONS}${company_id}`)
      .then(response => {
        const {data} = response;
        for (const key in data) {
          if (key !== 'success') {
            const today = new Date();
            const current_date = moment(today).format('YYYY-MM-DD');
            const end_date = moment(data[key].ends_at).format('YYYY-MM-DD');
            if (end_date >= current_date) {
              promoData.push(
                new Promotion(
                  data[key].id,
                  data[key].name,
                  data[key].image,
                  data[key].created_at,
                  data[key].starts_at,
                  data[key].ends_at,
                  data[key].category_id,
                  data[key].is_active,
                  data[key].discount_amount,
                  data[key].discount_type,
                  data[key].description,
                ),
              );
            }
          }
        }
      });
    //set promotion after check real time
    setPromotions(promoData);
    let outStock = [];
    const transformedCartItems = [];
    let discount_fixed = 0;
    let discount_percentage = 0;
    for (let i = 0; i < cartItems.length; i++) {
      const cat_id = cartItems[i].cat_id;
      const productId = cartItems[i].productId;
      const variations_id = cartItems[i].variations_id;
      const cart = cartItems[i];
      //end promotion
      //check price and availability
      await axios
        .get(
          `${BASE_URL.GET_PRODUCT_AVAILABILITY}/${productId}/${variations_id}`,
        )
        .then(response => {
          const data = response.data;
          if (data.length > 0) {
            const {qty_available, price, name, productName, variation_id} =
              data[0];
            //set prepare array and set new item data
            console.log('price', price);
            transformedCartItems.push({
              productId: productId,
              productTitle: productName,
              productPrice: price,
              quantity: 1,
              sum: price,
              size: name,
              image: cart.image,
              note: cart.note,
              cat_id: cart.cat_id,
              variations_id: cart.variations_id,
            });
            console.log('transformedCartItems', transformedCartItems);
            // end send new item
            if (qty_available < 1) {
              outStock.push({
                productName: productName,
                variation_id: variation_id,
              });
            } else {
            }
            //check promotion and give discount
            const checkItemPromo = promoData.filter(
              d => d.category_id == cat_id,
            );

            if (checkItemPromo.length > 0) {
              const {discount_amount, discount_type} = checkItemPromo[0];
              if (discount_type == 'percentage') {
                const discountPriceChecked = (price * discount_amount) / 100;
                discountPriceCheckedTotal =
                  discountPriceCheckedTotal + discountPriceChecked;
                discount_fixed = discount_amount;
              } else {
                const discountPriceChecked = discount_amount;
                discountPriceCheckedTotal =
                  discountPriceCheckedTotal + discountPriceChecked;
                discount_percentage =
                  Number.parseFloat(discount_amount).toFixed(2);
              }
            }

            arr_price_checked.push(Number(price));
            totalAmountPay = Number(totalAmountPay) + Number(price);
          } else {
            console.log(id, 'Out Stock');
          }
        })
        .catch(e => {
          console.log(e);
        });
      // end check price
    }
    //set item to cart after check price
    if (transformedCartItems.length > 0) {
      console.log('assign new data to cartitem store');
      console.log(transformedCartItems);
      // ====loop add product to store======
      transformedCartItems.map(d => {
        dispatch(cartActions.removeFromCart(d.variations_id));
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
      console.log('setCartItems', setCartItems);
      setCartItems(
        transformedCartItems.sort((a, b) =>
          a.productId < b.productId ? 1 : -1,
        ),
      );
    }
    new_arr_price_checked = arr_price_checked.reduce(
      (previousPrice, currentPrice, index) => previousPrice + currentPrice, // reduce sum price item as array data
      0,
    );
    setTotalPrice(
      (new_arr_price_checked - discountPriceCheckedTotal).toFixed(2),
    );
    alert('total price');
    //check outstock
    setDiscount_value_percentage(discount_percentage);
    setDiscount_value_fixed(discount_fixed);
    setOutStockState(outStock);
    if (outStock.length > 0) {
      let NameOutStock = '';
      outStock.map(d => {
        NameOutStock = NameOutStock + d.productName + ',';
      });
      Alert.alert(
        NameOutStock +
          ' ' +
          i18n.t('cart.just out of stock, please confirm remove it!'),
        '',
        [
          {
            text: i18n.t('drawer.Cancel'),
            onPress: () => console.log('Canceled'),
          },
          {
            text: i18n.t('drawer.Ok'),
            onPress: () =>
              outStock.map(d => {
                setLoading(true),
                  onRemoveCartItems(d.variation_id),
                  setLoading(false);
              }),
          },
        ],
      );
    } else {
      if (checkOut == true) {
        // alert('go check out');
        navigate('CheckOut', {
          totalAmount: totalAmount > 0 ? totalAmount : cartTotalAmount,
          discount_amount:
            discount_value_percentage > 0
              ? discount_value_percentage
              : discount_value_fixed,
        });
      }
    }
  };
  // useEffect(() => {
  //   calculateTotal();
  // }, [loading]);
  // }, [loading]);
  const onDecrement = (id, qty) => {
    if (qty <= 1) {
      onRemoveCartItems(id);
    } else {
      dispatch(cartActions.decrementQuantity(id));
    }
  };
  const onRemoveCartItems = id => {
    Alert.alert(
      i18n.t('cart.Are you sure you want to delete this item'),
      '',
      [
        {
          text: i18n.t('cart.No'),
          onPress: () => console.log('Canceled'),
        },
        {
          text: i18n.t('cart.Yes'),
          onPress: () => {
            dispatch(cartActions.removeFromCart(id));
          },
        },
      ],
      {cancelable: false},
    );
  };
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
        backgroundColor: Colors.primary,
        height: Platform.OS === 'android' ? 75 : 120,
      },
      headerRight: () => (
        <>
          <HeaderButtons HeaderButtonComponent={HeaderButton}>
            <TouchableCmp onPress={() => navigate('Cart')}>
              <View
                style={{
                  marginRight: 20,
                }}>
                <Image
                  style={{
                    width: 24,
                    height: 24,
                    tintColor: Colors.secondary,
                    resizeMode: 'contain',
                  }}
                  source={require('../../assets/cart.png')}
                />
                <CartCount style={{top: -6, left: -4}} />
              </View>
            </TouchableCmp>
          </HeaderButtons>
        </>
      ),
    });
  }, [props]);

  if (loading) {
    return (
      <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
        <ActivityIndicator size="large" color={Colors.primary} />
      </View>
    );
  }

  if (cartItems.length === 0) {
    return (
      <View style={styles.center}>
        <StatusBar barStyle={'dark-content'} />
        <Image
          source={require('../../assets/eat.png')}
          style={{width: 150, height: 150}}
        />
        <Text style={{fontSize: 18, fontWeight: '700'}}>
          {/* {i18n.t('cart.Hungry')} */}
        </Text>
        <Text style={{fontWeight: '300', opacity: 0.5}}>
          {i18n.t('cart.No items in cart')}
        </Text>
      </View>
    );
  }
  return (
    <>
      <ScrollView
        style={{backgroundColor: '#fff'}}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }>
        <Spiner />
        <StatusBar barStyle={'dark-content'} />
        <View style={{padding: 20}}>
          <Text
            style={{
              fontSize: 16,
              fontFamily: 'Roboto-Bold',
              color: '#5D5D5D',
            }}>
            {i18n.t('cart.Your Bag List')}: {cartItems.length}
          </Text>
        </View>
        <View>
          {cartItems.map((d, index) => {
            return (
              <CartItems
                key={index}
                promotion={promotions}
                quantity={d.quantity}
                cat_id={d.cat_id}
                sub_amount={d.sum}
                totalAmount={cartTotalAmount}
                name={d.productTitle}
                image={d.image}
                size={d.size}
                navigation={() =>
                  handleNavigateDetail(
                    d.productId,
                    d.productTitle,
                    d.sum,
                    d.size,
                    d.quantity,
                    d.cat_id,
                    d.variations_id,
                  )
                }
                onDecrementQTY={() => onDecrement(d.variations_id, d.quantity)}
                onIncrementQTY={() => {
                  dispatch(cartActions.incrementQuantity(d.variations_id));
                }}
                onRemove={() => {
                  onRemoveCartItems(d.variations_id);
                }}
              />
            );
          })}
        </View>
      </ScrollView>
      <Cards
        style={{
          ...styles.footer,
          backgroundColor: Colors.background,
        }}>
        <View style={{alignItems: 'center', width: '100%'}}>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              borderRadius: 20,
            }}>
            <ExtraTouchable onPress={() => handleCheckOut()}>
              <View style={styles.content}>
                <Text style={styles.textCheckout}>
                  {i18n.t('cart.Check Out')} {' | '}
                </Text>
                <View>
                  <Text
                    style={{
                      fontSize: 20,
                      color: Colors.secondary,
                      fontFamily: 'Roboto-Bold',
                    }}>
                    {' '}
                    $
                    {Number.parseFloat(
                      // totalAmount > 0 ? totalAmount : cartTotalAmount,
                      totalPrice,
                    ).toFixed(2)}{' '}
                  </Text>
                </View>
              </View>
            </ExtraTouchable>
          </View>
        </View>
      </Cards>
    </>
  );
};

export const screenOptions = navData => {
  return {
    headerTitle: i18n.t('cart.Your Cart'),
  };
};
export default CartScreen;
const styles = StyleSheet.create({
  container: {
    margin: 5,
    paddingVertical: 10,
    borderRadius: 0,
  },
  screen: {
    margin: 20,
  },
  summary: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderRadius: 0,
    padding: 10,
  },
  summaryText: {
    fontFamily: 'Poppins-Regular',
    fontSize: 16,
    color: '#676767',
  },
  center: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
  modalHeader: {
    borderBottomWidth: 0.5,
    borderColor: '#ddd',
    height: 50,
    justifyContent: 'center',
    borderColor: Colors.background,
  },
  backIcon: {
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 20,
  },
  footer: {
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    paddingBottom: Platform.OS === 'ios' ? PADDING_BOTTOM : 10,
    shadowColor: '#a1a1a1',
  },
  content: {
    backgroundColor: Colors.primary,
    padding: 0,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: 60,
    width: SCREEN_WIDTH - 56,
    paddingHorizontal: 20,
    borderRadius: 100,
  },
  textCheckout: {
    color: Colors.secondary,
    textTransform: 'capitalize',
    fontSize: 20,
    fontFamily: 'Roboto-Bold',
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 20,
  },
});
