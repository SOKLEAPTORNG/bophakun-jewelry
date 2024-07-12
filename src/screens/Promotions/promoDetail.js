import React, {useState, useEffect} from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  FlatList,
  Platform,
} from 'react-native';
import {
  SCREEN_WIDTH,
  DISCOUNT_PATH,
  IMAGE_PATH,
  STATUSBAR_HEIGHT,
  SCREEN_HEIGHT,
} from '../../constant/index';
import Text from '../../components/UI/DefaultText';
import {useSelector} from 'react-redux';
import {Image} from 'react-native-elements';
import moment from 'moment';
import i18n from '../../../Translations/index';
import ItemList from '../../components/Product/Items';
import TouchableCmp from '../../components/UI/TouchableCmp';
import {Colors} from '../../constant/index';
import CartCount from '../../components/Product/CartCount';

import {
  navigate,
  loadRef,
  _onLoading,
  _onLoadingFinish,
  goBack,
} from '../../navigation/RootNavigation';
const PromoDetail = ({route, navigation}) => {
  const [initailState, setInitailState] = useState({
    image: null,
    name: '',
    create_at: '',
    description: '',
    start_at: '',
    end_at: '',
    category_id: '',
  });

  const {id, notification} = route.params;
  const [qtySolds, setQtySolds] = useState([]);
  const [qtyAvailables, setQtyAvailables] = useState([]);
  const promotion = useSelector(state =>
    state.promotion.promotion.filter(d => d.id === id),
  );
  const notifications = useSelector(state =>
    state.notification.notifications.filter(item => item.id === id),
  );
  useEffect(() => {
    if (!notification) {
      const {
        image,
        name,
        create_at,
        description,
        start_at,
        end_at,
        category_id,
      } = promotion[0];
      setInitailState({
        ...initailState,
        name: name,
        image: image,
        create_at: create_at,
        description: description,
        start_at: start_at,
        end_at: end_at,
        category_id: category_id,
      });
    } else {
      const {title, description, created_date, image} = notifications[0];
      const create_at = moment(created_date).format('L');
      setInitailState({
        ...initailState,
        name: title,
        image: image,
        create_at: create_at,
        description: description,
        start_at: start_at,
        end_at: end_at,
        category_id: category_id,
      });
    }
  }, []);
  useEffect(() => {
    navigation.setOptions({
      headerTitle: (
        <Image
          style={{
            width: 120,
            height: 60,
            resizeMode: 'contain',
          }}
          source={require('../../assets/logo.png')}
        />
      ),
    });
  }, []);
  const {image, name, create_at, description, start_at, end_at, category_id} =
    initailState;
  const start_date = moment(start_at).format('MMM Do YYYY');
  const end_date = moment(end_at).format('MMMM Do YYYY');
  const products = useSelector(state =>
    state.product.products.filter(
      d => d.category_id === category_id || d.sub_category_id === category_id,
    ),
  );
  const onNavigationHandler = (val, name) => {
    navigate('ProductDetail', {
      prod_id: val,
      headerTitle: name,
      cat_id: category_id,
    });
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
        await dispatch(actionProduct.toggleAddFavorite(id));
        _onLoadingFinish();
      }
    } catch (er) {
      _onLoadingFinish();
    }
  };
  return (
    <ScrollView>
      <View
        style={{
          backgroundColor: Colors.primary,
          paddingTop: Platform.OS === 'ios' ? 70 : 40,
        }}>
        <View style={{...styles.header}}>
          <View style={{...styles.headerContainer}}>
            <TouchableCmp onPress={() => goBack('')}>
              <View>
                <Image
                  style={{
                    width: 21,
                    height: 21,
                    resizeMode: 'contain',
                    tintColor: Colors.secondary,
                  }}
                  source={require('../../assets/chevron-left.png')}
                />
              </View>
            </TouchableCmp>
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
            <TouchableCmp onPress={() => navigate('Cart')}>
              <View>
                <Image
                  style={{
                    width: 26,
                    height: 26,
                    resizeMode: 'contain',
                    tintColor: Colors.secondary,
                  }}
                  source={require('../../assets/cart.png')}
                />
                <CartCount style={{top: -5, left: -3}} />
              </View>
            </TouchableCmp>
          </View>
        </View>
      </View>
      <View style={{...styles.container}}>
        <View style={{...styles.wrapper}}>
          <View style={{...styles.imgContainer}}>
            <Image
              source={{
                uri:
                  image !== null
                    ? `${DISCOUNT_PATH}${image}`
                    : `${IMAGE_PATH}img/default.png`,
              }}
              style={{...styles.img}}
              PlaceholderContent={
                <ActivityIndicator size="large" color="#fff" />
              }
            />
          </View>
        </View>
      </View>
      <View
        style={{
          alignItems: 'center',
          marginTop: Platform.OS === 'android' ? 20 : 0,
        }}>
        <FlatList
          style={{}}
          data={products}
          extraData
          numColumns={2}
          // initialNumToRender={5}
          // onRefresh={onRefresh}
          // refreshing={refreshing}
          keyExtractor={item => item.id.toString()}
          // onEndReached={_onEndReachLoadMore}
          // ListFooterComponent={_renderFooter}
          renderItem={({item}) => {
            // console.log(item.id);
            let iconName;
            if (item.isFavorite > 0) {
              iconName = 'heart';
            } else {
              iconName = 'heart-o';
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
                iconName={iconName}
                name={item.name}
                description={item.description}
                qtySolds={qtySolds}
                qtyAvailables={qtyAvailables}
              />
            );
          }}
        />
      </View>
    </ScrollView>
  );
};
export default PromoDetail;

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  headerContainer: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    height: 50,
    flex: 1,
  },
  promotionTitle: {
    fontFamily: 'Poppins-Semibold',
    fontSize: 16,
    color: Colors.secondary,
  },
  container: {
    padding: 10,
    backgroundColor: Colors.primary,
    height: 100,
    marginBottom: Platform.OS === 'ios' ? 150 : 130,
  },
  title: {
    fontFamily: 'OpenSans-Bold',
    fontSize: 16,
  },
  wrapper: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 10,
  },
  imgContainer: {
    position: 'relative',
    width: SCREEN_WIDTH / 1.1,
    height:
      Platform.OS === 'android'
        ? SCREEN_HEIGHT / 4 - 10
        : SCREEN_HEIGHT / 4 - 35,
    borderRadius: 12,
    marginTop: 50,
    overflow: 'hidden',
  },
  img: {
    width: SCREEN_WIDTH / 1.1,
    height:
      Platform.OS === 'android'
        ? SCREEN_HEIGHT / 4 - 10
        : SCREEN_HEIGHT / 4 - 35,
    // flex: 1,
    resizeMode: 'cover',
  },
  date: {
    position: 'absolute',
    paddingHorizontal: 5,
    bottom: 0,
    height: 30,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#000',
    width: SCREEN_WIDTH - 10,
    opacity: 0.5,
    // paddingHorizontal: 5,
  },
});
