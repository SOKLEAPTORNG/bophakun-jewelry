import React from 'react';
import {View, StyleSheet} from 'react-native';
import {Colors} from '../../constant/index';
import Text from '../../components/UI/DefaultText';
import {styles as stylex} from '../Orders/index';
import TouchableCmp from '../UI/TouchableCmp';
import {useTheme} from '@react-navigation/native';
const BookingItems = (props) => {
  const theme = useTheme();
  return (
    <TouchableCmp onPress={props.navigation}>
      <View
        style={{
          ...stylex.container,
          backgroundColor: Colors.primary,
          padding: 0,
          marginBottom: 10,
          overflow: theme.dark ? 'hidden' : null,
        }}>
        <View style={{...styles.titleContainer}}>
          <Text style={{...styles.title, color: '#fff'}}>{props.name}</Text>
        </View>
        <View style={{...styles.flex}}>
          <View>
            <Text style={{color: '#fff'}}>Check In</Text>
            <Text style={{...styles.mainText, color: '#fff'}}>25 Sep 20</Text>
          </View>
          <View>
            <Text style={{color: '#fff'}}>Check Out</Text>
            <Text style={{...styles.mainText, color: '#fff'}}>25 Sep 20</Text>
          </View>
        </View>
        <View
          style={{
            ...styles.flex,
            backgroundColor: '#ddd',
            paddingVertical: 5,
          }}>
          <Text
            style={{...styles.mainText, color: Colors.primary, fontSize: 12}}>
            {props.numOfDay} Days
          </Text>
          <Text
            style={{...styles.mainText, color: Colors.primary, fontSize: 12}}>
            $ {props.totalAmount.toFixed(2)}
          </Text>
        </View>
      </View>
    </TouchableCmp>
  );
};
export default BookingItems;
const styles = StyleSheet.create({
  titleContainer: {
    paddingVertical: 10,
    borderBottomColor: '#ddd',
    borderBottomWidth: 1,
  },
  title: {
    fontFamily: 'OpenSans-Bold',
    fontSize: 16,
    paddingHorizontal: 10,
  },
  flex: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 10,
  },
  mainText: {
    fontFamily: 'OpenSans-Bold',
    fontSize: 16,
  },
});
