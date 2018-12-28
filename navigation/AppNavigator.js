import React from 'react';
import {createSwitchNavigator} from 'react-navigation';
import MainTabNavigator from './MainTabNavigator';
import {AuthLoadingScreen, SignInScreen} from "../screens/SignInScreen";


export default createSwitchNavigator({
    AuthLoading: AuthLoadingScreen,
    Main: MainTabNavigator,
    Auth: SignInScreen
}, {
        initialRouteName: 'AuthLoading',
    }
);
