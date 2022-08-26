import React from 'react';
import PropTypes from 'prop-types';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import Ionicons from 'react-native-vector-icons/Ionicons'
import { Box, Icon, Text, Factory, View, Column, Row, useTheme, Center, Heading, } from 'native-base'

Resources.propTypes = {

};

function Resources(props) {
    return (
        <Box backgroundColor="secureCycle.white" alignContent="center">
            <Center>
                <Column h="100%" width={`80%`} marginTop="25%">
                    <Heading size='lg' textAlign={`center`} >Resources functionality coming soon!</Heading>
                </Column>
            </Center>
        </Box>
    );
}

export default Resources;