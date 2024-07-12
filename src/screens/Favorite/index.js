import React, {useState, useEffect} from 'react';
import {View, FlatList, StyleSheet, Image} from 'react-native';
import Text from '../../components/UI/DefaultText';
import {HeaderButtons, Item} from 'react-navigation-header-buttons';
import HeaderButton from '../../components/UI/HeaderButton';
import TouchableCmp from '../../components/UI/TouchableCmp';
import FavoriteCount from '../../components/Product/FavoriteCount';
import {useTheme} from '@react-navigation/native';
import {useSelector} from 'react-redux';
import SaveItems from '../../components/Product/SaveItems';
import {
  navigate,
  _onLoading,
  _onLoadingFinish,
} from '../../navigation/RootNavigation';
import * as actionProduct from '../../store/action/product';
import {useDispatch} from 'react-redux';
import {Colors} from '../../constant/index';
import I18n from '../../../Translations/index';
const FavoriteOverviewScreen = props => {
  const [refreshing, setIsRefreshing] = useState(false);
  const items = useSelector(state => state.product.products);
  const saveItems = items.filter(d => d.isFavorite > 0);
  const theme = useTheme();
  const {available_promotions} = useSelector(state => state.promotion);
  const dispatch = useDispatch();
  const _onPressNavigate = (id, title, cat_id) => {
    navigate('ProductDetail', {
      prod_id: id,
      headerTitle: title,
      cat_id: cat_id,
    });
  };
  const fetchProduct = async () => {
    await dispatch(actionProduct.setProducts());
  };
  const _onRefresh = () => {
    setIsRefreshing(true);
    fetchProduct().then(() => {
      setIsRefreshing(false);
    });
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
            <View style={{marginRight: 20}}>
              <TouchableCmp onPress={() => navigate('Cart')}>
                <View>
                  <Image
                    style={{
                      width: 24,
                      height: 23,
                      resizeMode: 'contain',
                      tintColor: Colors.secondary,
                    }}
                    source={require('../../assets/heart.png')}
                  />
                  <FavoriteCount
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
  const _onRemoveSaveItems = async id => {
    try {
      _onLoading();
      await dispatch(actionProduct.toggleAddFavorite(id));
      await dispatch(actionProduct.setProducts());
      _onLoadingFinish();
    } catch (err) {
      console.log(err);
      _onLoadingFinish();
    }
  };
  if (saveItems.length === 0) {
    return (
      <View style={styles.centered}>
        <Image source={require('../../assets/logo.png')} style={styles.image} />
        <Text
          style={{
            // opacity: 0.5,
            fontSize: 16,
            marginTop: 20,
            fontFamily: 'Opensans-Regular',
          }}>
          {I18n.t('favorite.No Items Found!')}
        </Text>
      </View>
    );
  }
  return (
    <>
      <View style={{paddingTop: 20}}>
        <FlatList
          data={saveItems}
          keyExtractor={({id}) => id.toString()}
          refreshing={refreshing}
          onRefresh={_onRefresh}
          renderItem={items => (
            <SaveItems
              name={items.item.name}
              image={items.item.image}
              price={items.item.price}
              cat_id={items.item.category_id}
              promotion={available_promotions}
              navigation={() =>
                _onPressNavigate(
                  items.item.id,
                  items.item.name,
                  items.item.category_id,
                )
              }
              onRemove={() => _onRemoveSaveItems(items.item.id)}
            />
          )}
        />
      </View>
    </>
  );
};
export default FavoriteOverviewScreen;
export const screenOptions = ({navigation}) => {
  return {
    headerTitle: I18n.t('favorite.Save'),
  };
};
const styles = StyleSheet.create({
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    resizeMode: 'contain',
    width: 200,
    height: 200,
    marginLeft: 29,
  },
});
