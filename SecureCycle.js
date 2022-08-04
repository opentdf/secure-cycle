import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import AntDesign from 'react-native-vector-icons/AntDesign'
import Ionicons from 'react-native-vector-icons/Ionicons'
import { Box, Icon, Text, Factory, View, Column, Row, useTheme, Spinner, Heading, Image, Center } from 'native-base'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import SplashScreen from 'react-native-splash-screen'
import Config from "react-native-config";
import axios from 'axios'
import { useSelector, useDispatch } from 'react-redux'
import { fetchUserCycleData, addCycleItem, addCycleItems } from './store/cycleSlice'
import { addUserId, removeUserId } from './store/userSlice'

import client from 'react-native-opentdf'
import HomeScreen from './scenes/Home';
import AnalyticsScreen from './scenes/Analytics';
import ProfileScreen from './scenes/Profile';
import ResourcesScreen from './scenes/Resources';
import TrackingScreen from './scenes/Tracking';
import secureRequest from './util/secureRequest'


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

    } else if (route.name === 'Tracking') {
        iconName = 'ios-stats-chart-outline';
        return <Icon as={AntDesign} size="5xl" name={`pluscircle`} color={color} {...styleProps} />;

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
    const dispatch = useDispatch();
    const userId = useSelector((state) => state.user.userId)
    const cycleData = useSelector((state) => state.cycle.cycleDays)
    const [loadingData, setLoadingData] = React.useState(true)
    useEffect(() => {
        //lets give everyone a chance to see our pretty splash screen
        setLoadingData(true)
        //init our client
        client.setOIDCEndpoint(Config.OIDC_ENDPOINT);
        client.setKASEndpoint(Config.KAS_ENDPOINT);
        client.setClientId(Config.CLIENT_ID);
        client.setClientSecret(Config.CLIENT_SECRET);
        //make sure to set our default DataAttribute for the user, so that we can start encrypting!
        //first we'll fetch the needed uuid
        const configureDataAttributesAndPullInitialData = async () => {
            try {
                const resp = await secureRequest.get(`/uuid?client_id=${Config.CLIENT_ID}`)
                const uuid = resp.data;
                await dispatch(addUserId(uuid));
                client.addDataAttribute(`${Config.BASE_DATA_ATTR}/${uuid}`);
                await dispatch(fetchUserCycleData(uuid))
                setLoadingData(false)
                SplashScreen.hide();
            } catch (error) {
                console.error(error)
                debugger;
            }
        }



        configureDataAttributesAndPullInitialData();

    }, [])
    const {
        colors
    } = useTheme();

    if (loadingData == true) {
        return (
            <Box height={`100%`} width={`100%`} paddingTop={`50%`} backgroundColor={`white`}>
                <Center>
                <Column backgroundColor="white">
                    <Image resizeMode={`center`} size={`2xl`} alt="Secure Cycle"  source={require(`./design_and_branding/splash-screen-logo-small.png`)} />
                    {/* <Heading color="secureCycle.dark" fontSize="md"> */}
                        {/* Securely Loading Cycle Data */}
                    {/* </Heading> */}
                    <Spinner loading={loadingData} color={`secureCycle.dark`} size="lg" accessibilityLabel="Loading data..." />
                </Column>
                </Center>
            </Box>
        )
    }
    return (
        <Box safeArea h="100%" backgroundColor="secureCycle.dark">
            <Tab.Navigator safeAreaInsets={{ top: 0, left: 0, right: 0, bottom: 0 }} screenOptions={({ route }) => ({
                tabBarIcon: ({ focused, color, size }) => renderTabIcon(focused, color, size, route, colors),
                tabBarActiveTintColor: (route.name == "Tracking") ? colors.secureCycle["dark"] : colors.secureCycle["tertiary"],
                tabBarInactiveTintColor: colors.secureCycle["dark"],
                tabBarLabel: (route.name == "Tracking") ? "" : route.name,

                header: () => <Box></Box>,
                tabBarItemStyle: {
                    backgroundColor: colors.secureCycle["white"],
                },
                sceneContainerStyle: {
                    backgroundColor: colors.secureCycle["muted"],
                },
                tabBarStyle: {
                    paddingTop: 10,
                    margin: 0,
                    height: 60,
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
                <Tab.Screen name="Tracking" component={TrackingScreen} />
                <Tab.Screen name="Profile" component={ProfileScreen} />
                <Tab.Screen name="Resources" component={ResourcesScreen} />
            </Tab.Navigator>
        </Box>
    );
}

export default SecureCycle;