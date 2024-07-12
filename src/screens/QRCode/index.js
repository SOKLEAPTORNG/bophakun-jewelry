import React from 'react';
import {View, StyleSheet} from 'react-native';
import Text from '../../components/UI/DefaultText';
import QRCode from 'react-native-qrcode-svg';
import {Card} from 'native-base';
import {useSelector} from 'react-redux';
import i18n from '../../../Translations/index';
const CONTAINER_WIDTH = 250;
const MyQRCode = () => {
  const {uid} = useSelector((state) => state.auth.userInfo[0]);
  if (!uid) {
    return (
      <View style={styles.container}>
        <Text>Error Somethine when wrong!!</Text>
      </View>
    );
  }
  return (
    <View style={styles.container}>
      <Card style={styles.card}>
        <View style={styles.qrcode_container}>
          <QRCode size={200} value={uid} /> 
        </View>
      </Card>
      <Text>{i18n.t('QRCode.Scan QR code here')}</Text>
    </View>
  );
};
export const screenOptions = () => {
  return {
    headerTitle: i18n.t('QRCode.My QR code'),
  };
};
export default MyQRCode;
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  card: {
    width: CONTAINER_WIDTH,
    height: CONTAINER_WIDTH,
    alignItems: 'center',
    justifyContent: 'center',
  },
  qrcode_container: {
    width: CONTAINER_WIDTH - 20,
    height: CONTAINER_WIDTH - 20,
    borderColor: '#000',
    borderWidth: 4.5,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
