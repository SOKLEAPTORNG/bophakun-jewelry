/**
 * @flow strict-local
 * React Hook
 * State Management React Redux | Redux Persist
 * Angkor's House Mobile App
 * React Native Version 0.63.2
 * Project Repository:
 * Created by Roth => : https://github.com/roth-dev
 */

import React, {useEffect} from 'react';
import {StatusBar, Linking, Alert, BackHandler} from 'react-native';
import {Provider} from 'react-redux';
import {store, persiststore} from './src/store/configStore';
import {PersistGate} from 'redux-persist/integration/react';
import AppContainer from './src/navigation/index';
import SplashScreen from 'react-native-splash-screen';
import {screensEnabled} from 'react-native-screens';
import VersionCheck from 'react-native-version-check';
import i18n from './Translations/index';
screensEnabled();
const App = () => {
  /**
   * hide slash screen
   */
  useEffect(() => {
    SplashScreen.hide();
  }, []);
  /**
   * handel check update app version
   */
  useEffect(() => {
    const checkUpdateNeeded = async () => {
      try {
        let updateNeeded = await VersionCheck.needUpdate();
        if (updateNeeded && updateNeeded.isNeeded) {
          //Alert the user and direct to the app url
          Alert.alert(
            i18n.t('home.Please Update'),
            i18n.t(
              'home.You will have to update your app to the latest version to continue using',
            ),
            [
              {
                text: i18n.t('home.Update'),
                onPress: () => {
                  BackHandler.exitApp();
                  Linking.openURL(updateNeeded.storeUrl);
                },
              },
            ],
            {cancelable: false},
          );
        }
      } catch (err) {
        console.log(err);
      }
    };
    return () => checkUpdateNeeded();
  }, []);

  return (
    <Provider store={store}>
      <StatusBar barStyle={'dark-content'} />
      <PersistGate loading={null} persistor={persiststore}>
        <AppContainer />
      </PersistGate>
    </Provider>
  );
};
export default App;
