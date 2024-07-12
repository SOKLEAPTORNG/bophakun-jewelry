import React, {useState, useEffect} from 'react';
import {
  View,
  FlatList,
  ActivityIndicator,
  StyleSheet,
  Image,
} from 'react-native';
import {useTheme} from '@react-navigation/native';
import Text from '../../components/UI/DefaultText';
import PromoItems from '../../components/Promotions/PromoItems';
import PromoDetail from './promoDetail';
import {Colors, SCREEN_HEIGHT, SCREEN_WIDTH} from '../../constant/index';
import {navigate} from '../../navigation/RootNavigation';
import {useDispatch, useSelector} from 'react-redux';
import {HeaderButtons, Item} from 'react-navigation-header-buttons';
import HeaderButton from '../../components/UI/HeaderButton';
import * as actionPromotions from '../../store/action/promotion';
import CartCount from '../../components/Product/CartCount';
import TouchableCmp from '../../components/UI/TouchableCmp';
import I18n from '../../../Translations/index';
import moment from 'moment';
const PromoOverview = props => {
  const [isLoading, setIsLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const theme = useTheme();
  const dispatch = useDispatch();
  const promotions = useSelector(state =>
    state.promotion.promotion.sort((a, b) => b.id - a.id),
  );
  console.log('promotions', promotions);
  /**
   *
   * fetching promotions
   */
  const fetchPromotion = React.useCallback(async () => {
    try {
      await dispatch(actionPromotions.getPromotion());
    } catch (err) {
      console.log(err);
    }
  }, [dispatch]);
  const _onRefresh = () => {
    setRefreshing(true);
    fetchPromotion().then(() => {
      setRefreshing(false);
    });
  };
  useEffect(() => {
    props.navigation.setOptions({
      headerStyle: {
        shadowOffset: {height: 0, width: 0},
        backgroundColor: Colors.primary,
        height: Platform.OS === 'android' ? 90 : 120,
      },
      headerRight: () => (
        <>
          <HeaderButtons HeaderButtonComponent={HeaderButton}>
            <View style={{marginRight: 20}}>
              <TouchableCmp onPress={() => navigate('Cart')}>
                <View>
                  <Image
                    style={{
                      width: 24,
                      height: 23,
                      resizeMode: 'contain',
                      tintColor: Colors.secondary,
                    }}
                    source={require('../../assets/cart.png')}
                  />
                  <CartCount
                    style={{
                      left: -4,
                      top: -6,
                    }}
                  />
                </View>
              </TouchableCmp>
            </View>
          </HeaderButtons>
        </>
      ),
    });
  }, [props, theme.colors.background]);
  // useEffect()
  useEffect(() => {
    setIsLoading(true);
    fetchPromotion().then(() => {
      setIsLoading(false);
      // console.log(promotions);
    });
  }, [fetchPromotion]);
  if (isLoading) {
    return (
      <View style={{...styles.container}}>
        <ActivityIndicator size="large" color={Colors.primary} />
      </View>
    );
  }
  if (promotions.length === 0 && !isLoading) {
    return (
      <View style={{...styles.container}}>
        {!theme.dark && (
          <Image
            source={require('../../assets/empty.png')}
            style={styles.image}
          />
        )}

        <Text style={styles.mainText}>
          {I18n.t('promotion.Coming Soon')}...!
        </Text>
      </View>
    );
  }
  return (
    <View
      style={{
        alignItems: 'center',
      }}>
      <FlatList
        style={styles.flatlist}
        data={promotions}
        keyExtractor={item => item.id.toString()}
        refreshing={refreshing}
        onRefresh={_onRefresh}
        renderItem={items => {
          const create_date = moment(items.item.create_at).format(
            'MMMM Do YYYY',
          );
          return (
            <PromoItems
              style={{
                elevation: 4,
              }}
              name={items.item.name}
              description={items.item.description}
              createAt={create_date}
              image={items.item.image}
              onSelect={() =>
                navigate('PromoDetail', {
                  id: items.item.id,
                })
              }
            />
          );
        }}
      />
    </View>
  );
};
export default PromoOverview;
export const screenOptions = () => {
  return {
    headerTitle: I18n.t('promotion.Promotion'),
  };
};
const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
  flatlist: {
    paddingVertical: 10,
    shadowColor: '#a1a1a1',
    shadowOffset: {
      width: 0,
      height: 0,
    },
    shadowOpacity: 0.41,
    shadowRadius: 4.11,
  },
  image: {
    width: SCREEN_WIDTH / 2,
    height: SCREEN_WIDTH / 2,
    borderWidth: 0,
    resizeMode: 'contain',
    marginLeft: 29,
  },
  mainText: {
    fontFamily: 'OpenSans-Regular',
    fontSize: 16,
    textTransform: 'capitalize',
    marginTop: 20,
  },
});
