import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import AntDesign from 'react-native-vector-icons/AntDesign'
import Ionicons from 'react-native-vector-icons/Ionicons'
import { Box, Icon, Text, Factory, View, Column, Row, useTheme, Spinner, Input, Button, Heading, Image, Center, useToast, IconButton } from 'native-base'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import SplashScreen from 'react-native-splash-screen'
import Config from "react-native-config";
import axios from 'axios'
import { useSelector, useDispatch } from 'react-redux'
import { createStackNavigator } from '@react-navigation/stack';
import { fetchUserCycleData, addCycleItem, addCycleItems } from './store/cycleSlice'
import { addUserId, removeUserId } from './store/userSlice'
import encryptedDiskStorage from './util/encryptedDiskStorage'
import client from 'react-native-opentdf'
import HomeScreen from './scenes/Home';
import AnalyticsScreen from './scenes/Analytics';
import ProfileScreen from './scenes/Profile';
import ResourcesScreen from './scenes/Resources';
import TrackingScreen from './scenes/Tracking';
import secureRequest from './util/secureRequest'
import Login from './scenes/Login'

const Stack = createStackNavigator();

//create the tab navigator
const Tab = createBottomTabNavigator();

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

    } else if (route.name === 'Share') {
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
};

function SecureCycle(props) {
    const dispatch = useDispatch();
    const toast = useToast();
    const userId = useSelector((state) => state.user.userId)
    const clientId = useSelector((state) => state.user.clientId)
    const cycleData = useSelector((state) => state.cycle.cycleDays)
    const useCache = useSelector((state) => state.cycle.useCache)
    const [loadingData, setLoadingData] = React.useState(true)
    useEffect(() => {
        //lets give everyone a chance to see our pretty splash screen
        setLoadingData(true)
        //init our client


        //make sure to set our default DataAttribute for the user, so that we can start encrypting!
        //first we'll fetch the needed uuid
        const configureDataAttributesAndPullInitialData = async () => {
            try {
                await client.setOIDCEndpoint(Config.OIDC_ENDPOINT);
                await client.setKASEndpoint(Config.KAS_ENDPOINT);
                await client.setClientId(clientId);
                await client.setClientSecret(Config.CLIENT_SECRET);
                //it's important to call this function AFTER you've set all the configuration (endpoints, client id, etc)
                //in this future this will just be one init function that accepts all arguments
                await client.initClient();

                const resp = await secureRequest.get(`/uuid?client_id=${clientId}`)
                let uuid = resp.data;
                if (uuid) {
                    uuid = uuid[0];
                }
                await dispatch(addUserId(uuid));
                const dataAttribute = `${Config.BASE_DATA_ATTR}/${uuid}`;
                const currentAttributes = await client.readDataAttributes();
                console.log(currentAttributes)
                if (currentAttributes != dataAttribute) {
                await client.addDataAttribute(`${dataAttribute}`);
                }
                //attempt to load the cached data first, so we can get the user past the loading screen faster
                // await encryptedDiskStorage.clearAll()
                // const cacheData = null
                if (useCache) {
                    const cacheData = await encryptedDiskStorage.getCachedData(null, clientId)
                    if (cacheData) {
                        toast.show({
                            description: "Using cached Data.",
                        })
                        dispatch(addCycleItems(cacheData))
                        setLoadingData(false)
                    } else {
                        //this is messy. Let's DRY this up soon.
                        toast.show({
                            description: "No cache found. Fetching fresh data.",
                        })
                        //clear our cache and pull the data from the server
                        // await encryptedDiskStorage.clearCache(clientId)
                        await dispatch(fetchUserCycleData({ userId: uuid, clientId }))
                        setLoadingData(false)
                        SplashScreen.hide();
                    }
                    //this is messy. Let's DRY this up soon.
                } else {
                    toast.show({
                        description: "No cache found. Fetching fresh data.",
                    })
                    //clear our cache and pull the data from the server
                    // await encryptedDiskStorage.clearCache(clientId)
                    await dispatch(fetchUserCycleData({ userId: uuid, clientId }))
                    setLoadingData(false)
                    SplashScreen.hide();
                }
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
            <Box height={`100%`} width={`100%`} paddingTop={`30%`} backgroundColor={`white`}>
                <Center>
                    <Column backgroundColor="white">
                        <Image resizeMode={`center`} size={`2xl`} alt="Secure Cycle" source={require(`./design_and_branding/splash-screen-logo-small.png`)} />
                        <Center>
                            <Heading color="secureCycle.dark" marginTop={-75} variant="h6" textAlign={"center"}>Decrypting Your Data</Heading>
                        </Center>
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
                animationEnabled: false,
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
                <Tab.Screen name="Share" component={ProfileScreen} />
                <Tab.Screen name="Resources" component={ResourcesScreen} />
            </Tab.Navigator>
        </Box>
    );
}

const ShareScreen = (props) => {
    const toast = useToast();
    const shareInputRef = React.useRef(null);
    const userId = useSelector((state) => state.user.userId)

    const [shareClientId, setShareClientId] = React.useState(null)
    const handleLoginSubmit = async (text) => {
        try {


            shareInputRef.current.blur()

            // const shareResp = await secureRequest.get(`/share?client_id=${shareClientId}&uuid=${userId}`, {})
            const shareResp = await secureRequest.post(`/share?client_id=${shareClientId}&uuid=${userId}`, { uuid: userId, client_id: shareClientId })
            const result = shareResp.data;
            toast.show({
                description: `Successfully shared cycle data to ${shareClientId}`
            })

            //now lets take the user back to the view they opened the share screen from
            props.navigation.goBack();
        } catch (error) {
            console.log(error)
            toast.show({
                description: `Error sharing cycle data to ${shareClientId}`,
            })
            //now lets take the user back to the view they opened the share screen from
            props.navigation.goBack();
        }
    }

    const handleClientIdTextChange = (text) => {
        setShareClientId(text.toLowerCase())
    }

    return (
        <Box height={`100%`} width={`100%`} paddingTop={`5%`} rounded="md" backgroundColor={"secureCycle.muted:alpha.75"}>
            <Row>

                <Center>
                    <Column w="90%" space={5} maxW="400" height={`75%`} padding={5} backgroundColor="secureCycle.white" space={6} rounded="md" alignItems="center" _dark={{
                        borderColor: "secureCycle.500"
                    }} _light={{
                        borderColor: "coolGray.200"
                    }}>
                        <Heading variant={"h4"} color="secureCycle.dark" textAlign={"center"}>You're about to share sensitive data.</Heading>
                        <Heading variant={"h4"} color="secureCycle.dark" textAlign={"center"} marginY={2}>Please enter the clientId of the person you'd like to share with below</Heading>
                        <Input ref={shareInputRef} onChangeText={handleClientIdTextChange} borderColor={"secureCycle.dark"} _focus={{ color: "secureCycle.dark" }} placeholderTextColor="secureCycle.dark" size="xl" color="secureCycle.dark" placeholder="Client Id to Share With" w="90%" />
                        <Row space={10} marginTop={25}>
                            <Button rounded="full" onPress={handleLoginSubmit} backgroundColor="secureCycle.dark" size="lg" color="secureCycle.dark">Share</Button>
                            <Button rounded="full" onPress={() => props.navigation.navigate("Home")} backgroundColor="secureCycle.dark" size="lg" color="secureCycle.dark">Close</Button>
                        </Row>
                    </Column>
                </Center>
            </Row>
        </Box>
    );
}


const SecureCycleAuthStack = (props) => {

    return (
        <Stack.Navigator gestureEnabled={false} screenOptions={{
            headerShown: false,
            animationEnabled: false,
        }}
            headerShown={false}
            cardStyle={{
                padding: 0, margin: 0,
            }}
            initialRouteName="Logout">
            <Stack.Screen name="Logout" component={Login} />
            <Stack.Screen name="SecureCycle" component={SecureCycle} />
            <Stack.Screen name="ShareModal" options={{
                presentation: 'transparentModal',
                animationEnabled: false,
            }} component={ShareScreen} />
        </Stack.Navigator >
    )
}

export default SecureCycleAuthStack