import React, { useEffect } from 'react';
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
import { useSelector, useDispatch } from 'react-redux';
import { Box, Icon, Text, Factory, View, Column, Row, useTheme, Center, Divider, Flex, Heading, Input, Button, IconButton, Card, CardItem, ScrollView, Image, } from 'native-base'
import { CalendarProvider, WeekCalendar, Calendar, CalendarList } from "react-native-calendars";
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { NavigationContainer } from '@react-navigation/native';
import _ from 'lodash'
import client from 'react-native-opentdf';
import { parseISO, addDays, subDays, parse, format } from 'date-fns';


const TopTab = createMaterialTopTabNavigator();


DayScreen.propTypes = {

};


const formatCycleData = (cycleData) => {
    let formattedCycleData = {};
    for (let key in cycleData) {
        let rawData = cycleData[key];
        let parsedDate = parseISO(rawData.date)
        let formattedDateStr = format(parsedDate, `yyyy-MM-dd`);
        formattedCycleData[formattedDateStr] = { marked: true, dotColor: 'red', };
    }

    return formattedCycleData;
}



const calculatePeriodEstimate = () => {
    // Here's how we're going to calculate the period estimate:
    //see https://www.hopkinsmedicine.org/health/wellness-and-prevention/calculating-your-monthly-fertility-window
    // 1. Get the current date
    // 2. Get the date of the end of the last period
    // 3. The next period should start roughly (30 - (startOfLastPeriod - endOfLastPeriod)) +/- 10%
    const periodDays = Math.floor(Math.random() * 10);
    return periodDays;
}

const calculateOvulationEstimate = () => {
    // Here's how we're going to calculate the ovulation estimate:
    //see https://www.hopkinsmedicine.org/health/wellness-and-prevention/calculating-your-monthly-fertility-window
    // 1. Get the current date
    // 2. Get the date of the end of the last period
    // 3. The next ovluation period should start roughly (startOfNextPeriod - 12 days) 
    const ovDays = Math.floor(Math.random() * 10);
    return ovDays;
}

const calculateFertileEstimate = () => {
    //perhaps this needs to go away?
    const fertileDays = Math.floor(Math.random() * 10);
    return fertileDays;
}

const renderSymptoms = (cyclData, navigation) => {
    const symptoms = cyclData.symptoms;
    const symptomsIcons = symptoms.map((symptom, index) => {
        let iconName = null;
        let iconColor = `secureCycle.white`;
        let iconOutline = true;
        let iconSet = MaterialCommunityIcons;
        let iconLabel = null
        //these are all the "known" symptoms that we currently support
        // ['headache', 'nausea', 'bloating', 'cramps']"
        if (symptom.toLowerCase().includes("headache")) {
            iconName = "head-question";
            iconColor = "secureCycle.dark"
            iconOutline = false;
        } else if (symptom.toLowerCase().includes("nausea")) {
            iconName = "emoticon-sick";
            iconColor = "secureCycle.dark"
            iconOutline = false;
            iconSet = MaterialCommunityIcons;
        } else if (symptom.toLowerCase().includes("bloat")) {
            iconName = "airballoon";
            iconColor = "secureCycle.dark"
            iconOutline = false;
            iconSet = MaterialCommunityIcons;
        } else if (symptom.toLowerCase().includes("cramp")) {
            iconName = "emoticon-cry";
            iconColor = "secureCycle.dark"
            iconOutline = false;
            iconSet = MaterialCommunityIcons;
        } else {
            iconName = "account-question";
            iconColor = "secureCycle.dark"
            iconOutline = false;
            iconLabel = "Other"
            iconSet = MaterialCommunityIcons;
        }

        return (
            <Column key={`symptom_data_${cyclData.date}_${index}`}>
                <Column marginX={3}>
                    <IconButton backgroundColor={"secureCycle.dark"} rounded={"full"} borderColor={(iconOutline) ? "secureCycle.dark" : "secureCycle.white"} variant={(iconOutline) ? "outline" : "ghost"} _icon={{
                        "as": iconSet,
                        "name": iconName,
                        "color": (iconOutline) ? iconColor : "secureCycle.white",
                        backgroundColor: (iconOutline) ? "secureCycle.white" : "secureCycle.dark",
                    }}
                        onPress={() => null}
                    />
                </Column>
                <Column>
                    <Center>
                        <Text>{(iconLabel) ? iconLabel : symptom}</Text>
                    </Center>
                </Column>
            </Column>
        )
    })

    const handleShareCycleData = () => {
        navigation.navigate('Share', { cycleData: cyclData })
    }

    return (
        <Column paddingTop={5} paddingLeft={5} paddingRight={2}>
            <Row space={"md"}>
                <Column>
                    <Column >
                        <Center>
                            {(cyclData.on_period) ? <IconButton backgroundColor={"secureCycle.dark"} rounded={"full"} borderColor={"secureCycle.white"} variant={"ghost"} _icon={{
                                "as": SimpleLineIcons,
                                "name": "drop",
                                "color": "secureCycle.white",
                                backgroundColor: "secureCycle.dark",
                            }}
                                onPress={() => null}
                            /> : null}
                        </Center>
                    </Column>
                    <Column>
                        <Center>
                            <Text>Flow</Text>
                        </Center>
                    </Column>
                </Column>
                {symptomsIcons}
            </Row>
            <Row space={"md"} marginTop="5" width="100%">
                <Column width={"100%"} >
                    <Center>
                        <Button full backgroundColor="secureCycle.dark" onPress={() => handleShareCycleData()}>Share</Button>
                    </Center>
                </Column>
            </Row>
        </Column>
    )
}

const HistoryScreen = (props) => {
    const cycleData = useSelector(state => state.cycle.cycleDays);

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

    const rednerHistoryView = (props) => {
        const rendHistoryList = cycleData.map((cycleItem, idx) => {
            return (
                <Box key={`history_view_item_${idx}`}>
                    <Box paddingLeft={15} paddingRight={15} paddingTop={15}>
                        <Row>
                            <Heading>{format(parseISO(cycleItem.date), `MMM`)} {format(parseISO(cycleItem.date), `dd`)}</Heading>
                            {(cycleItem.on_period == true) ? <Icon as={SimpleLineIcons} color="secureCycle.pink" size={`lg`} marginLeft={2} marginTop={1} name={"drop"} /> : null}
                        </Row>
                        <Divider marginY={`2`} width={`20%`} />
                        <Column marginY={`5`}>
                            {renderSymptoms(cycleItem, props.navigation)}
                        </Column>
                    </Box>
                    <Divider />
                </Box>
            )
        })


        return (
            <Column backgroundColor="white" height={`100%`} width={`100%`}>
                {rendHistoryList}
            </Column>
        );
    }

    //main render function for HistoryScreen
    return (
        <Box width={`100%`} height={`100%`} backgroundColor="white">
            <ScrollView>
                <Row>
                    <IconButton onPress={() => setShowSanityCheck(!showSanityCheck)} icon={<Icon as={Ionicons} name={(showSanityCheck) ? "bug" : "bug-outline"} />} borderRadius="full" />
                </Row>
                {rednerHistoryView(props)}
                {renderSanityCheck(colors)}
            </ScrollView>
        </Box>
    )
}

function MonthScreen(props) {
    const {
        colors
    } = useTheme();
    const cycleData = useSelector(state => state.cycle.cycleDays);

    const handleDayPress = (day) => {
        props.navigation.navigate('DAY', {
            day: (parseISO(day.dateString)).toISOString()
        });
    }


    return (
        <>
            <CalendarProvider date={new Date().toISOString()}>
                <Box backgroundColor="secureCycle.white" alignContent="center">
                    <Column>
                        <CalendarList
                            markedDates={formatCycleData(cycleData)}
                            firstDay={1} onDayPress={(day) => handleDayPress(day)} />
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
    const day = props.route.params.day
    const [selectedDay, setSelectedDay] = React.useState(day);
    const cycleData = useSelector(state => state.cycle.cycleDays);
    let selectedCycleData = cycleData.filter(cycleDay => {
        const formattedDate = format(parseISO(cycleDay.date), `yyyy-MM-dd`);
        const selectedDate = format(parseISO(selectedDay), `yyyy-MM-dd`);
        return formattedDate == selectedDate
    });

    useEffect(() => {
        setSelectedDay(day);
    }, [props.route.params.day])

    // we'll check for this null later
    if (selectedCycleData.length > 0) {
        selectedCycleData = selectedCycleData[0]
    } else {
        selectedCycleData = null;
    }

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
        const fertileDaysCount = 1;
        const rendFertileItems = []
        for (let i = 0; i < fertileDaysCount; i++) {
            rendFertileItems.push(<Icon as={FontAwesome5} key={`fertile_days_baby_${i}`} size="sm" marginTop={-5} color="secureCycle.tertiary" name={"baby"} />)
        }

        return rendFertileItems;
    }

    const renderOvulationDays = () => {
        const OvulationDaysCount = 1;
        const rendOvulationItems = []
        for (let i = 0; i < OvulationDaysCount; i++) {
            rendOvulationItems.push(<Icon as={Octicons} color="secureCycle.tertiary" size="lg" key={`ovulation_days_dot_${i}`} name={"dot-fill"} />)
        }

        return rendOvulationItems;
    }

    const renderPeriodDays = () => {
        const PeriodDaysCount = 1;
        const rendPeriodItems = []
        for (let i = 0; i < PeriodDaysCount; i++) {
            rendPeriodItems.push(<Icon as={SimpleLineIcons} color="secureCycle.pink" marginTop={.5} key={`ovulation_days_drop_${i}`} name={"drop"} />)
        }

        return rendPeriodItems;
    }

    const renderGeneralFertOvPeriodPrediction = () => {
        return (
            <Box padding={1}>
                <Center>
                    <Row alignItems={`flex-start`} space={5}>
                        <Row alignItems={`space-between`} alignContent={`flex-start`}>
                            <Text color="secureCycle.tertiary" marginRight={5}>Fertile</Text>
                            {renderFertileDays()}
                        </Row>
                        <Row alignItems={`flex-start`}>
                            <Text color="secureCycle.tertiary" marginRight={5}>Ovulation</Text>
                            {renderOvulationDays()}
                        </Row>
                        <Row alignItems={`flex-start`}>
                            <Text color="secureCycle.pink" marginRight={5}>Period</Text>
                            {renderPeriodDays()}
                        </Row>
                    </Row>
                </Center>
            </Box>
        )
    }
    const handleDayPress = (day) => {
        setSelectedDay(parseISO(day.dateString).toISOString())
    }

    const renderCycleData = (props) => {
        const renderNoData = () => {
            return (
                <Column width="100%">
                    <Center>
                        <Heading size="xs" color="secureCycle.dark">No Cycle Data Found</Heading>
                    </Center>
                </Column>
            )
        }
        return (
            <Box background={"#FFF"} paddingY="2">
                <Row>
                    <Column width="20%">
                        <Center>
                            <IconButton variant="ghost" _icon={{
                                "as": MaterialIcons,
                                "name": "chevron-left",
                                "color": "secureCycle.dark",
                            }}
                                onPress={() => setSelectedDay(subDays(parseISO(selectedDay), 1).toISOString())}
                            />
                        </Center>
                    </Column>
                    <Column width="60%" paddingTop={2}>
                        <Center>
                            {/* Day */}
                            <Heading size="md" textAlign={"center"}>{format(parseISO(selectedDay), `MMMM, d, yyyy`)}</Heading>
                        </Center>
                    </Column>
                    <Column width="20%">
                        <Center>
                            <IconButton variant="ghost" _icon={{
                                "as": MaterialIcons,
                                "name": "chevron-right",
                                "color": "secureCycle.dark",
                            }}
                                onPress={() => setSelectedDay(addDays(parseISO(selectedDay), 1).toISOString())}
                            />
                        </Center>
                    </Column>
                </Row>
                <Center>
                    <Divider width={`50%`} marginTop={3} />
                </Center>
                <Row padding={`2`} space="md">
                    {/* Symptoms */}

                    {(!selectedCycleData) ? renderNoData() :
                        (<>
                            <Column width="100%">
                                <Center>
                                    <Column>
                                        {renderSymptoms(selectedCycleData, props.navigation)}
                                    </Column>
                                </Center>
                            </Column>
                        </>)
                    }
                </Row>
            </Box>
        )
    }

    return (
        <>
            <CalendarProvider date={new Date().toISOString()}>
                <ScrollView>
                    <Box backgroundColor="secureCycle.white" alignContent="center">
                        <Column>
                            <WeekCalendar markedDates={formatCycleData(cycleData)}
                                date={_.cloneDeep(selectedDay)}
                                firstDay={1}
                                initialDate={_.cloneDeep(selectedDay)}
                                onDayPress={(day) => handleDayPress(day)}
                            />
                            {renderGeneralFertOvPeriodPrediction()}
                            <Divider />
                            {renderCycleData(props)}
                        </Column>
                    </Box>
                    <Box marginTop={5}>
                        <Column h={`100%`} >
                            {renderPeriodPrediction()}
                        </Column>
                    </Box>
                </ScrollView>
            </CalendarProvider>
        </>
    );
}



function Home(props) {
    const {
        colors
    } = useTheme();

    return (
        <TopTab.Navigator initialRouteName={`DAY`}
            screenOptions={({ route }) => ({
                animationEnabled: false,
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
            <TopTab.Screen name="DAY" initialParams={{
                day: new Date().toISOString(),
            }} component={DayScreen} />
            <TopTab.Screen name="MONTH" component={MonthScreen} />
            <TopTab.Screen name="HISTORY" component={HistoryScreen} />
        </TopTab.Navigator>
    )
}

Home.propTypes = {

};

export default Home;