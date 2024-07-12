import React, {useEffect, useCallback} from 'react';
import {
  View,
  Image,
  StyleSheet,
  ScrollView,
  RefreshControl,
  Alert,
  Platform,
} from 'react-native';
import {StatusBar} from 'react-native';
import Text from '../../components/UI/DefaultText';
import {Colors, SCREEN_HEIGHT, STATUSBAR_HEIGHT} from '../../constant/index';
import Card from '../../components/UI/Card';
import SimpleLineIcons from 'react-native-vector-icons/SimpleLineIcons';
import * as actionAuth from '../../store/action/auth';
import {useDispatch, useSelector} from 'react-redux';
import i18n from '../../../Translations/index';
import {getVersion} from 'react-native-device-info';
import ExtraTouchable from '../../components/UI/TouchableCmp';
import {navigate} from '../../navigation/RootNavigation';
import {useTheme} from '@react-navigation/native';
import {Button} from 'react-native-paper';
import {SafeAreaView} from 'react-native-safe-area-context';
const MyStatusBar = ({backgroundColor, ...props}) => (
  <View style={[styles.statusBar, {backgroundColor}]}>
    <SafeAreaView>
      <StatusBar translucent backgroundColor={backgroundColor} {...props} />
    </SafeAreaView>
  </View>
);
const ProfileOverviewScreen = props => {
  const [isLoading, setIsLoading] = React.useState(false);
  const [isRefresh, setIsRefresh] = React.useState(false);
  const contact_data = useSelector(state => state.auth.userInfo);
  const {name, mobile, email, total_rp, uid, avatar, id} = !contact_data.length
    ? {}
    : contact_data[0];
  const {group_id, group_name, group_discount} = useSelector(state =>
    !state.auth.customer_group.length ? {} : state.auth.customer_group[0],
  );
  const {enable_rp} = useSelector(state =>
    !state.auth.companyInfo.length ? {} : state.auth.companyInfo[0],
  );
  const app_versoin = getVersion();
  const {colors} = useTheme();
  const theme = useTheme();
  const dispatch = useDispatch();
  const fetchUserInfo = useCallback(async () => {
    try {
      await dispatch(actionAuth.getUserInfo(uid));
    } catch (e) {
      console.log(e);
    }
  }, [dispatch, uid]);
  const onRefresh = () => {
    setIsRefresh(true);
    fetchUserInfo().then(() => setIsRefresh(false));
  };
  /**
   * unsubcribe listener
   */
  useEffect(() => {
    if (contact_data.length > 0) {
      const unsubcribe = props.navigation.addListener('focus', fetchUserInfo);
      return () => {
        unsubcribe();
      };
    }
  }, [props.navigation, fetchUserInfo, contact_data]);
  const onAuthSignOut = () => {
    Alert.alert(i18n.t('drawer.Are you sure you would like to log out ?'), '', [
      {
        text: i18n.t('drawer.Cancel'),
        onPress: () => console.log('Canceled'),
      },
      {
        text: i18n.t('drawer.Ok'),
        onPress: () => dispatch(actionAuth.logout()),
      },
    ]);
  };
  if (contact_data.length === 0) {
    return (
      <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
        <Image
          source={require('../../assets/logo.png')}
          style={{width: 150, height: 150, resizeMode: 'contain'}}
        />
        <View style={{alignItems: 'center', paddingTop: 10}}>
          <Text>{i18n.t('profile.You are not signed in')}</Text>
          <Button
            onPress={() => navigate('SignIn')}
            style={{
              backgroundColor: Colors.primary,
              marginTop: 10,
              width: 160,
              borderRadius: 90,
              height: 41,
            }}>
            <Text
              style={{
                fontSize: 16,
                color: Colors.secondary,
              }}>
              {i18n.t('profile.Sign In')}
            </Text>
          </Button>
        </View>
      </View>
    );
  }
  return (
    <React.Fragment>
      {/* <MyStatusBar backgroundColor={Colors.primary} barStyle="light-content" /> */}
      <ScrollView
        style={{backgroundColor: Colors.primary}}
        refreshControl={
          <RefreshControl onRefresh={onRefresh} refreshing={isRefresh} />
        }>
        <View style={styles.constainer}>
          <View style={{...styles.headerContainer}}>
            <View style={{...styles.headerWrapper}}>
              <View style={{...styles.avatarContainer}}>
                <Image
                  source={
                    avatar !== null
                      ? {uri: avatar}
                      : require('../../assets/profile.png')
                  }
                  style={styles.image}
                />
              </View>
            </View>
            <View style={{...styles.userName}}>
              <Text style={{...styles.mainText}}>{name}</Text>
              {mobile !== null || email !== null ? (
                <View>
                  {mobile !== null ? (
                    <Text
                      style={{
                        ...styles.subText,
                        marginBottom: 18,
                        color: Colors.secondary,
                        fontSize: 12,
                        fontFamily: 'Roboto-Bold',
                      }}>
                      +855 {mobile}{' '}
                    </Text>
                  ) : (
                    <Text style={{...styles.subText, marginTop: 9}}>
                      {email}{' '}
                    </Text>
                  )}
                </View>
              ) : (
                <View></View>
              )}
            </View>
          </View>
          <View
            style={{
              width: '100%',
              position: 'relative',
              alignItems: 'center',
            }}>
            <View
              style={{
                ...styles.balanceContainer,
                paddingTop: 20,
              }}>
              <View style={{...styles.wrapper, marginLeft: 20}}>
                {group_name && (
                  <View
                    style={{
                      ...styles.balance,
                    }}>
                    <Text
                      style={{
                        ...styles.mainText,
                        fontSize: 12,
                        fontFamily: 'Roboto-Regular',
                        color: Colors.textLight,
                      }}>
                      {/* {i18n.t('profile.Your Wallet')} */}
                      {group_name}
                    </Text>
                    <Text
                      style={{
                        ...styles.mainText,
                        fontSize: 12,
                        fontFamily: 'Roboto-Regular',
                        color: Colors.textLight,
                      }}>
                      {'   '}
                      {group_discount} %
                    </Text>
                  </View>
                )}
                {enable_rp > 0 && (
                  <ExtraTouchable onPress={() => navigate('Points')}>
                    <View
                      style={{
                        ...styles.balance,
                        marginLeft: !group_name ? 0 : 20,
                      }}>
                      <Text
                        style={{
                          ...styles.mainText,
                          fontSize: 12,
                          fontFamily: 'Roboto-Regular',
                          color: Colors.textLight,
                        }}>
                        {i18n.t('profile.Saving Points')}
                      </Text>
                      <Text
                        style={{
                          ...styles.mainText,
                          fontFamily: 'Roboto-Regular',
                          fontSize: 12,
                          color: theme.dark ? '#ffff' : Colors.textLight,
                        }}>
                        {'   '} {total_rp}
                      </Text>
                    </View>
                  </ExtraTouchable>
                )}
              </View>

              {/* <View style={{...styles.luckyDrawerContainer}}>
              <View>
                <Text style={{...styles.subText}}> Play Lucky Drawer</Text>
              </View>
              <SimpleLineIcons
                name="arrow-right"
                size={25}
                color={Colors.primary}
              />
            </View> */}
            </View>
            <Card
              style={{
                ...styles.card,
                backgroundColor: colors.background,
              }}>
              <ExtraTouchable onPress={() => props.navigation.openDrawer()}>
                <View style={{...styles.flex}}>
                  <View>
                    <Text style={{...styles.textList}}>
                      {i18n.t('QRCode.Menu')}
                    </Text>
                  </View>
                  <SimpleLineIcons
                    name="arrow-right"
                    size={16}
                    color={Colors.secondary}
                  />
                </View>
              </ExtraTouchable>
              <ExtraTouchable onPress={() => navigate('QRCode')}>
                <View style={{...styles.flex}}>
                  <View>
                    <Text style={{...styles.textList}}>
                      {i18n.t('QRCode.My QR code')}
                    </Text>
                  </View>
                  <SimpleLineIcons
                    name="arrow-right"
                    size={16}
                    color={Colors.secondary}
                  />
                </View>
              </ExtraTouchable>
              <ExtraTouchable onPress={() => navigate('Orders')}>
                <View style={{...styles.flex}}>
                  <View style={{...styles.flexIcon}}>
                    {/* <Image
                      style={{
                        ...styles.iconStyle,
                      }}
                      source={require('../../assets/order.png')}
                    /> */}
                    <Text style={{...styles.textList}}>
                      {i18n.t('order.Your Orders')}
                    </Text>
                  </View>
                  <SimpleLineIcons
                    name="arrow-right"
                    size={16}
                    color={Colors.secondary}
                  />
                </View>
              </ExtraTouchable>
              <ExtraTouchable onPress={() => navigate('Save')}>
                <View style={{...styles.flex}}>
                  <View style={{...styles.flexIcon}}>
                    {/* <Image
                      style={{
                        ...styles.iconStyle,
                      }}
                      source={require('../../assets/heart.png')}
                    /> */}
                    <Text style={{...styles.textList}}>
                      {i18n.t('favorite.Your favorites')}
                    </Text>
                  </View>
                  <SimpleLineIcons
                    name="arrow-right"
                    size={16}
                    color={Colors.secondary}
                  />
                </View>
              </ExtraTouchable>
              <ExtraTouchable onPress={() => navigate('Promotion')}>
                <View style={{...styles.flex}}>
                  <View style={{...styles.flexIcon}}>
                    {/* <Image
                      style={{
                        ...styles.iconStyle,
                      }}
                      source={require('../../assets/gift.png')}
                    /> */}
                    <Text style={{...styles.textList}}>
                      {i18n.t('promotion.Promotion')}
                    </Text>
                  </View>
                  <SimpleLineIcons
                    name="arrow-right"
                    size={16}
                    color={Colors.secondary}
                  />
                </View>
              </ExtraTouchable>
              <ExtraTouchable onPress={() => navigate('Notification')}>
                <View style={{...styles.flex}}>
                  <View style={{...styles.flexIcon}}>
                    {/* <Image
                      style={{
                        ...styles.iconStyle,
                      }}
                      source={require('../../assets/notification.png')}
                    /> */}
                    <Text style={{...styles.textList}}>
                      {i18n.t('setting.Notification')}
                    </Text>
                  </View>
                  <SimpleLineIcons
                    name="arrow-right"
                    size={16}
                    color={Colors.secondary}
                  />
                </View>
              </ExtraTouchable>
              <ExtraTouchable onPress={() => navigate('AboutUs')}>
                <View style={{...styles.flex}}>
                  <View style={{...styles.flexIcon}}>
                    {/* <Image
                      style={{
                        ...styles.iconStyle,
                      }}
                      source={require('../../assets/notification.png')}
                    /> */}
                    <Text style={{...styles.textList}}>
                      {i18n.t('about.About Us')}
                    </Text>
                  </View>
                  <SimpleLineIcons
                    name="arrow-right"
                    size={16}
                    color={Colors.secondary}
                  />
                </View>
              </ExtraTouchable>
              <ExtraTouchable onPress={() => navigate('Setting')}>
                <View style={{...styles.flex}}>
                  <View style={{...styles.flexIcon}}>
                    {/* <Image
                      style={{
                        ...styles.iconStyle,
                      }}
                      source={require('../../assets/setting.png')}
                    /> */}
                    <Text style={{...styles.textList}}>
                      {i18n.t('setting.Setting')}
                    </Text>
                  </View>
                  <SimpleLineIcons
                    name="arrow-right"
                    size={16}
                    color={Colors.secondary}
                  />
                </View>
              </ExtraTouchable>
              <ExtraTouchable onPress={() => navigate('EditProfile')}>
                <View
                  style={{
                    ...styles.flex,
                  }}>
                  <View style={{...styles.flexIcon}}>
                    {/* <Image
                      style={{
                        ...styles.iconStyle,
                        width: 36,
                        height: 36,
                      }}
                      source={require('../../assets/log-out.png')}
                    /> */}
                    <Text style={{...styles.textList}}>
                      {i18n.t('editprofile.Edit Profile')}
                    </Text>
                  </View>
                  <SimpleLineIcons
                    name="arrow-right"
                    size={16}
                    color={Colors.secondary}
                  />
                </View>
              </ExtraTouchable>
              <ExtraTouchable onPress={onAuthSignOut}>
                <View
                  style={{
                    ...styles.flex,
                  }}>
                  <View style={{...styles.flexIcon}}>
                    {/* <Image
                      style={{
                        ...styles.iconStyle,
                        width: 36,
                        height: 36,
                      }}
                      source={require('../../assets/log-out.png')}
                    /> */}
                    <Text style={{...styles.textList}}>
                      {i18n.t('drawer.Logout')}
                    </Text>
                  </View>
                </View>
              </ExtraTouchable>
            </Card>
          </View>
        </View>
        <View style={{...styles.footer}}>
          <Text style={{...styles.txtVersion}}>
            {i18n.t('profile.Version')}: {app_versoin}
          </Text>
        </View>
      </ScrollView>
    </React.Fragment>
  );
};
export const screenOptions = ({navigation}) => {
  return {
    headerShown: false,
    headerTitle: i18n.t('profile.profile'),
  };
};
export default ProfileOverviewScreen;
const APPBAR_HEIGHT = Platform.OS === 'ios' ? 44 : 56;
const styles = StyleSheet.create({
  screen: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  constainer: {
    flex: 1,
  },
  headerContainer: {
    padding: 15,
    alignItems: 'center',
    flexDirection: 'row',
    height: 161,
    top: 20,
  },
  headerWrapper: {
    alignItems: 'center',
  },
  avatarContainer: {
    width: 80,
    height: 80,
    borderRadius: 10,
    backgroundColor: '#ddd',
    alignItems: 'flex-end',

    justifyContent: 'center',
  },
  image: {
    flex: 1,
    width: null,
    height: null,
    width: 80,
    borderRadius: 10,
    height: 80,
  },
  userName: {
    alignItems: 'flex-start',
    marginTop: 10,
    marginLeft: 30,
  },
  mainText: {
    fontFamily: 'Roboto-Bold',
    fontSize: 24,
    color: Colors.secondary,
  },
  subText: {
    fontSize: 16,
    color: Colors.secondary,
  },
  balanceContainer: {
    padding: 10,
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.background,
  },
  wrapper: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  balance: {
    paddingVertical: 2.5,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
    flexDirection: 'row',
    height: 52,
    borderRadius: 11,
    backgroundColor: Colors.secondary,
  },
  luckyDrawerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#fff',
    padding: 10,
    marginTop: 10,
    borderRadius: 10,
  },
  card: {
    // padding: 20,
    margin: 0,
    borderRadius: 2.5,
    paddingBottom: 10,
    width: '100%',
  },
  flex: {
    flexDirection: 'row',
    padding: 15,
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomColor: '#ddd',
    borderBottomWidth: 1,
    width: '100%',
  },
  footer: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingBottom: Platform.OS === 'ios' ? 200 : 0,
    backgroundColor: Colors.background,
  },
  txtVersion: {
    opacity: 0.5,
    paddingBottom: Platform.OS === 'ios' ? 0 : 120,
    paddingTop: 20,
  },
  settingIcon: {
    width: 41,
    height: 41,
    resizeMode: 'contain',
  },
  editProfile: {
    backgroundColor: Colors.background,
    width: 146,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 6,
    marginTop: 18,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,

    marginBottom: 6,
  },
  editButton: {
    fontFamily: 'Poppins-Semibold',
    fontSize: 14,
    color: Colors.primary,
  },
  statusBar: {
    height: 46,
  },
  flexIcon: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconStyle: {
    width: 30,
    height: 30,
    resizeMode: 'contain',
  },
  textList: {
    left: 9,
    fontSize: 14,
    fontFamily: 'Roboto-Regular',
    color: Colors.secondary,
  },
});
