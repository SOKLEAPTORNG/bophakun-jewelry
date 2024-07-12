import {StyleSheet, Dimensions, Platform} from 'react-native';
import {
  STATUSBAR_HEIGHT,
  SCREEN_WIDTH,
  SCREEN_HEIGHT,
  Colors as Color,
} from '../../constant/index';
const ICON_WIDTH = Dimensions.get('window').width / 11 - 2;
// const ICON_HEIGHT = Dimensions.get('window').width / 8;
export default StyleSheet.create({
  container: {
    margin: 5,
    paddingVertical: 10,
    // alignItems: 'center',
    borderRadius: 0,
  },
  screen: {
    margin: 20,
  },
  summary: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    // marginBottom: 20,
    borderRadius: 0,
    padding: 10,
  },
  summaryText: {
    // fontFamily: "open-sans-bold",
    fontSize: 18,
  },
  amount: {
    color: '#000',
  },
  center: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
    backgroundColor: '#fff',
  },
  modalHeader: {
    borderBottomWidth: 0.5,
    borderColor: '#ddd',
    height: 50,
    justifyContent: 'center',
    backgroundColor: '#fff',
  },
  backIcon: {
    // width: 30,
    // height: 30,
    // borderRadius: 15,
    // backgroundColor: '#ddd',
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 20,
  },
  // footer: {
  // padding: 10,
  // borderRadius: 0,
  // },
  content: {
    backgroundColor: Color.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  textCheckout: {
    color: '#fff',
    textTransform: 'capitalize',
    fontSize: 14,
    fontWeight: '600',
    paddingVertical: 15,
  },
  footer: {
    padding: 10,
    position: 'absolute',
    bottom: Platform.OS === 'ios' && SCREEN_HEIGHT < 812 ? 0 : 20,
    left: 0,
    right: 0,
    flexDirection: 'row',
    borderRadius: 0,
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  qty: {
    // width: SCREEN_WIDTH / 2 - 20,
    backgroundColor: '#fff',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  btnCart: {
    // width: SCREEN_WIDTH / 2 + 20,
    // height: SCREEN_WIDTH / 8,
    backgroundColor: Color.primary,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 60,
    paddingVertical: 10,
  },
  txtCart: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
  },
  txtQty: {
    paddingHorizontal: 15,
    fontSize: 18,
    paddingTop: ICON_WIDTH / 6,
  },
  btnMinus: {
    width: ICON_WIDTH,
    height: ICON_WIDTH,
    borderRadius: ICON_WIDTH / 2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  btnSum: {
    width: ICON_WIDTH,
    height: ICON_WIDTH,
    borderRadius: ICON_WIDTH / 2,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
