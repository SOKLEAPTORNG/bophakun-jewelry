import React, {useEffect, useCallback, useState} from 'react';
import {View, Platform, StyleSheet, FlatList, Alert, Image} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import {HeaderButtons, Item} from 'react-navigation-header-buttons';
import HeaderButton from '../../components/UI/HeaderButton';
import {Colors as Color, Colors, SCREEN_WIDTH} from '../../constant/index';
import * as actionProduct from '../../store/action/product';
import {Tabs, ScrollableTab} from 'native-base';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import {useTheme} from '@react-navigation/native';
import ItemList from '../../components/Product/Items';
import TouchableCmp from '../../components/UI/TouchableCmp';
import CartCount from '../../components/Product/CartCount';
import {
  _onLoading,
  _onLoadingFinish,
  navigate,
} from '../../navigation/RootNavigation';
import i18n from '../../../Translations/index';
import Tab from '../../components/UI/Tab';
import {BASE_URL} from '../../constant/index';
import {business_info} from '../../constant/index';
import axios from 'axios';

const Categories = props => {
  const [refreshing, setRefreshing] = useState(false);
  const theme = useTheme();
  const product_category = useSelector(state =>
    state.product.product_categories.filter(d => d.parent_id == 0),
  );
  console.log('product_category', product_category);
  const products = useSelector(state => state.product.products);
  console.log('products', products);
  const isUser = useSelector(state => state.auth.userInfo);
  const dispatch = useDispatch();
  const [qtySolds, setQtySolds] = useState([]);
  const [qtyAvailables, setQtyAvailables] = useState([]);
  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await dispatch(actionProduct.setProducts());
    setRefreshing(false);
  }, [dispatch]);
  const onNavigationHandler = (val, name, cat_id) => {
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
      headerLeft: () => (
        <>
          <HeaderButtons HeaderButtonComponent={HeaderButton}>
            <View style={styles.headerLeft}>
              <TouchableCmp onPress={() => navigate('Home')}>
                <View>
                  <Image
                    style={{
                      width: 18,
                      height: 18,
                      resizeMode: 'contain',
                      tintColor: Colors.secondary,
                    }}
                    source={require('../../assets/chevron-left.png')}
                  />
                </View>
              </TouchableCmp>
            </View>
          </HeaderButtons>
        </>
      ),
      headerRight: () => (
        <>
          <HeaderButtons HeaderButtonComponent={HeaderButton}>
            <View style={styles.headerRight}>
              <TouchableCmp onPress={() => navigate('Cart')}>
                <View>
                  <Image
                    style={{
                      width: 24,
                      height: 23,
                      resizeMode: 'contain',
                      tintColor: Colors.secondary,
                    }}
                    source={require('../../assets/cart.png')}
                  />
                  <CartCount
                    style={{
                      left: -4,
                      top: -6,
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
  const renderItems = data => {
    return (
      <View
        style={{paddingTop: 10, backgroundColor: 'red', alignItems: 'center'}}>
        <FlatList
          style={{
            backgroundColor: theme.dark ? '#333' : '#fff',
            paddingTop: 20,
          }}
          data={products.filter(d => d.category_id == catid)}
          extraData
          numColumns={2}
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
                navigation={() => onNavigationHandler(item.id, item.name)}
                toggleFav={() => onToggleFavorite(item.id)}
                isFavorite={item.isFavorite}
                name={item.name}
                description={item.description}
                qtySolds={qtySolds}
                qtyAvailables={qtyAvailables}
              />
            );
            // }
          }}
        />
      </View>
    );
  };
  return (
    <React.Fragment>
      {product_category.length === 1 ? (
        renderItems(products)
      ) : (
        <Tabs
          renderTabBar={() => (
            <ScrollableTab
              style={{
                borderWidth: 0,
                backgroundColor: Colors.background,
                height: 60,
              }}
              tabsContainerStyle={
                {
                  // padding: 6,
                }
              }
            />
          )}
          tabBarUnderlineStyle={{
            ...styles.tabBarUnderlineStyle,
          }}>
          {product_category.map(d => {
            const catid = d.id;
            return (
              <Tab
                key={d.id}
                heading={d.name}
                activeTextStyle={{
                  ...styles.textStyle,
                  color: theme.dark ? '#fff' : Colors.secondary,
                }}
                textStyle={{
                  ...styles.textStyle,
                  color: theme.dark ? '#fff' : '#CBCBCB',
                }}
                activeTabStyle={{
                  ...styles.tabStyle,
                  backgroundColor: theme.dark ? '#333' : '#fff',
                }}
                tabStyle={{
                  backgroundColor: theme.dark ? '#333' : '#fff',
                }}>
                <View style={{alignItems: 'center', paddingBottom: 80}}>
                  <FlatList
                    style={{
                      backgroundColor: theme.dark ? '#333' : '#fff',
                      paddingTop: 20,
                    }}
                    data={products.filter(d => d.category_id == catid)}
                    extraData
                    numColumns={2}
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
                          qtySolds={qtySolds}
                          qtyAvailables={qtyAvailables}
                        />
                      );
                      // }
                    }}
                  />
                </View>
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
    headerTitle: i18n.t('drawer.All Category'),
  };
};
export default Categories;
const styles = StyleSheet.create({
  tabBarUnderlineStyle: {
    backgroundColor: Colors.secondary,
    height: 1,
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
    fontWeight: '300',
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
    // backgroundColor:Color.primary
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
    textTransform: 'capitalize',
    fontFamily: 'Raleway-Semibold',
    fontWeight: 'bold',
  },
  headerRight: {
    marginRight: 20,
  },
  headerLeft: {
    marginLeft: 20,
  },
});
