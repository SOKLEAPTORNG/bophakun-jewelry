import {StyleSheet, Dimensions, Platform} from 'react-native';
const {width, height} = Dimensions.get('window');
import {SCREEN_WIDTH, SCREEN_HEIGHT} from '../../constant/index';
import {Colors} from '../../constant/index';

const CELL_SIZE = width / 8;

export default StyleSheet.create({
  // container: {
  //   flex: 1,
  //   alignItems: 'center',
  //   justifyContent: 'center',
  // },
  container: {
    flex: 1,
    backgroundColor: Colors.primary,
  },
  header: {
    flex: 4,
    paddingHorizontal: 20,
    justifyContent: 'center',
    alignSelf: 'center',
    paddingTop: 100,
  },
  footer: {
    flex: 3,
    backgroundColor: '#fff',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 30,
  },
  text_header: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 30,
  },
  text_footer: {
    color: '#05375a',
    fontSize: 18,
  },
  logo: {
    width: 100,
    height: 165,
    resizeMode: 'contain',
    shadowColor: '#000',
    shadowOffset: {
      width: 2,
      height: 2,
    },
    shadowOpacity: 0.35,
    shadowRadius: 6,

    elevation: 8,
    bottom: 20,
  },
  fbsignIn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    width: 46,
    height: 46,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 100,
    shadowColor: '#a1a1a1',
    shadowOffset: {
      width: 2,
      height: 2,
    },
    shadowOpacity: 0.35,
    shadowRadius: 6,

    elevation: 8,
  },
  googleSignIn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    width: 46,
    height: 46,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 100,
    shadowColor: '#a1a1a1',
    shadowOffset: {
      width: 2,
      height: 2,
    },
    shadowOpacity: 0.35,
    shadowRadius: 6,

    elevation: 8,
  },
  textSign: {
    fontSize: 16,
    fontWeight: '100',
    color: '#000',
  },
  text_title: {
    fontSize: 20,
    fontFamily: 'Poppins-Bold',
    color: Colors.text,
  },
  footer_section: {
    flexDirection: 'row',
  },
  color_textPrivate: {
    color: Colors.textLight,
  },
  letfBorder: {
    borderBottomColor: '#ADB7C8',

    borderBottomWidth: 1,
    width: 77.5,
  },
  rightBorder: {
    borderBottomWidth: 1,
    width: 77.5,
    borderBottomColor: '#ADB7C8',
  },
  appleSignin: {
    paddingTop: 30,
    paddingBottom: 15,
    alignItems: 'center',
    justifyContent: 'center',
  },
  textPrivate: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    // marginTop: 10,
  },
  containerAvoiddingView: {
    borderRadius: 30,
    backgroundColor: Colors.primary,
    width: SCREEN_WIDTH / 1.4,
    height: 343,
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
  containerInput: {
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    width: 198,
    borderBottomColor: '#ADB7C8',
    marginTop: 20,
  },
  openDialogView: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: 13,
  },
  phoneInputStyle: {
    marginLeft: 5,
    flex: 1,
    height: 50,
    fontSize: 13,
  },
  flagContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconContainer: {
    width: 29,
    height: 29,
    marginRight: 9,
  },
  buttonContainer: {
    width: 198,
    height: 41,
    backgroundColor: Colors.secondary,
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 30,
    borderRadius: 21,
  },
  buttonText: {
    fontFamily: 'Poppins-Semibold',
    fontSize: 21,
    color: '#fff',
  },
  image: {
    flex: 1,
    justifyContent: 'center',
    width: '100%',
  },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalView: {
    margin: 10,
    backgroundColor: 'white',
    borderRadius: 5,
    padding: 10,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  button: {
    borderRadius: 5,
    marginBottom: 25,
    width: 110,
    height: 45,
    padding: 10,
    elevation: 2,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  buttonOpen: {
    backgroundColor: '#F194FF',
  },
  textStyle: {
    color: 'white',
    fontFamily: 'Poppins-Bold',
    textAlign: 'center',
    paddingLeft: 5,
  },
  modalText: {
    marginTop: 25,
    marginBottom: 15,
    textAlign: 'center',
    fontFamily: 'Poppins-Bold',
    fontSize: 20,
  },
  codeFiledRoot: {
    height: CELL_SIZE,
    marginBottom: 30,
  },
  cell: {
    fontSize: 20,
    fontWeight: '500',
    color: '#212121',
    backgroundColor: '#fff',
  },
  renderCellView: {
    alignItems: 'center',
    justifyContent: 'center',
    borderColor: '#919293',
    height: CELL_SIZE,
    width: CELL_SIZE,
    marginHorizontal: 5,
    borderWidth: 1,
    borderRadius: 5,
  },
});
