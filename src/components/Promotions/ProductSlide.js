import React from 'react';
import PropType from 'prop-types';
import {View, StyleSheet, Text, PlatformColor} from 'react-native';
import Swiper from 'react-native-swiper';
import {
  Colors,
  SCREEN_HEIGHT,
  SCREEN_WIDTH,
  SLIDER_GALLERY_PATH,
} from '../../constant/index';
import {useSelector} from 'react-redux';
import {Placeholder, PlaceholderLine, ShineOverlay} from 'rn-placeholder';
import Card from '../UI/Card';
import Image from '../../components/UI/ChacheImage';
const propTypes = {
  loading: PropType.bool,
  style: PropType.object,
  props: PropType.object,
};
const HomeSlide = (props, {style, loading}) => {
  console.log('props');
  console.log(props);
  console.log('props');
  // const {sliders} = useSelector(state => state.promotion);
  const sliders = props.data;
  return (
    <Card style={{...styles.container, ...style}}>
      <Swiper
        loop={true}
        autoplayTimeout={2.5}
        autoplay={true}
        horizontal={true}
        dotColor="#FFE8E5"
        activeDotStyle={{width: 20}}
        activeDotColor="#F6CFCA">
        {loading ? (
          <View style={styles.sliders}>
            <Placeholder Animation={ShineOverlay}>
              <PlaceholderLine style={styles.container} />
            </Placeholder>
          </View>
        ) : (
          sliders.map(d => {
            return (
              <View>
                <View>
                  {/* <Text>{`${SLIDER_GALLERY_PATH}${d.gallery_image}`}</Text> */}
                  <Image
                    key={d.id}
                    uri={`${SLIDER_GALLERY_PATH}${d.gallery_image}`}
                    style={{...styles.img}}
                  />
                </View>
              </View>
            );
          })
        )}
      </Swiper>
    </Card>
  );
};
HomeSlide.propTypes = propTypes;
export default HomeSlide;
const IMAGE_HEIGHT = SCREEN_HEIGHT / 3;
const styles = StyleSheet.create({
  wrapper: {},
  container: {
    height:
      Platform.OS === 'android'
        ? SCREEN_HEIGHT / 3+8
        : SCREEN_HEIGHT / 3 - 24,
  },
  img: {
    height: SCREEN_HEIGHT /3+8,
    width: '100%',
    resizeMode: 'contain',
  },
});
