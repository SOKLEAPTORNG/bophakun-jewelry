import React from 'react';
import {Text, View, StatusBar, StyleSheet, Image} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import i18n from '../../../Translations/index';
import {SCREEN_WIDTH, Colors, STATUSBAR_HEIGHT} from '../../constant/index';
import TouchableCmp from '../../components/UI/TouchableCmp';

import {
  navigate,
  loadRef,
  _onLoading,
  _onLoadingFinish,
  goBack,
} from '../../navigation/RootNavigation';

function PromotionInfo(props) {
  return (
    <SafeAreaView style={{backgroundColor: Colors.primary}}>
      <View style={{alignItems: 'center'}}>
        <View style={{...styles.header}}>
          <View style={{...styles.headerContainer}}>
            <TouchableCmp onPress={() => goBack('')}>
              <Image
                style={{
                  width: 29,
                  height: 29,
                  resizeMode: 'contain',
                }}
                source={require('../../assets/category-white.png')}
              />
            </TouchableCmp>
            <View>
              <Text style={styles.promotionTitle}>Promotion Name</Text>
            </View>
            <TouchableCmp onPress={() => navigate('Notification')}>
              <View>
                <Image
                  style={{
                    width: 26,
                    height: 26,
                    resizeMode: 'contain',
                    tintColor: 'white',
                  }}
                  source={require('../../assets/notification.png')}
                />
              </View>
            </TouchableCmp>
          </View>
        </View>
        <View style={styles.container}>
          <Image
            style={{
              width: SCREEN_WIDTH - 20,
              height: 232,
              resizeMode: 'stretch',
            }}
            source={require('../../assets/promotionslide.png')}
          />
        </View>
      </View>
    </SafeAreaView>
  );
}
export const screenOptions = nav => {
  return {
    headerTitle: 'Promotion Info',
  };
};
const styles = StyleSheet.create({
  header: {
    top: Platform.OS === 'ios' ? 0 : STATUSBAR_HEIGHT,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  headerContainer: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
  },
  container: {
    alignItems: 'center',
    height: 80,
    width: SCREEN_WIDTH - 40,
    paddingTop: 20,
  },
  promotionTitle: {
    fontFamily: 'Poppins-Semibold',
    fontSize: 16,
    color: '#fff',
  },
});
export default PromotionInfo;
