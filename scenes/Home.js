import React from 'react';
import {
    ImageBackground
} from 'react-native'
import PropTypes from 'prop-types';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5'
import Octicons from 'react-native-vector-icons/Octicons'
import Ionicons from 'react-native-vector-icons/Ionicons'
import SimpleLineIcons from 'react-native-vector-icons/SimpleLineIcons'

import { Box, Icon, Text, Factory, View, Column, Row, useTheme, Center, Flex, Heading, Input, Button, IconButton, Card, CardItem, ScrollView, Image, } from 'native-base'
import { CalendarProvider, WeekCalendar, Calendar, CalendarList } from "react-native-calendars";
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { NavigationContainer } from '@react-navigation/native';
import _ from 'lodash'
import client from 'react-native-opentdf';


const TopTab = createMaterialTopTabNavigator();


DayScreen.propTypes = {

};



const calculatePeriodEstimate = () => {
    const periodDays = Math.floor(Math.random() * 10);
    return periodDays;
}

const calculateOvulationEstimate = () => {
    const ovDays = Math.floor(Math.random() * 10);
    return ovDays;
}

const calculateFertileEstimate = () => {
    const fertileDays = Math.floor(Math.random() * 10);
    return fertileDays;
}

const HistoryScreen = () => {
    const {
        colors
    } = useTheme();
    const [textToEncrypt, setTextToEncrypt] = React.useState('')
    const [encryptedText, setEncryptedText] = React.useState('')
    const [decryptedText, setDecryptedText] = React.useState('')
    const [showSanityCheck, setShowSanityCheck] = React.useState(false)
    const encryptTextRef = React.useRef()
    const handleChange = text => setTextToEncrypt(text);
    const handleEncrypt = () => {
        if (textToEncrypt == null || textToEncrypt.length <= 0) {
            alert(`Please enter text to encrypt, before pressing encrypt`);
            return;
        }

        //remove the focus from the input field
        encryptTextRef.current.blur();
        // let attrName = fetch(`api/attributes/:username`))`)
        // attrName = decryptText(attrName)
        // client.add_attribute(attrName)

        //lets first fetch the uuid we need
        

        client.encryptText(textToEncrypt).then(passedEncryptedText => {
            setEncryptedText(passedEncryptedText)
        }).catch(error => {
            console.log(error)
        })
    }

    const handleDecrypt = () => {
        if (encryptedText == null || encryptedText.length <= 0) {
            alert(`Please encrypt some text first, before attempting decrypt operaiton`);
            return;
        }
        client.decryptText(encryptedText).then(passedDecryptedText => {
            setDecryptedText(passedDecryptedText)
        }).catch(error => {
            console.log(error)
        })
    }

    const renderSanityCheck = () => {

        if (showSanityCheck != true) {
            return null;
        }

        return (
            <Column marginTop={20}>
                <Box alignContent="center" backgroundColor={"secureCycle.tertiary:alpha.50"} padding={5} backgroundColorOpacity="0.5">
                    <Center>
                        <Heading justifyContent={`center`} textAlign="center" color="secureCycle.dark">OpenTDF Encrypt/Decrypt Test:</Heading>
                        <Input ref={encryptTextRef} onChangeText={handleChange} borderColor={"secureCycle.dark"} _focus={{ color: colors.secureCycle.dark }} placeholderTextColor="white" size="xl" color="white" placeholder="Enter something to encrypt!" w="90%" />
                    </Center>
                    <Box margin={5}>
                        <Button onPress={() => handleEncrypt()}>Encrypt</Button>
                    </Box>
                    <Box>
                        <Text>Encrypted Text:</Text>
                        <Card margin={5} backgroundColor={colors.secureCycle.muted}>
                            <Text>
                                {_.truncate(encryptedText, 100) || 'No encrypted text found'}
                            </Text>
                        </Card>
                    </Box>
                    <Box>
                        <Text>Decrypted Text:</Text>
                        <Card margin={5} backgroundColor={colors.secureCycle.muted}>
                            <Text>
                                {_.truncate(decryptedText, 100) || 'No decrypted text found'}
                            </Text>
                        </Card>
                    </Box>
                    <Box>
                        <Button onPress={() => handleDecrypt()}>Decrypt</Button>
                    </Box>
                </Box>
            </Column>
        )
    }
    return (
        <Box>
            <ScrollView>
                <Row>
                    <IconButton onPress={() => setShowSanityCheck(!showSanityCheck)} icon={<Icon as={Ionicons} name={(showSanityCheck) ? "bug" : "bug-outline"} />} borderRadius="full" />
                </Row>
                <Box margin={50}>
                    <Center>
                        <Text>Coming Soon!</Text>
                    </Center>
                </Box>
                {renderSanityCheck(colors)}
            </ScrollView>
        </Box>
    )
}

function MonthScreen(props) {
    const {
        colors
    } = useTheme();

    return (
        <>
            <CalendarProvider date={new Date().toISOString()}>
                <Box backgroundColor="secureCycle.white" alignContent="center">
                    <Column>
                        <CalendarList firstDay={1} onDayPress={(day) => alert(`Placeholder function for loading cycle data for day: ${day.dateString}`)} />
                    </Column>
                </Box>
            </CalendarProvider>
        </>
    );
}

function DayScreen(props) {
    const {
        colors
    } = useTheme();

    const renderPeriodPrediction = () => {
        //this is hardcoded, we should fix this later.
        const calculatedPeriodStartEstimate = calculatePeriodEstimate();
        return (
            <Center>
                <Box borderRadius={`full`} >
                    <ImageBackground resizeMode={"stretch"} borderRadius={500} source={require(`../design_and_branding/period_estimate_background_cropped.png`)} alt="prediction_background">
                        <Box height={280} width={280} padding={55} background="secureCycle.tertiary:alpha.70" borderRadius={"full"} >
                            <Center>
                                <Text fontSize={25} bold color={"secureCycle.white"}>Period In</Text>
                                <Text fontSize={50} marginBottom={2} marginTop={2} bold color={"secureCycle.white"}>{calculatedPeriodStartEstimate}</Text>
                                <Text fontSize={25} bold color={"secureCycle.white"}>Days</Text>
                            </Center>
                        </Box>
                    </ImageBackground>
                </Box>
            </Center>
        )
    }



    const renderFertileDays = () => {
        const fertileDaysCount = calculateFertileEstimate();
        const rendFertileItems = []
        for (let i = 0; i < fertileDaysCount; i++) {
            rendFertileItems.push(<Icon as={FontAwesome5} key={`fertile_days_baby_${i}`} color="secureCycle.tertiary" name={"baby"} />)
        }

        return rendFertileItems;
    }

    const renderOvulationDays = () => {
        const OvulationDaysCount = calculateOvulationEstimate();
        const rendOvulationItems = []
        for (let i = 0; i < OvulationDaysCount; i++) {
            rendOvulationItems.push(<Icon as={Octicons} color="secureCycle.tertiary" key={`ovulation_days_dot_${i}`} name={"dot-fill"} />)
        }

        return rendOvulationItems;
    }

    const renderPeriodDays = () => {
        const PeriodDaysCount = calculatePeriodEstimate();
        const rendPeriodItems = []
        for (let i = 0; i < PeriodDaysCount; i++) {
            rendPeriodItems.push(<Icon as={SimpleLineIcons} color="secureCycle.pink" key={`ovulation_days_drop_${i}`} name={"drop"} />)
        }

        return rendPeriodItems;
    }

    const renderGeneralFertOvPeriodPrediction = () => {
        return (
            <Box padding={5}>
                <Center>
                    <Column alignItems={`flex-start`} space={3}>
                        <Row alignItems={`space-between`} alignContent={`flex-start`}>
                            <Text color="secureCycle.tertiary" marginRight={5}>Fertile</Text>
                            {renderFertileDays()}
                        </Row>
                        <Row alignItems={`flex-start`}>
                            <Text color="secureCycle.tertiary" marginRight={5}>Ovula.</Text>
                            {renderOvulationDays()}
                        </Row>
                        <Row alignItems={`flex-start`}>
                            <Text color="secureCycle.pink" marginRight={5}>Period</Text>
                            {renderPeriodDays()}
                        </Row>
                    </Column>
                </Center>
            </Box>
        )
    }

    return (
        <>
            <CalendarProvider date={new Date().toISOString()}>
                <ScrollView>
                    <Box backgroundColor="secureCycle.white" alignContent="center">
                        <Column>
                            <Column>
                                <WeekCalendar firstDay={1} onDayPress={(day) => alert(`Placeholder function for loading cycle data for day: ${day.dateString}`)} />
                            </Column>
                            {renderGeneralFertOvPeriodPrediction()}
                        </Column>
                    </Box>
                    <Box marginTop={100}>
                        <Column h={`100%`} >
                            {renderPeriodPrediction()}
                        </Column>
                    </Box>
                </ScrollView>
            </CalendarProvider>
        </>
    );
}



function Home() {
    const {
        colors
    } = useTheme();

    return (
        <TopTab.Navigator initialRouteName={`DAY`}
            screenOptions={({ route }) => ({
                tabBarLabel: route.name,
                tabBarIndicatorStyle: {
                    backgroundColor: colors.secureCycle["dark"],
                },
                tabBarStyle: {
                    backgroundColor: colors.secureCycle["muted"],
                },
                tabBarLabelStyle: {
                    color: colors.secureCycle["dark"],
                }
            })}
        >
            <TopTab.Screen name="DAY" component={DayScreen} />
            <TopTab.Screen name="MONTH" component={MonthScreen} />
            <TopTab.Screen name="HISTORY" component={HistoryScreen} />
        </TopTab.Navigator>
    )
}

Home.propTypes = {

};

export default Home;