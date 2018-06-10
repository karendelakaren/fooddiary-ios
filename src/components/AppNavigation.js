// @flow
import React from 'react';
import { createStackNavigator, createDrawerNavigator } from 'react-navigation'
import styled from 'styled-components/native'
import Main from './Main';
import NewEntry from './NewEntry';
import Login from './Login';
import Welcome from './Welcome';
import PasswordReset from './PasswordReset';
import { Image, Text, View } from 'react-native';

const FeedNavigator = createStackNavigator({
    list: {
        screen: Main,
        headerMode: 'none'
    },
    newEntry: {
        screen: NewEntry
    },

}, {
    headerMode: 'none',
    navigationOptions: (props) => {
        console.log(props)
    }
});

const MainNavigator = createDrawerNavigator({
    feed: {
        screen: FeedNavigator
    },
});

const RootNavigator = createStackNavigator({
    welcome: {screen: Welcome},
    login: {screen: Login},
    passwordReset: {screen: PasswordReset},
    main: {
        screen: MainNavigator,
    }
}, {
    navigationOptions: (props) => {
        console.log(props)
        return {
            headerLeft: (
                <View onClick={() => props.navigation.navigate('DrawerOpen')}>
                    <Hamburger source={require('../assets/images/hamburger.png')} resizeMode="contain" />
                </View>
            ),
        }
    }
});

const Hamburger = styled.Image`
    padding: 5px;
    width: 30px;
    height: 30px;
`;

export default RootNavigator
