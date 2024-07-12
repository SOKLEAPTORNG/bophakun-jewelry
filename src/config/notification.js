import PushNotification from 'react-native-push-notification';
import PushNotificationIOS from '@react-native-community/push-notification-ios';
const androidChannel = () => {
  PushNotification.createChannel(
    {
      channelId: '123456', // (required)
      channelName: 'android', // (required)
      channelDescription: 'A channel to categorise your notifications', // (optional) default: undefined.
      soundName: 'default', // (optional) See `soundName` parameter of `localNotification` function
      importance: 4, // (optional) default: 4. Int value of the Android notification importance
      vibrate: true, // (optional) default: true. Creates the default vibration patten if true.
    },
    (created) => console.log(`createChannel returned '${created}'`), // (optional) callback returns whether the channel was created, false means it already existed.
  );
};
const iosNotification = (title, message) => {
  PushNotificationIOS.presentLocalNotification({
    alertTitle: title,
    alertBody: message,
  });
};

const androidNotification = (title, message) => {
  PushNotification.localNotification({
    channelId: '123456',
    title: title,
    message: message,
    priority: 'high',
  });
};
const onNotificationSchedule = (title, message) => {
  const Today = new Date(Date.now() + 2 * 300);
  PushNotification.scheduleLocalNotification({
    title: title,
    message: message,
    date: Today,
  });
};
const onCancelNotification = () => {
  PushNotification.cancelAllLocalNotifications();
};
export {
  androidNotification,
  onNotificationSchedule,
  onCancelNotification,
  iosNotification,
  androidChannel,
};



export const FcmPushNotification = () => {
  PushNotification.configure({
    onRegister: function (token) {
      console.log("TOKEN", token);
    },

    onNotification: function(notification){
      console.log("NOTIFICATION", notification);

      // required on IOS only 
      notification.finish(PushNotificationIOS.FetchResult.NoData);
    }, 

    // Android only 
    senderID: "781963404132",

    // iOS only 
    permissions: {
      alert: true, 
      badge: true, 
      sound: true
    }, 
    popInitialNotification: true, 
    requestPermissions: true
  });
};