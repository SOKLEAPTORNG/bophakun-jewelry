import React, {useEffect, useState, useCallback} from 'react';
import {
  View,
  StyleSheet,
  Platform,
  ScrollView,
  StatusBar,
  RefreshControl,
} from 'react-native';
import {Container, Tab, Tabs, ScrollableTab} from 'native-base';
import {TransitionPresets} from '@react-navigation/stack';
import Ionicons from 'react-native-vector-icons/FontAwesome5';
import {
  Colors as Color,
  SCREEN_HEIGHT,
  STATUSBAR_HEIGHT,
} from '../../constant/index';
import Items from './items';
import Cutting from './cutting';
import {useSelector, useDispatch} from 'react-redux';
import ExtraTouchable from '../../components/UI/TouchableCmp';
import * as actionAuth from '../../store/action/auth';
import * as actionTransitions from '../../store/action/auth';
import Text from '../../components/UI/DefaultText';
import i18n from '../../../Translations/index';
import {useTheme} from '@react-navigation/native';
import AddedPointsItems from './added_point_item';
import {Colors} from 'react-native/Libraries/NewAppScreen';
import {ColorSpace} from 'react-native-redash';
const PointOverview = props => {
  let total_saving = 0;
  let total_adding = 0;
  let total_paybill = 0;
  const [amount, setAmount] = useState(0);
  const [resfreshing, setRefreshing] = useState(false);
  const customer = useSelector(state => state.auth.userInfo);
  const {pointExchange} = useSelector(state => state.auth.companyInfo[0]);
  const transitions = useSelector(state => state.auth.transitions);
  const saving_data = transitions.filter(d => d.saving_points > 0);
  const cutting_data = transitions.filter(d => d.cut_point > 0);
  const added_points = useSelector(state =>
    state.auth.added_points.sort((a, b) => b.id - a.id),
  );
  const {total_rp} = customer[0];
  const theme = useTheme();
  const dispatch = useDispatch();
  /**
   * pull down refresh
   */
  const onRefresh = useCallback(async () => {
    try {
      setRefreshing(true);
      dispatch(actionAuth.getUserInfo(customer[0]['uid']));
      setRefreshing(false);
    } catch (err) {
      console.log(err);
    }
  }, [dispatch, customer]);
  /**
   * fetching transitions
   */
  const fetchTransitions = useCallback(async () => {
    try {
      await dispatch(actionTransitions.setTransitions());
    } catch (e) {
      console.log(e);
    }
  }, [dispatch]);
  /**
   * on change tabs will redispatch again
   */
  const onTabChange = async e => {
    if (e.i === 2) {
      try {
        setRefreshing(true);
        await dispatch(actionTransitions.setPointAdded());
        setRefreshing(false);
      } catch (err) {
        console.log(err);
      }
    }
  };

  useEffect(() => {
    const calculatePoints = () => {
      let total_amount = 0;
      let exchange = 0;
      exchange = 1 / pointExchange;
      total_amount = total_rp / exchange;
      setAmount(total_amount);
    };
    return calculatePoints();
  }, []);

  useEffect(() => {
    setRefreshing(true);
    fetchTransitions().then(() => {
      setRefreshing(false);
    });
  }, [onRefresh, fetchTransitions]);

  return (
    <Container>
      <StatusBar barStyle={'light-content'} />
      <View
        style={{
          ...styles.contain,
          backgroundColor: theme.dark ? '#000000' : Color.primary,
          position: 'relative',
          alignItems: 'center',
        }}>
        <View style={styles.header}>
          <View
            style={{
              position: 'absolute',
              width: '100%',
              paddingLeft: 10,
            }}>
            <ExtraTouchable
              onPress={() => props.navigation.goBack()}
              style={styles.btn}>
              <Ionicons name="chevron-left" color={Color.secondary} size={20} />
            </ExtraTouchable>
          </View>
          <Text style={styles.headerLabel}>
            {i18n.t('point.Points Transitions')}
          </Text>
        </View>
        <View style={styles.content}>
          <Text
            style={{
              ...styles.mainText,
              fontFamily: 'Poppins-Regular',
              color: Color.secondary,
            }}>
            {i18n.t('point.Available Points')}
          </Text>
          <Text style={styles.balance}>
            {total_rp} {i18n.t('point.pt')}{' '}
            {total_rp > 0 && (
              <Text style={styles.balance}>
                {' '}
                = {''} ${amount.toFixed(2)}
              </Text>
            )}
            {''}
          </Text>

          <View
            style={{
              backgroundColor: Color.secondary,
              borderRadius: 20,
              padding: 5,
              marginTop: 10,
              paddingHorizontal: 10,
              marginBottom: 20,
            }}>
            <Text
              style={{
                color: '#fff',
                fontSize: 12,
                // backgroundColor: Color.accent,
              }}>
              {1 / pointExchange} {i18n.t('point.pt')} = $ 1
            </Text>
          </View>
        </View>
        <View
          style={{
            backgroundColor: Color.secondary,
            alignSelf: 'stretch',
            padding: 5,
            alignContent: 'center',
            textAlign: 'center',
          }}>
          <Text
            style={{
              color: Color.textLight,
              fontSize: 13,
              fontWeight: '300',
              textAlign: 'center',
              // backgroundColor: Color.accent,
            }}>
            Saved: {/* xxxx   */}
            {saving_data.map((d, index) => {
              total_saving = total_saving + d.saving_points;
            })}
            {Number.parseFloat(total_saving).toFixed(2)} {i18n.t('point.pt')} |
            Pay Bill:{' '}
            {cutting_data.map((d, index) => {
              total_paybill = total_paybill + d.cut_point;
            })}
            {Number.parseFloat(total_paybill).toFixed(2)} {i18n.t('point.pt')} |
            Top-up:{' '}
            {added_points.map((d, index) => {
              total_adding = total_adding + d.point_value;
            })}
            {Number.parseFloat(total_adding).toFixed(2)} {i18n.t('point.pt')}
          </Text>
        </View>
      </View>
      <Tabs
        tabBarUnderlineStyle={{
          ...styles.tabBarUnderlineStyle,
        }}
        renderTabBar={() => (
          <ScrollableTab
            style={{
              backgroundColor: '#fff',
              borderWidth: 0,
            }}
            tabsContainerStyle={{
              backgroundColor: '#fff',
              padding: 6,
            }}
          />
        )}
        onChangeTab={e => onTabChange(e)}>
        <Tab
          heading="Saving Points"
          activeTextStyle={{
            ...styles.textStyle,
            color: theme.dark ? '#fff' : Color.secondary,
          }}
          textStyle={{
            ...styles.textStyle,
            color: theme.dark ? '#fff' : Color.secondary,
          }}
          activeTabStyle={{
            ...styles.tabStyle,
            backgroundColor: theme.dark ? '#333' : '#ffff',
          }}
          tabStyle={{backgroundColor: theme.dark ? '#333' : '#ffff'}}>
          <ScrollView
            style={{backgroundColor: theme.colors.background}}
            refreshControl={
              <RefreshControl onRefresh={onRefresh} refreshing={resfreshing} />
            }>
            {!saving_data.length ? (
              <View style={styles.tabContent}>
                <Text>{i18n.t('point.No Transitions')}</Text>
              </View>
            ) : (
              saving_data.map((d, index) => {
                return (
                  <Items
                    key={index}
                    orderDate={d.created_at}
                    savingPoint={d.saving_points}
                    status={d.status}
                    is_suspend={d.is_suspend}
                    cut_point={d.cut_point}
                  />
                );
              })
            )}
          </ScrollView>
        </Tab>
        <Tab
          heading={i18n.t('point.Cutting Points')}
          activeTextStyle={{
            ...styles.textStyle,
            color: theme.dark ? '#fff' : Color.secondary,
          }}
          textStyle={{
            ...styles.textStyle,
            color: theme.dark ? '#fff' : Color.secondary,
          }}
          activeTabStyle={{
            ...styles.tabStyle,
            backgroundColor: theme.dark ? '#333' : '#ffff',
          }}
          tabStyle={{backgroundColor: theme.dark ? '#333' : '#ffff'}}>
          <ScrollView
            style={{backgroundColor: theme.colors.background}}
            refreshControl={
              <RefreshControl onRefresh={onRefresh} refreshing={resfreshing} />
            }>
            {!cutting_data.length ? (
              <View style={styles.tabContent}>
                <Text>{i18n.t('point.No Transitions')}</Text>
              </View>
            ) : (
              cutting_data.map((d, index) => {
                return (
                  <Cutting
                    key={index}
                    orderDate={d.created_at}
                    savingPoint={d.saving_points}
                    status={d.status}
                    is_suspend={d.is_suspend}
                    cut_point={d.cut_point}
                  />
                );
              })
            )}
          </ScrollView>
        </Tab>
        <Tab
          heading={i18n.t('point.Adding Points')}
          activeTextStyle={{
            ...styles.textStyle,
            color: theme.dark ? '#fff' : Color.secondary,
          }}
          textStyle={{
            ...styles.textStyle,
            color: theme.dark ? '#fff' : Color.secondary,
          }}
          activeTabStyle={{
            ...styles.tabStyle,
            backgroundColor: theme.dark ? '#333' : '#ffff',
          }}
          tabStyle={{backgroundColor: theme.dark ? '#333' : '#ffff'}}>
          <ScrollView
            style={{backgroundColor: theme.colors.background}}
            refreshControl={
              <RefreshControl onRefresh={onRefresh} refreshing={resfreshing} />
            }>
            {!added_points.length ? (
              <View style={styles.tabContent}>
                <Text>{i18n.t('point.No Transitions')}</Text>
              </View>
            ) : (
              added_points.map((d, index) => {
                return (
                  <AddedPointsItems
                    status={d.status}
                    point_value={d.point_value}
                    dateFormat={d.created_at}
                    key={index}
                  />
                );
              })
            )}
          </ScrollView>
        </Tab>
      </Tabs>
    </Container>
  );
};

export const screenOptions = nav => {
  const TransitionPreset =
    Platform.OS == 'ios'
      ? TransitionPresets.DefaultTransition
      : TransitionPresets.FadeFromBottomAndroid;
  return {
    ...TransitionPreset,
    headerShown: false,
  };
};
export default PointOverview;
const styles = StyleSheet.create({
  contain: {
    height: SCREEN_HEIGHT / 3,
    paddingTop:
      Platform.OS === 'ios' ? STATUSBAR_HEIGHT * 2 - 30 : STATUSBAR_HEIGHT,
  },
  header: {
    alignItems: 'center',
    paddingLeft: 20,
    position: 'relative',
    width: '100%',
    marginTop: 20
  },
  tabBarUnderlineStyle: {
    backgroundColor: null,
    borderBottomWidth: 1.5,
    borderColor: Platform.OS === 'android' ? '#333' : Color.secondary,
  },
  headerLabel: {
    fontSize: 18,
    color: Color.secondary,
    fontFamily: 'Raleway-Bold',
    marginHorizontal: 20,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 30
  },
  mainText: {
    color: Color.accent,
  },
  balance: {
    color: Color.secondary,

    fontFamily: 'HomepageBaukasten-Book',
    fontSize: 24,
    marginTop: 10,
  },
  date: {
    fontSize: 10,
    opacity: 0.5,
    paddingTop: 5,
  },
  status: {
    fontSize: 16,
  },
  btn: {
    width: 35,
    height: 35,
  },
  activeTextStyle: {
    color: '#333',
    textTransform: 'capitalize',
    fontFamily: 'OpenSans-Regular',
    fontSize: Platform.OS === 'android' ? 14 : 13,
  },
  textStyle: {
    textTransform: 'capitalize',
    fontFamily: 'Roboto-Bold',
    fontSize: Platform.OS === 'android' ? 14 : 13,
  },
  tabStyle: {
    backgroundColor: '#fff',
  },
  // tabBarUnderlineStyle: {
  //   backgroundColor: null,
  //   borderBottomWidth: 1.5,
  //   borderColor: Platform.OS === 'android' ? '#333' : null,
  // },
  text: {
    fontFamily: 'OpenSans-Bold',
    opacity: 0.5,
  },
  tabContent: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: SCREEN_HEIGHT / 3 - 50,
  },
});
