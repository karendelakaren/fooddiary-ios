// @flow

import * as React from 'react';
import styled from 'styled-components/native';
import { connect } from 'react-redux';
import { colors } from '../constants/styleGuide';
import { requestPasswordReset } from '../redux/user';
import { ERROR_EMPTY_EMAIL } from './Register';
import { Input, InputError, InputWrap, Label } from './Input';
import Button from './UI/Button';
import { StackActions, NavigationActions, type NavigationState, type NavigationScreenProp } from 'react-navigation';

type PasswordResetProps = {
    navigation: NavigationScreenProp<NavigationState>,
    loggedIn: boolean,
    onPasswordReset: (email: string) => void
};

type PasswordResetState = {
    email: string,
    errorMessageEmail: string,
    errorMessagePassword: string,
    errorMessage: string
};

const mapStateToProps = () => ({

});

const mapDispatchToProps = (dispatch) => ({
    onPasswordReset: (email) => dispatch(requestPasswordReset(email))
});

class PasswordReset extends React.Component<PasswordResetProps, PasswordResetState> {
    static navigationOptions = {
        title: 'PasswordReset',
    };

    state = {
        email: '',
        errorMessageEmail: '',
        errorMessagePassword: '',
        errorMessage: ''
    };

    componentWillReceiveProps(newProps) {
        if (newProps.loggedIn) {
            const resetAction = StackActions.reset({
                index: 0,
                actions: [
                    NavigationActions.navigate({ routeName: 'main'})
                ]
            });
            this.props.navigation.dispatch(resetAction);
        }

        if (newProps.error && (!this.props.error || newProps.error.code !== this.props.error.code)) {
            if (newProps.error.type === 'email') {
                this.setState({errorMessageEmail: newProps.error.message});
            } else if (newProps.error.type === 'password') {
                this.setState({ errorMessagePassword: newProps.error.message});
            } else {
                this.setState({errorMessage: newProps.error.message});
            }
        }
    }

    login() {
        this.props.onPasswordReset(this.state.email);
    }

    render () {
        return (
            <Container>
                <InputWrap>
                    <Label>Email</Label>
                    <Input
                        value={this.state.email}
                        autoCorrect={false}
                        autoCapitalize="none"
                        keyboardType="email-address"
                        disableFullscreenUI
                        underlineColorAndroid="transparent"
                        onChangeText={(text) => this.setState({email: text})}
                        onBlur={() => {
                            if (!this.state.email) {
                                this.setState({
                                    errorMessageEmail: ERROR_EMPTY_EMAIL
                                });
                            }
                        }}
                    />
                    {!!this.state.errorMessageEmail &&
                    <InputError>{this.state.errorMessageEmail}</InputError>
                    }
                </InputWrap>
                <Button onPress={() => this.login()}>
                    PasswordReset
                </Button>
                {!!this.state.errorMessage &&
                <InputError>{this.state.errorMessage}</InputError>
                }
            </Container>
        );
    }
}

const Container = styled.View`
    padding: 40px 20px;
    background-color: ${colors.background};
`;

export default connect(mapStateToProps, mapDispatchToProps)(PasswordReset);
