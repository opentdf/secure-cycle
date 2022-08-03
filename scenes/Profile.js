import React from 'react';
import PropTypes from 'prop-types';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import Ionicons from 'react-native-vector-icons/Ionicons'
import { Box, Icon, Text, Factory, View, Column, Row, useTheme, Center, Heading, Space,  Skeleton, VStack, HStack, } from 'native-base'

Profile.propTypes = {

};

function Profile(props) {
    return (
        <Box backgroundColor="secureCycle.white" alignContent="center">
            <Center w="100%">
                <Column w="90%" maxW="400" height={`98%`} borderWidth="1" space={6} rounded="md" alignItems="center" _dark={{
                    borderColor: "secureCycle.500"
                }} _light={{
                    borderColor: "coolGray.200"
                }}>
                    <Skeleton h="40" endColor="secureCycle.dark" />
                    <Skeleton borderWidth={1} borderColor="coolGray.200" endColor="secureCycle.dark" size="20" rounded="full" mt="-70" />
                    <Row space="2">
                        <Skeleton size="5" rounded="full" endColor="secureCycle.dark" />
                        <Skeleton size="5" rounded="full" endColor="secureCycle.dark" />
                        <Skeleton size="5" rounded="full" endColor="secureCycle.dark" />
                        <Skeleton size="5" rounded="full" endColor="secureCycle.dark" />
                        <Skeleton size="5" rounded="full" endColor="secureCycle.dark" />
                    </Row>
                    <Skeleton.Text lines={3} alignItems="center" endColor="secureCycle.dark" px="12" />
                    <Skeleton mb="3" w="40" rounded="20" endColor="secureCycle.dark" />
                </Column>
            </Center>;
        </Box>
    );
}

export default Profile;