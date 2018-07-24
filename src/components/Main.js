// @flow

import * as React from 'react';
import { FlatList, Image, Text, TouchableOpacity, View } from 'react-native';
import styled from 'styled-components/native';
import { connect } from 'react-redux';
import { getDay, getMonthAbbr } from '../services/utils';
import { colors } from '../constants/styleGuide';
import { getBuddies } from '../redux/buddies';
import { getMeals } from '../redux/food';
import { logout } from '../redux/user';
import Hamburger from './UI/Hamburger';
import type { NavigationScreenProp, NavigationState } from 'react-navigation';

type MainProps = {
    onGetBuddies: () => void,
    onGetMeals: () => void,
    onLogout: () => void,
    navigation: NavigationScreenProp<NavigationState>,
    entries: Array<Object>
};

const mapStateToProps = (state) => ({
    entries: state.food.entries
});

const mapDispatchToProps = (dispatch) => ({
    onGetBuddies: () => dispatch(getBuddies()),
    onGetMeals: () => dispatch(getMeals()),
    onLogout: () => dispatch(logout())
});

class Main extends React.Component<MainProps> {
    static navigationOptions = (props) => ({
        headerLeft: (
            <Hamburger openDrawer={props.navigation.openDrawer} />
        ),
        headerRight: (
            <TouchableOpacity onPress={() => props.navigation.navigate('newEntry')}>
                <Text>New entry</Text>
            </TouchableOpacity>
        )
    });

    componentDidMount () {
        this.props.onGetBuddies();
        setTimeout(() => {
            this.props.onGetMeals();
        }, 1);
    }

    render () {
        const {navigation: {navigate}} = this.props;
        console.log(this.props.entries);
        return (
            <Container>
                <TouchableOpacity onPress={() => navigate('newEntry')}>
                    <Text>New entry</Text>
                </TouchableOpacity>
                <FlatList
                    data={this.props.entries}
                    keyExtractor={(item, i) => i.toString()}
                    renderItem={({item}) => (
                        <Entry>
                            {!!item.photo &&
                                <View style={{flexDirection: 'row'}}>
                                    <Image source={{uri: item.photo}} style={{flex: 1, height: 300}} resizeMode={'cover'}/>
                                </View>
                            }
                            <Content>
                                <Header>
                                    <DateBlock>
                                        <DateDay>{getDay(item.date)}</DateDay>
                                        <DateMonth>{getMonthAbbr(item.date).toUpperCase()}</DateMonth>
                                        <DateDivider />
                                    </DateBlock>
                                    <View>
                                        <MealType>{item.type}</MealType>
                                        <Name>{item.name.toUpperCase()}</Name>
                                    </View>
                                </Header>

                                <Description>{item.description}</Description>
                                <Buddies>
                                    {item.buddies && item.buddies.map((buddy) => buddy.name).join(', ')}
                                </Buddies>
                                <Buddies>{item.location}</Buddies>
                            </Content>
                        </Entry>
                    )}
                />
                <TouchableOpacity onPress={() => this.props.onLogout()}>
                    <Text>Logout</Text>
                </TouchableOpacity>
            </Container>
        );
    }
}

const Container = styled.View`
    padding: 40px 0;
    background-color: ${colors.background};
`;

const Entry = styled.View`
    borderBottomColor: ${colors.highlightBackground};
    borderBottomWidth: 1;
    padding: 5px 0;
`;

const Header = styled.View`
    flex-direction: row;
    margin-bottom: 7px;
`;

const DateBlock = styled.View`
    height: 50px;
    width: 50px;
    margin-right: 20px;
    border-radius: 50px;
`;

const DateDay = styled.Text`
    font-weight: bold;
    font-size: 14px;
    position: absolute;
    right: 32px;
    top: 5px;
`;

const DateMonth = styled.Text`
    font-weight: bold;
    font-size: 14px;
    position: absolute;
    left: 18px;
    bottom: 10px;
`;

const DateDivider = styled.View`
    width: 2px;
    height: 45px;
    background-color: black;
    position: absolute;
    transform: rotate(35deg);
    left: 17.5px;
    top: 0;
`;

const MealType = styled.Text`
    color: rgb(16, 119, 63);
    font-size: 13px;
    font-weight: bold;
`;

const Name = styled.Text`
    font-family: 'OpenSans-Bold';
    color: black;
    font-size: 16px;
`;

const Description = styled.Text`
    color: black;
    margin-bottom: 20px;
`;

const Buddies = styled.Text`
    color: black;
`;

const Content = styled.View`
    margin: 20px;
`;

export default connect(mapStateToProps, mapDispatchToProps)(Main);
