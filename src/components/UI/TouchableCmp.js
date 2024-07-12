import React from 'react';
import {
  TouchableOpacity,
  TouchableNativeFeedback,
  Platform,
} from 'react-native';
import PropTypes from 'prop-types';
const propTypes = {
  onPress: PropTypes.func,
  style: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
  children: PropTypes.node,
};

const Index = ({children, style, onPress}) => {
  let Touchable = TouchableOpacity;
  if (Platform.OS === 'android' && Platform.Version >= 21) {
    Touchable = TouchableNativeFeedback;
  }
  return (
    <Touchable onPress={onPress} style={style}>
      {children}
    </Touchable>
  );
};

Index.propTypes = propTypes;
export default Index;
