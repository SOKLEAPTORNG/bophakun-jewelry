import React, {useState, useCallback, useEffect} from 'react';
import {View, StyleSheet, ActivityIndicator, Platform} from 'react-native';
import Text from '../../components/UI/DefaultText';
import Touchable from '../../components/UI/TouchableCmp';
import Icon from 'react-native-vector-icons/FontAwesome';
import {Image} from 'react-native-elements';
import {
  Colors,
  IMAGE_PATH,
  SCREEN_HEIGHT,
  SCREEN_WIDTH,
} from '../../constant/index';
import {useTheme} from '@react-navigation/native';
import PropType from 'prop-types';
import {useSelector} from 'react-redux';
const propTypes = {
  cat_id: PropType.number,
  navigation: PropType.func,
  image: PropType.oneOfType([PropType.string, PropType.oneOf([null])]),
  name: PropType.string.isRequired,
  isFavorite: PropType.number,
  price: PropType.oneOfType([PropType.number, PropType.string]).isRequired,
  toggleFav: PropType.func,
};
const Product = ({
  navigation,
  name,
  isFavorite,
  image,
  toggleFav,
  price,
  cat_id,
}) => {
  const [state, setState] = useState({
    discount: 0,
    type: '',
    discount_price: 0,
  });
  const {available_promotions} = useSelector(state => state.promotion);
  const promotions = available_promotions.filter(
    promo => promo.category_id === cat_id,
  );
  const theme = useTheme();
  const setPromtion = useCallback(() => {
    if (promotions.length > 0) {
      promotions.map(d => {
        let new_price;
        if (d.discount_type === 'fixed') {
          new_price = Number.parseFloat(d.discount_amount).toFixed(0);
        } else {
          new_price = (price * d.discount_amount) / 100;
        }
        setState({
          ...state,
          discount: d.discount_amount,
          type: d.discount_type,
          discount_price: new_price,
        });
      });
    }
    return;
  }, [price]);
  useEffect(() => {
    setPromtion();
  }, [setPromtion]);
  return (
      <Touchable onPress={navigation}>
        <View
          style={{
            alignItems: 'center',
          overflow: 'hidden',
            shadowColor: 'rgba(132,156,185,0.3)',
            shadowOffset: {
              width: 0,
              height: 0,
            },
            shadowOpacity: 1,
          shadowRadius: 10,
          }}>
          <View style={styles.container}>
            <View style={{...styles.item}}>
              <View style={{...styles.wr_img}}>
                <Image
                  source={{
                    uri: !image
                      ? `${IMAGE_PATH}/img/default.png`
                      : `${IMAGE_PATH}/uploads/img/${image}`,
                  }}
                  style={styles.listImage}
                  PlaceholderContent={
                    <ActivityIndicator size="large" color="#fff" />
                  }
                />
              </View>
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  paddingHorizontal: 17,
                  paddingTop: 10,
                }}>
                <View style={{}}>
                  <Text
                    numberOfLines={2}
                    style={{
                      ...styles.name,
                      width: SCREEN_WIDTH / 1.3,
                    }}>
                    {name}
                  </Text>
                  <View style={styles.budgetTagsContainer}>
                    {promotions.length > 0 ? (
                      <View style={{flexDirection: 'row'}}>
                        <Text
                          style={{
                            ...styles.budgetTagsText,
                            color: Colors.secondary,
                          }}>
                          ${' '}
                          <Text
                            style={{
                              textDecorationLine: 'line-through',
                            }}>
                            {Number.parseFloat(price).toFixed(2)}
                          </Text>
                        </Text>
                        <Text
                          style={{...styles.budgetTagsText, paddingLeft: 5}}>
                          {Number.parseFloat(
                            price - state.discount_price,
                          ).toFixed(2)}
                        </Text>
                      </View>
                    ) : (
                      <Text style={styles.budgetTagsText}>
                        $ {Number.parseFloat(price).toFixed(2)}
                      </Text>
                    )}
                    <View>
                      <Text
                        numberOfLines={1}
                        style={styles.budgetTagsText}></Text>
                    </View>
                  </View>
                </View>
                <Touchable onPress={toggleFav}>
                  <View>
                    <Image
                      style={{
                        width: 30,
                        height: 30,
                        resizeMode: 'contain',

                        // tintColor:
                        //   isFavorite > 0 ? Colors.primary : Colors.accent,
                      }}
                      source={
                        isFavorite > 0
                          ? require('../../assets/heart-o.png')
                          : require('../../assets/heart.png')
                      }
                    />
                  </View>
                </Touchable>
              </View>
              {state.discount > 0 &&
                (state.type === 'percentage' ? (
                  <View style={styles.newContainer}>
                    <Text style={styles.newText}>
                      {Number(state.discount)} % Off
                    </Text>
                  </View>
                ) : (
                  <View style={styles.newContainer}>
                    <Text style={styles.newText}>
                      {Number.parseFloat(state.discount).toFixed(2)} $ Off
                    </Text>
                  </View>
                ))}
              {state.discount > 0 &&
                (state.type === 'percentage' ? (
                  <View style={styles.newContainer}>
                    <Text style={styles.newText}>
                      {Number(state.discount)} % Off
                    </Text>
                  </View>
                ) : (
                  <View style={styles.newContainer}>
                    <Text style={styles.newText}>
                      {Number.parseFloat(state.discount).toFixed(2)} $ Off
                    </Text>
                  </View>
                ))}
            </View>
          </View>
        </View>
      </Touchable>
  );
};
Product.propTypes = propTypes;
export default Product;
const styles = StyleSheet.create({
  list: {
    width: Platform.OS === 'android' ? '45%' : SCREEN_WIDTH / 2 - 20,
    flexDirection: 'column',
    marginHorizontal: 10,
    borderRadius: 10,
  },
  wr_img: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    width: SCREEN_WIDTH / 1.1,
    height: Platform.OS === 'ios' ? SCREEN_HEIGHT / 4 - 10 : SCREEN_HEIGHT / 4,
  },
  listImage: {
    width: SCREEN_WIDTH / 1.1,
    height: Platform.OS === 'ios' ? SCREEN_HEIGHT / 4 - 10 : SCREEN_HEIGHT / 4,
    resizeMode: 'contain',
  },
  listingRatingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  name: {
    fontSize: 16,
    fontFamily: 'OpenSans-Bold',
  },
  container: {
    width: SCREEN_WIDTH / 1.1,
    height: Platform.OS === 'ios' ? SCREEN_HEIGHT / 3 : SCREEN_HEIGHT / 2.8,
    flex: 1,
    backgroundColor: '#f9f9f9',
    borderRadius: 27,
    overflow: 'hidden',
    elevation: 15,
    shadowColor: 'rgba(132,156,185,0.8)',
    marginVertical: Platform.OS === 'android' ? 20 : 20
  },
  item: {
    width: '100%', // is 50% of container width
    height:
      Platform.OS === 'ios' ? SCREEN_HEIGHT / 4 - 10 : SCREEN_HEIGHT / 3 - 20,
    paddingBottom: 20,
  },
  rating: {
    fontSize: 13,
    fontWeight: '100',
    color: '#333333',
  },
  budgetTagsContainer: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
  },
  budgetTagsText: {
    fontSize: 21,
    fontFamily: 'Poppins-Bold',
  },
  newContainer: {
    position: 'absolute',
    padding: 5,
    paddingHorizontal: 15,
    zIndex: 10,
    backgroundColor: Colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    top: 0,
    borderBottomRightRadius: 10,
    borderTopLeftRadius: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 2,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 2.27,

    elevation: 10,
  },
  newText: {
    color: '#000',
    fontWeight: '500',
    fontSize: 14,
  },
});
