import React, {useRef} from 'react';
import {
  View,
  Animated,
  StyleSheet,
  SafeAreaView,
  Linking,
  TouchableOpacity,
  Platform,
} from 'react-native';

import Text from '../../components/UI/DefaultText';
import {Colors, SCREEN_WIDTH} from '../../constant/index';
import HomeSlider from '../../components/Promotions/HomeSlide';
import Ionicons from 'react-native-vector-icons/FontAwesome5';
import {goBack} from '../../navigation/RootNavigation';
import {useTheme} from '@react-navigation/native';
import { useSelector } from 'react-redux';

const HEADER_MAX_HEIGHT = SCREEN_WIDTH / 4;
const HEADER_MIN_HEIGHT = 84;
const HEADER_SCROLL_DISTANCE = HEADER_MAX_HEIGHT - HEADER_MIN_HEIGHT;
const AboutUsOverviewScreen = () => {
  const theme = useTheme();
  const scrollY = useRef(new Animated.Value(0)).current;
  const {
    mobile,
    email,
    website,
    description,
    facebook_link,
    name,
    address,
    google_map_link,
  } = useSelector(state => state.auth.companyInfo[0]);
  const fb = Platform.OS === 'ios' ? 'profile' : 'page';
  const new_website = website != null ? website.slice(7, 30) : '';
  const headerTranslateY = scrollY.interpolate({
    inputRange: [0, HEADER_SCROLL_DISTANCE],
    outputRange: [0, -HEADER_SCROLL_DISTANCE],
    extrapolate: 'clamp',
  });
  const imageOpacity = scrollY.interpolate({
    inputRange: [0, HEADER_SCROLL_DISTANCE / 2, HEADER_SCROLL_DISTANCE],
    outputRange: [1, 1, 0],
    extrapolate: 'clamp',
  });
  const imageTranslateY = scrollY.interpolate({
    inputRange: [0, HEADER_SCROLL_DISTANCE],
    outputRange: [0, 100],
    extrapolate: 'clamp',
  });
  const titleScale = scrollY.interpolate({
    inputRange: [0, HEADER_SCROLL_DISTANCE / 2, HEADER_SCROLL_DISTANCE],
    outputRange: [0, 0, 0.9],
    extrapolate: 'clamp',
  });
  const titleTranslateY = scrollY.interpolate({
    inputRange: [0, HEADER_SCROLL_DISTANCE / 2, HEADER_SCROLL_DISTANCE],
    outputRange: [0, 0, -8],
    extrapolate: 'clamp',
  });
  const onScroll = Animated.event(
    [{nativeEvent: {contentOffset: {y: scrollY}}}],
    {useNativeDriver: true},
  );
  return (
    <SafeAreaView
      style={{
        flex: 1,
      }}>
      <Animated.ScrollView
        contentContainerStyle={{paddingTop: HEADER_MAX_HEIGHT}}
        scrollEventThrottle={16}
        onScroll={onScroll}>
        <View
          style={{
            marginBottom: 20,
            alignItems: 'center',
            marginTop: Platform.OS === 'android' ? 20 : -20,
          }}>
          <HomeSlider />
        </View>
        <View style={styles.container}>
          <Text style={styles.title}>About Us</Text>
          <View
            style={
              (styles.content, {borderBottomWidth: 0.2, paddingBottom: 20})
            }>
            <Text style={styles.text}>{description}</Text>
          </View>

          <View style={styles.content}>
            <Text style={styles.title}>
              Contact:{' '}
              <Text style={{color: '#666', fontSize: 10}}>(All Clickable)</Text>
            </Text>
            <View style={styles.content}>
              <TouchableOpacity
                onPress={() => {
                  Linking.openURL(`fb://${fb}/${facebook_link}`);
                }}>
                <View style={{marginBottom: 10}}>
                  <Text style={{fontFamily: 'OpenSans-Bold'}}>
                    Facebook:{' '}
                    <Text
                      style={{
                        fontFamily: 'OpenSans-Regular',
                        color: Colors.secondary,
                      }}>
                      {name}
                    </Text>
                  </Text>
                </View>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => {
                  Linking.openURL(
                    `mailto:${email}?subject=mailsubject&body=mailbody`,
                  );
                }}>
                <View style={{marginBottom: 10}}>
                  <Text style={{fontFamily: 'OpenSans-Bold'}}>
                    Email:{' '}
                    <Text
                      style={{
                        fontFamily: 'OpenSans-Regular',
                        color: Colors.secondary,
                      }}>
                      {email}
                    </Text>
                  </Text>
                </View>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => {
                  Linking.openURL(`tel:${mobile}`);
                }}>
                <View style={{marginBottom: 10}}>
                  <Text
                    style={{paddingVertical: 5, fontFamily: 'OpenSans-Bold'}}>
                    Tel:{' '}
                    <Text
                      style={{
                        fontFamily: 'OpenSans-Regular',
                        color: Colors.secondary,
                      }}>
                      {mobile}
                    </Text>
                  </Text>
                </View>
              </TouchableOpacity>
              {new_website != '' ? (
                <TouchableOpacity
                  onPress={() => {
                    Linking.openURL(website).catch(err => {
                      console.error('Failed opening page because: ', err);
                      alert('Failed to open page');
                    });
                  }}>
                  <View style={{marginBottom: 10}}>
                    <Text style={{fontFamily: 'OpenSans-Bold'}}>
                      Website:{' '}
                      <Text
                        style={{
                          fontFamily: 'OpenSans-Regular',
                          color: Colors.secondary,
                        }}>
                        {new_website}
                      </Text>
                    </Text>
                  </View>
                </TouchableOpacity>
              ) : null}

              <TouchableOpacity
                onPress={() => {
                  Linking.openURL(google_map_link).catch(err => {
                    console.error('Failed opening page because: ', err);
                    alert('Failed to open page');
                  });
                }}>
                <View style={{marginBottom: 10}}>
                  <Text
                    style={{fontFamily: 'OpenSans-Bold', paddingVertical: 5}}>
                    Address:{' '}
                    <Text
                      style={{
                        fontFamily: 'OpenSans-Regular',
                        color: Colors.secondary,
                      }}>
                      {address}
                    </Text>
                  </Text>
                </View>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Animated.ScrollView>
      <Animated.View
        style={[
          styles.header,
          {
            transform: [{translateY: headerTranslateY}],
            backgroundColor: theme.dark ? '#000' : Colors.primary,
          },
        ]}>
        <Animated.Image
          style={[
            styles.headerBackground,
            {
              opacity: imageOpacity,
              transform: [{translateY: imageTranslateY}],
            },
          ]}
        />
      </Animated.View>
      <Animated.View
        style={[
          styles.topBar,
          {
            transform: [{translateY: titleTranslateY}],
          },
        ]}>
        <Ionicons
          name="arrow-left"
          color={Colors.secondary}
          size={20}
          onPress={goBack}
        />
        <Text style={styles.mainTitle}>About Us</Text>
        <View />
      </Animated.View>
    </SafeAreaView>
  );
};

export default AboutUsOverviewScreen;
export const screenOptions = () => {
  return {
    headerShown: false,
  };
};
const styles = StyleSheet.create({
  saveArea: {
    flex: 1,
    backgroundColor: '#eff3fb',
  },
  container: {
    paddingHorizontal: 20,
  },
  header: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    overflow: 'hidden',
    height: HEADER_MAX_HEIGHT,
  },
  headerBackground: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    width: null,
    height: HEADER_MAX_HEIGHT / 1,
  },
  topBar: {
    flexDirection: 'row',
    marginTop: 40,
    paddingHorizontal: 20,
    height: 50,
    alignItems: 'center',
    justifyContent: 'space-between',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
  },
  mainTitle: {
    color: Colors.secondary,
    fontSize: 20,
    fontFamily: 'OpenSans-Bold',
  },
  avatar: {
    height: 54,
    width: 54,
    resizeMode: 'contain',
    borderRadius: 54 / 2,
  },
  fullNameText: {
    fontSize: 16,
    marginLeft: 24,
  },
  title: {
    fontSize: 20,
    fontFamily: 'OpenSans-Bold',
  },
  content: {
    paddingTop: 10,
  },
  text: {
    fontSize: 15,
  },
  socail: {
    backgroundColor: '#ddd',
    width: 40,
    height: 40,
    borderRadius: 40,
  },
});
