import React, {useState, useEffect} from 'react';
import {View, StyleSheet, Image, PlatformColor} from 'react-native';
import Text from '../../components/UI/DefaultText';
import {
  SCREEN_HEIGHT,
  SCREEN_WIDTH,
  Colors,
  Colors as Color,
} from '../../constant/index';
import {useTheme} from '@react-navigation/native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import TouchableCmp from '../UI/TouchableCmp';
import {IMAGE_PATH} from '../../constant/index';
import PropTypes from 'prop-types';
import {ColorSpace} from 'react-native-redash';
import {Right} from 'native-base';

const handleAddToCart = async () => {
  try {
    if (itemPrice === 0 && !itemSize) {
      Alert.alert(
        i18n.t('productdetail.Please Select Option'),
        i18n.t('productdetail.Option price must be select one required'),
      );
    } else {
      const old_var_id = params.variations_id
        ? params.variations_id
        : variat_id;
      const isUpdate = existingCartItems ? 0 : 0;
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
        //check extraOptionStore filter out currect product id
        const otherExtraOption = extraOptionStore.filter(
          d => d.product_id !== prod_id,
        );
        const totalExtraOption = otherExtraOption.concat(extraOption);
        dispatch(actionCart.addExtraOption(totalExtraOption));
        onToggleSnackBar();
      }, 500);
    }
  } catch (e) {
    console.log(e.message);
  }
};
const propTypes = {
  image: PropTypes.string,
  price: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  name: PropTypes.string,
  navigation: PropTypes.func,
  promotion: PropTypes.oneOfType([
    PropTypes.arrayOf([PropTypes.array, PropTypes.object]),
  ]),
  cat_id: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
};
const RecommmentItems = ({
  image,
  price,
  name,
  navigation,
  promotion,
  onRemove,
  cat_id,
}) => {
  const [state, setState] = useState({
    discount_value: 0,
    discount_percentage: 0,
    discount_type: '',
  });
  const available_promotions = promotion.filter(d => d.category_id === cat_id);
  const theme = useTheme();
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
  useEffect(() => {
    if (available_promotions.length > 0) {
      available_promotions.map(d => {
        let discount;
        if (d.discount_type === 'fixed') {
          discount = d.discount_amount;
        } else {
          discount = (price * d.discount_amount) / 100;
        }
        setState({
          ...state,
          discount_value: discount,
          discount_percentage: Number.parseFloat(d.discount_amount),
          discount_type: d.discount_type,
        });
      });
    }
  }, [promotion]);
  const {colors} = theme;

  return (
    <View style={styles.itemContainer}>
      <TouchableCmp onPress={navigation}>
        <View
          style={{
            ...styles.container,
            // backgroundColor: theme.dark ? '#333' : Colors.background,
          }}>
          <View style={styles.imgContainer}>
            <Image
              source={{
                uri: !image
                  ? `${IMAGE_PATH}/img/default.png`
                  : `${IMAGE_PATH}/uploads/img/${image}`,
              }}
              style={{...styles.image}}
            />
          </View>
          <View style={{...styles.content}}>
            <Text style={{...styles.title}} numberOfLines={1}>
              {name}
            </Text>
            {state.discount_value > 0 ? (
              <View
                style={{
                  ...styles.priceContainer,
                }}>
                <View style={{}}>
                  <Text
                    style={{
                      textDecorationLine: 'line-through',
                      fontFamily: 'HomepageBaukasten-Book',
                      opacity: 0.5,
                      color: Colors.accent,
                      fontSize: 9,
                    }}>
                    USD{Number.parseFloat(price).toFixed(2)}
                  </Text>
                  <Text
                    style={{
                      ...styles.price,
                    }}>
                    USD
                    {Number.parseFloat(price - state.discount_value).toFixed(2)}
                  </Text>
                </View>
                {/* <TouchableCmp>
                  <View>
                    <Image
                      source={require('../../assets/heart.png')}
                      style={{width: 18, height: 18, resizeMode: 'contain'}}
                    />
                  </View>
                </TouchableCmp> */}
              </View>
            ) : (
              <View style={{...styles.priceContainer}}>
                <Text
                  style={{
                    ...styles.price,
                  }}>
                  ${Number.parseFloat(price).toFixed(2)}
                </Text>
                {/* <TouchableCmp>
                  <Image
                    source={require('../../assets/heart.png')}
                    style={{width: 18, height: 18, resizeMode: 'contain'}}
                  />
                </TouchableCmp> */}
              </View>
            )}
          </View>
          {state.discount_percentage > 0 && (
            <View style={styles.discount_container}>
              {state.discount_type === 'fixed' ? (
                <Text style={{...styles.textDiscount}}>
                  $ {state.discount_percentage.toFixed(0)} Off
                </Text>
              ) : (
                <Text style={{...styles.textDiscount}}>
                  {state.discount_percentage} % Off
                </Text>
              )}
            </View>
          )}
        </View>
      </TouchableCmp>
    </View>
  );
};
RecommmentItems.proTypes = propTypes;
export default RecommmentItems;
export const styles = StyleSheet.create({
  itemContainer: {
    paddingTop: 4,
    paddingLeft: 4,
    paddingTop: 16,
  },
  container: {
    overflow: 'hidden',
    width:
      Platform.OS === 'ios' ? SCREEN_WIDTH / 3 - 20 : SCREEN_WIDTH / 3 - 20,
    height: 140,
    marginRight: Platform.OS === 'ios' ? 10 : 10,
    justifyContent: 'space-between',
    marginBottom: 20,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#DEDEDE',
    borderRadius: 11,
    padding: 6,
  },
  imgContainer: {
    overflow: 'hidden',
    flexDirection: 'row',
    width:
      Platform.OS === 'ios' ? SCREEN_WIDTH / 3 - 26 : SCREEN_WIDTH / 3 - 26,
    height:
      Platform.OS === 'ios' ? SCREEN_WIDTH / 4 - 29 : SCREEN_WIDTH / 4 - 29,
    borderRadius: 6,
  },
  image: {
    width:
      Platform.OS === 'ios' ? SCREEN_WIDTH / 3 - 26 : SCREEN_WIDTH / 3 - 26,
    height:
      Platform.OS === 'ios' ? SCREEN_WIDTH / 4 - 29 : SCREEN_WIDTH / 4 - 29,
    resizeMode: 'cover',
  },
  content: {
    width: '100%',
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
    height: SCREEN_WIDTH / 4 - 10,
    paddingTop: 9,
  },
  title: {
    fontFamily: 'Roboto-Regular',
    fontSize: 10,
    color: Colors.text,
    textAlign: 'left',
    width: '100%',
  },
  discount_container: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 10,
    paddingHorizontal: 3,
    backgroundColor: '#E23737',
    height: 40,
    left: 13,
  },
  textDiscount: {
    color: '#fff',
    fontSize: 9,
    fontFamily: 'Poppins-Semibold',
  },
  price: {
    color: Colors.secondary,
    fontFamily: 'Roboto-Regular',
    fontSize: 10,
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    justifyContent: 'space-between',
    marginTop: 6,
  },
});
