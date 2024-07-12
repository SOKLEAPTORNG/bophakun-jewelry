import React, {useState, useEffect} from 'react';
import {View, StyleSheet, Image} from 'react-native';
import Text from '../../components/UI/DefaultText';
import {
  SCREEN_HEIGHT,
  SCREEN_WIDTH,
  IMAGE_PATH,
  Colors as Color,
} from '../../constant/index';
import {useTheme} from '@react-navigation/native';
import TouchableCmp from '../UI/TouchableCmp';
import PropTypes from 'prop-types';

const propTypes = {
  image: PropTypes.string,
  price: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  name: PropTypes.string,
  navigation: PropTypes.func,
  promotion: PropTypes.oneOfType([
    PropTypes.arrayOf([PropTypes.array, PropTypes.object]),
    PropTypes.array,
    PropTypes.object,
  ]),
  cat_id: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
};
const PopularItems = ({navigation, image, name, price, promotion, cat_id}) => {
  const [state, setState] = useState({
    discount_value: 0,
    discount_percentage: 0,
    discount_type: '',
  });
  const available_promotions = promotion.filter(
    (d) => d.category_id === cat_id,
  );
  const theme = useTheme();
  useEffect(() => {
    if (available_promotions.length > 0) {
      available_promotions.map((d) => {
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
  return (
    <TouchableCmp onPress={navigation}>
      <View
        style={{
          ...styles.container,
          backgroundColor: theme.dark ? '#333' : '#fff',
        }}>
        <View style={styles.imgContainer}>
          {state.discount_percentage > 0 && (
            <View style={styles.discount_container}>
              {state.discount_type === 'fixed' ? (
                <Text style={{color: '#fff'}}>
                  $ {state.discount_percentage.toFixed(2)} Off
                </Text>
              ) : (
                <Text style={{color: '#fff'}}>
                  {state.discount_percentage} % Off
                </Text>
              )}
            </View>
          )}

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
          <Text style={{...styles.title}}>{name}</Text>
          {state.discount_value > 0 ? (
            <View style={{flexDirection: 'row'}}>
              <Text>
                ${' '}
                <Text
                  style={{textDecorationLine: 'line-through', opacity: 0.5}}>
                  {Number.parseFloat(price).toFixed(2)}
                </Text>
              </Text>
              <Text style={{paddingLeft: 5}}>
                {Number.parseFloat(price - state.discount_value).toFixed(2)}
              </Text>
            </View>
          ) : (
            <Text>$ {Number.parseFloat(price).toFixed(2)}</Text>
          )}
        </View>
      </View>
    </TouchableCmp>
  );
};
PopularItems.propTypes = propTypes;
export default PopularItems;
export const styles = StyleSheet.create({
  container: {
    padding: 10,
    backgroundColor: '#fff',
    marginHorizontal: 5,
    marginBottom: 10,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  imgContainer: {
    position: 'relative',
    height: 120, 
    width: 120,
    borderRadius: 0,
    overflow: 'hidden',
    flexDirection: 'row',
    backgroundColor:'#fff',
  },
  image: {
    flex: 1,
    width: null,
    height: null,
    resizeMode: 'contain',
  },
  content: {
    width: 120,
    paddingVertical: 5,
  },
  title: {
    fontFamily: 'OpenSans-Bold',
    fontSize: 14,
  },
  discount_container: {
    position: 'absolute',
    padding: 10,
    zIndex: 10,
    backgroundColor: Color.accent,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
