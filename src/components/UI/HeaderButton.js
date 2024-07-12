import React from 'react';
import {Platform, Image} from 'react-native';
import {
  HeaderButton,
  HeaderButtons,
  Item,
} from 'react-navigation-header-buttons';
import FontAwsome5 from 'react-native-vector-icons/FontAwesome5';
import Ionicons from 'react-native-vector-icons/Ionicons';
import SimpleLineIcons from 'react-native-vector-icons/SimpleLineIcons';
import {Colors} from '../../constant/index';
import TouchableCmp from '../../components/UI/TouchableCmp';
import {goBack} from '../../navigation/RootNavigation';
const CustomHeaderButton = props => {
  return (
    <HeaderButton
      {...props}
      IconComponent={props.IconComponent}
      iconSize={props.iconSize}
      iconName={props.iconName}
      color={props.color ? props.color : '#333'}
    />
  );
};

export default CustomHeaderButton;
export const HeaderBackIcon = props => {
  return (
    <HeaderButtons HeaderButtonComponent={CustomHeaderButton}>
      <TouchableCmp onPress={props.onPress ? props.onPress : () => goBack()}>
        <Image
          style={{
            width: 21,
            height: 21,
            marginLeft: 20,
            tintColor: Colors.secondary,
            resizeMode: 'contain',
          }}
          source={require('../../assets/chevron-left.png')}
        />
      </TouchableCmp>
    </HeaderButtons>
  );
};
