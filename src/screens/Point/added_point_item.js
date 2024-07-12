import React, {useState, useCallback, useEffect} from 'react';
import {View, StyleSheet, Dimensions} from 'react-native';
import { Left, Right, ListItem, List } from 'native-base';

import Card from '../../components/UI/Card';
import Text from '../../components/UI/DefaultText';
import {
  Colors as Color,
  Colors,
  SCREEN_HEIGHT,
  SCREEN_WIDTH,
} from '../../constant/index';
import PropType from 'prop-types';
import {useTheme} from '@react-navigation/native';
import i18n from '../../../Translations/index';
const propTypes = {
  status: PropType.number.isRequired,
  dateFormat: PropType.string,
  updated_at: PropType.string,
  point_value: PropType.string,
};
const AddedPointsItems = ({dateFormat, status, point_value}) => {
  const [statusx, setStatus] = useState('');
  const [pointStatus, setPointStatus] = useState(null);
  const {colors} = useTheme();
  // const displayCartItem = orderItems
  const _statusChange = useCallback(() => {
    let statusxx;
    let point_status;
    if (status === 1) {
      statusxx = i18n.t('point.Added Points');
      point_status = '+';
    } else if (status === 2) {
      statusxx = i18n.t('point.Void');
      point_status = '-';
    }
    setStatus(statusxx);
    setPointStatus(point_status);
  }, []);
  useEffect(() => {
    _statusChange();
  }, []);
  return (
    <Card
      style={{

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
              <Text style={styles.status}>{statusx}</Text>
              <Text style={styles.date}>{dateFormat}</Text>
            </View>
          </Left>
          <Right>
            <Text
              note
              style={{color: Colors.secondary, fontFamily: 'Roboto-Regular'}}>
              {pointStatus}
              {Number.parseFloat(point_value).toFixed(2)} {i18n.t('point.pt')}
              {/* {(d.savingPoint * 1).toFixed(2)}pt */}
            </Text>
          </Right>
        </View>
      </List>
    </Card>
  );
};

AddedPointsItems.propTypes = propTypes;
export default AddedPointsItems;
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
    color: '#000',
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
    fontFamily: 'Roboto-Regular'
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
