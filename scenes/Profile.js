import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import SimpleLineIcons from 'react-native-vector-icons/SimpleLineIcons'

import Ionicons from 'react-native-vector-icons/Ionicons'
import { Box, Button, Icon, Text, Factory, useToast, View, IconButton, Column, Row, useTheme, Center, Heading, Space, Skeleton, VStack, HStack, ScrollView, Divider, } from 'native-base'
import { useSelector, useDispatch } from 'react-redux'
import AsyncStorage from '@react-native-async-storage/async-storage';
import encryptedDiskStorage from './../util/encryptedDiskStorage'
import secureRequest from './../util/secureRequest'
import { removeClientId } from './../store/userSlice'
import { clearAllCycleData } from './../store/cycleSlice'
import _ from 'lodash';
import client from 'react-native-opentdf'
import { format, parseISO } from 'date-fns';

Profile.propTypes = {

};



function Profile(props) {
    const dispatch = useDispatch()
    const [encryptedSharedData, setEncryptedSharedData] = React.useState(null)
    const userId = useSelector((state) => state.user.userId)
    const toast = useToast()
    const getRawCache = async () => {
        const encryptedCacheDataStr = await encryptedDiskStorage.getRawCachedData()
        setEncryptedSharedData(encryptedCacheDataStr)
        return encryptedCacheDataStr;
    }

    const handleShareDataDecrypt = async (item, index) => {
        const sharedData = encryptedSharedData[index]
        //NOTE: the "sharedData" is an array of [0] = username, [1] = encryptedData. Thus we hard index into the array at 1
        const decryptedSharedDataStr = await client.decryptText(sharedData[1])
        const decryptedSharedData = JSON.parse(decryptedSharedDataStr)
        //NOTE: we're intentionally setting the string version of our decrypted data instead of the object version since we're just displaying it as text
        encryptedSharedData[index] = [sharedData[0], { decrypted: true, decryptedSharedData, decryptedSharedDataStr }];
        setEncryptedSharedData(_.cloneDeep(encryptedSharedData))
    }

    const handleShareRevoke = async (item, index) => {
        try {
            alert(`This function is not yet implemented but will be soon!`)
            return;
            const shareResp = await secureRequest.post(`/revoke?client_id=${clientId}&uuid=${userId}`, { uuid: userId, client_id: clientId })
            const result = shareResp.data;
            toast.show({
                description: `Successfully revoked cycle data from ${shareClientId}`
            })

            //now lets take the user back to the view they opened the share screen from
            props.navigation.goBack();
        } catch (error) {
            console.log(error)
            toast.show({
                description: `Error revoking cycle data from ${shareClientId}`,
            })
            //now lets take the user back to the view they opened the share screen from
            props.navigation.goBack();
        }
    }



    const renderSharedListView = () => {

        if (encryptedSharedData == null) {

            return (
                <Box>
                    <Text>
                        Nothing To show yet!
                    </Text>
                </Box>
            )
        }

        const fancyShareDataRender = (shareData) => {
            const rendSharedDataArr = shareData.decryptedSharedData.map((cycleData) => {

                const symptoms = cycleData.symptoms;
                debugger;
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
                        <Column key={`symptom_data_${cycleData.date}_${index}`}>
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

                return (
                    <>
                    <Column paddingTop={5} paddingLeft={5} paddingRight={2}>
                        <Text marginY={2} bold>{format(parseISO(cycleData.date), `MMM`)} {format(parseISO(cycleData.date), `dd`)}</Text>
                        <Row space={"md"}>
                            <Column>
                                <Column >
                                    <Center>
                                        {(cycleData.on_period) ? <IconButton backgroundColor={"secureCycle.dark"} rounded={"full"} borderColor={"secureCycle.white"} variant={"ghost"} _icon={{
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
                    </Column>
                    <Divider />
                    </>
                )
            })

            return rendSharedDataArr;
        }


        const renderEncryptedCache = () => {
            const rendEncrypteData = encryptedSharedData.map((item, index) => {
                return (
                    <Box space={2} marginY={2} padding={5} backgroundColor="secureCycle.muted" key={`user_encrypted_data${item[0]}_${index}`}>
                        <Heading variant={"h6"} color="secureCycle.tertiary" marginY={2}>User: {_.truncate(item[0], 50)}</Heading>
                        <ScrollView height={300}>
                            <Text marginY={1}>Data:</Text>{(item[1].decrypted) ? fancyShareDataRender(item[1]) : (<Text bold>{item[1]}</Text>)}
                        </ScrollView>
                        <Row space={5}>
                            <Column>
                                <Button marginTop={5} onPress={() => handleShareDataDecrypt(item, index)} backgroundColor={"secureCycle.dark"}><Text color="secureCycle.white">Decrypt</Text></Button>
                            </Column>
                            <Column>
                                <Button marginTop={5} onPress={() => handleShareRevoke(item, index)} backgroundColor={"secureCycle.dark"}><Text color="secureCycle.white">Revoke</Text></Button>
                            </Column>
                        </Row>
                        <Divider />
                    </Box>
                )
            });
            return rendEncrypteData;
        }

        return (
            <Box>
                {renderEncryptedCache()}
            </Box>

        )
    }

    useEffect(() => {
        getRawCache()
    }, []);

    return (
        <Box backgroundColor="secureCycle.white">
            <Column marginTop={5} height={`4%`} width={`100%`}>
                <Center>
                    <Heading color="secureCycle.dark" variant={"h6"}>Displaying {(encryptedSharedData) ? encryptedSharedData.length : 0} users with data</Heading>
                </Center>
            </Column>
            <Column padding={5} height={`87%`} width={`100%`}>
                <ScrollView>
                    {renderSharedListView()}
                </ScrollView>
            </Column>
            <Column height={`6%`}>
                <Button rounded backgroundColor="secureCycle.dark" onPress={() => {
                    dispatch(removeClientId())
                    dispatch(clearAllCycleData())
                    props.navigation.navigate('Logout', {
                    });
                }}>
                    Logout
                </Button>
            </Column>
        </Box>
    );
}

export default Profile;