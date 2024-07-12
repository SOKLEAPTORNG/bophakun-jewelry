import React, {useCallback, useEffect, useState} from 'react';
import {
  View,
  StyleSheet,
  FlatList,
  Button,
  Image,
  ActivityIndicator,
} from 'react-native';
import Text from '../../components/UI/DefaultText';
import {cardView, SCREEN_WIDTH} from '../../constant/index';
import OrderItems from '../../components/Orders/index';
import {useSelector, useDispatch} from 'react-redux';
import * as actionOrders from '../../store/action/orders';
import {useTheme} from '@react-navigation/native';
import {Colors} from '../../constant/index';
import {navigate} from '../../navigation/RootNavigation';
import i18n from '../../../Translations/index';
const OrderOverviewScreen = props => {
  const [refreshing, setIsRefreshing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const theme = useTheme();
  const [error, setError] = useState();
  const orders = useSelector(state =>
    state.orders.orders.sort((a, b) => b.id - a.id),
  );
  console.log('orders', orders);
  const isUser = useSelector(state => state.auth.userInfo);
  const dispatch = useDispatch();
  const fetchOrders = useCallback(async () => {
    setError(null);
    try {
      await dispatch(actionOrders.getOrderDetail());
      await dispatch(actionOrders.getOrderItems());
    } catch (e) {
      setError(e.message);
    }
  }, [dispatch, setError]);
  useEffect(() => {
    if (isUser.length > 0) {
      setIsLoading(true);
      fetchOrders().then(() => {
        setIsLoading(false);
      });
    }
    return;
  }, [dispatch, fetchOrders]);
  const _onRefresh = () => {
    fetchOrders();
  };
  /**
   * unsubcribe listener
   */
  useEffect(() => {
    const unsubcribe = props.navigation.addListener('focus', fetchOrders);
    return () => {
      unsubcribe();
    };
  }, [props.navigation, fetchOrders]);
 useEffect(() => {
   props.navigation.setOptions({
     headerStyle: {
       shadowOffset: {height: 0, width: 0},
       backgroundColor: Colors.primary,
       height: Platform.OS === 'android' ? 75 : 120,
     },
   });
 }, [props, theme.colors.background]);
  const _onPressNavigate = (id, date, amount, order_number, packing_charge) => {
    navigate('OrderDetail', {
      transition_id: id,
      date: date,
      totalAmount: amount,
      order_number: order_number,
      packing_charge: packing_charge,
    });
  };
  if (!isUser.length) {
    return (
      <View style={styles.center}>
        <View>
          <Image
            source={require('../../assets/logo.png')}
            style={{
              width: 200,
              height: 200,
              resizeMode: 'contain',
              marginLeft: 29,
            }}
          />
        </View>
        <Text
          style={{
            fontFamily: 'Opensans-Regular',
            fontSize: 16,
            marginTop: 20,
          }}>
          {i18n.t('profile.You are not signed in')}
        </Text>
      </View>
    );
  }
  if (isLoading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color={Colors.primary} />
      </View>
    );
  }
  if (orders.length === 0 && !refreshing) {
    return (
      <View style={{...styles.center, paddingHorizontal: 20}}>
        <Image
          source={require('../../assets/empty.png')}
          style={styles.image}
        />
        <Text style={{...styles.mainText}}>
          {i18n.t('order.No order history yet')}
        </Text>
        <Text style={{...styles.subText}}>
          {i18n.t(
            'order.You don t have any order history yet Try order now your previous completed order will show here',
          )}
        </Text>
      </View>
    );
  }
  if (error) {
    return (
      <View style={{...styles.center}}>
        <Text>An error occurred!</Text>
        <Button
          title="Try again"
          onPress={fetchOrders}
          color={Colors.primary}
        />
      </View>
    );
  }
  return (
    <View
      style={{
        flex: 1,
        paddingHorizontal: 13,
        paddingBottom: 20
      }}>
      <Text
        style={{
          marginLeft: 13,
          marginTop: 20,
          fontFamily: 'Roboto-Bold',
          fontSize: 16,
          color: Colors.accent,
        }}>
        Your Past Orders
      </Text>
      <View
        style={{
          borderWidth: 0.5,
          marginHorizontal: 13,
          borderColor: '#E8E8E8',
          marginTop: 10
        }}
      />
      <FlatList
        style={{
          backgroundColor: '#fff',
        }}
        showsVerticalScrollIndicator={false}
        data={orders}
        keyExtractor={item => item.id.toString()}
        onRefresh={_onRefresh}
        refreshing={refreshing}
        onEndReachedThreshold={0.1}
        renderItem={items => (
          <OrderItems
            name={items.item.productTitle}
            id={items.item.id}
            quantity={items.item.quantity}
            dateTime={items.item.date}
            totalAmount={items.item.totalAmount}
            status={items.item.status}
            orderNumber={items.item.order_number}
            suspend={items.item.is_suspend}
            onSelect={() =>
              _onPressNavigate(
                items.item.id,
                items.item.date,
                items.item.final_total,
                items.item.order_number,
                items.item.packing_charge,
              )
            }
          />
        )}
      />
    </View>
  );
};
export default OrderOverviewScreen;
export const screenOptions = ({navigation}) => {
  return {
    // headerStyle: {},
    headerTitle: i18n.t('order.Your Orders'),
    // headerLeft: () => <HeaderBackIcon />,
  };
};
const styles = StyleSheet.create({
  container: cardView,
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  mainText: {
    fontFamily: 'OpenSans-Bold',
    fontSize: 18,
    textTransform: 'capitalize',
  },
  subText: {
    alignSelf: 'center',
  },
  image: {
    width: SCREEN_WIDTH / 2,
    height: SCREEN_WIDTH / 2,
    borderWidth: 0,
    resizeMode: 'contain',
  },
});
