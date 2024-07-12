import React from 'react';
import {useSelector} from 'react-redux';
import {View, Image, TouchableOpacity, Linking} from 'react-native';

const TelegramChat = () => {
  const telegram_chat = useSelector(state => state.auth.companyInfo[0]?.telegram_chat);

    return (
      <View>
        <TouchableOpacity
          onPress={() => {
            Linking.openURL(`${telegram_chat}`);
          }}>
          <Image
            style={{
              width: 36,
              height: 36,
              resizeMode: 'contain',
            }}
            source={require('../../assets/telegram.png')}
          />
        </TouchableOpacity>
      </View>
    );
}

export default TelegramChat;