import I18n from 'react-native-i18n';
I18n.fallbacks = true;
I18n.defaultLocale = 'en';

I18n.translations = {
  en: require('./en'),
  kh: require('./kh'),
};

export default I18n;
