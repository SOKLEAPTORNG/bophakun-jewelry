import React, {PureComponent} from 'react';
import {
  Platform,
  ImageBackground,
  Image,
  View,
  ActivityIndicator,
} from 'react-native';
import {IMAGE_PATH} from '../../constant/index';
var shorthash = require('shorthash');
var RNFS = require('react-native-fs');
class CacheImage extends PureComponent {
  state = {
    source: null,
    loading: true,
    showImage: false,
  };
  loadFile = (path) => {
    this.setState({source: {uri: path}});
  };
  downloadFile = async (uri, path) => {
    await RNFS.downloadFile({fromUrl: uri, toFile: path}).promise.then(
      (res) => this.loadFile(path),
      this.setState({loading: true}),
    );
  };
  componentDidMount = async () => {
    const {uri} = this.props;
    const name = shorthash.unique(uri);
    const extension = Platform.OS === 'android' ? 'file://' : '';
    const path = `${extension}${RNFS.CachesDirectoryPath}/${name}.png`;
    RNFS.exists(path).then((exists) => {
      if (exists) {
        this.loadFile(path);
        this.setState({loading: false});
      } else {
        this.downloadFile(uri, path);
        this.setState({loading: false});
      }
    });
  };
  // componentWillUnmount() {
  //   const {uri} = this.props;
  //   // console.log(uri);
  //   // this.downloadFile.removeEventListener(uri);
  //   return () => uri.removeEventListener();
  // }
  render() {
    if (this.state.loading) {
      return (
        <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
          <ActivityIndicator
            size={this.props.loadingSize ? this.props.loadingSize : 'large'}
            color="#333"
          />
        </View>
      );
    }
    if (this.state.source !== null) {
      return <Image style={this.props.style} source={this.state.source} />;
    }
    return (
      <ImageBackground
        source={{uri: `${IMAGE_PATH}/img/default.png`}}
        style={this.props.style}
      />
    );
  }
}
export default React.memo(CacheImage);
// CacheImage.propTypes = {
//   uri: PropTypes.string.isRequired,
//   style: PropTypes.object,
// };
