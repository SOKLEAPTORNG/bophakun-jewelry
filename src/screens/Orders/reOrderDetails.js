import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  ScrollView,
  SafeAreaView,
  StatusBar,
  Platform,
} from 'react-native';

import {
  Colors as Color,
} from '../../constant/index';
import i18n from '../../../Translations/index';
import {useTheme} from '@react-navigation/native';
import TouchableCmp from '../../components/UI/TouchableCmp';
import {SCREEN_WIDTH, Colors} from '../../constant';

function category(props) {
        useEffect(() => {
          props.navigation.setOptions({
            headerStyle: {
              shadowOffset: {height: 0, width: 0},
              backgroundColor: Colors.primary,
              height: 120,
            },
          });
        }, [props, Colors.background]);
  const theme = useTheme();
  const data = [
    {
      mainCategory: 'Ring',
      name: 'Dimond & Gold Ring (CRY2022)',
    },
    {
      mainCategory: 'Ring',
      name: 'Dimond & Gold Ring (CRY2022)',
    },
  ];

  const [mainCategory, setmainCategory] = useState('All');
    const [datalist, setDatalist] = useState('data');
  const setStatusFilter = mainCategory => {
    if (mainCategory !== 'All') {
      setDatalist([...data.filter(e => e.mainCategory === mainCategory)]);
    } else {
      setDatalist(data);
    }
    setmainCategory(mainCategory);
  };
    const renderItem = ({ item, index }) => {
    return (
      <View key={index} style={styles.itemContainer}>
          <View style={styles.itemBody}>
            <Text style={styles.itemName}>1 x {item.name}</Text>
              <Text style={styles.price}>$100.00</Text>
        </View>
      </View>
    );
  };

  return (
    <View style={{flex: 1}}>
      <SafeAreaView
        style={{
          flex: 1,
          justifyContent: 'space-between',
          paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
        }}>
        <StatusBar barStyle={'dark-content'} />
        <View
          style={{
            height: 60,
            justifyContent: 'center',
          }}>
          <View
            style={{
              width: '100%',
              position: 'absolute',
              paddingHorizontal: 20,
            }}>
            <Text
              style={{
                fontFamily: 'Roboto-Bold',
                fontSize: 16,
                color: Colors.accent,
              }}>
              Your Past Orders
            </Text>
          </View>
        </View>
        <ScrollView showsVerticalScrollIndicator={false}>
          <View style={{...styles.container}}>
            <View
              style={{
                alignItems: 'center',
                justifyContent: 'center',
                paddingBottom: 10,
                marginTop: -20,
              }}></View>
            <View
              style={{
                ...styles.wrapper,
              }}>
              <View
                style={{
                  paddingHorizontal: 20,
                  paddingVertical: 10,
                  marginBottom: 10,
                  backgroundColor: '#FFE8E5',
                  marginHorizontal: 20,
                  paddingVertical: 20,
                  borderRadius: 12,
                }}>
                <View style={styles.statusContainer}>
                  <Text
                    style={{
                      ...styles.titleStatus,
                    }}>
                    {i18n.t('order.Date & Time')}
                  </Text>
                  <Text
                    style={{
                      ...styles.titleStatus,
                    }}>
                    {'29th Feb 2022, 09:20am'}
                  </Text>
                </View>
                <View style={{marginTop: 10}}>
                  <Text
                    style={{
                      ...styles.titleStatus,
                    }}>
                    Your Order Number: {'192319891839'}{' '}
                  </Text>
                </View>
              </View>
              <View
                style={{
                  borderBottomWidth: 1,
                  marginHorizontal: 20,
                  borderBottomColor: '#E3E3E3',
                marginVertical: 20
                }}
              />
              <View
                style={{
                  ...styles.wrapper,
                  paddingBottom: 30,
                }}>
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                  }}>
                  <Text
                    style={{
                      fontFamily: 'Roboto-Bold',
                      fontSize: 16,
                      color: Colors.accent,
                      marginTop: 10,
                      paddingHorizontal: 20,
                    }}>
                    {i18n.t('order.Order Items Detail')}
                  </Text>
                </View>
                <View
                  style={{
                    marginTop: 20,
                    marginHorizontal: 20,
                    borderBottomWidth: 1,
                    paddingBottom: 20,
                    borderBottomColor: '#E3E3E3',
                  }}>
                  <FlatList
                    data={data}
                    keyExtractor={i => i.toString()}
                    ItemSeparatorComponent={props => {
                      return (
                        <View
                          style={{
                            height: 10,
                          }}
                        />
                      );
                    }}
                    renderItem={renderItem}
                  />
                </View>
              </View>
              <View
                style={{
                  ...styles.flex,
                  paddingHorizontal: 20,
                }}>
                <Text style={{...styles.subText, color: '#585151'}}>
                  {i18n.t('checkout.Delivery Fee is')}
                </Text>
                <Text
                  style={{
                    fontFamily: 'Roboto-Regular',
                    fontSize: 15,
                    color: '#585151',
                  }}>
                  $100
                </Text>
              </View>
              <View
                style={{
                  ...styles.flex,
                  paddingHorizontal: 20,
                  marginTop: 10,
                }}>
                <Text
                  style={{
                    ...styles.subText,
                    color: '#585151',
                  }}>
                  {i18n.t('order.Total')}
                </Text>

                <View style={{alignItems: 'flex-end'}}>
                  <Text
                    style={{
                      fontFamily: 'Roboto-Regular',
                      fontSize: 15,
                      color: '#585151',
                    }}>
                    $100
                  </Text>
                </View>
              </View>
            </View>
          </View>
        </ScrollView>
        <View style={styles.footer}>
          <TouchableCmp>
            <View style={styles.bookingContainer}>
              <Text style={styles.reOrderText}>Select Items to Re-Order</Text>
            </View>
          </TouchableCmp>
        </View>
      </SafeAreaView>
    </View>
  );
}

export default category;
const styles = StyleSheet.create({
    item: {
        alignItems: 'center',
        marginBottom: 10,
    },
    container: {
        flex: 1,
        flexDirection: 'row',
        backgroundColor: '#fff',
    },
    listTab: {
        padding: 15,
        borderRightWidth: 1,
        borderRightColor: '#e2e2e2',
        width: SCREEN_WIDTH / 3.4,
        paddingBottom: 100,
    },
    btnTab: {
        backgroundColor: '#E2E2E2',
        borderRadius: 12,
        width: SCREEN_WIDTH / 5,
        height: SCREEN_WIDTH / 5,
        alignItems: 'center',
        justifyContent: 'center',
    },
    bntTabActive: {
        backgroundColor: '#E2E2E2',
        borderRadius: 12,
        width: SCREEN_WIDTH / 5,
        height: SCREEN_WIDTH / 5,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1,
        borderColor: Colors.primary,
    },
    textTab: {
        fontSize: 12,
        marginTop: 4,
        fontFamily: 'Roboto-Regular',
    },
    textTabActive: {},
    img: {
        width: SCREEN_WIDTH / 7 - 10,
        height: SCREEN_WIDTH / 7 - 10,
        resizeMode: 'contain',
    },
    subCategory: {
        padding: 10,
        backgroundColor: '#fff',
        flex: 1,
        alignItems: 'center',
    },
    subCatContainer: {
        marginTop: 10,
        alignItems: 'flex-start',
        width: '100%',
    },
    icon: {
        width: 14,
        height: 14,
        resizeMode: 'contain',
        tintColor: Colors.text,
    },
    filterContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: Colors.secondary,
        width: SCREEN_WIDTH / 1.6,
        paddingVertical: 10,
        paddingHorizontal: 9,
        borderRadius: 7,
        marginBottom: 6,
    },
    filterText: {
        fontFamily: 'Roboto-Regular',
        fontSize: 16,
    },
    itemContainer: { width: '100%' },
    itemBody: {
        width: '100%',
        justifyContent: 'space-between',
        flexDirection: 'row',
  },
  itemName: {
    fontFamily: 'Roboto-Regular',
    fontSize: 14,
  },

  itemContainter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 20,
  },
  container: {
    marginTop: 20,
    flex: 1,
    paddingBottom: 50,
    borderBottomLeftRadius: 39,
    borderBottomRightRadius: 39,
  },
  wrapper: {
    backgroundColor: '#fff',
  },
  subText: {
    fontSize: 14,
  },
  mainText: {
    fontFamily: 'Roboto-Medium',
  },
  flex: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  textStatus: {
    fontSize: 16,
    textTransform: 'capitalize',
    color: Color.darkGrey,
    fontFamily: 'Roboto-Regular',
  },
  footer: {
    alignItems: 'center',
  },
  content: {
    backgroundColor: Color.accent,
    padding: 10,
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  textOrder: {
    color: '#fff',
    textTransform: 'capitalize',
    fontSize: 16,
    // paddingVertical: 15,
    fontFamily: 'Roboto-Medium',
  },
  statusContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  titleStatus: {
    fontFamily: 'Roboto-Regular',
    color: Color.accent,
    fontSize: 15,
  },
  wrappBtnSummary: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  textQuantity: {
    paddingHorizontal: 10,
    fontFamily: 'OpenSans-Bold',
    fontSize: 16,
    color: '#2A2A2A',
  },
  wrappIcon: {
    justifyContent: 'center',
    alignItems: 'center',
    width: 25,
    height: 25,
    backgroundColor: '#000',
    borderRadius: 26,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,

    elevation: 2,
  },
  icon: {
    width: 11,
    height: 11,
    resizeMode: 'contain',
    tintColor: '#2A2A2A',
  },
  price: {
    color: Colors.secondary,
    fontFamily: 'Roboto-Regular',
      fontSize: 14,
  },
  bookingContainer: {
    width: SCREEN_WIDTH - 40,
    height: 60,
    borderRadius: 100,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Platform.OS === 'android' ? 20 : 0,
  },
  reOrderText: {
    fontSize: 20,
    fontFamily: 'Roboto-Bold',
    color: Colors.secondary,
  },
});
