import React from 'react';
import {StyleSheet, Platform} from 'react-native';
import {useSelector} from 'react-redux';
import {Badge} from 'react-native-paper';
import {Colors} from 'react-native/Libraries/NewAppScreen';
import {Colors as Color} from '../../constant';
export default function (props) {
  const items = useSelector(state => state.product.products);
  const saveItems = items.filter(d => d.isFavorite > 0);
  const cartItems = useSelector(state => {
    const transformedCartItems = [];
    for (const key in state.carts.cartItems) {
      transformedCartItems.push({
        productId: key,
      });
    }
    return transformedCartItems;
  });
  const styles = StyleSheet.create({
    badgeStyle: {
      position: 'absolute',
      top: Platform.OS === 'ios' ? 0 : 5,
      left: 10,
      opacity: cartItems.length !== 0 ? 1 : 0,
      fontSize: 10,
      backgroundColor: '#F12C2C',
      fontFamily: 'Gotham-Bold',
      fontWeight: 'bold',
      color: '#fff',
    },
  });

  return (
    <Badge size={16} style={{...styles.badgeStyle, ...props.style}}>
      {saveItems.length}
    </Badge>
  );
}
