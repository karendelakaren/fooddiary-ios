// @flow
import React from 'react';
import { createStackNavigator, createDrawerNavigator, createSwitchNavigator } from 'react-navigation'
import styled from 'styled-components/native'
import Main from './Main';
import NewEntry from './NewEntry';
import Login from './Login';
import Welcome from './Welcome';
import PasswordReset from './PasswordReset';
import { Image, Text, View, TouchableOpacity } from 'react-native';

const FeedNavigator = createStackNavigator({
    list: {
        screen: Main,
        headerMode: 'none'
    },
    newEntry: {
        screen: NewEntry
    },
});

const MainNavigator = createDrawerNavigator({
    feed: {
        screen: FeedNavigator
    },
}, {
    navigationOptions: {
        drawerLabel: 'Menu'
    }
});


const AuthNavigator = createStackNavigator({
    welcome: {screen: Welcome},
    login: {screen: Login},
    passwordReset: {screen: PasswordReset},
});

const RootNavigator = createSwitchNavigator({
    auth: {screen: AuthNavigator},
    main: {screen: MainNavigator}
});

export default RootNavigator
