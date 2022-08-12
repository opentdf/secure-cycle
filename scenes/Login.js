import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import Ionicons from 'react-native-vector-icons/Ionicons'
import { Box, Icon, Text, Factory, View, Column, Row, useTheme, Center, Button, IconButton, Heading, Input, Image } from 'native-base'
import { useSelector, useDispatch } from 'react-redux'
import { addUserId, removeUserId, addClientSecret, addClientId } from './../store/userSlice'

Login.propTypes = {

};

function Login(props) {
    const clientIdInputRef = React.useRef(null);
    const dispatch = useDispatch()
    const storedClientId = useSelector((state) => state.user.clientId)

    const [clientId, setClientId] = React.useState(null)
    const handleLoginSubmit = (text) => {
        clientIdInputRef.current.blur()
        //lets clear our text input
        setClientId(null)
        clientIdInputRef.current.clear();

        dispatch(addClientId(clientId))
    }

    const handleClientIdTextChange = (text) => {
        setClientId(text.toLowerCase())
    }

    useEffect(() => {
        //perform a basic auth check
        if (storedClientId) {
            props.navigation.navigate('SecureCycle', {
            });
        }
    }, [storedClientId])


    return (
        <Box height={`100%`} width={`100%`} paddingTop={`5%`} backgroundColor={`secureCycle.white`}>
            <Center>
                <Column w="95%" maxW="400" height={`98%`} backgroundColor="secureCycle.white" space={6} rounded="md" alignItems="center" _dark={{
                    borderColor: "secureCycle.500"
                }} _light={{
                    borderColor: "coolGray.200"
                }}>
                    <Image resizeMode={`center`} size={`2xl`} alt="Secure Cycle" source={require(`./../design_and_branding/splash-screen-logo-small.png`)} />
                    <Input ref={clientIdInputRef} onChangeText={handleClientIdTextChange} borderColor={"secureCycle.dark"} _focus={{ color: "secureCycle.dark" }} placeholderTextColor="secureCycle.dark" size="xl" color="secureCycle.dark" placeholder="Enter Your Client Id" w="90%" />
                    <Button rounded="full" onPress={handleLoginSubmit} backgroundColor="secureCycle.dark" size="lg" color="secureCycle.dark">Login</Button>
                </Column>
            </Center>
        </Box>
    );
}

export default Login;