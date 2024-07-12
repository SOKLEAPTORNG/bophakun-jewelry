import React, {useEffect, useRef, useState, useCallback} from 'react';
import {
  View,
  Platform,
  StatusBar,
  Image,
  ImageBackground,
  KeyboardAvoidingView,
  Modal,
  Pressable,
  Animated,
  ActivityIndicator,
  Alert,
} from 'react-native';
import {TextInput} from 'react-native-gesture-handler';
import styles from './style';
import {
  AccessToken,
  LoginManager,
  GraphRequest,
  GraphRequestManager,
} from 'react-native-fbsdk';
import {
  AppleButton,
  appleAuth,
} from '@invertase/react-native-apple-authentication';
import {TransitionPresets} from '@react-navigation/stack';
import Text from '../../components/UI/DefaultText';
import * as Animatable from 'react-native-animatable';
import {CodeField, Cursor} from 'react-native-confirmation-code-field';
import {Colors, STATUSBAR_HEIGHT} from '../../constant/index';
import moment from 'moment';
import {useDispatch} from 'react-redux';
import I18n from '../../../Translations/index';
import * as authActions from '../../store/action/auth';
import * as actionPromotions from '../../store/action/promotion';
import * as actionProduct from '../../store/action/product';
import Loading from '../../components/UI/Spiner';
import TouchableCmp from '../../components/UI/TouchableCmp';
import {GoogleSignin, statusCodes} from '@react-native-community/google-signin';
import {GOOGLE_AUTH_CLIENT_ID} from '../../constant/index';
import auth from '@react-native-firebase/auth';
import {useTheme, useNavigation} from '@react-navigation/native';
import SimpleLineIcons from 'react-native-vector-icons/SimpleLineIcons';

const {Value, Text: AnimatedText} = Animated;

export default props => {
  const [iosVersion, setIosVersion] = useState('');
  const [phoneNumber, setPhoneNumber] = useState();
  const [isLoading, setIsLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  // if null, no SMS has been sent
  const [confirm, setConfirm] = useState(null);
  const [code, setCode] = useState('');
  const dispatch = useDispatch();
  const loadRef = useRef(null);
  const theme = useTheme();
  const navigation = useNavigation();
  useEffect(() => {
    const majorVersionIOS = parseInt(Platform.Version, 10);
    setIosVersion(majorVersionIOS);
    GoogleSignin.configure({
      webClientId: GOOGLE_AUTH_CLIENT_ID,
      offlineAccess: true,
    });
  }, []);

  const onChangePhone = number => {
    setPhoneNumber(number);
  };
  const handleCheckUserInfo = async userId => {
    try {
      await dispatch(authActions.getUserInfo(userId));
      await dispatch(actionProduct.setProducts());
      await dispatch(authActions.setCompanyInfo());
      await dispatch(actionPromotions.getPromotion());
    } catch (err) {
      console.log(err.message);
    }
  };
  const _handleLogin = async (name, id, email, photo, token) => {
    const namex = name == null ? 'Unknown' : name;
    const emailx = email == null ? id : email;
    const photox = photo == null ? '' : photo;
    try {
      await dispatch(authActions.login(namex, id, emailx, photox, token));
      navigation.goBack();
      _onLoadingFinish();
    } catch (e) {
      _onLoadingFinish();
      console.log(e);
    }
  };
  // ===============================>
  const _onLoading = () => {
    const load = loadRef.current;
    if (load) {
      load.show();
    }
  };
  const _onLoadingFinish = () => {
    const load = loadRef.current;
    if (load) {
      load.close();
    }
  };
  const onFacebookButtonPress = async () => {
    _onLoading();
    setIsLoading(true);
    try {
      const result = await LoginManager.logInWithPermissions([
        'public_profile',
        'email',
      ]);
      if (result.isCancelled) {
        setIsLoading(false);
      }
      const data = await AccessToken.getCurrentAccessToken();
      const facebookCredential = auth.FacebookAuthProvider.credential(
        data.accessToken,
      );
      // console.log(data);
      const PROFILE_REQUEST_PARAMS = {
        fields: {
          string:
            'picture.type(large),name,email,gender, first_name, last_name',
        },
      };

      const req = await AccessToken.getCurrentAccessToken().then(res => {
        return res;
      });
      const token = req.accessToken;
      const profileReq = new GraphRequest(
        '/me',
        {
          token,
          parameters: PROFILE_REQUEST_PARAMS,
        },
        (err, res) => {
          if (err) {
            console.log('Login info has an error');
            _onLoadingFinish();
          } else {
            const {id, name, picture} = res;
            const {url} = picture.data;
            const email = res.email;
            handleCheckUserInfo(id).then(() => {
              _handleLogin(name, id, email, url, token);
            });
          }
        },
      );
      new GraphRequestManager().addRequest(profileReq).start();
      return auth()
        .signInWithCredential(facebookCredential)
        .then(() => props.navigation.goBack());
    } catch (err) {
      __DEV__ && console.log('err', err);
      _onLoadingFinish();
      // throw new Error('Something when wrong!!');
    }
  };
  const onPressGoogleSignIn = async () => {
    _onLoading();
    try {
      await GoogleSignin.hasPlayServices();
      await GoogleSignin.signIn().then(response => {
        const {name, id, email, photo} = response.user;
        handleCheckUserInfo(id).then(() => {
          _handleLogin(name, id, email, photo, response.idToken);
        });

        // Create a Google credential with the token
        const googleCredential = auth.GoogleAuthProvider.credential(
          response.idToken,
        );
        // const {user, idToken} = userInfo;
        // console.log(response);
        return auth()
          .signInWithCredential(googleCredential)
          .then(() => props.navigation.goBack());
      });
    } catch (e) {
      __DEV__ && console.log({...e});
      if (e.code === statusCodes.SIGN_IN_CANCELLED) {
        _onLoadingFinish();
      }
      _onLoadingFinish();
    }
  };
  const onPresAppleSingIn = async () => {
    _onLoading();
    try {
      const appleAuthRequestResponse = await appleAuth.performRequest({
        requestedOperation: appleAuth.Operation.LOGIN,
        requestedScopes: [appleAuth.Scope.EMAIL, appleAuth.Scope.FULL_NAME],
      });
      if (!appleAuthRequestResponse.identityToken) {
        throw 'Apple Sign-In failed - no identify token returned';
      }
      const {identityToken, email, fullName, nonce} = appleAuthRequestResponse;
      const appleCredential = auth.AppleAuthProvider.credential(
        identityToken,
        nonce,
      );

      return auth()
        .signInWithCredential(appleCredential)
        .then(() => {
          const {photoURL, metadata} = auth().currentUser;
          const {creationTime} = metadata;
          const uid = moment(creationTime).format('YYYYMMDDDDhhmmss');
          console.log(uid);
          handleCheckUserInfo(uid).then(() => {
            _handleLogin(
              fullName.familyName,
              uid,
              email,
              photoURL,
              identityToken,
            );
          });
        })
        .catch(e => {
          __DEV__ && console.log(e);
        });
    } catch (error) {
      __DEV__ && console.log(error); // all of this console log should show only devlopement good
      if (error.code === appleAuth.Error.CANCELED) {
        _onLoadingFinish();
      }
      _onLoadingFinish();
    }
    // Start the sign-in request
  };

  async function signInWithPhoneNumber() {
    const phone_number = '+855' + phoneNumber;
    _onLoading();
    const confirmation = await auth().signInWithPhoneNumber(phone_number);
    console.log('confirmation: ', confirmation);

    _onLoadingFinish();
    setConfirm(confirmation);
    setModalVisible(true);
  }

  async function confirmCode() {
    setIsLoading(true);
    try {
      await confirm.confirm(code);
      let userData = await auth().currentUser;
      console.log('userData', userData._user);
      console.log(userData._user.phoneNumber);
      // console.log('yes', userData);
      const {photoURL, metadata} = auth().currentUser;
      const {creationTime} = metadata;
      const uid = moment(creationTime).format('YYYYMMDDDDhhmmss');
      handleCheckUserInfo(uid).then(() => {
        console.log('work on handle login', userData._user);
        _handleLogin(userData._user.phoneNumber, uid, null, null, null);
        setModalVisible(!modalVisible);
        setCode('');
        setIsLoading(false);
      });
    } catch (error) {
      console.log('Invalid code.');
      setModalVisible(!modalVisible);
      setIsLoading(false);
      setCode('');
      Alert.alert('Something went wrong', 'Please try again later', [
        {
          text: 'Okay',
        },
      ]);
    }
  }

  const renderCell = ({index, symbol, isFocused}) => {
    return (
      <View style={styles.renderCellView}>
        <AnimatedText key={index} style={styles.cell}>
          {symbol || (isFocused ? <Cursor /> : null)}
        </AnimatedText>
      </View>
    );
  };

  const onChangeCode = textCode => {
    setCode(textCode);
  };

  return (
    <View
      style={{
        ...styles.container,
        backgroundColor: theme.dark ? Colors.primary : Colors.primary,
      }}>
      <View
        style={{
          top: Platform.OS === 'ios' ? STATUSBAR_HEIGHT : 0,
          padding: 20,
          position: 'absolute',
          zIndex: 999,
        }}>
        <SimpleLineIcons
          name="arrow-left"
          size={24}
          color="#fff"
          onPress={() => props.navigation.goBack()}
        />
      </View>
      <ImageBackground
        backgroundColor={Colors.primary}
        // blurRadius={6}
        style={{
          flex: 1,
          // height: 552,
        }}
        source={require('../../assets/login-bg.png')}>
        <View style={{flex: 1}}>
          <Loading
            ref={loadRef}
            backgroundColor={'#00000096'}
            indicatorColor={'#fff'}
            easing={Loading.EasingType.linear}
          />
          <StatusBar
            backgroundColor={Colors.primary}
            barStyle="light-content"
          />
          <View style={styles.header}>
            <View style={{justifyContent: 'center', alignItems: 'center'}}>
              <Animatable.Image
                // animation="bounceIn"
                duraton="3000"
                // source={require('../../assets/logo-white.png')}
                style={styles.logo}
                resizeMode="stretch"
              />
            </View>
            <Animatable.View
              duration={250}
              style={{
                ...styles.footer,
                backgroundColor: null,
              }}
              animation="fadeInUpBig">
              <KeyboardAvoidingView
                keyboardVerticalOffset={50}
                behavior="padding"
                style={styles.containerAvoiddingView}>
                <Text style={{...styles.text_title, marginTop: 30}}>
                  {I18n.t('login.Login Account')}
                </Text>
                <View style={styles.containerInput}>
                  <View style={styles.flagContainer}>
                    <Image
                      style={{width: 25, height: 16}}
                      source={require('../../assets/flag.png')}
                    />
                    <Text style={styles.openDialogView}>{'  +855 '}</Text>
                  </View>
                  <TextInput
                    style={styles.phoneInputStyle}
                    placeholder={I18n.t('login.Phone Number')}
                    keyboardType="numeric"
                    value={phoneNumber}
                    onChangeText={onChangePhone}
                    secureTextEntry={false}
                  />
                </View>
                <TouchableCmp onPress={signInWithPhoneNumber}>
                  <View style={{...styles.buttonContainer}}>
                    <Text style={styles.buttonText}>
                      {' '}
                      {I18n.t('login.Next')}
                    </Text>
                  </View>
                </TouchableCmp>
                <View style={styles.footer_section}>
                  <View style={styles.letfBorder} />
                  <Text
                    style={{
                      color: '#000',
                      fontSize: 12,
                      paddingHorizontal: 14,
                    }}>
                    {I18n.t('login.Or')}
                  </Text>
                  <View style={styles.rightBorder} />
                </View>
                <View
                  style={{
                    paddingTop: 20,
                    flexDirection: 'row',
                    zIndex: 999,
                    justifyContent: 'center',
                    alignItems: 'center',
                    width: '100%',
                  }}>
                  <Animatable.View animation="fadeInLeft" duration={500}>
                    <TouchableCmp onPress={onFacebookButtonPress}>
                      <View style={{...styles.iconContainer}}>
                        <Image
                          style={{...styles.iconContainer}}
                          source={require('../../assets/facebook-icon.png')}
                        />
                      </View>
                    </TouchableCmp>
                  </Animatable.View>
                  <Animatable.View animation="fadeInRight" duration={500}>
                    <TouchableCmp onPress={onPressGoogleSignIn}>
                      <View style={{...styles.iconContainer}}>
                        <Image
                          style={{...styles.iconContainer}}
                          source={require('../../assets/google-icon.png')}
                        />
                      </View>
                    </TouchableCmp>
                  </Animatable.View>
                  <Animatable.View animation="fadeInRight" duration={500}>
                    {Platform.OS === 'ios' && (
                      <TouchableCmp onPress={onPresAppleSingIn}>
                        <View style={{...styles.iconContainer, marginRight: 0}}>
                          <Image
                            style={{...styles.iconContainer}}
                            source={require('../../assets/apple-icon.png')}
                          />
                          <View></View>
                        </View>
                      </TouchableCmp>
                    )}
                  </Animatable.View>
                </View>
              </KeyboardAvoidingView>
            </Animatable.View>
          </View>
        </View>
      </ImageBackground>
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          Alert.alert('Modal has been closed.');
          setModalVisible(!modalVisible);
        }}>
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <Text style={styles.modalText}>Enter Verification Code</Text>
            <CodeField
              value={code}
              onChangeText={onChangeCode}
              cellCount={6}
              rootStyle={styles.codeFiledRoot}
              keyboardType="number-pad"
              textContentType="oneTimeCode"
              renderCell={renderCell}
            />
            <Pressable
              style={[
                styles.button,
                {backgroundColor: isLoading ? '#FD8442a0' : Colors.primary},
              ]}
              onPress={() => confirmCode()}
              disabled={isLoading}>
              {isLoading && (
                <ActivityIndicator size="small" color={Colors.primary} />
              )}
              <Text style={styles.textStyle}>Confirm</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    </View>
  );
};
export const screenOptions = navData => {
  const TransitionPreset = TransitionPresets.ModalSlideFromBottomIOS;
  return {
    headerShown: false,
  };
};
