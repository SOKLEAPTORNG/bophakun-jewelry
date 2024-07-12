import React, {useState, useEffect} from 'react';
import {Platform, View, Text, StyleSheet} from 'react-native';
import {createStackNavigator, TransitionPresets} from '@react-navigation/stack';
import {createDrawerNavigator, DrawerItemList} from '@react-navigation/drawer';
import {useTheme} from '@react-navigation/native';
import DrawerContentOptions from './DrawerContent';
import SettingScreen, {
  screenOptions as SettingScreenOptions,
} from '../screens/Setting/index';
import ProductDetailScreen, {
  screenOptions as ProductDetailScreenOptions,
} from '../screens/Details/ProductDetail';
import SeeMore, {
  screenOptions as SeeMoreOptions,
} from '../screens/SeeMore/index';

import CartScreen, {
  screenOptions as CartScreenOptions,
} from '../screens/Cart/index';
import CheckOutScreen, {
  screenOptions as CheckOutScreenOptions,
} from '../screens/CheckOut/index';
import CategorieScreen, {
  screenOptions as CategoriesScreenOptions,
} from '../screens/Categories/index';
import NewCategorieScreen, {
  screenOptions as NewCategoriesScreenOptions,
} from '../screens/Categories/NewCategories';
import EditProfileScreen, {
  screenOptions as EditProfileScreenOptions,
} from '../screens/Profile/EditProfile';
import OrderScreen, {
  screenOptions as OrderScreenOptions,
} from '../screens/Orders/index';
import SaveScreen, {
  screenOptions as SaveScreenOptions,
} from '../screens/Favorite/index';
import PromoScreen, {
  screenOptions as PromoScreenOptions,
} from '../screens/Promotions/index';
import PromoDetailScreen, {
  screenOptions as PromoDetailScreenOptions,
} from '../screens/Promotions/promoDetail';
import NotificationScreen, {
  screenOptions as NotificationScreenOptions,
} from '../screens/Notfication/index';
import OrdersDetailScreen, {
  screenOptions as OrdersDetailScreenOptions,
} from '../screens/Orders/orderDetail';
import SearchScreen, {
  screenOptions as SearchScreenOptions,
} from '../screens/Search/index';
import ItemListScreen, {
  screenOptions as ItemListScreenOptions,
} from '../screens/Categories/ItemListScren';
import QRCodeScreen, {
  screenOptions as QRCodeScreenOptions,
} from '../screens/QRCode/index';
import PointScreen, {
  screenOptions as PointScreenOptions,
} from '../screens/Point/index';
import AboutScreen, {
  screenOptions as AboutScreenOptions,
} from '../screens/AboutUs/index';
import SignInScreen, {
  screenOptions as SignInScreenOptions,
} from '../screens/SignIn/index';
import reOrderDetailsScreen, {
  screenOptions as reOrderDetailsScreenOptions,
} from '../screens/Orders/reOrderDetails';
import PromotionInfo, {
  screenOptions as PromotionInfoOptions,
} from '../components/Promotions/PromotionInfo';
import Onboarding, {
  screenOptions as OnboardingOptions,
} from '../components/UI/Onboarding';
import ProfileScreen from '../screens/Profile/index';
import {Colors} from '../constant/index';
import {HeaderBackIcon} from '../components/UI/HeaderButton';
import MaiTabs from './rootTabs';
const Stack = createStackNavigator();
const Drawer = createDrawerNavigator();
const RootNavigator = () => {
  const {colors} = useTheme();
  const TransitionPreset =
    Platform.OS === 'ios'
      ? TransitionPresets.SlideFromRightIOS
      : TransitionPresets.FadeFromBottomAndroid;
  const defaultNavOptions = {
    headerStyle: {
      backgroundColor: Colors.primary,
      height: 80,
      // shadowOffset: {height: 0, width: 0},
    },
    headerTitleStyle: {
      fontFamily: 'Roboto-Bold',
      fontSize: 16,
      color: Colors.secondary,
    },
    headerBackTitleStyle: {
      fontFamily: 'Roboto-Bold',
    },
    headerTintColor: Colors.primary,
    headerLeft: () => <HeaderBackIcon></HeaderBackIcon>,
  };
  return (
    <Stack.Navigator screenOptions={defaultNavOptions} initialRouteName="Home">
      <Stack.Screen
        name="Home"
        component={MaiTabs}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="Setting"
        component={SettingScreen}
        options={SettingScreenOptions}
      />
      <Stack.Screen
        name="ProductDetail"
        component={ProductDetailScreen}
        options={{
          ProductDetailScreenOptions,
        }}
      />
      <Stack.Screen
        name="Cart"
        component={CartScreen}
        options={CartScreenOptions}
      />
      <Stack.Screen
        name="CheckOut"
        component={CheckOutScreen}
        options={CheckOutScreenOptions}
      />
      <Stack.Screen
        name="Categories"
        component={CategorieScreen}
        options={CategoriesScreenOptions}
      />
      <Stack.Screen
        name="NewCategories"
        component={NewCategorieScreen}
        options={NewCategoriesScreenOptions}
      />
      <Stack.Screen name="EditProfile" component={EditProfileScreen} />
      <Stack.Screen
        name="Orders"
        component={OrderScreen}
        options={OrderScreenOptions}
      />
      <Stack.Screen
        name="SeeMore"
        component={SeeMore}
        options={({route}) => ({title: route.params.name})}
      />

      <Stack.Screen
        name="Savex"
        component={SaveScreen}
        options={SaveScreenOptions}
      />
      <Stack.Screen
        name="Promotion"
        component={PromoScreen}
        options={PromoScreenOptions}
      />
      <Stack.Screen
        name="PromoDetail"
        component={PromoDetailScreen}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="Notification"
        component={NotificationScreen}
        options={{NotificationScreenOptions}}
      />
      <Stack.Screen
        name="OrderDetail"
        component={OrdersDetailScreen}
        options={OrdersDetailScreenOptions}
      />

      <Stack.Screen
        name="Search"
        component={SearchScreen}
        options={SearchScreenOptions}
      />
      <Stack.Screen
        name="ItemList"
        component={ItemListScreen}
        options={ItemListScreenOptions}
      />

      <Stack.Screen
        name="Points"
        component={PointScreen}
        options={PointScreenOptions}
      />
      <Stack.Screen
        name="QRCode"
        component={QRCodeScreen}
        options={QRCodeScreenOptions}
      />
      <Stack.Screen
        name="AboutUs"
        component={AboutScreen}
        options={AboutScreenOptions}
      />
      <Stack.Screen
        name="SignIn"
        component={SignInScreen}
        options={SignInScreenOptions}
      />
      <Stack.Screen
        name="reOrderDetails"
        component={reOrderDetailsScreen}
        options={reOrderDetailsScreenOptions}
      />
      <Stack.Screen
        name="PromotionInfo"
        component={PromotionInfo}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="Onboarding"
        component={Onboarding}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen name="Profile" component={ProfileScreen} />
    </Stack.Navigator>
  );
};
const AppNavigator = () => {
  const [initRender, setInitRender] = useState(true);
  useEffect(() => {
    setInitRender(false);
  }, [initRender]);

  return (
    <Drawer.Navigator
      drawerStyle={{width: initRender ? null : '65%'}}
      initialRouteName="Home"
      drawerContent={props => (
        <DrawerContentOptions navigation={props.navigation} />
      )}>
      <Drawer.Screen name="Home" component={RootNavigator} />
    </Drawer.Navigator>
  );
};
export default AppNavigator;
