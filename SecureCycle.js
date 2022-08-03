import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import Ionicons from 'react-native-vector-icons/Ionicons'
import { Box, Icon, Text, Factory, View, Column, Row, useTheme, } from 'native-base'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import SplashScreen from 'react-native-splash-screen'

import client from 'react-native-opentdf'
import HomeScreen from './scenes/Home';
import AnalyticsScreen from './scenes/Analytics';
import ProfileScreen from './scenes/Profile';
import ResourcesScreen from './scenes/Resources';
import Config from "react-native-config";
    const CLIENT_ID = "tdf-client";
    const CLIENT_SECRET = "123-456";
    const ORGANIZATION_NAME = "tdf";


//create the tab navigator
const Tab = createBottomTabNavigator();

// const StyledTab = Factory(Tab);
// const StyledTabNavigator = Factory(Tab.Navigator);
// const StyledTabScreen = Factory(Tab.Screen);
// return <FactoryView bg="emerald.400" borderRadius={4} size={16} />;


//add any required props here
SecureCycle.propTypes = {

};

const renderTabIcon = (focused, color, size, route, themeColors) => {
    let iconName;
    let styleProps = {}
    if (route.name === 'Home') {
        iconName = 'ios-home-outline';
    } else if (route.name === 'Analytics') {
        iconName = 'ios-stats-chart-outline';

    } else if (route.name === 'Profile') {
        iconName = 'person-circle-outline';
    }
    else if (route.name === 'Resources') {
        iconName = 'md-book-outline';
    }

    if (focused) {
        styleProps.color = themeColors.secureCycle["tertiary"];
    } else {
        styleProps.color = color;
    }

    // You can return any component that you like here!
    return <Icon as={Ionicons} size="2xl" name={iconName} color={color} {...styleProps} />;
    //  <Ionicons name={iconName} size={size} color={color} />;
};

function SecureCycle(props) {

    useEffect(() => {
        //lets give everyone a chance to see our pretty splash screen
        setTimeout(() => {
            SplashScreen.hide();
        }, 1500)
        //init our client
        client.setOIDCEndpoint(Config.OIDC_ENDPOINT);
        client.setKASEndpoint(Config.KAS_ENDPOINT);
        client.setClientId(Config.CLIENT_ID);
        client.setClientSecret(Config.CLIENT_SECRET);
        //make sure to set our default DataAttribute for the user, so that we can start encrypting!
        client.setDataAttribute(Config.DATA_ATTRIBUTE);
    }, [])
    const {
        colors
    } = useTheme();

    return (
        <Box safeArea h="100%" backgroundColor="secureCycle.dark">
            <Tab.Navigator safeAreaInsets={{ top: 0, left: 0, right: 0, bottom: 0 }} screenOptions={({ route }) => ({
                tabBarIcon: ({ focused, color, size }) => renderTabIcon(focused, color, size, route, colors),
                tabBarActiveTintColor: colors.secureCycle["tertiary"],
                tabBarInactiveTintColor: colors.secureCycle["dark"],
                tabBarLabel: route.name,
                header: () => <Box></Box>,
                tabBarItemStyle: {
                    backgroundColor: colors.secureCycle["white"],
                },
                sceneContainerStyle: {
                    backgroundColor: colors.secureCycle["muted"],
                },
                tabBarStyle: {
                    padding: 0,
                    margin: 0,
                    shadowColor: "#000",
                    shadowOffset: {
                        width: 0,
                        height: 9,
                    },
                    shadowOpacity: 0.48,
                    shadowRadius: 11.95,

                    elevation: 18,
                },
            })}>
                <Tab.Screen name="Home" component={HomeScreen} />
                <Tab.Screen name="Analytics" component={AnalyticsScreen} />
                <Tab.Screen name="Profile" component={ProfileScreen} />
                <Tab.Screen name="Resources" component={ResourcesScreen} />
            </Tab.Navigator>
        </Box>
    );
}

export default SecureCycle;