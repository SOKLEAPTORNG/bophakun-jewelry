import React from 'react';
import {Text, StyleSheet} from 'react-native';
import {useTheme} from '@react-navigation/native';
import PropType from 'prop-types';
const propTypes = {
  children: PropType.node,
  numberOfLines: PropType.number,
  style: PropType.oneOfType([PropType.object, PropType.array]),
};
const Index = ({children, style, numberOfLines}) => {
  const {colors} = useTheme();
  return (
    <Text
      style={{...styles.mainText, color: colors.text, ...style}}
      numberOfLines={numberOfLines}>
      {children}
    </Text>
  );
};
Index.propTypes = propTypes;
export default Index;

const styles = StyleSheet.create({
  mainText: {
    fontFamily: 'OpenSans-Regular',
  },
});
