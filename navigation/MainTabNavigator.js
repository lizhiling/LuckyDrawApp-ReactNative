import React from 'react';
import {createStackNavigator, createBottomTabNavigator} from 'react-navigation';

import TabBarIcon from '../components/TabBarIcon';
import HomeScreen from '../screens/HomeScreen';
import LinksScreen from '../screens/ShopScreen';
import ProfileScreen from '../screens/ProfileScreen';

const HomeStack = createStackNavigator({
    Home: HomeScreen,
});

HomeStack.navigationOptions = {
    tabBarLabel: '卡包',
    tabBarIcon: ({focused}) => (
        <TabBarIcon
            focused={focused}
            name='md-card'
        />
    ),
};

const ShopStack = createStackNavigator({
    Links: LinksScreen,
});

ShopStack.navigationOptions = {
    tabBarLabel: '商店',
    tabBarIcon: ({focused}) => (
        <TabBarIcon
            focused={focused}
            name={'md-business'}
        />
    ),
};

const ProfileStack = createStackNavigator({
    Links: ProfileScreen
});
ProfileStack.navigationOptions = {
    tabBarLabel: "个人中心",
    tabBarIcon: ({focused}) => (
        <TabBarIcon
            focused={focused}
            name={'md-person'}
        />
    ),
};

export default createBottomTabNavigator({
    HomeStack,
    ShopStack,
    ProfileStack
});
