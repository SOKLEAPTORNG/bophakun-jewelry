import React from 'react';
import {
  Image,
  StyleSheet,
  FlatList,
  View,
  Text,
  TouchableOpacity,
  Dimensions,
  ImageBackground,
} from 'react-native';
import {SCREEN_WIDTH} from '../../constant';
import {Colors} from '../../constant';
import {
  navigate,
  _onLoading,
  _onLoadingFinish,
} from '../../navigation/RootNavigation';

const {width, height} = Dimensions.get('window');
const slides = [
  {
    id: '1',
    image: require('../../assets/logo.png'),
    // title: 'Eat Healthy',
    // subtitle: 'Express Delivery',
  },
  // {
  //   id: '2',
  //   image: require('../../assets/logo-bg.png'),
  //   title: 'Achieve Your Goals',
  //   subtitle: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
  // },
  // {
  //   id: '3',
  //   image: require('../../assets/logo-bg.png'),
  //   title: 'Achieve Your Goals',
  //   subtitle: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
  // },
];

const Slide = ({item}) => {
  return (
    <View
      style={{
        alignItems: 'center',
        width: SCREEN_WIDTH / 1,
        justifyContent: 'center',
      }}>
      <Image
        source={item?.image}
        style={{
          top: '22%',
          left: 14,
          height: 113,
          width: 240.85,
          resizeMode: 'cover',
        }}
      />
      <View style={{alignItems: 'flex-start'}}>
        <Text style={styles.title}>{item?.title}</Text>
        <Text style={styles.subtitle}>{item?.subtitle}</Text>
      </View>
    </View>
  );
};

const OnboardingScreen = ({navigation}) => {
  const [currentSlideIndex, setCurrentSlideIndex] = React.useState(0);
  const ref = React.useRef();
  const updateCurrentSlideIndex = e => {
    const contentOffsetX = e.nativeEvent.contentOffset.x;
    const currentIndex = Math.round(contentOffsetX / width);
    setCurrentSlideIndex(currentIndex);
  };

  const goToNextSlide = () => {
    const nextSlideIndex = currentSlideIndex + 1;
    if (nextSlideIndex != slides.length) {
      const offset = nextSlideIndex * width;
      ref?.current.scrollToOffset({offset});
      setCurrentSlideIndex(currentSlideIndex + 1);
    }
  };

  const skip = () => {
    const lastSlideIndex = slides.length - 1;
    const offset = lastSlideIndex * width;
    ref?.current.scrollToOffset({offset});
    setCurrentSlideIndex(lastSlideIndex);
  };

  const Footer = () => {
    return (
      <View
        style={{
          height: height * 0.3,
          justifyContent: 'space-between',
          paddingHorizontal: 20,
        }}>
        {/* Indicator container */}
        {/* <View
          style={{
            flexDirection: 'row',
            justifyContent: 'center',
          }}>
          Render indicator
          {slides.map((_, index) => (
            <View
              key={index}
              style={[
                styles.indicator,
                currentSlideIndex == index && {
                  backgroundColor: Colors.primary,
                  width: 12,
                },
              ]}
            />
          ))}
        </View> */}

        {/* Render buttons */}
        <View
          style={{
            marginBottom: Platform.OS === 'ios' ? 120 : 60,
            alignItems: 'center',
          }}>
          {currentSlideIndex == slides.length - 1 ? (
            <View style={{height: 54}}>
              <TouchableOpacity
                style={styles.btn}
                onPress={() => navigate('Home')}>
                <ImageBackground
                  style={{ ...styles.btn, resizeMode: 'contain', justifyContent: 'center'}}
                  source={require('../../assets/getstart-button.png')}>
                  <Text
                    style={{
                      fontFamily: 'Raleway-Regular',
                      fontSize: 30,
                      color: '#fff',
                      marginTop: Platform.OS === 'android' ? -6  : 0,
                    }}>
                    Get Started
                  </Text>
                </ImageBackground>
              </TouchableOpacity>
            </View>
          ) : (
            <View
              style={{
                flexDirection: 'row',
              }}>
              <TouchableOpacity
                activeOpacity={0.8}
                style={[
                  styles.btn,
                  {
                    borderColor: Colors.text,
                    borderWidth: 1,
                    backgroundColor: 'transparent',
                  },
                ]}
                onPress={skip}>
                <Text
                  style={{
                    fontWeight: 'bold',
                    fontSize: 15,
                    color: Colors.text,
                  }}>
                  SKIP
                </Text>
              </TouchableOpacity>
              <View style={{width: 15}} />
              <TouchableOpacity
                activeOpacity={0.8}
                onPress={goToNextSlide}
                style={styles.btn}>
                <Text
                  style={{
                    fontWeight: 'bold',
                    fontSize: 15,
                    color: '#fff',
                  }}>
                  NEXT
                </Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </View>
    );
  };

  return (
    <ImageBackground
      style={{flex: 1}}
      source={require('../../assets/welcome-screen.jpg')}>
      {/* <View style={{flex: 1, backgroundColor: Colors.background}}> */}
      <FlatList
        ref={ref}
        onMomentumScrollEnd={updateCurrentSlideIndex}
        contentContainerStyle={{height: height * 0.75}}
        showsHorizontalScrollIndicator={false}
        horizontal
        data={slides}
        pagingEnabled
        renderItem={({item}) => <Slide item={item} />}
      />
      <Footer />
      {/* </View> */}
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  subtitle: {
    color: Colors.text,
    fontSize: 32,
    maxWidth: '70%',
    textAlign: 'center',
    lineHeight: 40,
  },
  title: {
    color: Colors.primary,
    fontSize: 28,
    fontFamily: 'Poppins-Semibold',
    marginTop: 42,
    textAlign: 'center',
  },
  image: {
    height: '100%',
    width: '100%',
    resizeMode: 'contain',
  },
  indicator: {
    height: 4,
    width: 4,
    backgroundColor: Colors.primary,
    marginHorizontal: 1,
    borderRadius: 4,
  },
  btn: {
    flex: 1,
    height: 54,
    width: 276,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
export default OnboardingScreen;
