import React from 'react';
import {View, StyleSheet} from 'react-native';
import PropType from 'prop-types';
const propTypes = {
  children: PropType.node,
  style: PropType.oneOfType([PropType.array, PropType.object]),
};
const Card = ({style, children}) => {
  return <View style={{...styles.card, ...style}}>{children}</View>;
};

const styles = StyleSheet.create({
  card: {},
});
Card.propTypes = propTypes;
export default Card;
