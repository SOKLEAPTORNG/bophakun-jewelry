import React, {useCallback, useEffect, useRef, useState} from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  Animated,
  StatusBar,
  Image,
  Platform,
  RefreshControl,
  TouchableOpacity,
  Alert,
  ImageBackground,
  Linking
} from 'react-native';
import Text from '../../components/UI/DefaultText';
import i18n from '../../../Translations/index';
import Feather from 'react-native-vector-icons/Feather';

import SimpleLineIcons from 'react-native-vector-icons/SimpleLineIcons';
import AntDesign from 'react-native-vector-icons/AntDesign';
import {useDispatch, useSelector} from 'react-redux';
import { BASE_URL, business_info } from '../../constant/index';
import TelegramChat from '../../components/Message/telegram-component';
import PropTypes from 'prop-types';
import Index from '../Promotions/index';
import {
  Colors,
  STATUSBAR_HEIGHT,
  SCREEN_WIDTH,
  SCREEN_HEIGHT,
  DISCOUNT_PATH,
  IMAGE_PATH,
} from '../../constant/index';
import CartCount from '../../components/Product/CartCount';
import ExtraToucable from '../../components/UI/TouchableCmp';
import CategoriesItems from '../../components/Product/CategoriesItems';
import {useTheme} from '@react-navigation/native';
import Geolocation from '@react-native-community/geolocation';
import HomeSlider from '../../components/Promotions/HomeSlide';
import PopularItems from '../../components/Product/PopularItems';
import RecommendItems from '../../components/Product/RecommendItems';
import Message from '../../components/Message/telegram-component';
import TouchableCmp from '../../components/UI/TouchableCmp';
import {
  navigate,
  loadRef,
  _onLoading,
  _onLoadingFinish,
} from '../../navigation/RootNavigation';
import Placeholder, {
  CategoryPlaceholder,
  RecommendItemsPlaceholder,
} from '../../components/UI/Placeholder';
import axios from 'axios';
import AsyncStorage from '@react-native-community/async-storage';
import Loading from '../../components/UI/Spiner';
import messaging from '@react-native-firebase/messaging';
import {androidNotification, iosNotification} from '../../config/notification';
import PromotionSlider from '../../components/Promotions/sliders';
import ListItems from '../../components/Product/Items_List_Col_3';
import * as actionSlider from '../../store/action/promotion';
import * as actionProduct from '../../store/action/product';
import * as actionPromotions from '../../store/action/promotion';

import * as actionAuth from '../../store/action/auth';
import {isIphoneX} from '../../utils/index';
import {FlatList} from 'react-native-gesture-handler';
const ProductsOverviewScreen = props => {
  const [error, setError] = useState();
  const [foods, setFoods] = useState([]);
  const [errNetwork, setErrNetwork] = useState();
  const [isLoading, setIsLoading] = useState(false);
  const [goalPrice, setGoalPrice] = useState([]);
  const [popularItem, setPopularItems] = useState([]);
  const [isScrollLimit, setIsScrollLimit] = useState(false);
  const [qtyAvailables, setQtyAvailables] = useState([]);
  const [qtySolds, setQtySolds] = useState([]);
  const [recommendItems, setRecommendItems] = useState([]);
  const _opacity = useRef(new Animated.Value(0)).current;
  const dummyData = Array(3)
    .fill()
    .map((_, index) => ({id: index}));
  const catItems = Array(4)
    .fill()
    .map((_, index) => ({id: index}));
  // const loadRef = useRef(null);
  const product = useSelector(state => state.product.products);
  const {popularItems} = useSelector(state => state.product);
  const food_items = useSelector(state => state.product.food_items);
  const categories = useSelector(state => state.product.product_type);

  const {available_promotions} = useSelector(state => state.promotion);
  const productPromotion = [];
  if (available_promotions.length > 0) {
    available_promotions.map(item => {
      const filterProduct = product.filter(
        d => d.category_id == item.category_id,
      );
      if (filterProduct.length > 0) {
        filterProduct.map(item => {
          productPromotion.push(item);
        });
      }
    });
  }
  const {recommend_items} = useSelector(state => state.product);
  const iphonex = isIphoneX();
  const dispatch = useDispatch();
  const theme = useTheme();
  const {colors} = useTheme();
  /**
   * on Scoll event handler
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
  const _onScrollEventHandler = ({nativeEvent}) => {
    const {y} = nativeEvent.contentOffset;
    const statusBar = STATUSBAR_HEIGHT + 50;
    const limit = 150 - statusBar;
    if (y > limit && isScrollLimit !== true) {
      Animated.timing(_opacity, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }).start();
      setIsScrollLimit(true);
    }
    if (y < limit && isScrollLimit !== false) {
      Animated.timing(_opacity, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }).start();
      setIsScrollLimit(false);
    }
  };
  /**
   * rendom foods items
   */
  const getRandomProducts = (arr, n, type) => {
    let result = new Array(n);
    let len = arr.length;
    let taken = new Array(len);
    if (n > len)
      // throw new RangeError('getRandom: more elements taken than available');
      n = len;
    while (n--) {
      const x = Math.floor(Math.random() * len);
      result[n] = arr[x in taken ? taken[x] : x];
      taken[x] = --len in taken ? taken[len] : len;
    }
    switch (type) {
      case 'foods':
        return setFoods(result);
      case 'pop':
        return setPopularItems(result);
      case 'remm':
        return setRecommendItems(result);
      default:
        return;
    }
  };
  useEffect(() => {
    getRandomProducts(food_items, 10, 'foods');
    getRandomProducts(popularItems, 10, 'pop');
    getRandomProducts(recommend_items, 10, 'remm');
  }, []);
  const getGoalPrice = async () => {
    await axios
      .get(
        `https://extranet.eocambo.com/api/${business_info.business_id}/goods-standard-price`,
      )
      .then(({data}) => {
        if (data.length > 0) {
          setGoalPrice(data);
        }
      });
  };
  useEffect(() => {
    getGoalPrice();
  }, []);

  const goalPriceInformation = () => {
    if (goalPrice.length > 0) {
      return (
        <View style={styles.newContainer}>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
              // margin: 17,
              borderBottomWidth: 1,
              borderColor: '#E3E3E3',
              paddingBottom: 10,
            }}>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
              }}>
              <Image
                source={require('../../assets/gold.png')}
                style={styles.goldIcon}
              />
              <Text
                style={{
                  ...styles.mainText,
                  color: Colors.secondary,
                  top: 3,
                  marginLeft: 13,
                  fontSize: 18,
                }}>
                Gold Price
              </Text>
            </View>
            <View>
              <Text style={styles.unitTextRight}>
                {i18n.t('home.Last Updated')}
              </Text>
              <Text style={styles.unitTextRight}>
                {goalPrice[0].updated_at}
              </Text>
            </View>
          </View>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-around',
              paddingTop: 10,
            }}>
            <View
              style={{
                display:
                  goalPrice[0].is_show_purchases_price == 1 ? 'flex' : 'none',
              }}>
              <Text style={styles.unitText}>
                {i18n.t('home.Purchase Price/oz')}
              </Text>
              <Text style={styles.unitText}>
                $ {goalPrice[0].purchase_price}
              </Text>
            </View>
            <View>
              <Text>|</Text>
            </View>
            <View
              style={{
                display:
                  goalPrice[0].is_show_selling_price == 1 ? 'flex' : 'none',
              }}>
              <Text style={styles.unitTextRight}>
                {' '}
                {i18n.t('home.Selling Price/oz')}
              </Text>
              <Text style={styles.unitTextRight}>
                $ {goalPrice[0].selling_price}
              </Text>
            </View>
          </View>
        </View>
      );
    } else {
      return <View></View>;
    }
  };

  /**
   * Subscribed to topic weather!

  useEffect(() => {
    // registerAppWithFCM();
    _handleRequestPermission();
    const onSubscribe = () => {
      messaging().subscribeToTopic('traffic');
    };
    onSubscribe();
  }, []);
  /**
   * unSubscribed to topic weather!
   */
  useEffect(() => {
    messaging().onNotificationOpenedApp(remoteMessage => {
      props.navigation.navigate(remoteMessage.data.type);
    });
  }, [props.navigation]);
  useEffect(() => {
    const initailMessage = messaging().onMessage(async remoteMessage => {
      const title = remoteMessage.notification.body;
      const content = remoteMessage.notification.title;
      const {type} = remoteMessage.data;
      // console.log(title)
      props.navigation.navigate(type);
    });
    return initailMessage;
  }, []);
  /**
   * Request permission using firebase cloude messaging
   */
  // const registerAppWithFCM = async () => {
  //   await messaging().registerDeviceForRemoteMessages(); // using auto ios registeration messaging in firebase json file
  // };
  const _handleRequestPermission = async () => {
    await messaging().requestPermission({
      alert: true,
      announcement: false,
      badge: true,
      carPlay: true,
      provisional: false,
      sound: true,
    });
  };
  /**
   * handle refresh fetching product
   */
  const fetchProduct = useCallback(async () => {
    setError(null);
    setErrNetwork(null);
    try {
      await dispatch(actionProduct.setProducts());
      await dispatch(actionSlider.setSlider());
      await dispatch(actionPromotions.getPromotion());
    } catch (err) {
      onErrorAlert(err);
    }
  }, [dispatch]);
  /**
   * fetching slider data from api request
   */
  const fetchSlider = useCallback(async () => {
    try {
      if (product.length === 0) {
        await dispatch(actionProduct.setProducts());
        await dispatch(actionSlider.setSlider());
      } else {
        await dispatch(actionSlider.setSlider());
      }
    } catch (e) {
      onErrorAlert(e.message);
    }
  }, [dispatch, product]);
  /**
   * handle refresh fetching product
   */
  const onPressRelaodData = async () => {
    const userData = await AsyncStorage.getItem('userData');
    const transformData = JSON.parse(userData);
    const {userId} = transformData;
    try {
      await dispatch(actionAuth.getUserInfo(userId));
      await dispatch(actionProduct.setProducts());
      await dispatch(actionSlider.setSlider());
    } catch (e) {
      onErrorAlert();
      setIsLoading(true);
    }
  };
  const onErrorAlert = message => {
    Alert.alert(
      i18n.t('home.Failed to connect the sever'),
      i18n.t('home.Please check your internet connection and try again'),
      [
        {
          text: 'Retry',
          onPress: () => onPressRelaodData(),
        },
      ],
    );
  };
  /**
   * unsubscribe fetching slider
   */
  useEffect(() => {
    Geolocation.getCurrentPosition(info => console.log(info.coords));
    const unsubcribe = props.navigation.addListener('focus', fetchSlider);
    return async () => {
      unsubcribe();
    };
  }, [fetchSlider, props.navigation]);
  /**
   * first call fetching slider with useEffect
   */
  useEffect(() => {
    setIsLoading(true);
    fetchSlider().then(() => {
      setIsLoading(false);
    });
  }, [dispatch, fetchSlider]);
  /**
   * handle pull down refreshing
   */
  const onRefresh = useCallback(() => {
    // alert('hello');
    _onLoading();
    fetchProduct().then(() => {
      _onLoadingFinish();
    });
  }, [fetchProduct]);
  const handleNavigateDetailScreen = (id, title, cat_id) => {
    props.navigation.navigate('ProductDetail', {
      prod_id: id,
      headerTitle: title,
      cat_id: cat_id,
    });
  };
  const handleNavigateCategoriesScreen = (id, name) => {
    props.navigation.navigate('ItemList', {
      cat_id: id,
      name: name,
    });
  };
  const renderCategories = () => {
    return (
      <View style={styles.containertwocol}>
        {isLoading
          ? catItems.map(d => <CategoryPlaceholder key={d.id} />)
          : categories.map(item => {
              // console.log(item.id);
              return (
                <CategoriesItems
                  key={item.id}
                  id={item.id}
                  title={item.name}
                  image={item.image}
                  navigation={() =>
                    handleNavigateCategoriesScreen(item.id, item.name)
                  }
                />
              );
            })}
      </View>
    );
  };
  const handleSeeMore = type => {
    let seeMoreProducts = [];
    var name = '';

    if (type === 'see_all_promotion') {
      name = 'All promotion';
      seeMoreProducts = productPromotion;
    } else if (type === 'new_arrival') {
      name = i18n.t('home.New Arrival');
      product
        .filter(d => d.isNew === 1)
        .map((item, index) => {
          seeMoreProducts.push(item);
        });
    } else if (type === 'recommended') {
      name = i18n.t('home.Recommended for you');
      product
        .filter(d => d.is_recommend === 1)
        .map((item, index) => {
          seeMoreProducts.push(item);
        });
    }

    navigate('SeeMore', {
      name: name,
      product: seeMoreProducts,
      seeMore: type,
      available_promotions: available_promotions,
    });
  };

  const renderIsNew = () => {
    return (
      <ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>
        {product
          .filter(d => d.isNew === 1)
          .slice(0, 10)
          .map((d, index) => {
            //here to code
            let qtyAvailableItem = 0;
            let availableStatus = i18n.t('home.OutStock');
            if (qtyAvailables.length > 0) {
              const qtyAvailableItems = qtyAvailables.filter(
                m => m.product_id == d.id,
              );
              if (qtyAvailableItems.length > 0) {
                qtyAvailableItem = qtyAvailableItems[0].qty_available;
                if (qtyAvailableItem > 0) {
                  availableStatus = i18n.t('home.Instock');
                }
              }
            }
            let qtySoldItemResult = 0;
            if (qtySolds.length > 0) {
              const qtySoldItem = qtySolds.filter(m => m.product_id == d.id);
              if (qtySoldItem.length > 0) {
                qtySoldItemResult = qtySoldItem[0].qty_sold;
              }
            }
            // console.log('d', d.id);
            // const qtyAvailables = qtyAvailables.filter(
            //   m => m.product_id == 7074,
            // );
            // console.log('qtyAvailables', qtyAvailables);
            return (
              <RecommendItems
                key={index}
                promotion={available_promotions}
                cat_id={d.category_id}
                name={d.name}
                image={d.image}
                price={d.price}
                navigation={() =>
                  handleNavigateDetailScreen(d.id, d.name, d.category_id)
                }
                availableStatus={availableStatus}
                qtySoldItemResult={qtySoldItemResult}
                isLoading={isLoading}
              />
            );
          })}
      </ScrollView>
    );
  };
  const renderProductPromotion = () => {
    return (
      <ScrollView
        style={{}}
        bounces={false}
        horizontal={true}
        showsHorizontalScrollIndicator={false}>
        {isLoading
          ? dummyData.map(d => {
              return <Placeholder key={d.id} />;
            })
          : productPromotion.slice(0, 10).map((d, index) => {
              let qtyAvailableItem = 0;
              let availableStatus = 'OutStock';
              if (qtyAvailables.length > 0) {
                const qtyAvailableItems = qtyAvailables.filter(
                  m => m.product_id == d.id,
                );
                if (qtyAvailableItems.length > 0) {
                  qtyAvailableItem = qtyAvailableItems[0].qty_available;
                  if (qtyAvailableItem > 0) {
                    availableStatus = 'Instock';
                  }
                }
              }
              let qtySoldItemResult = 0;
              if (qtySolds.length > 0) {
                const qtySoldItem = qtySolds.filter(m => m.product_id == d.id);
                if (qtySoldItem.length > 0) {
                  qtySoldItemResult = qtySoldItem[0].qty_sold;
                }
              }
              return (
                <RecommendItems
                  key={d.id}
                  cat_id={d.category_id}
                  image={d.image}
                  promotion={available_promotions}
                  name={d.name}
                  price={d.price}
                  availableStatus={availableStatus}
                  qtySoldItemResult={qtySoldItemResult}
                  navigation={() =>
                    handleNavigateDetailScreen(d.id, d.name, d.category_id)
                  }
                />
              );
            })}
      </ScrollView>
    );
  };
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
  const renderRecommendItems = () => {
    return (
      <ScrollView
        style={{
          elevation: 3,
        }}
        bounces={false}
        horizontal={true}
        showsHorizontalScrollIndicator={false}>
        {isLoading
          ? dummyData.map(d => <RecommendItemsPlaceholder key={d.id} />)
          : product
              .filter(d => d.is_recommend === 1)
              .slice(0, 10)
              .map((d, index) => {
                // console.log('xxxx', d);

                return (
                  <RecommendItems
                    key={d.id}
                    cat_id={d.category_id}
                    image={d.image}
                    promotion={available_promotions}
                    name={d.name}
                    price={d.price}
                    navigation={() =>
                      handleNavigateDetailScreen(d.id, d.name, d.category_id)
                    }
                  />
                );
              })}
      </ScrollView>
    );
  };
  return (
    <View
      style={{
        ...styles.container,
        backgroundColor: isScrollLimit
          ? theme.colors.background
          : Colors.background,
      }}>
      <Loading
        ref={loadRef}
        backgroundColor={'#00000096'}
        indicatorColor={'#fff'}
        easing={Loading.EasingType.linear}
      />
      <StatusBar
        backgroundColor={Colors.primary}
        barStyle={
          Platform.OS === 'android'
            ? 'light-content'
            : theme.dark
            ? 'light-content'
            : 'dark-content'
        }
      />
      <Animated.View
        style={{
          ...styles.searchToolWrapper,
          backgroundColor: isScrollLimit ? Colors.primary : 'rgba(0,0,0,0)',
          justifyContent: 'center',
          borderBottomWidth: null,
          zIndex: isScrollLimit ? 99 : 0,
        }}>
        {isScrollLimit && (
          <Animated.View
            style={{
              ...styles.headerSearch,
              opacity: _opacity,
            }}>
            <TelegramChat />
            <Animated.View
              style={{
                paddingHorizontal: 20,
                justifyContent: 'center',
              }}>
              <TouchableCmp onPress={() => navigate('Search')}>
                <View
                  style={{
                    ...styles.search,
                    backgroundColor: Colors.background,
                    flexDirection: 'row',
                    width: SCREEN_WIDTH - 140,
                    top: 0,
                    height: 40,
                    paddingHorizontal: 12,
                  }}>
                  <Text style={{...styles.textSearch}}>
                    {i18n.t('search.Search')}
                  </Text>
                  <Image
                    style={{
                      width: 22,
                      height: 22,
                      resizeMode: 'contain',
                      tintColor: Colors.secondary,
                    }}
                    source={require('../../assets/search.png')}
                  />
                </View>
              </TouchableCmp>
            </Animated.View>
            <TouchableCmp onPress={() => navigate('Notification')}>
              <View>
                <View>
                  <Image
                    style={{
                      width: 24,
                      height: 24,
                      resizeMode: 'contain',
                      tintColor: Colors.secondary,
                    }}
                    source={require('../../assets/notification.png')}
                  />
                </View>
              </View>
            </TouchableCmp>
          </Animated.View>
        )}
      </Animated.View>
      <ScrollView
        style={{backgroundColor: Colors.background}}
        scrollEventThrottle={16}
        showsVerticalScrollIndicator={false}
        onScroll={_onScrollEventHandler}
        refreshControl={
          <RefreshControl
            refreshing={false}
            onRefresh={onRefresh}
            progressBackgroundColor="transparent"
          />
        }>
        <View>
          <View style={{...styles.header}}>
            <View
              style={{
                paddingVertical: 10,
                paddingHorizontal: 20,
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
                width: '100%',
              }}>
              <TelegramChat />
              <View>
                <Image
                  style={{
                    width: 120,
                    height: 60,
                    resizeMode: 'contain',
                  }}
                  source={require('../../assets/logo.png')}
                />
              </View>
              <View style={{}}>
                <TouchableCmp onPress={() => navigate('Notification')}>
                  <View>
                    <Image
                      style={{
                        width: 26,
                        height: 26,
                        resizeMode: 'contain',
                        tintColor: Colors.secondary,
                      }}
                      source={require('../../assets/notification.png')}
                    />
                  </View>
                </TouchableCmp>
              </View>
            </View>
            <View>
              <TouchableCmp onPress={() => navigate('Search')}>
                <View
                  style={{
                    ...styles.search,
                    backgroundColor: Colors.background,
                    paddingHorizontal: 20,
                    height: 41,
                    marginTop: 10,
                  }}>
                  <Text style={{...styles.textSearch}}>
                    {i18n.t('search.Search')}
                  </Text>
                  <Image
                    style={{
                      width: 22,
                      height: 22,
                      resizeMode: 'contain',
                      tintColor: Colors.secondary,
                    }}
                    source={require('../../assets/search.png')}
                  />
                </View>
              </TouchableCmp>
            </View>
          </View>
        </View>
        {goalPriceInformation()}
        {/* ======promotion slider======= */}
        <View
          style={{
            marginTop: -100,
            marginBottom: 20,
            display: available_promotions.length > 0 ? 'flex' : 'none',
          }}>
          <PromotionSlider />
        </View>
        <View
          style={{
            paddingTop: 10,
          }}>
          <View style={{...styles.wrappTitle, marginTop: 10}}>
            <Text style={{...styles.mainTitle}}>
              {i18n.t('home.New Design')}
            </Text>
            <TouchableCmp onPress={() => handleSeeMore('new_arrival')}>
              <View>
                <Text style={{...styles.seeAll}}>{i18n.t('home.See all')}</Text>
              </View>
            </TouchableCmp>
          </View>
          <View style={{...styles.wrappItems}}>{renderIsNew()}</View>
          <View
            style={{
              display: available_promotions.length > 0 ? 'flex' : 'none',
            }}>
            <View style={styles.wrappTitle}>
              <Text style={{...styles.mainTitle}}>
                {i18n.t('home.Promotion')}
              </Text>
              <TouchableCmp onPress={() => handleSeeMore('see_all_promotion')}>
                {/* //productPromotion */}
                <View>
                  <Text style={{...styles.seeAll}}>
                    {i18n.t('home.See all')}
                  </Text>
                </View>
              </TouchableCmp>
            </View>
            <View style={styles.wrappItems}>{renderProductPromotion()}</View>
          </View>
          {/* ========slider= */}
          <View style={styles.sliderContainer}>
            <HomeSlider loading={isLoading} />
          </View>
          {/* <View style={{height: 600}}/> */}
        </View>
      </ScrollView>
    </View>
  );
};
export const screenOptions = ({navigation}) => {
  return {
    headerShown: false,
  };
};
export default React.memo(ProductsOverviewScreen);
const styles = StyleSheet.create({
  sliderContainer: {
    paddingBottom: Platform.OS === 'ios' ? 110 : 90,
    alignItems: 'center',
  },
  screen: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  mainText: {
    fontSize: 18,
    fontFamily: 'Roboto-Bold',
  },
  subText: {
    fontSize: 14,
  },
  unitText: {
    fontSize: 12,
  },
  unitTextRight: {
    fontSize: 12,
    textAlign: 'right',
  },
  container: {
    position: 'relative',
    width: '100%',
    backgroundColor: '#edf0ff',
  },
  header: {
    paddingTop: STATUSBAR_HEIGHT,
    alignItems: 'center',
    backgroundColor: Colors.primary,
    paddingBottom: 20,
    height: Platform.OS === 'android' ? 260 : 280,
  },
  headerSearch: {
    alignItems: 'center',
    justifyContent: 'space-between',
    flexDirection: 'row',
    paddingTop: Platform.OS === 'ios' ? STATUSBAR_HEIGHT - 10 : 0,
    position: 'absolute',
  },
  searchToolWrapper: {
    position: 'absolute',
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    height: Platform.OS === 'ios' ? 100 : 80,
    paddingTop: STATUSBAR_HEIGHT,
    left: 0,
    top: 0,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  searchContainer: {
    padding: 10,
    borderBottomColor: '#ddd',
  },
  popularTitleContainer: {
    marginVertical: 10,
  },
  mainTitle: {
    fontSize: 16,
    fontFamily: 'Roboto-Bold',
    color: Colors.text,
  },
  seeAll: {
    fontFamily: 'Roboto-Regular',
    fontSize: 14,
    color: Colors.darkGrey,
  },
  popualar: {
    flexDirection: 'row',
    padding: 10,
    justifyContent: 'space-between',
    alignItems: 'center',
    marginLeft: 6,
  },
  recommendContainer: {
    padding: 2.5,
  },
  search: {
    padding: 5,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: SCREEN_WIDTH - 40,
    borderRadius: 100,
    backgroundColor: Colors.background,
  },
  textSearch: {
    fontSize: 18,
    color: '#A39582',
    fontFamily: 'Roboto-Regular',
    color: Colors.secondary,
  },
  footer: {
    backgroundColor: '#edf0ff',
    borderTopLeftRadius: 0,
    borderTopRightRadius: 0,
  },
  wrappTitle: {
    paddingHorizontal: 10,
    marginLeft: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    fontSize: 20,
    fontFamily: 'Roboto-Medium',
    marginTop: 10,
  },
  wrappItems: {
    paddingLeft: 20,
  },
  containertwocol: {
    flex: 1,
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  logoContainer: {
    width: 100,
    height: 100,
    resizeMode: 'stretch',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,

    elevation: 5,
  },
  newContainer: {
    marginHorizontal: 20,
    marginVertical: 27,
    padding: 17,
    paddingHorizontal: 20,
    marginTop: -80,
    // height: SCREEN_HEIGHT / 5-30,
    borderRadius: 10,
    shadowColor: '#A1A1A1',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.35,
    shadowRadius: 3.84,
    elevation: 5,
    backgroundColor: Colors.background,
  },
  goldIcon: {
    width: 36,
    height: 36,
  },
});
