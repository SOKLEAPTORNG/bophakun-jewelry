import React, {useState, useCallback, useEffect} from 'react';
import {View, StyleSheet, Dimensions} from 'react-native';
import {Left, Right, ListItem, List, Card} from 'native-base';
import Text from '../../components/UI/DefaultText';
import {
  Colors as Color,
  SCREEN_HEIGHT,
  SCREEN_WIDTH,
} from '../../constant/index';
import PropType from 'prop-types';
import {useTheme} from '@react-navigation/native';
import i18n from '../../../Translations/index';
const propTypes = {
  status: PropType.string.isRequired,
  orderDateFormat: PropType.number,
  // point_status: PropType.number.isRequired,
  savingPoint: PropType.number.isRequired,
  is_suspend: PropType.number.isRequired,
  cut_point: PropType.number.isRequired,
};
const Index = ({orderDate, savingPoint, cut_point}) => {
  const [statusx, setStatus] = useState('');
  const [pointStatus, setPointStatus] = useState(null);
  const {colors} = useTheme();
  // const displayCartItem = orderItems
  const _orderStatus = useCallback(() => {
    let statusxx;
    let point_status;
    if (savingPoint > 0 && cut_point === 0) {
      statusxx = i18n.t('point.Earned');
      point_status = '+';
    } else if (savingPoint === 0 && cut_point > 0) {
      statusxx = i18n.t('point.Pay Bill');
      point_status = '-';
    }
    setStatus(statusxx);
    setPointStatus(point_status);
  }, []);
  useEffect(() => {
    _orderStatus();
  }, [_orderStatus]);
  return (
    <Card style={{backgroundColor: colors.background}}>
      <List>
        <ListItem
          style={{
            height: 60,
          }}>
          <Left>
            <View>
              <Text style={styles.status}>Pay Bill</Text>
              <Text style={styles.date}>{orderDate}</Text>
            </View>
          </Left>
          <Right>
            <Text
              note
              style={{color: Colors.secondary, fontFamily: 'Roboto-Regular'}}>
              -{(cut_point * 1).toFixed(2)} {i18n.t('point.pt')}
              {/* {cut_point.toFixed(2)} {i18n.t('point.pt')} */}
              {/* {(d.savingPoint * 1).toFixed(2)}pt */}
            </Text>
          </Right>
        </ListItem>
      </List>
    </Card>
  );
};
Index.PropType = propTypes;
export default Index;
const styles = StyleSheet.create({
  contain: {
    height: SCREEN_HEIGHT / 3,
    backgroundColor: Color.primary,
    paddingTop: SCREEN_WIDTH / 10 - 10,
  },
  headerLabel: {
    fontSize: 18,
    color: '#fff',
    fontWeight: '700',
    marginHorizontal: 30,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  mainText: {
    color: '#fff',
    fontWeight: '500',
  },
  balance: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 18,
    marginTop: 10,
  },
  date: {
    fontSize: 11,
    opacity: 0.5,
    paddingTop: 5,
  },
  status: {
    fontSize: 14,
    color: '#B9B9B9',
    fontFamily: 'Roboto-Regular',
  },
  btn: {
    marginHorizontal: 15,
    width: 35,
    height: 35,
    alignItems: 'center',
    borderRadius: 17.5,
    justifyContent: 'center',
  },
});
