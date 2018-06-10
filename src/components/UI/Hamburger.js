// @flow

import React from 'react';
import styled from 'styled-components/native'

type HamburgerProps = {
    openDrawer: () => void
};

const Hamburger = (props: HamburgerProps) => (
    <Button onPress={props.openDrawer}>
        <Icon source={require('../../assets/images/hamburger.png')} resizeMode="contain" />
    </Button>
);

const Button = styled.TouchableOpacity`
    padding: 15px ;
`;

const Icon = styled.Image`
    width: 25px;
    height: 25px;
`;

export default Hamburger;