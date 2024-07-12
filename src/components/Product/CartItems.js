import React, {useState, useEffect, useCallback} from 'react';
import {View, StyleSheet, Image, Platform} from 'react-native';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import AntDesign from 'react-native-vector-icons/AntDesign';
import {
  Colors,
  IMAGE_PATH,
  SCREEN_HEIGHT,
  SCREEN_WIDTH,
} from '../../constant/index';
import {useSelector, useDispatch} from 'react-redux';
import Swipeable from 'react-native-gesture-handler/Swipeable';
import TouchableCmp from '../UI/TouchableCmp';
import {useTheme} from '@react-navigation/native';
import Text from '../../components/UI/DefaultText';
import PropTypes from 'prop-types';
import axios from 'axios';
import moment from 'moment';
import Promotion from '../../models/promotion';
import {BASE_URL} from '../../constant/index';
import {ColorSpace} from 'react-native-redash';
const propTypes = {
  navigation: PropTypes.oneOfType([PropTypes.func, PropTypes.object])
    .isRequired,
  image: PropTypes.string,
  name: PropTypes.string.isRequired,
  sub_amount: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  quantity: PropTypes.number.isRequired,
  onDecrementQTY: PropTypes.oneOfType([PropTypes.func, PropTypes.object])
    .isRequired,
  onRemove: PropTypes.oneOfType([PropTypes.func, PropTypes.object]).isRequired,
  size: PropTypes.string.isRequired,
  cat_id: PropTypes.number,
  promotion: PropTypes.oneOfType([PropTypes.array, PropTypes.object]),
  totalAmount: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
};

const defaultProps = {
  image: null || undefined,
};
const CartItems = ({
  navigation,
  image,
  name,
  sub_amount,
  quantity,
  onDecrementQTY,
  onIncrementQTY,
  size,
  onRemove,
  cat_id,
  promotion,
  totalAmount,
}) => {
  const [initailState, setInitailState] = useState({
    discount_value: 0,
    new_sub_amount: 0,
  });
  const promotions = promotion.filter(d => d.category_id === cat_id);
  /**
   * calculate discount value return new price
   */
  const company_data = useSelector(state => state.auth.companyInfo[0]);
  const company_id = company_data.id;
  const calulate_discount = useCallback(async () => {
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
        getPromotionRealTime = promoData.filter(d => d.category_id === cat_id);
      });
    if (getPromotionRealTime.length > 0) {
      getPromotionRealTime.map(d => {
        let total_sub_amount = 0;
        let discount;
        if (d.discount_type === 'fixed') {
          discount = d.discount_amount * quantity;
          total_sub_amount = totalAmount - discount;
        } else {
          discount = (sub_amount * d.discount_amount) / 100;
        }
        total_sub_amount = sub_amount - initailState.discount_value; // calculate sum total amount
        setInitailState({
          ...initailState,
          discount_value: discount,
          new_sub_amount: total_sub_amount,
        });
      });
    }
  }, [sub_amount, initailState.new_sub_amount]); // accepted two dependencies for update initiastats
  /**
   *
   */
  useEffect(() => {
    calulate_discount();
  }, [calulate_discount]);
  const theme = useTheme();
  const _rightAction = (progress, dragX) => {
    const scale = dragX.interpolate({
      inputRange: [-100, 0],
      outputRange: [1, 0],
      extrapolate: 'clamp',
    });
    return (
      <TouchableCmp onPress={onRemove}>
        <View style={{...styles.rightAction, backgroundColor: '#F12C2C'}}>
          <View style={styles.wrapperx}>
            <Image
              style={{width: 24, height: 24, resizeMode: 'contain'}}
              source={require('../../assets/trash.png')}
            />
          </View>
        </View>
      </TouchableCmp>
    );
  };
  return (
    <View style={{alignItems: 'center'}}>
      <TouchableCmp onPress={navigation}>
        <View style={styles.wrapper}>
          <TouchableCmp onPress={onRemove}>
            <View
              style={{
                position: 'absolute',
                top: Platform.OS === 'ios' ? -16 : -6,
                right: Platform.OS === 'ios' ? -16 : -6,
              }}>
              <Image
                style={{width: 24, height: 24, resizeMode: 'contain'}}
                source={require('../../assets/remove.png')}
              />
            </View>
          </TouchableCmp>
          <Swipeable renderRightActions={_rightAction}>
            <View
              style={{
                ...styles.item,
              }}>
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                }}>
                <TouchableCmp onPress={navigation}>
                  <View style={styles.imgContainer}>
                    <Image
                      style={styles.img}
                      source={{
                        uri: !!image
                          ? `${IMAGE_PATH}/uploads/img/${image}`
                          : `${IMAGE_PATH}/img/default.png`,
                      }}
                    />
                  </View>
                </TouchableCmp>
                <View style={styles.wrappCotent}>
                  <TouchableCmp onPress={navigation}>
                    <View>
                      <Text style={styles.title} numberOfLines={2}>
                        {name}
                      </Text>
                    </View>
                  </TouchableCmp>
                  <View
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      width: 'auto',
                    }}>
                    <Text style={styles.size}>
                      {size === 'DUMMY' ? 'Normal' : size}
                    </Text>
                  </View>
                  <View
                    style={{
                      ...styles.wrappBtnSummary,
                    }}>
                    <TouchableCmp onPress={navigation}>
                      <View>
                        {initailState.discount_value > 0 ? (
                          <View style={{alignItems: 'flex-start'}}>
                            <Text style={{...styles.price, fontSize: 12}}>
                              <Text
                                style={{
                                  fontSize: 12,
                                  fontFamily: 'HomepageBaukasten-Book',
                                  textDecorationLine: 'line-through',
                                  opacity: 0.5,
                                }}>
                                ${Number.parseFloat(sub_amount).toFixed(2)}
                              </Text>
                            </Text>
                            <Text
                              style={{
                                ...styles.price,
                              }}>
                              $
                              {Number.parseFloat(
                                initailState.new_sub_amount,
                              ).toFixed(2)}
                            </Text>
                          </View>
                        ) : (
                          <Text style={styles.price}>
                            ${Number.parseFloat(sub_amount).toFixed(2)}
                          </Text>
                        )}
                      </View>
                    </TouchableCmp>
                  </View>
                </View>
              </View>
            </View>
          </Swipeable>
        </View>
      </TouchableCmp>
    </View>
  );
};
CartItems.propTypes = propTypes;
CartItems.defaultProps = defaultProps;
const styles = StyleSheet.create({
  qtyContainer: {},
  rightAction: {
    justifyContent: 'center',
    alignItems: 'center',
    flex: Platform.OS === 'ios' ? 1 : 0,
  },
  wrapperx: {
    paddingHorizontal: 20,
    alignItems: 'center',
    flexDirection: 'row',
  },
  wrapper: {
    marginTop: Platform.OS === 'ios' ? 20 : 18,
    width: SCREEN_WIDTH / 1.1,
    borderColor: '#E8E8E8',
    borderWidth: 1,
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 10,
    alignItems: 'flex-end',
    position: 'relative',
  },
  item: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'flex-start',
    shadowColor: 'rgb(75, 89, 101)',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    overflow: 'visible',
  },
  size: {
    fontFamily: 'Roboto-Regular',
    fontSize: 14,
    color: '#5D5D5D',
    marginVertical: 6,
  },
  sizeContainer: {
    paddingVertical: 5,
  },
  textSize: {
    // fontFamily: 'OpenSans-Bold',
    textTransform: 'capitalize',
  },
  favItem: {
    height: 250,
    width: '100%',
    backgroundColor: '#f5f5f5',
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
    // marginTop: 10
  },
  imgContainer: {
    overflow: 'hidden',
    borderRadius: 11,
    width: SCREEN_WIDTH / 3,
    height: Platform.OS === 'android' ? SCREEN_WIDTH / 3 : SCREEN_WIDTH / 3,
  },
  textQty: {
    fontFamily: 'Gotham-Bold',
    fontSize: 16,
    paddingHorizontal: 4,
    color: Colors.accent,
  },
  img: {
    flex: 1,
    width: null,
    height: null,
  },
  wrappCotent: {
    // padding: 10,
    paddingLeft: 10,
    width: '60%',
  },
  priceIcon: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    width: '85%',
  },
  wrappHeartIcon: {
    width: 30,
    height: 30,
    borderRadius: 15,
    zIndex: 10,
  },
  price: {
    fontSize: 18,
    fontFamily: 'Roboto-Regular',
    color: Colors.secondary,
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
    color: Colors.text,
    fontSize: 16,
    textTransform: 'capitalize',
    width: '80%',
  },
  wrappBtnSummary: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 2,
  },
  textQuantity: {
    paddingHorizontal: 10,
    fontFamily: 'OpenSans-Bold',
    fontSize: 16,
  },
  wrappIcon: {
    justifyContent: 'center',
    alignItems: 'center',
    width: 25,
    height: 25,
    backgroundColor: '#000',
    borderRadius: 26,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,

    elevation: 2,
  },
  icon: {
    width: 12,
    height: 12,
    resizeMode: 'contain',
    tintColor: Colors.accent,
  },
});

export default CartItems;
