import React from 'react';
import SignInScreen, {
  screenOptions as SignInScreenOption,
} from '../screens/SignIn';
import {createStackNavigator} from '@react-navigation/stack';

const AuthStack = createStackNavigator();

const index = () => {
  return (
    <AuthStack.Navigator>
      <AuthStack.Screen
        name="SignIn"
        component={SignInScreen}
        options={SignInScreenOption}
      />
    </AuthStack.Navigator>
  );
};

export default index;
