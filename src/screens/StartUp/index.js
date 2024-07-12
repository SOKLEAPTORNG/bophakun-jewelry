import React, {useCallback, useEffect, useState} from 'react';
import {
  View,
  ActivityIndicator,
  StyleSheet,
  Image,
  ImageBackground,
} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import * as authActions from '../../store/action/auth';
import * as actionProduct from '../../store/action/product';
import * as actionPromotions from '../../store/action/promotion';
import I18n from '../../../Translations/index';
import Text from '../../components/UI/DefaultText';
import AsyncStorage from '@react-native-community/async-storage';
import {Button} from 'react-native-paper';
import Icons from 'react-native-vector-icons/Entypo';
import {useTheme} from '@react-navigation/native';
import {Colors, SCREEN_HEIGHT, SCREEN_WIDTH} from '../../constant/index';
const StartupScreen = props => {
  __DEV__ && console.log('render');
  const [isloading, setIsLoading] = useState(false);
  const [error, setError] = useState();
  const [isNetworkErr, setIsNetworkErr] = useState();
  const dispatch = useDispatch();
  const codex = useSelector(state => state.localStorage.code);
  const theme = useTheme();
  const defaultLang = async () => {
    if (!codex) return;
    I18n.locale = codex;
  };
  /**
   * dispatch user infomation and fetching products
   */
  const fetchUser = useCallback(
    async (token, expirationTime) => {
      setError(null);
      setIsNetworkErr(null);
      try {
        const userData = await AsyncStorage.getItem('userData');
        if (!userData) {
          await dispatch(actionProduct.setProducts());
          await dispatch(authActions.setCompanyInfo());
          await dispatch(actionPromotions.getPromotion());
        } else {
          const transformedData = JSON.parse(userData);
          const {userId} = transformedData;
          await dispatch(authActions.getUserInfo(userId));
          await dispatch(actionProduct.setProducts());
          await dispatch(authActions.setCompanyInfo());
          await dispatch(actionPromotions.getPromotion());
        }
      } catch (err) {
        if (err.message === 'Network Error') {
          setIsNetworkErr(err.message);
        } else {
          setError(err.message);
        }
      }
    },
    [dispatch, setError],
  );
  useEffect(() => {
    fetchUser();
  }, [dispatch, fetchUser]);
  if (isNetworkErr) {
    return (
      <View
        style={{...styles.screen, backgroundColor: 'theme.colors.background'}}>
        <Icons
          name="emoji-sad"
          size={50}
          color={theme.dark ? '#fff' : '#333'}
        />
        <Text style={{...styles.mainText}}>
          {I18n.t('loading.No Internet connection')}
        </Text>
        <Text style={{...styles.subText}}>
          {I18n.t(
            'loading.Please check your internet connection and try again',
          )}
        </Text>
        <Button onPress={fetchUser}>
          <Text style={{...styles.mainText}}>{I18n.t('loading.Refresh')} </Text>
        </Button>
      </View>
    );
  }
  if (error) {
    return (
      <View
        style={{...styles.screen, backgroundColor: theme.colors.background}}>
        <Text>An error occurred!</Text>
        <Button onPress={fetchUser}>
          <Text style={{...styles.mainText}}>{I18n.t('loading.Refresh')} </Text>
        </Button>
      </View>
    );
  }

  return (
    <View
      style={{
        ...styles.screen,
        alignItems: 'center',
        justifyContent: 'center',
      }}>
      <Image
        style={{
          width: '60%',
          height: '60%',
          resizeMode: 'contain',
        }}
        source={require('../../assets/logo.png')}
      />
      {/* <Image source={require('../../assets/logo.png')} style={styles.image} /> */}
      <View style={{position: 'absolute', paddingTop: 100}}>
        <ActivityIndicator size="small" color="#fff" />
      </View>
    </View>
  );
  // return;
};
const IMAGE_WIDTH = SCREEN_WIDTH / 2;
const IMAGE_HEIGHT = SCREEN_HEIGHT / 4;
const styles = StyleSheet.create({
  screen: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.background,
  },
  mainText: {
    fontSize: 18,
    fontFamily: 'OpenSans-Bold',
    // color: '#fff',
  },
  subText: {
    fontSize: 14,
    // color: '#fff',
  },
  image: {
    width: IMAGE_WIDTH,
    height: IMAGE_HEIGHT,
    resizeMode: 'contain',
  },
});

export default StartupScreen;
