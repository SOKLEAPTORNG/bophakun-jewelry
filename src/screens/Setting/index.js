import React, {useState, useCallback, useEffect} from 'react';
import {
  TouchableOpacity,
  StyleSheet,
  View,
  Platform,
  ScrollView,
  StatusBar,
  Linking,
} from 'react-native';
import Modal from 'react-native-modal'; // 2.4.0
import SimpleLineIcons from 'react-native-vector-icons/SimpleLineIcons';
import {Colors} from '../../constant/index';
import Fontisto from 'react-native-vector-icons/Fontisto';
import i18n from '../../../Translations/index';
import Text from '../../components/UI/DefaultText';
import {useTheme} from '@react-navigation/native';
import {Switch} from 'react-native-paper';
import {useDispatch, useSelector} from 'react-redux';
import TouchableCmp from '../../components/UI/TouchableCmp';
import * as actionLocalStorage from '../../store/action/local';

const SettingOverviewScreen = props => {
  const {colors} = useTheme();
  const theme = useTheme();
  const [visibleModal, setVisbleModal] = useState(null);
  const [code, setCode] = useState('en');
  const [isDarkTheme, setIsDarkTheme] = useState(false);
  const darkThem = useSelector(state => state.localStorage.isDarkTheme);
  const codex = useSelector(state => state.localStorage.code);
  const {facebook_link, contact_us_link, company_website} = useSelector(
    state => state.auth.companyInfo[0],
  );
  useEffect(() => {
    const setDefaultStateLangauge = () => {
      if (codex) {
        setCode(codex);
      }
      return;
    };
    setDefaultStateLangauge();
  }, [codex]);
  const paperTheme = useTheme();
  const dispatch = useDispatch();
  const onToggleThemes = useCallback(() => {
    setIsDarkTheme(!isDarkTheme);
    dispatch(actionLocalStorage.setToggleThemes(isDarkTheme));
  }, [dispatch, isDarkTheme]);
  const onLanguageChange = () => {
    if (codex === code) {
      setVisbleModal(null);
    } else {
      dispatch(actionLocalStorage.setToggleLanguage(code));
      setVisbleModal(null);
    }
  };
  useEffect(() => {
    if (!darkThem) {
      setIsDarkTheme(!isDarkTheme);
    }
  }, []);
  const _handleOpenLinking = type => {
    const fb = Platform.OS === 'ios' ? 'profile' : 'page';
    switch (type) {
      case 'fb':
        return Linking.openURL(`fb://${fb}/${facebook_link}`);
      case 'ig':
        return Linking.openURL('instagram://user?username=angkorhousekh');
      case 'web':
        return Linking.openURL(company_website);
      case 'notifi':
        return Linking.openSettings();
      case 'contact':
        return Linking.openURL(contact_us_link); //
      default:
        return;
    }
  };
  const _renderButton = (text, onPress) => (
    <TouchableOpacity onPress={onPress}>
      <View style={styles.button}>
        <Text style={{...styles.btnText}}>{text}</Text>
      </View>
    </TouchableOpacity>
  );

  const _renderModalContent = () => (
    <View style={{...styles.modalContent, backgroundColor: colors.background}}>
      <TouchableCmp onPress={() => setCode('kh')}>
        <View style={{...styles.flex}}>
          <Text style={{...styles.mainText}}>ភាសាខ្មែរ </Text>
          <Fontisto
            name={code === 'kh' ? 'radio-btn-active' : 'radio-btn-passive'}
            size={24}
            color={Colors.primary}
          />
        </View>
      </TouchableCmp>
      <TouchableCmp onPress={() => setCode('en')}>
        <View style={{...styles.flex}}>
          <Text style={{...styles.mainText}}>English</Text>
          <Fontisto
            name={code === 'en' ? 'radio-btn-active' : 'radio-btn-passive'}
            size={24}
            color={Colors.primary}
          />
        </View>
      </TouchableCmp>
      {_renderButton(i18n.t('setting.Apply'), () => onLanguageChange())}
    </View>
  );

  return (
    <ScrollView>
      <View style={{...styles.container}}>
        <StatusBar
          backgroundColor={theme.dark ? colors.background : colors.text}
          barStyle={theme.dark ? 'light-content' : 'dark-content'}
        />
        <View
          style={{
            ...styles.headerTitle,
            backgroundColor: theme.dark ? '#000' : '#ddd',
          }}>
          <Text style={{...styles.mainText}}>
            {i18n.t('setting.App Settings')}
          </Text>
        </View>
        {/* <TouchableCmp onPress={() => onToggleThemes()}>
          <View style={{...styles.wrapper, backgroundColor: colors.background}}>
            <View style={{...styles.flex}}>
              <Text>Dark Mode</Text>
              <Switch value={paperTheme.dark} onValueChange={onToggleThemes} />
              <View style={{...styles.subFlex}}>
              <Text style={{...styles.subText, color: colors.text}}>Light</Text>
              <SimpleLineIcons name="arrow-right" size={14} color={Colors.primary}/>
            </View>
            </View>
          </View>
        </TouchableCmp> */}
        <TouchableCmp onPress={() => _handleOpenLinking('notifi')}>
          <View style={{...styles.wrapper, backgroundColor: colors.background}}>
            <View style={{...styles.flex}}>
              <Text
                style={{
                  fontFamily: 'Roboto-Medium',
                }}>
                {i18n.t('setting.Notification')}
              </Text>
              <SimpleLineIcons
                name="arrow-right"
                size={14}
                color={Colors.primary}
              />
            </View>
          </View>
        </TouchableCmp>
        <TouchableCmp onPress={() => setVisbleModal(1)}>
          <View style={{...styles.wrapper, backgroundColor: colors.background}}>
            <View style={{...styles.flex}}>
              <Text
                style={{
                  fontFamily: 'Roboto-Medium',
                }}>
                {i18n.t('setting.Language')}
              </Text>
              <SimpleLineIcons
                name="arrow-right"
                size={14}
                color={Colors.primary}
              />
            </View>
          </View>
        </TouchableCmp>
        <View
          style={{
            ...styles.headerTitle,
            backgroundColor: theme.dark ? '#000' : '#ddd',
          }}>
          <Text style={{...styles.mainText}}>
            {i18n.t('setting.More Settings')}
          </Text>
        </View>
        {/* <TouchableCmp>
          <View style={{...styles.wrapper, backgroundColor: colors.background}}>
            <View style={{...styles.flex}}>
              <Text>About Us</Text>
              <SimpleLineIcons
                name="arrow-right"
                size={14}
                color={Colors.primary}
              />
            </View>
          </View>
        </TouchableCmp> */}
        <TouchableCmp onPress={() => _handleOpenLinking('fb')}>
          <View style={{...styles.wrapper, backgroundColor: colors.background}}>
            <View style={{...styles.flex}}>
              <Text>Follow Us On Facebook</Text>
              <SimpleLineIcons
                name="arrow-right"
                size={14}
                color={Colors.primary}
              />
            </View>
          </View>
        </TouchableCmp>
        {/* <TouchableCmp onPress={() => _handleOpenLinking('ig')}>
          <View style={{...styles.wrapper, backgroundColor: colors.background}}>
            <View style={{...styles.flex}}>
              <Text>Follow Us On Instagram</Text>
              <SimpleLineIcons
                name="arrow-right"
                size={14}
                color={Colors.primary}
              />
            </View>
          </View>
        </TouchableCmp> */}
        <TouchableCmp onPress={() => _handleOpenLinking('web')}>
          <View style={{...styles.wrapper, backgroundColor: colors.background}}>
            <View style={{...styles.flex}}>
              <Text>Visit Our Website</Text>
              <SimpleLineIcons
                name="arrow-right"
                size={14}
                color={Colors.primary}
              />
            </View>
          </View>
        </TouchableCmp>
        <TouchableCmp onPress={() => _handleOpenLinking('contact')}>
          <View style={{...styles.wrapper, backgroundColor: colors.background}}>
            <View style={{...styles.flex}}>
              <Text>Contact Us</Text>
              <SimpleLineIcons
                name="arrow-right"
                size={14}
                color={Colors.primary}
              />
            </View>
          </View>
        </TouchableCmp>
        <Modal
          isVisible={visibleModal === 1}
          animationIn={'fadeInUp'}
          animationOut={'fadeOutDown'}>
          {_renderModalContent()}
        </Modal>
      </View>
    </ScrollView>
  );
};

export default SettingOverviewScreen;
export const screenOptions = ({navigation}) => {
  return {
    headerTitle: i18n.t('setting.Setting'),
  };
};

const styles = StyleSheet.create({
  container: {
    // margin: 10,
    flex: 1,
    // padding: 20,
    // borderColor: Colors.primary,
    // borderWidth: 1,
    // justifyContent: 'center',
    // alignItems: 'center',
  },
  headerTitle: {
    padding: 15,
  },
  flex: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    justifyContent: 'space-between',
  },
  subFlex: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
  },
  wrappContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  wrapper: {
    backgroundColor: '#fff',
    borderBottomColor: '#ddd',
    borderBottomWidth: 1,
  },
  button: {
    backgroundColor: Colors.primary,
    padding: 10,
    marginTop: 16,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 4,
    borderColor: Colors.primary,
  },
  modalContent: {
    padding: 22,
    // justifyContent: 'center',
    // alignItems: 'center',
    borderRadius: 4,
    borderColor: Colors.primary,
  },
  bottomModal: {
    justifyContent: 'flex-end',
    margin: 0,
  },
  btnText: {
    color: '#fff',
    fontFamily: 'OpenSans-Bold',
    fontSize: 18,
  },
  mainText: {
    fontFamily: 'Roboto-Medium',
    fontSize: 16,
  },
  subText: {
    paddingRight: 5,
    fontSize: 12,
  },
});
