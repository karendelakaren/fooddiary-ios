// @flow

import React from 'react';
import styled from 'styled-components/native';
import hamburger from '../../assets/images/hamburger.png';

type HamburgerProps = {
    openDrawer: () => void
};

const Hamburger = (props: HamburgerProps) => (
    <Button onPress={props.openDrawer}>
        <Icon source={hamburger} resizeMode="contain" />
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