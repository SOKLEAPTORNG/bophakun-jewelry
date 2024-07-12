import React, {useState} from 'react';
import {View, StyleSheet, ActivityIndicator} from 'react-native';
import Text from '../../components/UI/DefaultText';
import TouchableCmp from '../../components/UI/TouchableCmp';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import PropTyps from 'prop-types';
import {SCREEN_WIDTH, cardView, IMAGE_PATH} from '../../constant/index';
import {Image} from 'react-native-elements';

const propTyps = {
  name: PropTyps.string.isRequired,
  createAt: PropTyps.oneOfType([PropTyps.number, PropTyps.string]).isRequired,
  image: PropTyps.string.isRequired,
  description: PropTyps.string.isRequired,
  onSelect: PropTyps.oneOfType([PropTyps.object, PropTyps.func]).isRequired,
  theme: PropTyps.oneOfType([PropTyps.bool, PropTyps.func]),
  onPress: PropTyps.func,
  navigation: PropTyps.func,
};
const defaultProps = {
  image: null || undefined,
};
const NotifiItems = ({
  name,
  createAt,
  image,
  description,
  onSelect,
  theme,
  onPress,
  navigation,
}) => {
  const [show, setShow] = useState(false);
  // const theme = useTheme();
  const _onShow = () => {
    setShow(!show);
  };
  return (
    <TouchableCmp onPress={_onShow}>
      <View
        style={{
          ...cardView,
          backgroundColor: theme.colors.background,
          borderColor: '#fff',
          borderWidth: 1,
        }}>
        <View style={{...styles.flex, justifyContent: 'flex-start'}}>
          <View style={{...styles.iconCotainer}}>
            <FontAwesome
              name="bell-o"
              size={16}
              color={theme.dark ? '#fff' : '#333'}
            />
          </View>
          <View style={{...styles.titleContainer}}>
            <Text
              style={{...styles.mainTitle}}
              numberOfLines={!show ? 1 : null}>
              {name}
            </Text>
            <Text style={{paddingVertical: 5, fontSize: 13, opacity: 0.5}}>
              {createAt}
            </Text>
          </View>
        </View>
        {show && image && (
          <TouchableCmp onPress={navigation}>
            <View style={{...styles.imageContainer}}>
              <Image
                source={{uri: !image ? `${IMAGE_PATH}img/default.png` : image}}
                style={{...styles.image}}
                PlaceholderContent={
                  <ActivityIndicator size="small" color="#fff" />
                }
              />
            </View>
          </TouchableCmp>
        )}
        <View style={{...styles.content}}>
          <Text numberOfLines={!show ? 2 : null}>{description}</Text>
        </View>
      </View>
    </TouchableCmp>
  );
};
NotifiItems.propTyps = propTyps;
NotifiItems.defaultProps = defaultProps;
export default NotifiItems;
const styles = StyleSheet.create({
  flex: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  mainTitle: {
    fontFamily: 'OpenSans-Bold',
    fontSize: 14,
  },
  iconCotainer: {
    width: 34,
    height: 34,
    borderColor: '#ddd',
    borderRadius: 18,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  titleContainer: {
    width: SCREEN_WIDTH - 20 - 20 - 20,
    paddingHorizontal: 10,
  },
  content: {},
  imageContainer: {
    width: SCREEN_WIDTH / 1.1,
    height: 150,
  },
  image: {
    width: null,
    height: 150,
    resizeMode: 'cover',
    // flex: 1,
  },
});
