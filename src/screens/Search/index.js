import React, {useState, useEffect, useCallback, createRef} from 'react';
import {
  View,
  TextInput,
  FlatList,
  StatusBar,
  StyleSheet,
  TouchableWithoutFeedback,
  Keyboard,
  Platform,
  Alert,
  Image,
} from 'react-native';
import {HeaderButtons, Item} from 'react-navigation-header-buttons';
import TouchableCmp from '../../components/UI/TouchableCmp';
import HeaderButton from '../../components/UI/HeaderButton';
import I18n from '../../../Translations/index';
import {useSelector, useDispatch} from 'react-redux';
import {BASE_URL} from '../../constant/index';
import {business_info} from '../../constant/index';
import axios from 'axios';
import ListItems from '../../components/Product/Items';
import {
  SCREEN_WIDTH,
  Colors,
  typeSearch,
  STATUSBAR_HEIGHT,
} from '../../constant/index';
import SimpleLineIcons from 'react-native-vector-icons/SimpleLineIcons';
import Icons from 'react-native-vector-icons/MaterialIcons';
// import * as actionSearch from '../../store/action/search';
import * as actionProducts from '../../store/action/product';
import {
  push,
  navigate,
  goBack,
  _onLoading,
  _onLoadingFinish,
} from '../../navigation/RootNavigation';
import Text from '../../components/UI/DefaultText';
import {useTheme} from '@react-navigation/native';
import CartCount from '../../components/Product/CartCount';
import i18n from '../../../Translations/index';
import {ColorSpace} from 'react-native-redash';
const Search = props => {
  const [itemData, setItemData] = useState([]);
  const [trigger, setTrigger] = useState(false);
  const [textInput, setTextInput] = useState(null);
  const [refreshing, setIsRefreshing] = useState(false);
  const [isKeyboardVisible, setKeyboardVisible] = useState(false);
  const [qtySolds, setQtySolds] = useState([]);
  const [qtyAvailables, setQtyAvailables] = useState([]);
  const listItems = useSelector(state => state.product.products);
  const isUser = useSelector(state => state.auth.userInfo);
  const inputRef = createRef({});
  const dispatch = useDispatch();
  const theme = useTheme();
  // const {history} = useSelector((state) => state.search);
  const onKeyboardAutoFocus = useCallback(() => {
    // setTimeout(() => {
    //   inputRef.current.focus();
    // }, 500);
  }, [inputRef]);
  const onTextChange = useCallback(
    value => {
      console.log('listItems', listItems);
      const data = listItems.filter(i =>
        i.name.toLowerCase().includes(value.toLowerCase()),
      );
      console.log('data search', data);
      if (value === '') {
        setItemData([]);
      } else {
        setItemData(data);
      }

      if (!isKeyboardVisible) {
        // dispatch(actionSearch.searchHistories(textInput));
        // console.log(value);
      }
    },
    [listItems, isKeyboardVisible, dispatch, textInput],
  );
  // const _onSubmitEditing = (value) => {
  //   dispatch(actionSearch.searchHistories(textInput));
  // };
  const _onClearHistory = () => {
    dispatch({
      type: typeSearch.CLEAR_TEXT_SEARCH_HISTORY,
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
  const _onKeybordDismiss = () => {
    Keyboard.dismiss;
  };
  const _onPressHandleNavigate = (id, name, cat_id) => {
    push('ProductDetail', {
      prod_id: id,
      headerTitle: name,
      cat_id: cat_id,
    });
  };
  const _onRefresh = async () => {
    setIsRefreshing(true);
    await dispatch(actionProducts.setProducts());
    setIsRefreshing(false);
  };
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
        setTrigger(!trigger);
        await dispatch(actionProducts.toggleAddFavorite(id));
        _onLoadingFinish();
      }
    } catch (er) {
      _onLoadingFinish();
    }
  };
  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener(
      'keyboardDidShow',
      () => {
        setKeyboardVisible(true); // or some other action
      },
    );
    const keyboardDidHideListener = Keyboard.addListener(
      'keyboardDidHide',
      () => {
        setKeyboardVisible(false); // or some other action
        // _onSubmitEditing();
      },
    );

    return () => {
      keyboardDidHideListener.remove();
      keyboardDidShowListener.remove();
    };
  }, []);
  useEffect(() => {
    props.navigation.setOptions({
      headerStyle: {
        backgroundColor: theme.dark ? '#333' : Colors.primary,
        height: Platform.OS === 'android' ? 75 : 120,
        shadowOffset: {height: 0, width: 0},
      },
      headerTitle: () => {
        return (
          <View style={styles.inputWrraper}>
            <TextInput
              ref={inputRef}
              placeholder={I18n.t('search.Search')}
              placeholderTextColor={Colors.secondary}
              style={styles.searchInput}
              color={'#000'}
              onLayout={() => onKeyboardAutoFocus()}
              onChangeText={value => onTextChange(value)}
              // onSubmitEditing={(val) => _onSubmitEditing(val)}
            />
          </View>
        );
      },
      headerLeft: () => (
        <HeaderButtons HeaderButtonComponent={HeaderButton}>
          <TouchableCmp
            style={{width: 50}}
            onPress={props.onPress ? props.onPress : () => goBack()}>
            <View>
              <Image
                style={{
                  width: 21,
                  height: 21,
                  marginLeft: 20,
                  resizeMode: 'contain',
                  tintColor: Colors.secondary,
                }}
                source={require('../../assets/chevron-left.png')}
              />
            </View>
          </TouchableCmp>
        </HeaderButtons>
      ),
      headerRight: () => (
        <>
          <HeaderButtons HeaderButtonComponent={HeaderButton}>
            <TouchableCmp
              style={{width: 50}}
              onPress={props.onPress ? props.onPress : () => navigate('Cart')}>
              <View>
                <Image
                  style={{
                    width: 26,
                    height: 26,
                    marginLeft: 10,
                    marginRight: Platform.OS === 'android' ? 10 : 0,
                    resizeMode: 'contain',
                    tintColor: Colors.secondary,
                  }}
                  source={require('../../assets/cart.png')}
                />
              </View>
            </TouchableCmp>
            <CartCount style={{top: -6, left: 6}} />
          </HeaderButtons>
        </>
      ),
    });
  }, [props, onKeyboardAutoFocus, inputRef, onTextChange]);

  return (
    <React.Fragment>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
        <View
          style={{
            ...styles.constainer,
            // backgroundColor: theme.colors.background,
          }}>
          <StatusBar barStyle={'dark-content'} />
          {!itemData.length ? (
            <View style={{justifyContent: 'center', alignItems: 'center'}}>
              {/* <View style={styles.historyContainer}>
                <View>
                  <Text>Search history</Text>
                </View>
                <ExtraTouchable onPress={_onClearHistory}>
                  <Text>Clear</Text>
                </ExtraTouchable>
              </View>
              {!history.length ? (
                <View style={styles.historyWrapper}>
                  <View style={styles.history}>
                    {history.map((d, index) => {
                      return <Text key={index}>{d.title}</Text>;
                    })}
                  </View>
                </View>
              ) : (
                <View style={{paddingHorizontal: 20}}>
                  <Text>No history</Text>
                </View>
              )} */}
              <Text>{I18n.t('search.No items found')}!</Text>
            </View>
          ) : (
            <View>
              <FlatList
                style={{
                  backgroundColor: '#fff',
                }}
                data={itemData}
                keyExtractor={(item, index) => index.toString()}
                numColumns={1}
                onRefresh={_onRefresh}
                refreshing={refreshing}
                showsVerticalScrollIndicator={false}
                initialNumToRender={10}
                renderItem={({item}) => {
                  let iconName;
                  if (item.isFavorite > 0) {
                    iconName = require('../../assets/heart-o.png');
                  } else {
                    iconName = require('../../assets/heart.png');
                  }
                  return (
                    <ListItems
                      cat_id={item.category_id}
                      image={item.image}
                      name={item.name}
                      id={item.id}
                      price={item.price}
                      navigation={() =>
                        _onPressHandleNavigate(
                          item.id,
                          item.name,
                          item.category_id,
                        )
                      }
                      isFavorite={item.isFavorite}
                      prod_cat_id={item.service_category_id}
                      toggleFav={() => onToggleFavorite(item.id)}
                      qtySolds={qtySolds}
                      qtyAvailables={qtyAvailables}
                    />
                  );
                }}
              />
            </View>
          )}
        </View>
      </TouchableWithoutFeedback>
    </React.Fragment>
  );
};

export const screenOptions = nav => {
  const Title = I18n.t('Search');
  return {
    headerTintColor: '#fff',
    headerLeft: () => (
      <HeaderButtons HeaderButtonComponent={HeaderButton}>
        <Item
          color={Colors.primary}
          title="Cart"
          iconName={'arrow-left'}
          iconSize={20}
          IconComponent={SimpleLineIcons}
          onPress={() => goBack()}
        />
      </HeaderButtons>
    ),
    headerRight: () => (
      <HeaderButtons HeaderButtonComponent={HeaderButton}>
        <Item
          color={Colors.primary}
          title="Cart"
          iconName={'shopping-cart'}
          iconSize={26}
          IconComponent={Icons}
          onPress={() => nav.navigation.navigate('Cart')}
        />
      </HeaderButtons>
    ),
  };
};
export default Search;
const styles = StyleSheet.create({
  constainer: {
    flex: 1,
    backgroundColor: 'white',
    paddingBottom: 15,
    paddingTop: 10,
  },
  header: {
    height: 120,
    top: STATUSBAR_HEIGHT,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  inputWrraper: {
    left: Platform.OS === 'android' ? -SCREEN_WIDTH / 6 + 35 : -10,
    width: SCREEN_WIDTH - 20 - 100,
    marginLeft: Platform.OS === 'ios' ? 13 : 18,
    backgroundColor: '#fff',
    paddingHorizontal: 10,
    borderRadius: 100,
  },
  searchInput: {
    height: 40,
    fontFamily: 'Roboto-Regular',
  },
  historyContainer: {
    padding: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  historyWrapper: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  history: {
    margin: 5,
    padding: 15,
    borderColor: '#ddd',
    borderWidth: 0.5,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
  },
});
