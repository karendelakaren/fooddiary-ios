// @flow

import * as React from 'react';
import {
    Text,
    TouchableOpacity,
    View,
    DatePickerIOS,
    Image,
    Picker
} from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import styled from 'styled-components/native';
import { connect } from 'react-redux';
import { createNewEntry } from '../redux/food';
import { addBuddy } from '../redux/buddies';
import { colors } from '../constants/styleGuide';
import { mealTypes } from '../constants/mealTypes';
import { locationTypes } from '../constants/locationTypes';
import ImagePicker from 'react-native-image-picker';
import firebase from 'react-native-firebase';

type NewEntryProps = {
    onCreateEntry: (entry: Object) => void
};

type NewEntryState = {
    name: string,
    description: string,
    date: Date,
    buddy: string,
    buddies: Array,
    location: string,
    website: string,
    type: string,
    notes: string,
    photo: string,
    image: string,
    dateType: string,
    locationPickerOpen: boolean
}

const mapStateToProps = (state) => ({
    buddies: state.buddies.buddies
});

const mapDispatchToProps = (dispatch) => ({
    onCreateEntry: (entry) => dispatch(createNewEntry(entry)),
    onAddBuddy: (buddy) => dispatch(addBuddy(buddy))
});

class NewEntry extends React.Component<NewEntryProps, NewEntryState> {
    state = {
        name: '',
        description: '',
        date: new Date(),
        buddy: '',
        buddies: [],
        location: '',
        website: '',
        type: 'dinner',
        notes: '',
        photo: '',
        image: '',
        dateType: 'today',
        locationPickerOpen: false
    };

    addImage () {
        ImagePicker.launchImageLibrary({}, (imageResponse)  => {
            console.log(imageResponse);
            if (imageResponse.didCancel) { return false; }
            this.setState({image: imageResponse.uri});
            firebase.storage().ref(imageResponse.fileName).putFile(imageResponse.uri, {
                contentType: 'image/jpeg',
                timeCreated: imageResponse.timestamp
            })
                .then(response => {
                    this.setState({photo: response.downloadURL});
                }).catch(error => {
                    console.log(error);
                });
        });
    }

    addEntry () {
        const userId = firebase.auth().currentUser && firebase.auth().currentUser._user.uid;
        const entry = {
            name: this.state.name,
            description: this.state.description,
            buddies: this.state.buddies,
            date: this.state.date,
            location: this.state.location,
            type: this.state.type,
            notes: this.state.notes,
            photo: this.state.photo,
            userId
        };
        this.props.onCreateEntry(entry);
    }

    addBuddy () {
        if (this.state.buddy) {
            this.props.onAddBuddy(this.state.buddy);
            this.setState({
                buddies: [...this.state.buddies, this.state.buddy],
                buddy: ''
            });
        }
    }

    fetchWebsite () {

        const url = this.state.website;
        fetch(url).then((reponse) => {
            return reponse.text();
        }).then(body => {
            const matchSiteName = body.match(/<meta.name="application-name".*content="(.*)".*\/>/);
            console.log(matchSiteName);
            const matchAppName = body.match(/<meta.*property="og:site_name".*content="(.*)".*\/>/);
            console.log(matchAppName);
            const matchTitle = body.match(/<title>(.*?)<\/title>/);
            console.log(matchTitle);
        });
    }

    render () {
        console.log(this.state.photo, this.state.image);
        return (
            <Container>
                <KeyboardAwareScrollView keyboardDismissMode="interactive">
                    <Wrap>
                        <Label>Name</Label>
                        <Input
                            onChangeText={(name) => this.setState({name})}
                            value={this.state.name}
                            returnKeyType="next"
                            placeholder={'Name of dish'}
                        />
                        <Label>Type</Label>
                        <TypeButtons>
                            {Object.keys(mealTypes).map(type => (
                                <TypeButton
                                    key={type}
                                    active={type === this.state.type}
                                    onPress={() => this.setState({type})}
                                >
                                    <TypeButtonText>{mealTypes[type]}</TypeButtonText>
                                </TypeButton>
                            ))}
                        </TypeButtons>
                        <Label>Description</Label>
                        <InputArea
                            multiline
                            onChangeText={(description) => this.setState({description})}
                            value={this.state.description}
                            returnKeyType="next"
                            placeholder={'Ingredients, instructions...'}
                        />
                        <Label>Date</Label>
                        <TypeButtons>
                            <TypeButton
                                active={'today' === this.state.dateType}
                                onPress={() => {
                                    this.setState({
                                        date: new Date(),
                                        dateType: 'today'
                                    });
                                }}
                            >
                                <TypeButtonText>Today</TypeButtonText>
                            </TypeButton>
                            <TypeButton
                                active={'yesterday' === this.state.dateType}
                                onPress={() => {
                                    this.setState({
                                        date: new Date(Date.now() - 86400000),
                                        dateType: 'yesterday'
                                    });
                                }}
                            >
                                <TypeButtonText>Yesterday</TypeButtonText>
                            </TypeButton>
                            <TypeButton
                                active={'custom' === this.state.dateType}
                                onPress={() => {
                                    this.setState({
                                        dateType: 'custom'
                                    });
                                }}
                            >
                                <TypeButtonText>Custom</TypeButtonText>
                            </TypeButton>
                        </TypeButtons>
                        {this.state.dateType === 'custom' && (
                            <DatePickerIOS
                                date={this.state.date}
                                mode="date"
                                onDateChange={(date) => this.setState({date})}
                            />
                        )}
                        <DinnerWithContainer>
                            <DinnerWith>Together with: </DinnerWith>
                            {this.state.buddies.map((buddy, i) => (
                                <Tag
                                    key={i}
                                    onPress={() => this.setState({
                                        buddies: this.state.buddies.filter((selectedBuddy) => selectedBuddy !== buddy)
                                    })}
                                >
                                    <TagText >{this.props.buddies[buddy].name}</TagText>
                                </Tag>
                            ))}
                        </DinnerWithContainer>
                        <View>
                            <Input
                                onChangeText={(buddy) => this.setState({buddy})}
                                value={this.state.buddy}
                            />
                            <AddBuddyButton onPress={() => this.addBuddy()}>
                                <AddBuddyButtonText>
                                    +
                                </AddBuddyButtonText>
                            </AddBuddyButton>
                        </View>

                        <TagContainer>
                            {Object.keys(this.props.buddies).map((buddyKey, i) => (
                                <Tag key={i} onPress={() => this.setState({buddies: [...this.state.buddies, buddyKey]})}>
                                    <TagText >{this.props.buddies[buddyKey].name}</TagText>
                                </Tag>
                            ))}
                        </TagContainer>

                        <Label>Location</Label>
                        <SelectButton onPress={() => this.setState({locationPickerOpen: !this.state.locationPickerOpen})}>
                            <SelectButtonText>{this.state.location ? locationTypes[this.state.location].name : 'Select location'}</SelectButtonText>
                        </SelectButton>
                        {this.state.locationPickerOpen && (
                            <SelectBox>
                                <Picker
                                    selectedValue={this.state.location}
                                    style={{ height: 200, width: 300 }}
                                    onValueChange={(itemValue) => this.setState({location: itemValue})}>
                                    {Object.keys(locationTypes).map(type => (
                                        <Picker.Item key={type} label={locationTypes[type].name} value={type} />
                                    ))}
                                </Picker>
                            </SelectBox>
                        )}
                        {/*<Input*/}
                        {/*onChangeText={(location) => this.setState({location})}*/}
                        {/*value={this.state.location}*/}
                        {/*returnKeyType="next"*/}
                        {/*/>*/}
                        {/*<Label>Source</Label>*/}
                        {/*<Input*/}
                        {/*onChangeText={(source) => this.setState({source})}*/}
                        {/*value={this.state.source}*/}
                        {/*/>*/}

                        {/*<Input*/}
                        {/*onChangeText={(website) => this.setState({website})}*/}
                        {/*value={this.state.website}*/}
                        {/*/>*/}
                        {/*<TouchableOpacity onPress={() => this.fetchWebsite()}>*/}
                        {/*<Text>*/}
                        {/*Website*/}
                        {/*</Text>*/}
                        {/*</TouchableOpacity>*/}

                        <Label>Notes</Label>
                        <InputArea
                            multiline
                            onChangeText={(notes) => this.setState({notes})}
                            value={this.state.notes}
                            returnKeyType="next"
                        />

                        <TouchableOpacity onPress={() => this.addImage()}>
                            <Text>
                                Add Image
                            </Text>
                        </TouchableOpacity>

                        {!!this.state.image && (
                            <Image source={{uri: this.state.image}} style={{width: 300, height: 200}} />
                        )}

                        <TouchableOpacity onPress={() => this.addEntry()}>
                            <Text>
                                Add
                            </Text>
                        </TouchableOpacity>
                    </Wrap>
                </KeyboardAwareScrollView>
            </Container>
        );
    }
}

const Container = styled.View`
    flex: 1;
    background-color: ${colors.background};
`;

const Wrap = styled.View`
    padding: 40px 20px;
`;

const Input = styled.TextInput`
    height: 40px;
    background-color: transparent;
    margin-bottom: 30px;
    color: black;
    padding: 0;
    border-bottom-width: 2px;
    border-bottom-color: black;
    font-size: 16px;
`;

const InputArea = styled.TextInput`
    height: 80px;
    background-color: #FAFAFA;
    border-radius: 5px;
    margin-bottom: 30px;
    color: black;
    padding: 10px 10px;
`;

const Label = styled.Text`
    color: black;
    font-family: 'OpenSans-Bold';
    font-size: 12px;
    margin-bottom: 8px;
`;

const DinnerWithContainer = styled.View`
    flex-direction: row;
    align-items: center;
    flex-wrap: wrap;
`;

const DinnerWith = styled.Text`
    color: black;
    font-family: 'OpenSans-Bold';
    font-size: 12px;
    margin-bottom: 10px;
`;

const AddBuddyButton = styled.TouchableOpacity`
    position: absolute;
    background-color: transparent;
    padding: 6px 15px;
    right: 0;
`;

const AddBuddyButtonText = styled.Text`
    font-family: 'OpenSans-Bold';
    color: black;
    font-size: 20px;
`;

const TagContainer = styled.View`
    flex-direction: row;
    flex-wrap: wrap;
`;

const Tag = styled.TouchableOpacity`
    background-color: ${colors.highlightBackground};
    border-radius: 20px;
    padding: 10px 20px;
    margin-right: 10px;
    margin-bottom: 10px;
`;

const TagText = styled.Text`;
    color: black;
    font-family: 'OpenSans-Bold';
    font-size: 12px;
`;

const TypeButtons = styled.View`
    flex-direction: row;
    flex-wrap: wrap;
    margin-bottom: 20px;
`;

const TypeButton = styled.TouchableOpacity`
    background-color: ${props => props.active ? 'rgba(16, 119, 63, 0.05)' : colors.highlightBackground};
    borderWidth: 2;
    borderColor: ${props => props.active ? 'rgb(16, 119, 63)' : 'transparent'};
    border-radius: 25px;
    padding: 8px 18px;
    margin-right: 10px;
    margin-bottom: 10px;
`;

const TypeButtonText = styled.Text`
    color: black;
    font-family: 'OpenSans-Bold';
    font-size: 12px;
`;

const SelectButton = styled.TouchableOpacity`
    height: 40px;
    justify-content: center;
    border-bottom-width: 2px;
    border-bottom-color: black;
`;

const SelectButtonText = styled.Text`
    font-size: 16px;
`;

const SelectBox = styled.View`
    padding-bottom: 20px;
    border-bottom-width: 2px;
    border-bottom-color: black;
`;

export default connect(mapStateToProps, mapDispatchToProps)(NewEntry);
