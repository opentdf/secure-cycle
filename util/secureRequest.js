import axios from 'axios'
import Config from 'react-native-config'

let secureInstance = null;

let instanceCreated = false;
const createInstance = () => {
    if (instanceCreated == false) {
        secureInstance = axios.create({
            baseURL: Config.BASE_API_URL,
            timeout: 10000,
        });
        instanceCreated = true;
    }

    return secureInstance;
}


export default createInstance();