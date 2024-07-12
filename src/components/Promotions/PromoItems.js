import React from 'react';
import {View, StyleSheet, Image, Platform} from 'react-native';
import {
  SCREEN_WIDTH,
  Colors,
  DISCOUNT_PATH,
  IMAGE_PATH,
  SCREEN_HEIGHT,
} from '../../constant/index';
import ExtraToucable from '../UI/TouchableCmp';
import PropTypes from 'prop-types';
import {useTheme} from '@react-navigation/native';
const propTypes = {
  onSelect: PropTypes.func.isRequired,
  name: PropTypes.string.isRequired,
  createAt: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
};
const PromoItems = ({onSelect, image}) => {
  const theme = useTheme();
  return (
    <ExtraToucable onPress={onSelect}>
      <View style={{...styles.iconCotainer}}>
        <Image
          style={{
            ...styles.image,
          }}
          source={{
            uri:
              image !== null
                ? `${DISCOUNT_PATH}${image}`
                : `${IMAGE_PATH}img/default.png`,
          }}
        />
      </View>
    </ExtraToucable>
  );
};
PromoItems.propTypes = propTypes;
export default PromoItems;
const styles = StyleSheet.create({
  iconCotainer: {
    width: SCREEN_WIDTH / 1.1,
    height:
      Platform.OS === 'android'
        ? SCREEN_HEIGHT / 4 - 10
        : SCREEN_HEIGHT / 4 - 35,

    borderRadius: 20,
    backgroundColor: Colors.secondary,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
  },
  image: {
    width: SCREEN_WIDTH / 1.1,
    height:
      Platform.OS === 'android'
        ? SCREEN_HEIGHT / 4 - 10
        : SCREEN_HEIGHT / 4 - 35,
    borderRadius: 20,
    resizeMode: 'cover',
  },
});
