import React, {useState} from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  Image,
  Platform,
} from 'react-native';
import {useSelector} from 'react-redux';
import Carousel from 'react-native-snap-carousel';
import {
  SCREEN_HEIGHT,
  SCREEN_WIDTH,
  DISCOUNT_PATH as PRONOTIONS_IMAGE_PATH,
} from '../../constant/index';
import Card from '../UI/Card';
import {navigate} from '../../navigation/RootNavigation';
import {useTheme} from '@react-navigation/native';
const slideHieght = SCREEN_HEIGHT / 3;
const carouselRef = React.createRef();

const Sliders = () => {
  const {available_promotions} = useSelector(state => state.promotion);
  const [activeIndex, setActivateIndex] = useState(0);
  const theme = useTheme();
  const _onPressCarousel = id => {
    navigate('PromoDetail', {
      id: id,
    });
  };

  const _renderItem = ({item, index}) => {
    return (
      <TouchableOpacity
        onPress={() => {
          _onPressCarousel(item.id);
        }}>
        <Card>
          <View style={{...styles.imagContainer}}>
            <Image
              source={{
                uri: `${PRONOTIONS_IMAGE_PATH}/${item.image}`,
              }}
              resizeMode="stretch"
              style={{...styles.image}}
            />
          </View>
        </Card>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={{flex: 1}}>
      <View
        style={{
          flex: 1,
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}>
        {/* <TouchableOpacity style={{backgroundColor: 'red'}}>
          <View style={{position: 'absolute', left: 30}}>
            <Image
              source={require('../../assets/chevron-left.png')}
              style={{
                width: 20,
                height: 20,
                resizeMode: 'contain',
                tintColor: '#fff',
              }}
            />
          </View>
        </TouchableOpacity> */}
        <View style={{zIndex: -99}}>
          <Carousel
            layout={'default'}
            ref={carouselRef}
            data={available_promotions}
            sliderWidth={SCREEN_WIDTH}
            itemWidth={SCREEN_WIDTH}
            renderItem={_renderItem}
            useScrollView
            onSnapToItem={index => setActivateIndex(index)}
            activeSlideAlignment="center"
            loop={true}
            autoplay={true}
            snapToPrev={true}
          />
        </View>
        {/* <TouchableOpacity style={{backgroundColor: 'red'}}>
          <View style={{position: 'absolute', right: 30}}>
            <Image
              source={require('../../assets/chevron-right.png')}
              style={{
                width: 20,
                height: 20,
                resizeMode: 'contain',
                tintColor: '#fff',
              }}
            />
          </View>
        </TouchableOpacity> */}
      </View>
    </SafeAreaView>
  );
};
export default Sliders;
const styles = StyleSheet.create({
  slide: {
    position: 'relative',
    padding: 0,
    alignItems: 'center',
    justifyContent: 'center',
  },
  border: {
    // borderRadius: 4,
    borderWidth: 0.5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  imagContainer: {
    alignItems: 'center',
    marginTop: 20,
  },
  image: {
    width: '90%',
    height:
      Platform.OS === 'android'
        ? SCREEN_HEIGHT / 4 - 10
        : SCREEN_HEIGHT / 4 - 35,
    borderRadius: 12,
    flex: 1,
    resizeMode: 'cover',
  },
});
