import React, {useState, useCallback, useEffect} from 'react';
import {View, StyleSheet, Dimensions} from 'react-native';
import { Left, Right, ListItem, List } from 'native-base';
import Card from '../../components/UI/Card';
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
    <Card
      style={{
        marginTop: 20,
        alignItems: 'center',
        paddingBottom: 10,
      }}>
      <List>
        <View
          style={{
            height: 53,
            borderRadius: 12,
            width: SCREEN_WIDTH - 40,
            paddingHorizontal: 10,
            flexDirection: 'row',
            backgroundColor: '#fff',
            shadowColor: '#000',
            shadowOffset: {
              width: 0,
              height: 2,
            },
            shadowOpacity: 0.15,
            shadowRadius: 3.84,

            elevation: 5,
          }}>
          <Left>
            <View>
              <Text style={styles.status}>Saved</Text>
              <Text style={styles.date}>{orderDate}</Text>
            </View>
          </Left>
          <Right>
            <Text
              note
              style={{color: Color.secondary, fontFamily: 'Roboto-Regular'}}>
              +{savingPoint} {i18n.t('point.pt')}
              {/* {(savingPoint * 1).toFixed(2)}pt */}
            </Text>
          </Right>
        </View>
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
    width: 35,
    height: 35,
    alignItems: 'center',
    borderRadius: 17.5,
    justifyContent: 'center',
  },
});
