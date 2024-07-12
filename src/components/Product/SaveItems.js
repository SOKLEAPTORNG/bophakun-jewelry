import React, {useEffect, useState} from 'react';
import {View, StyleSheet, Image, PlatformColor} from 'react-native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import {Colors as Color, IMAGE_PATH} from '../../constant/index';
import TouchableCmp from '../UI/TouchableCmp';
import {useTheme} from '@react-navigation/native';
import Text from '../../components/UI/DefaultText';
import PropTypes from 'prop-types';
import {Colors} from 'react-native/Libraries/NewAppScreen';
const propTypes = {
  image: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  size: PropTypes.string.isRequired,
  price: PropTypes.number.isRequired,
  promotion: PropTypes.oneOfType([PropTypes.array, PropTypes.object]),
  cat_id: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
};
const FavoriteItems = ({
  image,
  name,
  size,
  navigation,
  price,
  onRemove,
  promotion,
  cat_id,
}) => {
  const [state, setState] = useState({discount_value: 0});
  const promotions = promotion.filter(d => d.category_id === cat_id);
  useEffect(() => {
    if (promotions.length > 0) {
      promotions.map(d => {
        let new_price;
        if (d.discount_type === 'fixed') {
          new_price = d.discount_amount;
        } else {
          new_price = (price * d.discount_amount) / 100;
        }
        setState({
          ...state,
          discount_value: new_price,
        });
      });
    }
  }, []);
  const theme = useTheme();
  return (
    <View style={styles.wrapper}>
      <TouchableCmp onPress={navigation}>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}>
          <View style={styles.item}>
            <View style={styles.imgContainer}>
              <Image
                style={styles.img}
                source={{
                  uri: !!!image
                    ? `${IMAGE_PATH}/img/default.png`
                    : `${IMAGE_PATH}/uploads/img/${image}`,
                }}
              />
            </View>

            <View style={styles.wrappCotent}>
              <Text style={styles.title} numberOfLines={2}>
                {name}
              </Text>
              <View
                style={{
                  ...styles.flex,
                  marginTop: 3,
                }}>
                <View>
                  <View
                    style={{
                      ...styles.wrappBtnSummary,
                      paddingRight: 10,
                    }}>
                    <View style={{...styles.sizeContainer}}>
                      <Text style={{...styles.textSize}}>
                        Size:{' '}
                      </Text>
                      <Text style={{...styles.textSize}}>
                        {size ? size : 'Normal'}
                      </Text>
                    </View>
                    {promotions.length > 0 ? (
                      <View style={{flexDirection: 'row'}}>
                        <Text style={{...styles.price}}>
                          <Text
                            style={{
                              textDecorationLine: 'line-through',
                              fontSize: 16,
                              color: '#b9b9b9',
                              fontFamily: 'HomepageBaukasten-Book',
                            }}>
                            ${Number.parseFloat(price).toFixed(2)}
                          </Text>
                          <Text style={{...styles.price}}>
                            {'  '}$
                            {Number.parseFloat(
                              price - state.discount_value,
                            ).toFixed(2)}
                          </Text>
                        </Text>
                      </View>
                    ) : (
                      <Text style={styles.price}>
                        ${Number.parseFloat(price).toFixed(0)}
                      </Text>
                    )}
                  </View>
                </View>
              </View>
            </View>
          </View>
          <View
            style={{
              position: 'absolute',
              width: '100%',
              alignItems: 'flex-end',
              left: 6,
              top: -6,
            }}>
            <TouchableCmp onPress={onRemove}>
              <View
                style={{
                  width: 30,
                  height: 30,
                  alignItems: 'center',
                  justifyContent: 'center',
                  borderRadius: 40,
                }}>
                <Image
                  style={{
                    width: 21,
                    height: 21,
                    resizeMode: 'contain',
                  }}
                  source={require('../../assets/heart.png')}
                />
              </View>
            </TouchableCmp>
          </View>
        </View>
      </TouchableCmp>
    </View>
  );
};
FavoriteItems.PropTypes = propTypes;
const styles = StyleSheet.create({
  wrapper: {
    left: 0,
    right: 0,
    top: 0,
    marginTop: 5,
    marginVertical: 10,
    marginHorizontal: 20,
    padding: 10,
    borderWidth: 1,
    borderRadius: 15,
    borderColor: '#E2E2E2',
  },
  item: {
    flexDirection: 'row',
    height: 100,
    width: '70%',
  },
  sizeContainer: {
    flexDirection: 'row'
  },
  textSize: {
    fontFamily: 'Roboto-Regular',
    color: Color.accent,
    fontSize: 14,
    marginBottom: 3
  },
  favItem: {
    height: 250,
    width: '100%',
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
    // marginTop: 10
  },
  imgContainer: {
    width: 100,
    height: 100,
    borderColor: '#E8E8E8',
  },
  img: {
    flex: 1,
    width: null,
    height: null,
    borderRadius: 11,
  },
  wrappCotent: {
    padding: 5,
    left: 10,
  },
  flex: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  priceIcon: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    width: '85%',
  },
  wrappHeartIcon: {
    width: 26,
    height: 26,
    borderRadius: 15,
    zIndex: 10,
  },
  price: {
    fontSize: 16,
    fontFamily: 'Roboto-Regular',
    color: Color.secondary,
  },
  bgImage: {
    width: '100%',
    height: '100%',
    justifyContent: 'flex-end',
  },
  mealRow: {
    flexDirection: 'row',
  },
  mealHeader: {
    height: '85%',
  },
  mealDetail: {
    paddingHorizontal: 10,
    justifyContent: 'space-between',
    alignItems: 'center',
    height: '15%',
  },
  titleContainer: {
    backgroundColor: 'rgba(0,0,0,0.5)',
    paddingVertical: 5,
    paddingHorizontal: 12,
  },
  title: {
    fontFamily: 'Roboto-Bold',
    fontSize: 16,
    textTransform: 'capitalize',
    paddingRight: 10,
    color: '#000',
    width: '90%',
  },
});

export default React.memo(FavoriteItems);
