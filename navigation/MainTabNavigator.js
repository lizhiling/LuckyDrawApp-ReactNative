import React from 'react';
import { Platform } from 'react-native';
import { createStackNavigator, createBottomTabNavigator } from 'react-navigation';

import TabBarIcon from '../components/TabBarIcon';
import HomeScreen from '../screens/HomeScreen';
import LinksScreen from '../screens/ShopScreen';

const HomeStack = createStackNavigator({
  Home: HomeScreen,
});

HomeStack.navigationOptions = {
  tabBarLabel: '卡包',
  tabBarIcon: ({ focused }) => (
    <TabBarIcon
      focused={focused}
      name='md-card'
    />
  ),
};

const shopStack = createStackNavigator({
  Links: LinksScreen,
});

shopStack.navigationOptions = {
  tabBarLabel: '商店',
  tabBarIcon: ({ focused }) => (
    <TabBarIcon
      focused={focused}
      name={'md-business'}
    />
  ),
};

export default createBottomTabNavigator({
  HomeStack,
  shopStack
});
