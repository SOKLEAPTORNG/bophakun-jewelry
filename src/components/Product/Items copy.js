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
  iconName: PropType.string.isRequired,
  price: PropType.oneOfType([PropType.number, PropType.string]).isRequired,
  toggleFav: PropType.func,
};
const Product = ({
  navigation,
  name,
  iconName,
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
  const {available_promotions} = useSelector((state) => state.promotion);
  const promotions = available_promotions.filter(
    (promo) => promo.category_id === cat_id,
  );
  const theme = useTheme();
  const setPromtion = useCallback(() => {
    if (promotions.length > 0) {
      promotions.map((d) => {
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
      <View style={{...styles.list,borderRadius:10}}>
        <View style={{...styles.wr_img}}>
          <Image
            source={{
              uri: !image
                ? `${IMAGE_PATH}/img/default.png`
                : `${IMAGE_PATH}/uploads/img/${image}`,
            }}
            style={styles.listImage}
            PlaceholderContent={<ActivityIndicator size="large" color="#fff" />}
          />
        </View>
        <View style={styles.listingRatingContainer}>
          <View style={{flex: 1}}>
            <Text style={{...styles.name}}>{name}</Text>
          </View>
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <Touchable onPress={toggleFav}>
              <Icon name={iconName} size={24} color={Colors.primary} />
            </Touchable>
            {/* </Text> */}
          </View>
        </View>
        <View style={styles.budgetTagsContainer}>
          {promotions.length > 0 ? (
            <View style={{flexDirection: 'row'}}>
              <Text
                style={{
                  ...styles.budgetTagsText,
                }}>
                ${' '}
                <Text style={{textDecorationLine: 'line-through'}}>
                  {Number.parseFloat(price).toFixed(2)}
                </Text>
              </Text>
              <Text style={{...styles.budgetTagsText, paddingLeft: 5}}>
                {Number.parseFloat(price - state.discount_price).toFixed(2)}
              </Text>
            </View>
          ) : (
            <Text style={styles.budgetTagsText}>
              $ {Number.parseFloat(price).toFixed(2)}
            </Text>
          )}
          <View>
            <Text numberOfLines={1} style={styles.budgetTagsText}></Text>
          </View>
        </View>
        {state.discount > 0 &&
          (state.type === 'percentage' ? (
            <View style={styles.newContainer}>
              <Text style={styles.newText}>{Number(state.discount)} % Off</Text>
            </View>
          ) : (
            <View style={styles.newContainer}>
              <Text style={styles.newText}>
                {Number.parseFloat(state.discount).toFixed(2)} $ Off
              </Text>
            </View>
          ))}
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
    // paddingHorizontal: 10,
    // paddingBottom: 10,
    marginHorizontal: 10,
    borderRadius:10,
    marginBottom: 10,
    
  },
  wr_img: {
    backgroundColor:'#fff', 
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5
  },
  listImage: { 
  height: 120,  
  width: null,
  // resizeMode: 'contain'
    resizeMode: 'cover',
  },
  listingRatingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  name: {
    // fontWeight: '500',
    fontSize: 16,
    fontFamily: 'OpenSans-Bold',
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
    // fontWeight: '100',
    fontSize: 15,
  },
  newContainer: {
    position: 'absolute',
    top: 20,
    left: 10,
    backgroundColor: Colors.primary,
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  newText: {
    color: '#FFFFFF',
    fontWeight: '500',
  },
});
