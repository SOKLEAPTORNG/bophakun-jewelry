import React, {useEffect, useState} from 'react';
import {View, StyleSheet, Image} from 'react-native';
import Fontisto from 'react-native-vector-icons/Fontisto';
import TouchableCmp from '../../components/UI/TouchableCmp';
import Text from '../UI/DefaultText';
import PropTypes from 'prop-types';
import {useSelector} from 'react-redux';
import {Colors} from '../../constant';
const propTypes = {
  size: PropTypes.string.isRequired,
  price: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
  onSelected: PropTypes.oneOfType([PropTypes.func, PropTypes.object]),
  selectedSize: PropTypes.oneOfType([PropTypes.string, PropTypes.any]),
  iconColor: PropTypes.string.isRequired,
  discount: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  discount_type: PropTypes.string,
};
const Index = ({
  size,
  price,
  onSelected,
  selectedSize,
  iconColor,
  discount,
  discount_type,
}) => {
  const [state, setState] = useState({
    price: 0,
  });
  useEffect(() => {
    const calculatePrice = () => {
      let new_price = 0;
      if (discount > 0) {
        if (discount_type === 'fixed') {
          new_price = price - discount;
        } else {
          new_price = price - (price * discount) / 100;
        }
        setState({...state, price: new_price});
      }
    };
    return calculatePrice();
  }, []);
  return (
    <TouchableCmp onPress={onSelected}>
      <View style={styles.container}>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
          }}>
          <Fontisto
            name={
              selectedSize === size ? 'checkbox-active' : 'checkbox-passive'
            }
            size={16}
            color={selectedSize === size ? Colors.secondary : Colors.darkGrey}
          />

          <Text style={{...styles.mainText}}>
            {size === 'DUMMY' ? 'Normal' : size}
          </Text>
        </View>
        {discount > 0 ? (
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
            }}>
            <Text
              style={{
                ...styles.mainText,
              }}>
              <Text
                style={{
                  color: Colors.darkGrey,
                  fontFamily: 'Helvetica-Bold',
                }}>
                {' '}
              </Text>
              <Text
                style={{
                  textDecorationLine: 'line-through',
                  color: Colors.accent,
                  opacity: 0.5,
                  fontFamily: 'Roboto-Regular',
                  fontSize: 14,
                }}>
                ${Number.parseFloat(price).toFixed(2)}
              </Text>
              <Text
                style={{
                  ...styles.price,
                }}>
                {'  '}
              </Text>
              <Text
                style={{
                  ...styles.price,
                }}>
                ${Number.parseFloat(state.price).toFixed(2)}
              </Text>
            </Text>
          </View>
        ) : (
          <Text
            style={{
              ...styles.price,
            }}>
            ${Number.parseFloat(price).toFixed(2)}
          </Text>
        )}
      </View>
    </TouchableCmp>
  );
};
Index.propTypes = propTypes;
export default Index;

const styles = StyleSheet.create({
  mainText: {
    paddingLeft: 5,
    fontSize: 14,
    fontFamily: 'Roboto-Regular',
    textTransform: 'capitalize',
    color: Colors.darkGrey,
  },
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 10,
    alignItems: 'center',
    paddingHorizontal: 10,
  },
  price: {
    fontFamily: 'Roboto-Regular',
    fontSize: 14,
    color: Colors.secondary,
    textTransform: 'uppercase',
  },
});
