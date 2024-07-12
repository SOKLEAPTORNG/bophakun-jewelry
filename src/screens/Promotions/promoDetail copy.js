import React, {useState, useEffect} from 'react';
import {View, StyleSheet, ScrollView, ActivityIndicator} from 'react-native';
import {
  SCREEN_WIDTH,
  DISCOUNT_PATH,
  IMAGE_PATH,
  Colors,
  SCREEN_HEIGHT,
} from '../../constant/index';
import Text from '../../components/UI/DefaultText';
import TouchableCmp from '../../components/UI/TouchableCmp';
import {useSelector} from 'react-redux';
import {Image} from 'react-native-elements';
import moment from 'moment';
import i18n from '../../../Translations/index';
import {
  navigate,
  loadRef,
  _onLoading,
  _onLoadingFinish,
} from '../../navigation/RootNavigation';
const PromoDetail = ({route, navigation}) => {
  const [initailState, setInitailState] = useState({
    image: null,
    name: '',
    create_at: '',
    description: '',
    start_at: '',
    end_at: '',
  });
  const {id, notification} = route.params;
  const promotion = useSelector(state =>
    state.promotion.promotion.filter(d => d.id === id),
  );
  const notifications = useSelector(state =>
    state.notification.notifications.filter(item => item.id === id),
  );
  useEffect(() => {
    if (!notification) {
      const {image, name, create_at, description, start_at, end_at} =
        promotion[0];
      setInitailState({
        ...initailState,
        name: name,
        image: image,
        create_at: create_at,
        description: description,
        start_at: start_at,
        end_at: end_at,
      });
    } else {
      const {title, description, created_date, image} = notifications[0];
      const create_at = moment(created_date).format('L');
      setInitailState({
        ...initailState,
        name: title,
        image: image,
        create_at: create_at,
        description: description,
        start_at: start_at,
        end_at: end_at,
      });
    }
  }, []);
  useEffect(() => {
    navigation.setOptions({
      headerTitle: !notification
        ? i18n.t('promotion.Promotion Detail')
        : i18n.t('promotion.Notification Detail'),
    });
  }, []);
  const {image, name, create_at, description, start_at, end_at} = initailState;
  const start_date = moment(start_at).format('MMM Do YYYY');
  const end_date = moment(end_at).format('MMMM Do YYYY');
  return (
    <ScrollView>
      <View style={{...styles.container}}>
        <View style={{width: '100%', paddingHorizontal: 10, marginTop: 20}}>
          <Text style={{...styles.title}}>{name}</Text>
          <Text>{create_at}</Text>
        </View>
        <TouchableCmp onPress={() => navigate('PromotionInfo')}>
          <View style={{...styles.wrapper}}>
            <View style={{...styles.imgContainer}}>
              <Image
                source={{
                  uri:
                    image !== null
                      ? `${DISCOUNT_PATH}${image}`
                      : `${IMAGE_PATH}img/default.png`,
                }}
                style={{...styles.img}}
                resizeMode="stretch"
                PlaceholderContent={
                  <ActivityIndicator size="large" color="#fff" />
                }
              />
              {start_at !== '' && end_at !== '' && (
                <View style={styles.date}>
                  <Text
                    style={{
                      color: '#fff',
                      fontFamily: 'Roboto-Bold',
                      fontSize: 12,
                    }}>
                    Start : {start_date}
                  </Text>
                  <Text
                    style={{
                      color: '#fff',
                      fontFamily: 'Poppins-Bold',
                      fontSize: 12,
                      // marginRight: 50,
                    }}>
                    End : {end_date}
                  </Text>
                </View>
              )}
            </View>
          </View>
        </TouchableCmp>
      </View>
    </ScrollView>
  );
};
export default PromoDetail;
export const screenOptions = () => {
  return {
    headerTitle: i18n.t('promotion.Promotion Detail'),
  };
};
const styles = StyleSheet.create({
  container: {
    padding: 10,
  },
  title: {
    fontFamily: 'Poppins-Semibold',
    fontSize: 18,
  },
  wrapper: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 0,
    },
    shadowOpacity: 0.44,
    shadowRadius: 6,

    elevation: 2,
  },
  imgContainer: {
    position: 'relative',
    width: SCREEN_WIDTH / 1.1,
    height: 200,
    overflow: 'hidden',

    // alignItems: 'center',
    // justifyContent: 'center',
  },
  img: {
    width: null,
    height: 200,

    // flex: 1,
    // resizeMode: '',
  },
  date: {
    position: 'absolute',
    bottom: 0,
    height: 30,
    alignItems: 'center',
    flexDirection: 'row',

    justifyContent: 'space-between',
    backgroundColor: Colors.primary,
    width: '100%',
    paddingHorizontal: 10,
  },
});
