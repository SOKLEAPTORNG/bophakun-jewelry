import {StyleSheet, Platform} from 'react-native';
import {Colors} from '../../constant/index';
import {
  Colors as Color,
  PADDING_BOTTOM,
  SCREEN_WIDTH,
  SCREEN_HEIGHT,
} from '../../constant/index';
export default StyleSheet.create({
  container: {
    padding: 10,
    backgroundColor: '#fff',
    margin: 10,
    borderRadius: 5,
  },
  mainText: {
    fontFamily: 'Roboto-Bold',
    fontSize: 16,
    color: Colors.accent,
  },
  subTextdetails: {
    fontFamily: 'Roboto-Regular',
    textTransform: 'capitalize',
    color: '#585151',
    fontSize: 14,
  },
  subText: {
    fontFamily: 'Roboto-Regular',
    textTransform: 'capitalize',
    fontSize: 14,
    marginBottom: Platform.OS === 'android' ? 10 : 10,
  },
  contact_info: {
    borderTopWidth: 1,
    borderColor: '#E3E3E3',
    marginHorizontal: 20,
    paddingTop: 10,
  },
  footer: {
    padding: 15,
    borderRadius: 0,
    paddingBottom: Platform.OS === 'ios' ? PADDING_BOTTOM : 10,
    alignItems: 'center',
  },
  content: {
    justifyContent: 'center',
    alignItems: 'center',
    height: 60,
    borderRadius: 100,
    width: SCREEN_WIDTH - 40,
    // shadowColor: '#a1a1a1',
    // shadowOffset: {
    //   width: 0,
    //   height: 3,
    // },
    // shadowOpacity: 0.5,
    // shadowRadius: 2.65,

    // elevation: 7,
  },
  textOrder: {
    color: Color.secondary,
    textTransform: 'capitalize',
    fontSize: 24,
    // paddingVertical: 15,
    fontFamily: 'Raleway-Bold',
  },
  grandTotal: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  discount: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  subTotal: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  summary: {},
  payment: {
    // marginHorizontal: 10,
    borderRadius: 5,
  },
  payment_method: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  sheetView: {
    flexDirection: 'row',
    alignItems: 'center',
    borderColor: '#ddd',
    borderWidth: 1,
    marginVertical: 5,
    justifyContent: 'space-between',
    paddingHorizontal: 10,
    borderRadius: 5,
  },
  inputContainerStyle: {
    borderWidth: 2,
    borderColor: '#E3E3E3',
    width: '100%',
    height: 71,
    backgroundColor: '#E3E3E3',
    borderRadius: 10,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
  },
  instructionsContainer: {
    paddingVertical: 2,
  },
  deliveryInfo: {
    backgroundColor: '#fff',
    width: SCREEN_WIDTH / 1.2,
    height:
      Platform.OS === 'ios' ? SCREEN_HEIGHT / 4 - 50 : SCREEN_HEIGHT / 4 - 20,
    borderRadius: 20,
    padding: 9,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,

    elevation: 5,
  },
  orderInfo: {
    borderRadius: 20,
    backgroundColor: '#fff',
    width: SCREEN_WIDTH / 1.2,
    padding: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,

    elevation: 5,
  },
  policyTxt: {
    color: Colors.accent,
    fontSize: 11,
    fontFamily: 'Raleway-Regular',
  },
});
