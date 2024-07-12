import React, {useEffect, useCallback, useState} from 'react';
import {
  View,
  Platform,
  ActivityIndicator,
  StyleSheet,
  FlatList,
  Image,
  Alert,
} from 'react-native';
import TouchableCmp from '../../components/UI/TouchableCmp';
import {useDispatch, useSelector} from 'react-redux';
import {HeaderButtons, Item} from 'react-navigation-header-buttons';
import HeaderButton from '../../components/UI/HeaderButton';
import {Colors as Color, Colors, SCREEN_WIDTH} from '../../constant/index';
import * as actionProduct from '../../store/action/product';
import {Tab, Tabs, ScrollableTab} from 'native-base';
import SimpleLineIcons from 'react-native-vector-icons/SimpleLineIcons';
import AntDesign from 'react-native-vector-icons/AntDesign';
import {useTheme} from '@react-navigation/native';
import ItemList from '../../components/Product/Items';
import CartCount from '../../components/Product/CartCount';
import Text from '../../components/UI/DefaultText';
import i18n from '../../../Translations/index';
import {
  _onLoading,
  _onLoadingFinish,
  navigate,
} from '../../navigation/RootNavigation';
const Categories = props => {
  const [qtySolds, setQtySolds] = useState([]);
  const [qtyAvailables, setQtyAvailables] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const theme = useTheme();
  const cat_id = props.route.params.cat_id;
  const product_category = useSelector(state =>
    state.product.product_categories.filter(d => d.parent_id === cat_id),
  );
  const products = useSelector(state =>
    state.product.products.filter(d => d.category_id === cat_id),
  );
  const isUser = useSelector(state => state.auth.userInfo);

  const dispatch = useDispatch();
  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await dispatch(actionProduct.setProducts());
    setRefreshing(false);
  }, [dispatch]);
  const onNavigationHandler = (val, name) => {
    props.navigation.navigate('ProductDetail', {
      prod_id: val,
      headerTitle: name,
      cat_id: cat_id,
    });
  };
 const getSoldAndAvailble = async () => {
   //api check
   const url = `${BASE_URL.GET_PRODUCT_SOLD_AVAILABILITY}${business_info.business_id}`;
   console.log('url', url);
   await axios
     .get(
       `${BASE_URL.GET_PRODUCT_SOLD_AVAILABILITY}${business_info.business_id}`,
     )
     .then(response => {
       const data = response.data;
       console.log('data', data);
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
  const onToggleFavorite = async id => {
    try {
      if (isUser.length === 0) {
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
      } else {
        _onLoading();
        await dispatch(actionProduct.toggleAddFavorite(id));
        _onLoadingFinish();
      }
    } catch (er) {
      _onLoadingFinish();
    }
  };
  useEffect(() => {
    props.navigation.setOptions({
      headerStyle: {
        shadowOffset: {height: 0, width: 0},
        backgroundColor: Color.primary,
      },
      headerRight: () => (
        <>
          <HeaderButtons HeaderButtonComponent={HeaderButton}>
            <View style={styles.headerRight}>
              <TouchableCmp onPress={() => navigate('Cart')}>
                <View>
                  <Image
                    style={{
                      width: 38,
                      height: 35,
                      resizeMode: 'contain',
                      tintColor: Colors.secondary,
                    }}
                    source={require('../../assets/cart.png')}
                  />
                  <CartCount
                    style={{
                      left: 0,
                      top: -8,
                    }}
                  />
                </View>
              </TouchableCmp>
            </View>
          </HeaderButtons>
        </>
      ),
    });
  }, [props, theme.colors.background]);
  if (product_category.length === 0) {
    return (
      <View style={styles.loaded}>
        <Image
          source={require('../../assets/search.png')}
          style={{width: null, height: 100}}
        />
        <Text>{i18n.t('search.No items found')}!</Text>
      </View>
    );
  }
  return (
    <React.Fragment>
      {product_category.length === 1 ? (
        !products.length ? (
          <View
            style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
            <Text>{i18n.t('search.No items found')}!</Text>
          </View>
        ) : (
          <View style={{alignItems: 'center', backgroundColor: '#fff'}}>
            <FlatList
              style={{
                backgroundColor: '#fff',
                paddingTop: 10,
              }}
              data={products}
              extraData
              // numColumns={2}
              initialNumToRender={5}
              showsVerticalScrollIndicator={false}
              onRefresh={onRefresh}
              refreshing={refreshing}
              keyExtractor={item => item.id.toString()}
              // onEndReached={_onEndReachLoadMore}
              // ListFooterComponent={_renderFooter}
              renderItem={({item}) => {
                // console.log(item.id);
                let iconName;
                if (item.isFavorite > 0) {
                  iconName = "require('../../assets/heart.png')";
                } else {
                  iconName = "require('../../assets/heart-o.png')";
                }
                return (
                  <ItemList
                    key={item.id}
                    id={item.id}
                    cat_id={item.category_id}
                    image={item.image}
                    price={item.price}
                    navigation={() => onNavigationHandler(item.id, item.name)}
                    toggleFav={() => onToggleFavorite(item.id)}
                    isFavorite={item.isFavorite}
                    name={item.name}
                    description={item.description}
                    qtySolds={qtySolds}
                    qtyAvailables={qtyAvailables}
                  />
                );
              }}
            />
          </View>
        )
      ) : (
        <Tabs
          style={{
            paddingVertical: 10,
          }}
          tabBarBackgroundColor="#fff"
          tabBarUnderlineStyle={{
            ...styles.tabBarUnderlineStyle,
          }}
          renderTabBar={() => (
            <ScrollableTab
              style={{
                backgroundColor: '#fff',
                borderWidth: 0,
              }}
              tabsContainerStyle={{
                padding: 6,
                shadowColor: 'rgba(132,156,185,0.15)',
                shadowOffset: {
                  width: 2,
                  height: 1,
                },
                shadowOpacity: 1,
                shadowRadius: 3.84,
              }}
            />
          )}>
          {product_category.map(d => {
            const catid = d.id;
            return (
              <Tab
                key={d.id}
                heading={d.name}
                activeTextStyle={{
                  ...styles.textStyle,
                  color: theme.dark ? '#fff' : Colors.textLight,
                  fontFamily: 'Roboto-Medium',
                  alignItems: 'center',
                  shadowColor: Colors.primary,
                  textAlign: 'center',
                  shadowOffset: {
                    width: 0,
                    height: 2,
                  },
                  shadowOpacity: 0.25,
                  shadowRadius: 3.84,

                  elevation: 5,
                }}
                textStyle={{
                  ...styles.textStyle,
                  color: theme.dark ? '#fff' : Colors.primary,
                  fontFamily: 'Roboto-Medium',
                }}
                activeTabStyle={{
                  ...styles.tabStyle,
                  alignItems: 'center',
                  backgroundColor: Colors.primary,
                  borderRadius: 8,
                  marginHorizontal: 10,
                  elevation: 5,
                }}
                tabStyle={{
                  backgroundColor: theme.dark ? '#333' : '#fff',
                  marginHorizontal: 10,
                  borderRadius: 8,
                  elevation: 5,
                }}>
                {!products.length ? (
                  <View
                    style={{
                      flex: 1,
                      justifyContent: 'center',
                      alignItems: 'center',
                    }}>
                    <Text>{i18n.t('search.No items found')}!</Text>
                  </View>
                ) : (
                  <View
                    style={{
                      flex: 1,
                      backgroundColor: '#fff',
                      // shadowColor: 'rgba(132,156,185,1)',
                      // elevation: 5,
                      // shadowColor: '#000',
                      // shadowOffset: {
                      //   width: 0,
                      //   height: 2,
                      // },
                      // shadowOpacity: 0.25,
                      // shadowRadius: 3.84,

                      // elevation: 5,
                    }}>
                    <FlatList
                      style={{
                        // shadowColor: '#000',
                        // shadowOffset: {
                        //   width: 0,
                        //   height: 2,
                        // },
                        // shadowOpacity: 0.25,
                        // shadowRadius: 3.84,

                        // elevation: 10,
                      }}
                      data={products.filter(d => d.sub_category_id == catid)}
                      extraData
                      // numColumns={2}
                      refreshing={refreshing}
                      onRefresh={onRefresh}
                      showsVerticalScrollIndicator={false}
                      initialNumToRender={products.length}
                      keyExtractor={item => item.id.toString()}
                      renderItem={({item}) => {
                        let iconName;
                        if (item.isFavorite > 0) {
                          iconName = "require('../../assets/heart-o.png')";
                        } else {
                          iconName = "require('../../assets/heart.png')";
                        }
                        // if (item.sub_category_id === catid) {
                        return (
                          <ItemList
                            key={item.id}
                            id={item.id}
                            cat_id={item.category_id}
                            image={item.image}
                            price={item.price}
                            navigation={() =>
                              onNavigationHandler(item.id, item.name)
                            }
                            toggleFav={() => onToggleFavorite(item.id)}
                            isFavorite={item.isFavorite}
                            name={item.name}
                            description={item.description}
                          />
                        );
                        // }
                      }}
                    />
                  </View>
                )}
              </Tab>
            );
          })}
        </Tabs>
      )}
    </React.Fragment>
  );
};
export const screenOptions = nav => {
  return {
    headerTitle: nav.route.params.name,
  };
};
export default Categories;
const styles = StyleSheet.create({
  tabBarUnderlineStyle: {
    backgroundColor: null,
    borderColor: Platform.OS === 'android' ? '#333' : null,
  },
  wrapper: {
    paddingLeft: 15,
    paddingRight: 15,
    paddingTop: 15,
  },
  item: {
    height: 150,
    backgroundColor: '#fff',
    marginBottom: 20,
    shadowColor: 'rgb(75, 89, 101)',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
  },
  netLabel: {
    fontSize: 18,
  },
  product: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  title: {
    fontSize: 20,
    fontWeight: '400',
    marginLeft: 10,
    // color: Color.primary,
    // paddingVertical: 20,
  },
  image: {
    width: SCREEN_WIDTH,
    height: SCREEN_WIDTH / 2,
  },
  wrapImage: {
    position: 'relative',
    paddingVertical: 20,
    alignItems: 'center',
  },
  floatingSection: {
    position: 'absolute',
    width: SCREEN_WIDTH,
    height: SCREEN_WIDTH / 5 - 30,
    backgroundColor: Color.primary,
    opacity: 0.8,
    bottom: 20,
    justifyContent: 'center',
    zIndex: 0,
  },
  label: {
    fontSize: 16,
    color: '#fff',
    fontWeight: '400',
    marginHorizontal: 20,
  },
  wrapLabel: {
    zIndex: 10,
  },
  loaded: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingRight: 20,
  },
  wr_category: {
    backgroundColor: '#fff',
    paddingHorizontal: 15,
    paddingVertical: 10,
    marginLeft: 5,
    borderRadius: 8,
    marginVertical: 10,
    marginTop: 15,
    color: '#ddd',
  },
  activeTabs: {
    backgroundColor: '#fff',
    paddingHorizontal: 15,
    paddingVertical: 10,
    marginLeft: 5,
    borderRadius: 8,
    marginVertical: 10,
    marginTop: 15,
    borderBottomColor: '#ddd',
    borderBottomWidth: 1.5,
  },
  activeTabStyle: {
    backgroundColor: 'white',
    // height: 40,
  },
  TabStyle: {
    backgroundColor: 'white',
    // height: 40,
  },
  loading: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  textStyle: {
    color: '#333',
    textTransform: 'uppercase',
    fontFamily: 'Roboto-Medium',
    // fontSize: 18,
  },
  row: {
    flex: 1,
    justifyContent: 'space-around',
  },
});
