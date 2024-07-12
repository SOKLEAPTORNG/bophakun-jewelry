import React, {useEffect, useState, useCallback, Fragment} from 'react';
import {
  View,
  StyleSheet,
  Dimensions,
  ScrollView,
  Platform,
  KeyboardAvoidingView,
  ActivityIndicator,
  Alert,
  TouchableOpacity,
  StatusBar,
} from 'react-native';
import Text from '../../components/UI/DefaultText';
import HeaderButton from '../../components/UI/HeaderButton';
import ProductSlider from '../../components/Promotions/ProductSlide';
import Promotion from '../../models/promotion';
import Fontisto from 'react-native-vector-icons/Fontisto';
import {HeaderButtons, Item} from 'react-navigation-header-buttons';
import {goBack} from '../../navigation/RootNavigation';
import {ButtonPopup} from '../../components/UI/ButtonPopup';
import HTMLView from 'react-native-htmlview';
import moment from 'moment';
import {business_info} from '../../constant/index';
import {
  Colors,
  PADDING_BOTTOM,
  SCREEN_HEIGHT,
  SCREEN_WIDTH,
  IMAGE_PATH,
} from '../../constant/index';
import {useSelector, useDispatch} from 'react-redux';
import Animated from 'react-native-reanimated';
import Card from '../../components/UI/Card';
import {useTheme} from '@react-navigation/native';
import * as actionCart from '../../store/action/cart';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import AntDesign from 'react-native-vector-icons/AntDesign';
import {TextInput, Snackbar} from 'react-native-paper';
import i18n from '../../../Translations/index';
import {
  navigate,
  _onLoading,
  _onLoadingFinish,
} from '../../navigation/RootNavigation';
import TouchableCmp from '../../components/UI/TouchableCmp';
import {Image} from 'react-native-elements';
import * as actionProduct from '../../store/action/product';
import axios from 'axios';
import {BASE_URL} from '../../constant/index';
import PriceItems from '../../components/Product/itemsPrice';
import * as actionPromotions from '../../store/action/promotion';
import CartCount from '../../components/Product/CartCount';
import {ColorSpace} from 'react-native-redash';
import {TouchableWithoutFeedback} from 'react-native-gesture-handler';
import {SafeAreaView} from 'react-native-safe-area-context';
const {height: wHeight, width: wWidth} = Dimensions.get('window');

export const HEADER_IMAGE_HEIGHT = wHeight / 3;
const ProductDetailOverviewScreen = props => {
  const [isLoading, setIsLoading] = useState(false);
  const [visible, setVisible] = useState(false);
  const [itemSize, setItemSize] = useState(null);
  const [stockStatus, setStockStatus] = useState('');
  const [availableQty, setAvailableQty] = useState(0);
  const [itemPrice, setItemPrice] = useState(0);
  const [itemPriceSelected, setItemPriceSelected] = useState(0);
  const [itemExtraPrice, setItemExtraPrice] = useState(0);
  const [itemQty, setItemsQty] = useState(1);
  const [variat_id, setVariat_id] = useState(null);
  const [qtySolds, setQtySolds] = useState([]);

  const [qtyAvailables, setQtyAvailables] = useState([]);
  const [statex, setState] = useState({
    quantity: 1,
    selectedSize: null,
    selectedPrice: 0,
    isScrollOverLimit: false,
    _productOpacity: new Animated.Value(0),
    arrPrice: [],
    price: 0,
    note: null,
    cartId: 0,
    showAlert: '',
    prodPrice: [],
    prodGallery: [],
  });

  const [discountState, setDiscountState] = useState({
    discount: 0,
    type: '',
    discount_price: 0,
  });
  const getSoldAndAvailble = async () => {
    //api check
    const url = `${BASE_URL.GET_PRODUCT_SOLD_AVAILABILITY}${business_info.business_id}`;
    await axios
      .get(
        `${BASE_URL.GET_PRODUCT_SOLD_AVAILABILITY}${business_info.business_id}`,
      )
      .then(response => {
        const data = response.data;
        setQtyAvailables(data.qty_availables);

        setQtySolds(data.qty_solds);
      })
      .catch(e => {
        setIsLoading(false);
        console.log(e);
      });
  };
  useEffect(() => {
    getSoldAndAvailble();
  }, []);
  const params = props.route.params;
  const prod_id = params.prod_id;
  const cat_id = params.cat_id;
  const theme = useTheme();
  const {colors} = useTheme();
  let qtySoldItemResult = 0;
  if (qtySolds.length > 0) {
    const qtySoldItem = qtySolds.filter(m => m.product_id == prod_id);
    if (qtySoldItem.length > 0) {
      qtySoldItemResult = qtySoldItem[0].qty_sold;
    }
  }
  //check if already in cart
  const cartItem = useSelector(s => {
    return s.carts.cartItems;
  });
  const [cartItems, setCartItems] = useState([]);
  const [itemExisting, setitemExisting] = useState(false);
  const cartList = variation_id => {
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
    if (transformedCartItems.length > 0) {
      const checkIfExisted = transformedCartItems.filter(
        d => d.variations_id == variation_id,
      );
      console.log('transformedCartItems', transformedCartItems);
      console.log('checkIfExisted', checkIfExisted);
      if (checkIfExisted.length > 0) {
        setitemExisting(true);
      }
    } else {
      console.log('not in cart yet');
    }
  };
  console.log('cartItem', cartItem);
  console.log('variat_id', variat_id);
  console.log('prod_id', prod_id);

  //end check if already in cart
  const extraOptionStore = useSelector(state => state.carts.extraOption);

  let extraOptionStorePro = [];
  if (extraOptionStore.length > 0) {
    extraOptionStorePro = extraOptionStore.filter(
      d => d.product_id === prod_id,
    );
  }
  const [extraOption, setExtraOption] = useState(extraOptionStorePro);
  const {ProductExtraOption, ProductExtraGroup} = useSelector(
    state => state.product,
  );
  const isUser = useSelector(state => state.auth.userInfo);
  /**
   * select array of product from reducer state
   * filter by product id that we get from route params
   */
  const data = useSelector(state =>
    state.product.products.filter(d => d.id === prod_id),
  );
  const ProductFeature = () => (
    <View {...styles.imageContainer}>
      <Image
        source={{
          uri:
            image !== null
              ? `${IMAGE_PATH}/uploads/img/${image}`
              : `${IMAGE_PATH}/img/default.png`,
        }}
        style={styles.image}
        PlaceholderContent={<ActivityIndicator size="large" color="#000" />}
      />
    </View>
  );

  /**
   * select existing cart items from reducer state
   * select by product id
   */
  const existingCartItems = useSelector(
    state => state.carts.cartItems[params.variations_id],
  );
  /**
   * select all available promotions
   */
  const promotionsx = useSelector(state =>
    cat_id > 0 || cat_id !== undefined
      ? state.promotion.available_promotions.filter(
          d => d.category_id === cat_id,
        )
      : [],
  );
  const [promotions, setpromotions] = useState(
    useSelector(state =>
      cat_id > 0 || cat_id !== undefined
        ? state.promotion.available_promotions.filter(
            d => d.category_id === cat_id,
          )
        : [],
    ),
  );
  const company_data = useSelector(state => state.auth.companyInfo[0]);
  const company_id = company_data.id;
  /**
   * distructure array of item data
   */
  const {image, name, id, price, isFavorite, description} = data[0];

  const dispatch = useDispatch();

  const handleChaneText = value => {
    setState({
      ...statex,
      note: value,
    });
  };
  /**
   * fetching items price by specific productd id
   */
  const fetchProductPrice = useCallback(async () => {
    await axios
      .get(`${BASE_URL.GET_PRODUCT_PRICE}${id}`)
      .then(response => {
        const datax = response.data.products;
        if (datax.length > 0) {
          checkAvailability(prod_id, datax[0].variations_id, true);
        }
        setState({
          ...statex,
          prodPrice: datax,
          prodGallery: response.data.galleries,
        });
      })
      .then(() => setPromtion())
      .catch(e => {
        setIsLoading(false);
        console.log(e);
      });
  }, []);

  const checkAvailability = async (id, variations_id, isDefault = false) => {
    //api check
    await axios
      .get(`${BASE_URL.GET_PRODUCT_AVAILABILITY}/${id}/${variations_id}`)
      .then(response => {
        const data = response.data;
        if (data.length > 0) {
          const {qty_available, price, name} = data[0];
          setAvailableQty(qty_available);
          setItemPrice(parseFloat(price) + parseFloat(itemExtraPrice));
          if (qty_available > 0) {
            setStockStatus('In Stock');
            //select default optoin
            if (isDefault == true) {
              // console.log('set default');
              handleSelectOption(price, name, variations_id, 1);
            } else {
              // console.log('not check');
            }
          } else {
            setStockStatus('Out Stock');
            setitemExisting(true);
          }
        } else {
          setStockStatus('Out Stock');
          setitemExisting(true);
        }
      })
      .catch(e => {
        setIsLoading(false);
        console.log(e);
      });
    //call func cartlist
    cartList(variations_id);
  };
  /**
   * check if items having promotions
   */
  let popupRef = React.createRef();

  const onShowPopup = () => {
    popupRef.show();
  };

  const onClosePopup = () => {
    popupRef.close();
  };
  const checkButton = () => {
    if (cat_id == 1152) {
      return (
        <View>
          <TouchableWithoutFeedback onPress={onShowPopup}>
            <View style={{...styles.addToCartContainer}}>
              <Text style={{...styles.maiText, color: '#fff'}}>Book Now</Text>
            </View>
          </TouchableWithoutFeedback>
          <ButtonPopup
            call="Call: 012 XXX XXX"
            messenger="Messenger"
            ref={target => (popupRef = target)}
            onTouchOutside={onClosePopup}
          />
        </View>
      );
    } else {
      return (
        <TouchableCmp onPress={() => handleAddToCart()}>
          <View>
            <Text style={{...styles.maiText, color: 'white', fontSize: 16}}>
              {i18n.t('productdetail.Add to cart')}
            </Text>
          </View>
        </TouchableCmp>
      );
    }
  };
  const setPromtion = useCallback(async () => {
    let getPromotionRealTime = [];
    await axios
      .get(`${BASE_URL.GET_PROMOTIONS}${company_id}`)
      .then(response => {
        const {data} = response;
        const promoData = [];
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
        setpromotions(promoData.filter(d => d.category_id === cat_id));
        getPromotionRealTime = promoData.filter(d => d.category_id === cat_id);
      });

    if (getPromotionRealTime.length > 0) {
      getPromotionRealTime.map(d => {
        let new_price;
        if (d.discount_type === 'fixed') {
          new_price = d.discount_amount;
        } else {
          new_price = (price * d.discount_amount) / 100;
        }
        setDiscountState({
          ...discountState,
          discount: d.discount_amount,
          type: d.discount_type,
          discount_price: new_price,
        });
      });
    } else {
      // console.log('else if not promotion', price);
      setDiscountState({
        ...discountState,
        discount_price: 0,
      });
    }
    return;
  }, []);
  // const serviceState = useCallback(() => {
  //   cat_id = params.cat_id;
  //   return;
  // }, []);
  /**
   * on Press select price options
   */

  const handleSelectOption = async (
    pricex,
    size,
    variations_id,
    qty_available,
  ) => {
    await dispatch(actionPromotions.getPromotion());
    setPromtion();
    checkAvailability(prod_id, variations_id); //Variat_id
    // setItemPrice(parseFloat(pricex) + parseFloat(itemExtraPrice));
    setItemSize(size);
    setVariat_id(variations_id);
  };

  useEffect(() => {
    setIsLoading(true);
    fetchProductPrice().then(() => {
      setIsLoading(false);
    });
  }, [fetchProductPrice]);
  /**
   * handle add items to cart passing by parameter
   */
  const handleAddToCart = async () => {
    try {
      if (itemPrice === 0 && !itemSize) {
        Alert.alert(
          i18n.t('productdetail.Please Select Option'),
          i18n.t('productdetail.Option price must be select one required'),
        );
      } else {
        setitemExisting(true);
        const old_var_id = params.variations_id
          ? params.variations_id
          : variat_id;
        const isUpdate = existingCartItems ? 1 : 0;
        setTimeout(() => {
          dispatch(
            actionCart.addToCart(
              id,
              itemQty,
              itemPrice,
              itemSize,
              name,
              image,
              statex.note,
              cat_id,
              variat_id,
              old_var_id,
              isUpdate,
            ),
          );
          onToggleSnackBar();
        }, 500);
      }
    } catch (e) {
      console.log(e.message);
    }
  };
  /**
   * decrease cart items quantity
   */
  const decreaseQty = () => {
    if (existingCartItems) {
      // dispatch(actionCart.decrementQuantity(id));
      if (itemQty !== 1) {
        setItemsQty(itemQty - 1);
      }
    } else {
      if (itemQty !== 1) {
        setItemsQty(itemQty - 1);
      }
    }
  };
  /**
   * increase cart items quantity
   */
  const IncreaseQty = () => {
    if (existingCartItems) {
      // dispatch(actionCart.incrementQuantity(id));
      setItemsQty(itemQty + 1);
    }
    if (itemQty < 99) {
      setItemsQty(itemQty + 1);
    } else {
      Alert.alert(
        'Warnning!!',
        i18n.t(
          "productdetail.Sorry you can't Increase quantity greater than 99",
        ),
      );
    }
  };
  /**
   * on toggle add items to favorite
   */
  const _onToggleFavorite = async () => {
    try {
      if (isUser.length > 0) {
        _onLoading();
        await dispatch(actionProduct.toggleAddFavorite(id));
        _onLoadingFinish();
      } else {
        Alert.alert(
          i18n.t('favorite.Sign In Require'),
          i18n.t(
            'favorite.Please sign in before you can add this item to your favorite',
          ),
          [
            {
              text: i18n.t('profile.Sign In'),
              onPress: () => navigate('SignIn'),
            },
          ],
        );
      }
    } catch (e) {
      _onLoadingFinish();
      console.log(e);
    }
  };
  const onToggleSnackBar = () => setVisible(!visible);

  const onDismissSnackBar = () => setVisible(false);
  const isCheckedOption = itemId => {
    const checked = extraOption.filter(v => v.itemId === itemId); // this will return boolean true false
    return checked.length > 0 ? true : false;
  };
  const toggleChecked = (group_id, itemId, extra_price, product_id) => {
    let arr = {
      group_id: group_id,
      itemId: itemId,
      extra_price: extra_price,
      product_id: product_id,
    };

    const newArr = extraOption.filter(d => d.group_id !== group_id);
    const initArr = [...newArr, arr];
    let extra_price_total = 0;
    initArr.map(d => {
      extra_price_total =
        parseFloat(extra_price_total) + parseFloat(d.extra_price);
    });
    setItemExtraPrice(parseFloat(extra_price_total));

    const newPrice =
      parseFloat(itemPriceSelected) + parseFloat(extra_price_total);
    if (itemPriceSelected !== '') {
      setItemPrice(newPrice);
      setExtraOption(initArr);
    }
  };
  /**
   * check if is existing cart items
   */
  useEffect(() => {
    if (existingCartItems) {
      const {qty, size, variations_id} = existingCartItems;
      const cart_items_price = existingCartItems.price;
      if (itemPriceSelected !== '') {
        setItemSize(size);
        setItemPrice(cart_items_price);
        let totalExtraPriceFromStore = 0;
        extraOption.map(d => {
          totalExtraPriceFromStore =
            parseFloat(totalExtraPriceFromStore) + parseFloat(d.extra_price);
        });
        setItemPriceSelected(
          parseFloat(cart_items_price) - parseFloat(totalExtraPriceFromStore),
        );
      }
      setItemsQty(qty);
      setVariat_id(variations_id);
      setTimeout(() => {
        if (statex.prodPrice) {
          // Alert.alert(
          //   i18n.t('productdetail.This item already in your cart'),
          //   '',
          // );
          setitemExisting(true);
        }
      }, 500);
    } else {
      let totalExtraPriceFromStore = 0;
      extraOption.map(d => {
        totalExtraPriceFromStore =
          parseFloat(totalExtraPriceFromStore) + parseFloat(d.extra_price);
      });
      setItemExtraPrice(totalExtraPriceFromStore);
    }
  }, []);

  const iconContainerx = {
    ...styles.iconContainer,
  };
  const iconColors = theme.dark ? '#fff' : Colors.primary;
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
              <View style={{marginRight: 20}}>
                <Image
                  style={{
                    width: 24,
                    height: 24,
                    resizeMode: 'contain',
                    tintColor: Colors.secondary,
                  }}
                  source={require('../../assets/cart.png')}
                />
              </View>
            </TouchableCmp>
          </HeaderButtons>
          <CartCount style={{top: 18, left: -4}} />
        </>
      ),
    });
  }, [existingCartItems]);
  if (isLoading) {
    return (
      <View style={{...styles.centerd}}>
        <ActivityIndicator
          size="large"
          color={theme.dark ? '#fff' : Colors.primary}
          animating={true}
        />
      </View>
    );
  }
  const RenderOptionGroup = () => (
    <View>
      {ProductExtraGroup.filter(dg => dg.product_id === id).map((d, index) => {
        return (
          <View key={index}>
            <Text
              style={{
                fontWeight: 'bold',
                marginBottom: 5,
                color: Colors.darkGrey,
              }}>
              {d.name}{' '}
              {d.is_required == 1 ? (
                <Text style={{color: 'red'}}>*</Text>
              ) : (
                <Text></Text>
              )}
            </Text>
            <View
              style={{
                flexDirection: 'row',
                flexDirection: 'row',
                flexWrap: 'wrap',
                alignItems: 'flex-start',
              }}>
              {RenderOption(d.id)}
            </View>
          </View>
        );
      })}
    </View>
  );
  const RenderOption = id =>
    ProductExtraOption.filter(data => data.extra_group_id === id).map(
      (dataOption, index) => {
        return (
          <View
            key={index}
            style={{
              borderWidth: 0.3,
              width: '50%',
              padding: 3,
              borderRadius: 50,
              backgroundColor: '#fff',
              marginBottom: 5,
              marginRight: 5,
              alignContent: 'center',
            }}>
            <TouchableOpacity
              onPress={() =>
                toggleChecked(
                  id,
                  dataOption.id,
                  dataOption.extra_price,
                  prod_id,
                )
              }>
              <View
                style={{
                  flexDirection: 'row',
                  flexWrap: 'wrap',
                  padding: 5,
                }}>
                <Text style={{marginRight: 5}}>
                  <Fontisto
                    name={
                      isCheckedOption(dataOption.id) == true
                        ? 'checkbox-active'
                        : 'checkbox-passive'
                    }
                    style={{marginRight: 5}}
                    size={20}
                    color="#676767"
                  />
                </Text>
                <Text>{dataOption.name}</Text>
                <Text> + ${dataOption.extra_price}</Text>
              </View>
            </TouchableOpacity>
          </View>
        );
      },
    );
  const RenderProductPrice = () => (
    <View style={{}}>
      {statex.prodPrice
        .sort((a, b) => a.price - b.price) // sort order by asc
        .map((d, i) => {
          return (
            <PriceItems
              iconColor={iconColors}
              key={i + 1}
              price={d.price}
              size={d.size}
              onSelected={() =>
                handleSelectOption(
                  d.price,
                  d.size,
                  d.variations_id,
                  d.qty_available,
                )
              }
              selectedSize={itemSize}
              discount={discountState.discount}
              discount_type={discountState.type}
            />
          );
        })}
    </View>
  );
  const RenderButton = () => (
    <Card
      style={{
        ...styles.carView,
        display: itemExisting == true ? 'none' : 'flex',
      }}>
      <TouchableCmp onPress={() => handleAddToCart()}>
        <View style={{...styles.addToCartContainer}}>
          {/* <View style={{...styles.mainFlex}}>
            <TouchableCmp onPress={decreaseQty}>
              <View style={iconContainerx}>
                <Image
                  style={{width: 16, height: 16, tintColor: '#fff'}}
                  source={require('../../assets/minus.png')}
                />
              </View>
            </TouchableCmp>

            <Text style={{...styles.textQty}}>{itemQty}</Text>

            <TouchableCmp onPress={IncreaseQty}>
              <View style={iconContainerx}>
                <Image
                  style={{width: 16, height: 16, tintColor: '#fff'}}
                  source={require('../../assets/plus.png')}
                />
              </View>
            </TouchableCmp>
          </View> */}
          {existingCartItems ? (
            <Text
              style={{
                ...styles.maiText,
                color: Colors.secondary,
                fontSize: 24,
              }}>
              {i18n.t('productdetail.Update')} |${' '}
              {discountState.discount_price > 0
                ? discountState.type === 'percentage'
                  ? (
                      (itemPrice - (itemPrice * discountState.discount) / 100) *
                      itemQty
                    ).toFixed(2)
                  : Number.parseFloat(
                      (itemPrice - discountState.discount) * itemQty,
                    ).toFixed(2)
                : (itemPrice * itemQty).toFixed(2)}
            </Text>
          ) : discountState.discount_price > 0 ? (
            <Text
              style={{
                ...styles.maiText,
                color: Colors.secondary,
                fontSize: 24,
              }}>
              {i18n.t('productdetail.Add to cart')} | $
              {itemPrice > 0
                ? discountState.type === 'percentage'
                  ? (
                      (itemPrice - (itemPrice * discountState.discount) / 100) *
                      itemQty
                    ).toFixed(2)
                  : Number.parseFloat(
                      (itemPrice - discountState.discount) * itemQty,
                    ).toFixed(2)
                : Number.parseFloat(itemPrice * itemQty).toFixed(2)}
            </Text>
          ) : (
            <Text
              style={{
                ...styles.maiText,
                color: Colors.secondary,
                fontSize: 24,
              }}>
              {i18n.t('productdetail.Add to cart')} | ${' '}
              {(itemPrice * itemQty).toFixed(2)}
            </Text>
            // <TouchableCmp onPress={onShowPopup}>
            //   <View>{checkButton()}</View>
            // </TouchableCmp>
          )}
        </View>
      </TouchableCmp>
    </Card>
  );
  return (
    <Fragment>
      <ScrollView
        style={{backgroundColor: Colors.background}}
        showsVerticalScrollIndicator={false}>
        <KeyboardAvoidingView
          // keyboardVerticalOffset={50}
          style={styles.container}
          behavior={Platform.OS === 'ios' ? 'position' : {}}>
          <View
            style={{
              ...styles.imageContainer,
            }}>
            {statex.prodGallery.length > 0 ? (
              <ProductSlider data={statex.prodGallery} />
            ) : (
              <ProductFeature />
            )}
          </View>
          <View style={styles.productContainer}>
            <View style={{...styles.nameContainer}}>
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                }}>
                <Text
                  numberOfLines={2}
                  style={{
                    ...styles.maiText,
                    width: '80%',
                    fontSize: 20,
                    marginTop: 10,
                  }}>
                  {name}{' '}
                  <Text style={{fontSize: 12, color: Colors.secondary}}>
                    {stockStatus} | Sold {(qtySoldItemResult * 1).toFixed(0)}
                  </Text>
                </Text>
                <TouchableCmp onPress={_onToggleFavorite}>
                  <View
                    style={{
                      ...styles.headerCotainer,
                    }}>
                    <Image
                      style={{
                        width: 33,
                        height: 33,
                        resizeMode: 'contain',
                        tintColor:
                          isFavorite > 0 ? Colors.secondary : Colors.secondary,
                      }}
                      source={
                        isFavorite > 0
                          ? require('../../assets/heart.png')
                          : require('../../assets/heart-o.png')
                      }
                    />
                  </View>
                </TouchableCmp>
              </View>
              <View style={{marginTop: 0}}>
                {discountState.discount_price > 0 ? (
                  <View style={{}}>
                    <Text
                      style={{
                        ...styles.priceText,
                      }}>
                      $
                      {Number.parseFloat(
                        price - discountState.discount_price,
                      ).toFixed(2)}
                    </Text>
                    <Text
                      style={{
                        ...styles.maiText,
                      }}>
                      <Text
                        style={{
                          ...styles.priceText,
                          textDecorationLine: 'line-through',
                          fontWeight: '200',
                          fontSize: 15,
                        }}>
                        {' '}
                        ${Number.parseFloat(price).toFixed(2)}
                      </Text>

                      <Text style={{fontSize: 15, color: Colors.secondary}}>
                        {' '}
                        {/* | {(promotions[0].discount_amount * 1).toFixed(2)}{' '}
                        {promotions[0].discount_type == 'percentage'
                          ? '%'
                          : '$'}{' '}
                        Off */}
                      </Text>
                    </Text>
                  </View>
                ) : (
                  <Text style={{...styles.priceText}}>
                    ${Number.parseFloat(price).toFixed(2)}
                  </Text>
                )}
              </View>
            </View>
            <View
              style={{
                backgroundColor: '#ddd',
                padding: 5,
                display:
                  itemExisting == true && stockStatus == 'In Stock'
                    ? 'flex'
                    : 'none',
              }}>
              <Text
                style={{
                  fontSize: 12,
                  color: Colors.secondary,
                }}>
                {' '}
                {i18n.t('productdetail.This item already in your cart')}
              </Text>
            </View>
            {description !== '' ? (
              <View style={{...styles.description}}>
                <Text
                  style={{
                    fontFamily: 'Roboto-Regular',
                    fontSize: 14,
                    paddingBottom: 10,
                  }}>
                  {i18n.t('productdetail.Description')}
                </Text>
                <HTMLView
                  value={description}
                  stylesheet={styles}
                  textComponentProps={{
                    style: {
                      color: Colors.darkGrey,
                      fontFamily: 'Roboto-Regular',
                      fontSize: 14,
                    },
                  }}
                />
              </View>
            ) : (
              <View style={{...styles.description}}>
                <Text>{i18n.t('productdetail.Description')}</Text>
              </View>
            )}
            <View
              style={{
                ...styles.selectOption,
              }}>
              <View>
                <Text style={{...styles.subText}}>
                  {i18n.t('productdetail.Select options')}
                </Text>
              </View>
              <Text style={{...styles.subText, fontWeight: '400'}}>
                {i18n.t('productdetail.1 REQUIRED')}
              </Text>
            </View>

            {RenderProductPrice()}
            <View
              style={{
                width: SCREEN_WIDTH / 1.1,
                justifyContent: 'center',
                paddingHorizontal: 10,
                display: itemPrice === 0 && !itemSize ? 'none' : 'flex',
              }}>
              {RenderOptionGroup()}
            </View>
            <View
              style={{
                ...styles.instruction,
                // backgroundColor: theme.dark ? '#000' : '#ddd',
              }}
            />
            {/* <Text
              style={{
                ...styles.maiText,
                fontSize: 14,
                paddingTop: 15,
                paddingLeft: 10,
              }}>
              {i18n.t('productdetail.Special instruction')}
            </Text> */}
            <View style={{...styles.instructionsContainer}}>
              <TextInput
                style={{
                  width: '100%',
                  height: 90,
                  borderRadius: 10,
                  borderTopRightRadius: 10,
                  borderTopLeftRadius: 10,
                  backgroundColor: '#E3E3E3',
                  marginTop: 10,
                }}
                borderRadius={10}
                borderWidth={0}
                outlineColor="#000"
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
            <View
              style={{
                ...styles.quantityContainer,
              }}></View>
          </View>
        </KeyboardAvoidingView>
      </ScrollView>
      {RenderButton()}
      <Snackbar
        duration={3000}
        style={{
          backgroundColor: Colors.secondary,
        }}
        visible={visible}
        onDismiss={onDismissSnackBar}
        action={{
          label: i18n.t('cart.Go to cart'),
          color: Colors.textLight,
          onPress: () => navigate('Cart'),
        }}>
        <Text style={{color: '#fff'}}>
          {i18n.t('productdetail.This item successful added to your cart')}
        </Text>
      </Snackbar>
    </Fragment>
  );
};
export const screenOptions = props => {
  return {
    headerTitle: props.route.params.cartInfo
      ? i18n.t('productdetail.Customize')
      : props.route.params.headerTitle,
  };
};
export default ProductDetailOverviewScreen;
const styles = StyleSheet.create({
  productContainer: {
    paddingTop: 10,
    paddingHorizontal: 10,
    width: '100%',
    backgroundColor: Colors.background,
    borderTopLeftRadius: 39,
    borderTopRightRadius: 39,
  },
  headerCotainer: {
    width: 55,
    height: 55,
    borderRadius: 42,
    top: -50,
    backgroundColor: Colors.background,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#a1a1a1',
    right: 10,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.4,
    shadowRadius: 3,

    elevation: 5,
  },
  centerd: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    flex: 1,
  },
  nameContainer: {
    padding: 10,
  },
  maiText: {
    fontSize: 20,
    fontFamily: 'Roboto-Bold',
    textTransform: 'capitalize',
    color: Colors.text,
  },
  priceText: {
    fontFamily: 'Roboto-Bold',
    fontSize: 25,
    color: Colors.secondary,
  },
  subText: {
    fontSize: 16,
    fontFamily: 'Roboto-Bold',
    color: '#9D9D9D',
  },
  imageContainer: {
    backgroundColor: '#fff',
    // position: 'relative',
  },
  heartIconContainer: {
    flexDirection: 'row',
    position: 'absolute',
    bottom: Platform.OS === 'ios' ? -10 : -20,
    right: 20,
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  image: {
    width: null,
    height:
      Platform.OS === 'android'
        ? SCREEN_HEIGHT / 3 + 8
        : SCREEN_HEIGHT / 3 - 24,
    flex: 1,
    resizeMode: 'cover',
  },
  description: {
    paddingBottom: 20,
    paddingHorizontal: 10,
    marginTop: 10,
  },
  selectOption: {
    padding: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  priceContainer: {
    // marginVertical: 10,
    padding: 15,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomColor: '#ddd',
    borderBottomWidth: 1,
  },
  sizeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  instruction: {},
  instructionsContainer: {
    padding: 10,
  },
  inputContainerStyle: {
    margin: 0,
    fontFamily: 'OpenSans-Bold',
    backgroundColor: '#fff',
  },
  quantityContainer: {
    paddingVertical: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  mainFlex: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  greyText: {
    fontFamily: 'Poppins-Regular',
    fontSize: 14,
    color: Colors.textGrey,
  },
  iconContainer: {
    width: 26,
    height: 26,
    backgroundColor: Colors.secondary,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 7,
  },
  textQty: {
    fontFamily: 'Gotham-Bold',
    fontSize: 27,
    paddingHorizontal: 20,
    color: Colors.secondary,
  },
  carView: {
    padding: 20,
    borderRadius: 0,
    paddingBottom: Platform.OS === 'ios' ? PADDING_BOTTOM : 10,
    backgroundColor: Colors.background,
  },
  addToCartContainer: {
    borderRadius: 12,
    backgroundColor: Colors.primary,
    width: SCREEN_WIDTH - 40,
    height: 64,
    flexDirection: 'row',
    justifyContent: 'center',
    paddingHorizontal: 28,
    alignItems: 'center',
    borderRadius: 100,
  },
});
