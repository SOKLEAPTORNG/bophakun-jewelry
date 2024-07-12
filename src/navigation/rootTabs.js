import React from 'react';
import {Platform, View, Image} from 'react-native';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {createStackNavigator, TransitionPresets} from '@react-navigation/stack';
import Entypo from 'react-native-vector-icons/Entypo';
import AntDesign from 'react-native-vector-icons/AntDesign';
import SimpleLineIcons from 'react-native-vector-icons/SimpleLineIcons';
import Feather from 'react-native-vector-icons/Feather';
import HomeScreen, {
  screenOptions as HomeScreenOptions,
} from '../screens/Home/index';
import SaveScreen, {
  screenOptions as SaveScreenOptions,
} from '../screens/Favorite/index';
import ProfileScreen, {
  screenOptions as ProfileScreenOptions,
} from '../screens/Profile/index';
import PromotionScreen, {
  screenOptions as PromotionScreenOptions,
} from '../screens/Promotions/index';
import OrderScreen, {
  screenOptions as OrderScreenOptions,
} from '../screens/Orders/index';
import CategoryScreen, {
  screenOptions as CategoryScreenOptions,
} from '../screens/Categories/NewCategories';
import {Colors, SCREEN_HEIGHT} from '../constant/index';
import i18n from '../../Translations/index';
import {useTheme} from '@react-navigation/native';
import {colors} from 'react-native-elements';
const Stack = createStackNavigator();
const Tabs = createBottomTabNavigator();
const TransitionPreset =
  Platform.OS === 'ios'
    ? TransitionPresets.SlideFromRightIOS
    : TransitionPresets.FadeFromBottomAndroid;
const defaultNavOptions = {
  ...TransitionPreset,
  headerStyle: {
    // backgroundColor: '#00',
    shadowOffset: {height: 0, width: 0},
  },
  headerTitleStyle: {
    fontFamily: 'Roboto-Medium',
    fontSize: 17,
  },
  headerBackTitleStyle: {
    fontFamily: 'Roboto-Medium',
  },
  headerTintColor: Colors.secondary,
};
const HomeStack = () => {
  const {colors} = useTheme();
  return (
    <Stack.Navigator
      screenOptions={{
        ...defaultNavOptions,
        headerStyle: {backgroundColor: colors.background},
      }}>
      <Stack.Screen
        name="Home"
        component={HomeScreen}
        options={HomeScreenOptions}
      />
    </Stack.Navigator>
  );
};
const FavoriteStack = () => {
  const {colors} = useTheme();
  return (
    <Stack.Navigator
      screenOptions={{
        ...defaultNavOptions,
        headerStyle: {backgroundColor: Colors.primary},
      }}>
      <Stack.Screen
        name="Save"
        component={SaveScreen}
        options={SaveScreenOptions}
      />
    </Stack.Navigator>
  );
};
const CategoryStack = () => {
  const {colors} = useTheme();
  return (
    <Stack.Navigator
      screenOptions={{
        ...defaultNavOptions,
        headerStyle: {backgroundColor: Colors.primary},
      }}>
      <Stack.Screen
        name="Category"
        component={CategoryScreen}
        options={CategoryScreenOptions}
      />
    </Stack.Navigator>
  );
};
const PromoStack = () => {
  const {colors} = useTheme();
  return (
    <Stack.Navigator
      screenOptions={{
        ...defaultNavOptions,
        headerStyle: {backgroundColor: Colors.primary},
      }}>
      <Stack.Screen
        name="Promotion"
        component={PromotionScreen}
        options={PromotionScreenOptions}
      />
    </Stack.Navigator>
  );
};
const ProfileStack = () => {
  const {colors} = useTheme();
  return (
    <Stack.Navigator
      screenOptions={{
        ...defaultNavOptions,
        headerStyle: {backgroundColor: Colors.primary},
      }}>
      <Stack.Screen
        name="Profile"
        component={ProfileScreen}
        options={ProfileScreenOptions}
      />
    </Stack.Navigator>
  );
};
const Index = () => {
  const {colors} = useTheme();
  return (
    <Tabs.Navigator
      initialRouteName="Home"
      tabBarOptions={{
        activeTintColor: Colors.accent,
        inactiveTintColor: Colors.accent,
        // showLabel: false
        style: {
          backgroundColor: 'transparent',
          position: 'absolute',
          borderTopWidth: 0,
          elevation: 0,
          backgroundColor: Colors.background,
          height: Platform.OS === 'ios' ? 90 : 80,
          paddingHorizontal: 20,
          shadowColor: '#a1a1a1',
          shadowOffset: {
            width: 0,
            height: 0,
          },
          shadowOpacity: 0.5,
          shadowRadius: 10.84,

          elevation: 5,
        },
        tabStyle: {
          height: Platform.OS === 'ios' ? 100 : 95,
          width: '100%',
          paddingBottom: 20,
          paddingTop: 5,
          marginTop: Platform.OS === 'ios' ? -10 : -10,
        },
        labelStyle: {
          fontFamily: 'Roboto-Medium',
          // color: Colors.primary,
        },
      }}>
      <Tabs.Screen
        name="Home"
        component={HomeStack}
        options={{
          tabBarIcon: ({tintColor, focused}) => (
            <View
              style={{
                height: 80,
                width: '100%',
                alignItems: 'center',
                justifyContent: 'center',
                position: 'absolute',
                top: 12,
                paddingBottom: 30,
              }}>
              <Image
                style={{
                  width: focused ? 32 : 26,
                  height: focused ? 32 : 26,
                  resizeMode: 'contain',
                  tintColor: focused ? Colors.accent : Colors.accent,
                }}
                source={require('../assets/home.png')}
              />
            </View>
          ),
          tabBarLabel: i18n.t('home.Home'),
        }}
      />
      <Tabs.Screen
        name="Category"
        component={CategoryStack}
        options={{
          tabBarIcon: ({tintColor, focused}) => (
            <View
              style={{
                height: 80,
                width: '100%',
                // backgroundColor: '#fff',
                alignItems: 'center',
                justifyContent: 'center',
                position: 'absolute',
                top: 12,
                paddingBottom: 30,
              }}>
              <Image
                style={{
                  width: focused ? 30 : 26,
                  height: focused ? 30 : 26,
                  resizeMode: 'contain',
                  // tintColor: focused ? Colors.secondary : Colors.secondary,
                }}
                source={require('../assets/category-tab.png')}
              />
            </View>
          ),
          tabBarLabel: i18n.t('home.Categories'),
        }}
      />
      <Tabs.Screen
        name="Save"
        component={FavoriteStack}
        options={{
          tabBarIcon: ({tintColor, focused}) => (
            <View
              style={{
                height: 80,
                width: '100%',
                // backgroundColor: '#fff',
                alignItems: 'center',
                justifyContent: 'center',
                position: 'absolute',
                top: 13,
                paddingBottom: 30,
              }}>
              <Image
                style={{
                  width: focused ? 33 : 29,
                  height: focused ? 33 : 29,
                  resizeMode: 'contain',
                  tintColor: focused ? Colors.accent : Colors.accent,
                }}
                source={require('../assets/heart-o.png')}
              />
            </View>
            // <Entypo
            //   name="heart-outlined"
            //   size={focused ? 39 : 35}
            //   color={focused ? Colors.secondary : Colors.secondary}
            //   style={{paddingTop: 16}}
            // />
          ),
          tabBarLabel: i18n.t('favorite.Save'),
        }}
      />

      {/* <Tabs.Screen
        name="Promotion"
        component={PromoStack}
        options={{
          tabBarIcon: ({tintColor, focused}) => (
            <AntDesign
              name="gift"
              size={focused ? 38 : 33}
              color={focused ? Colors.secondary : Colors.secondary}
              style={{paddingTop: 16}}
            />
          ),
          tabBarLabel: i18n.t('promotion.Promotion'),
        }}
      /> */}
      <Tabs.Screen
        name="Profile"
        component={ProfileStack}
        options={{
          tabBarIcon: ({tintColor, focused}) => (
            <View
              style={{
                height: 80,
                width: '100%',
                // backgroundColor: '#fff',
                alignItems: 'center',
                justifyContent: 'center',
                position: 'absolute',
                top: 10,
                paddingBottom: 30,
                // borderTopRightRadius: 30,
              }}>
              <Image
                style={{
                  width: focused ? 33 : 29,
                  height: focused ? 33 : 29,
                  resizeMode: 'contain',
                }}
                source={require('../assets/user.png')}
              />
            </View>
          ),
          tabBarLabel: i18n.t('profile.Me'),
        }}
      />
    </Tabs.Navigator>
  );
};

export default Index;
