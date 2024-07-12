import React from 'react';
import {
  Modal,
  Dimensions,
  TouchableWithoutFeedback,
  StyleSheet,
  View,
  Text,
  Image,
} from 'react-native';
import TouchableCmp from '../../components/UI/TouchableCmp';
import {Title} from 'react-native-paper';
import {Colors} from '../../constant';
import {SCREEN_HEIGHT, SCREEN_WIDTH} from '../../constant';

const deviceHeight = Dimensions.get('window').height;
export class ButtonPopup extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      show: false,
    };
  }
  show = () => {
    this.setState({show: true});
  };
  close = () => {
    this.setState({show: false});
  };

  renderOutsideTouchable(onTouch) {
    const view = <View style={{flex: 1, width: '100%'}} />;
    if (!onTouch) return view;

    return (
      <TouchableWithoutFeedback
        onPress={onTouch}
        style={{flex: 1, width: '100%'}}>
        {view}
      </TouchableWithoutFeedback>
    );
  }

  render() {
    let {show} = this.state;
    const {onTouchOutside, call, messenger} = this.props;

    return (
      <Modal
        animationType="fade"
        transparent={true}
        visible={show}
        onRequestClose={this.close}>
        <View
          style={{
            flex: 1,
            backgroundColor: '#000000aa',
            justifyContent: 'flex-end',
          }}>
          {this.renderOutsideTouchable(onTouchOutside)}
          <View
            style={{
              borderTopRightRadius: 10,
              borderTopLeftRadius: 10,
              paddingHorizontal: 10,
              height: 260,
              alignItems: 'center',
            }}>
            <View style={{...styles.container}}>
              <TouchableCmp>
                <View
                  style={{
                    ...styles.buttonContainer,
                  }}>
                  <Image
                    source={require('../../assets/call.png')}
                    style={styles.img}
                  />
                  <Text
                    style={{
                      ...styles.mainText,
                    }}>
                    {call}
                  </Text>
                </View>
              </TouchableCmp>
              <TouchableCmp>
                <View
                  style={{
                    ...styles.buttonContainer,
                  }}>
                  <Image
                    source={require('../../assets/messenger.png')}
                    style={styles.img}
                  />
                  <Text
                    style={{
                      ...styles.mainText,
                    }}>
                    {messenger}
                  </Text>
                </View>
              </TouchableCmp>
            </View>
          </View>
        </View>
      </Modal>
    );
  }
}

const styles = StyleSheet.create({
  buttonContainer: {
    bottom: 10,
    marginVertical: 10,
    flexDirection: 'row',
    backgroundColor: Colors.primary,
    width: SCREEN_WIDTH - 117,
    height: 50,
    borderWidth: 3,
    borderColor: '#fff',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#a1a1a1',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.65,
    shadowRadius: 6.84,

    elevation: 5,
  },
  mainText: {
    color: '#fff',
    fontSize: 18,
    fontFamily: 'Poppins-Semibold',
  },
  container: {
    flex: 1,
    width: '86%',
    borderTopRightRadius: 20,
    borderTopLeftRadius: 20,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  img: {
    width: 30,
    height: 30,
    resizeMode: 'contain',
    marginRight: 10,
  },
});
