import React from 'react';
import {View, StyleSheet, Dimensions, Platform} from 'react-native';
import {Colors, SCREEN_HEIGHT, SCREEN_WIDTH} from '../../constant/index';
import Text from '../../components/UI/DefaultText';
import {IMAGE_PATH, CATEGORY_PATH} from '../../constant/index';
import TouchableCmp from '../UI/TouchableCmp';
import Image from '../UI/ChacheImage';
const Index = props => {
  return (
    <View
      style={{
        elevation: 5,
        paddingVertical: 10,
        alignItems: 'center',
      }}>
      <TouchableCmp style={{}} onPress={props.navigation}>
        <View style={{...styles.container}}>
          <View style={{...styles.iconContainer}}>
            <Image
              loadingSize="small"
              uri={`${CATEGORY_PATH}${props.image}`}
              // source={{
              //   uri: `${CATEGORY_PATH}${props.image}`,
              // }}
              style={{...styles.image}}
            />
          </View>
          <View style={{width: '100%', alignItems: 'center'}}>
            <Text numberOfLines={1} style={{...styles.title}}>
              {props.title}
            </Text>
          </View>
        </View>
      </TouchableCmp>
    </View>
  );
};

export default Index;
const WIDTH = Dimensions.get('window').width;
const HEIGHT = Dimensions.get('window').height;
const ITEMS_WIDTH = SCREEN_WIDTH / 3.5;
export const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 10,
    width: WIDTH / 2.5,
    backgroundColor: 'rgba(255,255,255,1)',
    height: Platform.OS === 'ios' ? WIDTH / 2.5 : WIDTH / 2.5,
    marginHorizontal: 15,
    borderRadius: 8,
    shadowColor: 'rgba(132,156,185,0.5)',
    elevation: 15,
    overflow: 'hidden',
  },
  iconContainer: {
    backgroundColor: '#f9f9f9',
    borderRadius: 100,
  },
  image: {
    // position: 'absolute',
    width: WIDTH / 5,
    height: WIDTH / 5,
    resizeMode: 'contain',
    // backgroundColor: 'red',
  },
  title: {
    fontFamily: 'Roboto-Bold',
    fontSize: 20,
    color: Colors.secondary,
    marginTop: 20,
    height: 40,
    // backgroundColor: 'red'
  },
});
