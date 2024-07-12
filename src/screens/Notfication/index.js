import React, {useState, useEffect, useCallback} from 'react';
import {View, StyleSheet, FlatList, Platform, Alert} from 'react-native';
import {useTheme} from '@react-navigation/native';
import Text from '../../components/UI/DefaultText';
import NotifiItems from '../../components/Notifications/index';
import i18n from '../../../Translations/index';
import * as actionNotification from '../../store/action/notification';
import {useDispatch, useSelector} from 'react-redux';
import {Tab, Tabs} from 'native-base';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import {navigate} from '../../navigation/RootNavigation';
import moment from 'moment';
import {Colors} from '../../constant';
const NotifiOverview = props => {
  const [refreshing, setRefreshing] = useState(false);
  const theme = useTheme();
  const notification = useSelector(state => state.notification.notifications);
  const generalNotification = notification.filter(
    d => d.uid === null || d.uid === undefined,
  );
  const userNotification = notification.filter(items => !!items.uid);
  const _onRefresh = () => {
    setRefreshing(true);
    fetchNotification().then(() => setRefreshing(false));
  };
  const dispatch = useDispatch();
  const fetchNotification = useCallback(async () => {
    try {
      await dispatch(actionNotification.fetchNotificationRequest());
    } catch (err) {
      Alert.alert('Error', err.message);
    }
  }, [dispatch]);
  const onTabChange = async e => {
    if (e.i === 1) {
      try {
        await dispatch(actionNotification.fetchNotificationRequest());
      } catch (err) {
        Alert.alert('Error', err.message);
      }
    }
  };
  useEffect(() => {
    setRefreshing(true);
    fetchNotification().then(() => setRefreshing(false));
  }, [dispatch, fetchNotification]);

  // if (isLoading) {
  //   return (
  //     <View style={styles.container}>
  //       <ActivityIndicator size="large" color={theme.dark ? '#fff' : '#333'} />
  //     </View>
  //   );
  // }
  useEffect(() => {
    props.navigation.setOptions({
      headerStyle: {
        elevation: 0,
        shadowColor: 'transparent',
        backgroundColor: Colors.background,
      },
    });
  }, []);
  const onPressNavigate = id => {
    navigate('PromoDetail', {
      id: id,
      notification: true,
    });
  };
  // if (!notification.length && !isLoading) {
  //   return (
  //     <ScrollView
  //       style={{flex: 1}}
  //       refreshControl={
  //         <RefreshControl onRefresh={_onRefresh} refreshing={refreshing} />
  //       }>
  //       <View style={styles.container}>
  //         <Text>{i18n.t('promotion.Comming Soon')}...!</Text>
  //       </View>
  //     </ScrollView>
  //   );
  // }
  const renderItems = data => {
    return (
      <FlatList
        style={{backgroundColor: theme.colors.background, paddingTop: 10}}
        data={data}
        keyExtractor={item => item.id.toString()}
        refreshing={refreshing}
        onRefresh={_onRefresh}
        renderItem={items => {
          const create_date = moment(items.item.created_date).format('L');
          return (
            <NotifiItems
              name={items.item.title}
              description={items.item.description}
              createAt={create_date}
              image={items.item.image}
              theme={theme}
              navigation={() => onPressNavigate(items.item.id)}
            />
          );
        }}
      />
    );
  };
  return (
    <React.Fragment>
      <Tabs
        tabBarUnderlineStyle={{
          ...styles.tabBarUnderlineStyle,
          borderColor: theme.dark ? '#fff' : '#333',
        }}
        onChangeTab={e => onTabChange(e)}>
        <Tab
          heading={i18n.t('promotion.Promotion')}
          activeTextStyle={{
            ...styles.textStyle,
            color: theme.dark ? '#fff' : '#333',
          }}
          textStyle={{...styles.textStyle, color: theme.dark ? '#fff' : '#333'}}
          activeTabStyle={{
            ...styles.tabStyle,
            backgroundColor: theme.dark ? '#333' : '#ffff',
          }}
          tabStyle={{backgroundColor: theme.dark ? '#333' : '#ffff'}}>
          {!generalNotification.length ? (
            <View
              style={{
                ...styles.container,
                backgroundColor: theme.colors.background,
              }}>
              <FontAwesome
                name="bell-o"
                size={35}
                color={theme.dark ? '#ffff' : '#333'}
                style={{opacity: 0.5}}
              />
              <Text style={styles.text}>
                {i18n.t('notification.No notification')}
              </Text>
            </View>
          ) : (
            renderItems(generalNotification)
          )}
        </Tab>
        <Tab
          heading={i18n.t('notification.Transitions')}
          activeTextStyle={{
            ...styles.textStyle,
            color: theme.dark ? '#fff' : '#333',
          }}
          textStyle={{...styles.textStyle, color: theme.dark ? '#fff' : '#333'}}
          activeTabStyle={{
            ...styles.tabStyle,
            backgroundColor: theme.dark ? '#333' : '#ffff',
          }}
          tabStyle={{backgroundColor: theme.dark ? '#333' : '#ffff'}}>
          {!userNotification.length ? (
            <View
              style={{
                ...styles.container,
                backgroundColor: theme.colors.background,
              }}>
              <FontAwesome
                name="bell-o"
                size={30}
                color={theme.dark ? '#ffff' : '#333'}
                style={{opacity: 0.5}}
              />
              <Text style={styles.text}>
                {i18n.t('notification.No notification')}
              </Text>
              <Text>{i18n.t("notification.You don't have notifications")}</Text>
            </View>
          ) : (
            renderItems(userNotification)
          )}
        </Tab>
      </Tabs>
    </React.Fragment>
  );
};
export default NotifiOverview;
export const screenOptions = () => {
  return {
    headerTitle: i18n.t('setting.Notification'),
  };
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  bgImg: {
    width: 300,
    height: 300,
    resizeMode: 'contain',
  },
  activeTextStyle: {
    color: '#333',
    textTransform: 'uppercase',
    fontFamily: 'OpenSans-Regular',
    fontSize: 14,
  },
  textStyle: {
    color: '#333',
    textTransform: 'uppercase',
    fontFamily: 'Poppins-Medium',
    fontSize: 13,
  },
  tabStyle: {
    backgroundColor: '#fff',
  },
  tabBarUnderlineStyle: {
    backgroundColor: null,
    borderBottomWidth: 1.5,
    borderColor: Platform.OS === 'android' ? '#333' : null,
  },
  text: {
    fontFamily: 'OpenSans-Bold',
    opacity: 0.5,
  },
});
