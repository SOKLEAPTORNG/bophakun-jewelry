import React from 'react';
import PropType from 'prop-types';
import {View, StyleSheet, Platform} from 'react-native';
import Swiper from 'react-native-swiper';
import {SCREEN_HEIGHT, SCREEN_WIDTH, SLIDER_PATH} from '../../constant/index';
import {useSelector} from 'react-redux';
import {Placeholder, PlaceholderLine, ShineOverlay} from 'rn-placeholder';
import Card from '../UI/Card';
import Image from '../../components/UI/ChacheImage';
import {Colors} from '../../constant/index';
const propTypes = {
  loading: PropType.bool,
  style: PropType.object,
};
const HomeSlide = ({style, loading}) => {
  const {sliders} = useSelector(state => state.promotion);

  return (
    <Card style={{...styles.container}}>
      <Swiper
        loop={true}
        autoplayTimeout={2.5}
        autoplay={true}
        horizontal={true}
        dotColor="#ddd"
        activeDotColor={Colors.primary}>
        {loading ? (
          <View>
            <Placeholder Animation={ShineOverlay}>
              <PlaceholderLine style={styles.container} />
            </Placeholder>
          </View>
        ) : (
          sliders.map(d => {
            return (
              <Image
                key={d.id}
                uri={`${SLIDER_PATH}${d.image}`}
                style={{...styles.img}}
              />
            );
          })
        )}
      </Swiper>
    </Card>
  );
};
HomeSlide.propTypes = propTypes;
export default HomeSlide;
const IMAGE_HEIGHT =
  Platform.OS === 'ios' ? SCREEN_HEIGHT / 2.5 : SCREEN_HEIGHT / 2.5;
const styles = StyleSheet.create({
  wrapper: {},
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    width: SCREEN_WIDTH - 40,
    height:
      Platform.OS === 'android'
        ? SCREEN_HEIGHT / 4 - 10
        : SCREEN_HEIGHT / 4 - 35,
    borderRadius: 12,
    shadowOpacity: 0,
  },
  img: {
    height: null,
    width: null,
    resizeMode: 'cover',
    backgroundColor: '#f1f1f1',
    flex: 1,
    // borderRadius: 20,
  },
});
