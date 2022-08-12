import React from 'react';
import PropTypes from 'prop-types';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Entypo from 'react-native-vector-icons/Entypo'
import SimpleLineIcons from 'react-native-vector-icons/SimpleLineIcons'
import Ionicons from 'react-native-vector-icons/Ionicons'
import DateTimePicker from '@react-native-community/datetimepicker';
import { useSelector, useDispatch } from 'react-redux'

import { Box, Button, Icon, Text, TextArea, Input, Factory, View, Column, Row, useTheme, Center, Heading, Switch, Spinner, IconButton } from 'native-base'
import { formatISO } from 'date-fns'
import client from 'react-native-opentdf';
import Config from 'react-native-config'
import secureRequest from './../util/secureRequest'
import { useToast } from 'native-base';
import { fetchUserCycleData, addCycleItem, addCycleItems } from './../store/cycleSlice'

Tracking.propTypes = {

};


const STATIC_SYMPTOMS = [
    {
        "type": "flow",
        "name": "none",
        "label": "None",
        "iconFont": SimpleLineIcons,
        "iconName": "drop",
    },
    {
        "type": "flow",
        "name": "heavy",
        "label": "Heavy",
        "iconFont": SimpleLineIcons,
        "iconName": "drop",
    },
    {
        "type": "flow",
        "name": "spotting",
        "label": "Spotting",
        "iconFont": Entypo,
        "iconName": "water",
    }
]

const SymptomList = (props) => {
    const renderFlowButtons = STATIC_SYMPTOMS.filter((symptom) =>  symptom.type == `flow`).map((symptom) => {
        return (
            
            <IconButton rounded="full" borderColor="secureCycle.dark" key={`${symptom.name}_outline_${symptom.type}`} variant={`outline`} _icon={{
                as: symptom.iconFont,
                name: symptom.iconName,
                color: `secureCycle.dark`,
                backgroundColor: `secureCycle.`,
              }} onPress={() => props.onPress(symptom.name)}
              >
            </IconButton>
        )
    })


    return (
        <Box>
            <Row>
            {renderFlowButtons}
            </Row>
        </Box>
    )
}

function Tracking({ navigation }) {
    const { colors } = useTheme();
    const dispatch = useDispatch();
    const clientId = useSelector((state) => state.user.clientId)

    const toast = useToast();
    const [date, setDate] = React.useState(new Date());
    const [symptoms, setSymptoms] = React.useState(``);
    const [onPeriod, setOnPeriod] = React.useState(true);
    const [loading, setLoading] = React.useState(false);
    const handleTrackedDataSubmission = async () => {
        try {
            setLoading(true);

            const payload = {
                date: formatISO(date),
                "on_period": onPeriod,
                //NOTE: this is just a hack for now, everywhere else in the app is treating symptoms as an array
                // however we haven't had a chance to build out the "symptoms input" UI yet 
                //so for demo purposes we're just allowing the user to enter their symptoms into a TextArea, as a string
                //thus, on insert, we're just wrapping the string in an array and sending it to the server
                //that way it'll play nice with the rest of the app
                symptoms: [symptoms],
            }
            let encryptedPayload = {};

            //loop through and encrypt each value
            const keys = Object.keys(payload);

            for (let i = 0; i < keys.length; i++) {
                const key = keys[i];
                let value = payload[key]
                if (value === `` || value == null) {
                    alert(`${key} is a required value. Please try again.`)
                    return;
                }
                //ensure we're only encrypting strings
                value = value.toString()
                //and now lets encrypt
                encryptedPayload[key] = await client.encryptText(value);
            }

            //lets proactively add this data to our store
            dispatch(addCycleItem(payload));
            //now lets get our uuid (user id)
            const uuidResp = await secureRequest.get(`/uuid?client_id=${clientId}`)
            let  uuid = uuidResp.data;
            if(uuid) {
                uuid = uuid[0];
            }
            //okay we're good to go. Lets send our data
            const resp = await secureRequest.post(`/date?uuid=${uuid}`, encryptedPayload)
            
            setSymptoms(``)
            setDate(new Date())
            setOnPeriod(true)

            //now lets show a toast
            toast.show({
                render: () => {
                    return (
                        <Box bg="secureCycle.tertiary" px="2" py="1" rounded="sm" mb={5}>
                            <Text color={`white`}>Your cycle data has been encrypted and submitted!</Text>
                        </Box>
                    );
                }
            });
            //and now lets navigate back to the home screen after a brief delay
            setTimeout(() => {
                navigation.navigate('Home')
                setLoading(false);
            }, 1500)
        } catch (error) {
            debugger;
            console.error(error)
        }
    }

    const handleSymptomChange = text => {
        setSymptoms(text);
    };
    const handlePeriodToggleChange = e => setOnPeriod(!onPeriod);

    const renderSpinnerOrForm = () => {
        if (loading) {
            return (
                <Box height={`50%`} width={`100%`} backgroundColor={`secureCycle.white`}>
                    <Center>
                        <Column>
                            <Spinner loading={loading} color={`secureCycle.tertiary`} size="lg" accessibilityLabel="Loading data..." />
                            <Heading color="secureCycle.tertiary" fontSize="md">
                                Encrypting Cycle Data
                            </Heading>
                        </Column>
                    </Center>
                </Box>
            );
        }

        return (
            <>
                <DateTimePicker
                    value={date}
                    onChange={(event, selectedDate) => setDate(selectedDate)}
                    textColor={colors.secureCycle.dark}
                    accentColor={colors.secureCycle.dark}
                    style={{
                        color: colors.secureCycle.dark,
                        width: `100%`
                    }}
                />
                <Row space={24}>
                    <Heading color={`secureCycle.dark`} size='lg' textAlign={`center`}>Flow Today?</Heading>
                    <Switch defaultIsChecked isChecked={onPeriod} offTrackColor="secureCycle.muted" onTrackColor="secureCycle.dark" size='lg' onToggle={() => handlePeriodToggleChange()} />
                </Row>
                <Input placeholder="Symptoms" onChangeText={handleSymptomChange} size="2xl" />
                <Button backgroundColor={`secureCycle.dark`} onPress={() => handleTrackedDataSubmission()} size="lg">
                    Track
                </Button>
            </>
        )
    }


    return (
        <Box backgroundColor="secureCycle.muted" h="100%" padding={25}>
            <Box backgroundColor="secureCycle.white" shadow={`4`} padding={25}>
                <Column h="80%" width={`100%`} space={10} >
                    {renderSpinnerOrForm()}
                </Column>
            </Box>
        </Box>
    );
}

export default Tracking;