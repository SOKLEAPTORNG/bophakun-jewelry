import React, {useState, useEffect} from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  Image,
  Linking,
  Alert,
} from 'react-native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Icon from 'react-native-vector-icons/SimpleLineIcons';
import Text from '../components/UI/DefaultText';
import {useDispatch} from 'react-redux';
import {
  SCREEN_HEIGHT,
  SCREEN_WIDTH,
  Colors,
  STATUSBAR_HEIGHT,
} from '../constant/index';
import * as authActions from '../store/action/auth';
import i18n from '../../Translations/index';
import {navigate} from './RootNavigation';
import TouchableCmp from '../components/UI/TouchableCmp';
import {useSelector} from 'react-redux';
import {useTheme} from '@react-navigation/native';

const Index = props => {
  const [state, setState] = useState({
    avatar: null,
  });
  const [companyInfo, setCompanyInfo] = useState([]);
  const dispatch = useDispatch();
  const isUser = useSelector(state => state.auth.userInfo);
  const company_info = useSelector(state => state.auth.companyInfo);
  const theme = useTheme();
  const _onOpenLink = () => {
    Linking.openURL('https://eocambo.com/');
  };
  const onPressLogout = () => {
    dispatch(authActions.logout());
    props.navigation.closeDrawer();
  };
  const onAuthHandler = () => {
    if (isUser.length > 0) {
      onAuthSignOut();
    } else {
      navigate('SignIn');
    }
  };

  const onAuthSignOut = () => {
    Alert.alert(i18n.t('drawer.Are you sure you would like to log out ?'), '', [
      {
        text: i18n.t('drawer.Cancel'),
        onPress: () => console.log('Canceled'),
      },
      {
        text: i18n.t('drawer.Ok'),
        onPress: () => onPressLogout(),
      },
    ]);
  };
  useEffect(() => {
    if (company_info.length > 0) {
      const {facebook_link, company_website, contact_us_link} = company_info[0];
      setCompanyInfo(company_info[0]);
    } else {
      setState({
        ...state,
        facebook_link: 'null',
        company_website: null,
        contact_us_link: null,
      });
    }
    if (isUser.length > 0) {
      const {avatar} = isUser[0];
      setState({
        ...state,
        avatar: avatar,
      });
    } else {
      setState({
        ...state,
        avatar: null,
      });
    }
  }, [isUser, company_info]);
  const _handleOpenLinking = type => {
    const fb = Platform.OS === 'ios' ? 'profile' : 'page';
    switch (type) {
      case 'fb':
        return Linking.openURL(`fb://${fb}/${companyInfo.facebook_link}`);
      case 'ig':
        return Linking.openURL('instagram://user?username=angkorhousekh');
      case 'web':
        return Linking.openURL(companyInfo.company_website);
      case 'notifi':
        return Linking.openSettings();
      case 'contact':
        return Linking.openURL(companyInfo.contact_us_link); //
      default:
        return;
    }
  };

  return (
    <View style={{...styles.container}}>
      <View
        style={{
          ...styles.header,
          backgroundColor: theme.dark ? Colors.primary : Colors.primary,
        }}>
        <View style={styles.logoContainer}>
          {/* {state.avatar !== null || isUser.length > 0 ? (
            <Image source={{uri: state.avatar}} style={styles.img} />
          ) : ( */}
          <Image source={require('../assets/logo.png')} style={styles.img} />
          {/* )} */}
        </View>
      </View>
      <ScrollView>
        <View style={{...styles.wrappContent}}>
          <TouchableCmp onPress={() => navigate('Home')}>
            <View style={{...styles.flex}}>
              <Image
                style={{
                  ...styles.iconContainer,
                }}
                source={require('../assets/home.png')}
              />
              <Text style={{...styles.mainText}}>{i18n.t('home.Home')}</Text>
            </View>
          </TouchableCmp>
          <TouchableCmp onPress={() => navigate('Orders')}>
            <View style={{...styles.flex}}>
              <Image
                style={{
                  ...styles.iconContainer,
                }}
                source={require('../assets/order.png')}
              />
              <Text style={{...styles.mainText}}>
                {i18n.t('order.Your Orders')}
              </Text>
            </View>
          </TouchableCmp>
          <TouchableCmp onPress={() => navigate('Promotion')}>
            <View style={{...styles.flex}}>
              <Image
                style={{
                  ...styles.iconContainer,
                }}
                source={require('../assets/gift.png')}
              />
              <Text style={{...styles.mainText}}>
                {i18n.t('promotion.Promotion')}
              </Text>
            </View>
          </TouchableCmp>
          <TouchableCmp onPress={() => navigate('Notification')}>
            <View style={{...styles.flex}}>
              <Image
                style={{
                  ...styles.iconContainer,
                }}
                source={require('../assets/notification.png')}
              />
              <Text style={{...styles.mainText}}>
                {i18n.t('setting.Notification')}
              </Text>
            </View>
          </TouchableCmp>
          <TouchableCmp onPress={() => navigate('Setting')}>
            <View style={{...styles.flex}}>
              <Image
                style={{
                  ...styles.iconContainer,
                }}
                source={require('../assets/setting.png')}
              />
              <Text style={{...styles.mainText}}>
                {i18n.t('drawer.Setting')}
              </Text>
            </View>
          </TouchableCmp>
          <TouchableCmp onPress={() => navigate('AboutUs')}>
            <View style={{...styles.flex}}>
              <Image
                style={{
                  ...styles.iconContainer,
                }}
                source={require('../assets/about-us.png')}
              />
              <Text style={{...styles.mainText}}>
                {i18n.t('about.About Us')}
              </Text>
            </View>
          </TouchableCmp>
          <TouchableCmp onPress={onAuthHandler}>
            <View style={{...styles.flex}}>
              <Image
                style={{
                  ...styles.iconContainer,
                }}
                source={require('../assets/logout.png')}
              />
              <Text style={{...styles.mainText}}>
                {isUser.length > 0
                  ? i18n.t('drawer.Logout')
                  : i18n.t('drawer.Login')}
              </Text>
            </View>
          </TouchableCmp>
        </View>
      </ScrollView>
      <TouchableCmp onPress={_onOpenLink}>
        <View style={{...styles.footer}}>
          <Text style={{fontSize: 12, color: Colors.secondary}}>
            Powered by: eOcambo Technology
          </Text>
        </View>
      </TouchableCmp>
    </View>
  );
};
export default Index;
const PROFILE_WIDTH = SCREEN_WIDTH / 4;
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.primary,
  },
  header: {
    width: '100%',
    height: SCREEN_HEIGHT / 4,
    alignItems: 'center',
    justifyContent: 'center',
  },
  mainText: {
    paddingLeft: 20,
    fontFamily: 'Poppins-Semibold',
    fontSize: 16,
    color: Colors.secondary,
  },
  wrappContent: {
    padding: 15,
    marginTop: 30,
    backgroundColor: Colors.background,
    borderTopWidth: 2,
    borderTopColor: Colors.background,
  },
  flex: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
    borderBottomColor: '#ddd',
    borderBottomWidth: 1,
  },
  footer: {
    borderTopColor: Colors.secondary,
    borderTopWidth: 1,
    padding: 20,
  },
  profileContainer: {
    width: PROFILE_WIDTH,
    height: PROFILE_WIDTH,
    borderRadius: PROFILE_WIDTH / 2,
    // padding: 5,
  },
  logoContainer: {
    width: 200,
    height: 200,
    marginTop: 50,
    padding: 10,
    resizeMode: 'contain',
  },
  img: {
    flex: 1,
    width: null,
    height: null,
    resizeMode: 'contain',
  },
  iconContainer: {
    width: 27,
    height: 27,
    resizeMode: 'contain',
    tintColor: Colors.secondary,
  },
});
