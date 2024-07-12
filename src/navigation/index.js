import React, {useEffect, useState} from 'react';
import {useSelector} from 'react-redux';
import {
  NavigationContainer,
  DefaultTheme as NavigationDefaultTheme,
  DarkTheme as NavigationDarkTheme,
} from '@react-navigation/native';
import {
  // Provider as PaperProvider,
  DefaultTheme as PaperDefaultTheme,
  DarkTheme as PaperDarkTheme,
} from 'react-native-paper';
import AppNavigators from './rootStack';
import StartupScreen from '../screens/StartUp/index';
import AuthNavigator from './authStack';
import {navigationRef} from './RootNavigation';
import I18n from '../../Translations/index';
import {Colors} from '../constant';
export const AuthContext = React.createContext();
const AppNavigator = props => {
  // const [isDarkTheme, setIsDarkTheme] = React.useState(false);
  const [isReady, setIsReady] = useState(false);
  const isAuth = useSelector(state => !!state.auth.token);
  const {isDarkTheme, code} = useSelector(state => state.localStorage);
  const product = useSelector(state => state.product.products);
  const didTryAutoLogin = useSelector(state => state.auth.didTryAutoLogin);
  const CustomDefaultTheme = {
    ...NavigationDefaultTheme,
    ...PaperDefaultTheme,
    colors: {
      ...NavigationDefaultTheme.colors,
      ...PaperDefaultTheme.colors,
      background: Colors.background,
      text: '#333333',
    },
  };
  const CustomDarkTheme = {
    ...NavigationDarkTheme,
    ...PaperDarkTheme,
    colors: {
      ...NavigationDarkTheme.colors,
      ...PaperDarkTheme.colors,
      background: '#333333',
      text: '#dddddd',
    },
  };
  const theme = isDarkTheme ? CustomDarkTheme : CustomDefaultTheme;
  useEffect(() => {
    const setDetaullanguage = async () => {
      // if (!code) {
      //   I18n.locale = 'en';
      // } else {
      I18n.locale = code;
      // }
    };
    setDetaullanguage().then(() => setIsReady(true));
  }, [code]);
  return (
    <NavigationContainer ref={navigationRef} theme={theme}>
      {product.length > 0 ? <AppNavigators /> : <StartupScreen />}

      {/* {isAuth && isReady && <AppNavigators />}
      {!isAuth && didTryAutoLogin && <AuthNavigator />}
      {!isAuth && !didTryAutoLogin && <StartupScreen />} */}
    </NavigationContainer>
  );
};

export default AppNavigator;
