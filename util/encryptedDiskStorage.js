import AsyncStorage from '@react-native-async-storage/async-storage';
import client from 'react-native-opentdf'
import Config from 'react-native-config'
import _ from 'lodash'
const STORAGE_KEYS = {
    APP_SETTINGS: `APP_SETTINGS`,
    CACHE_DATA: `CACHE_DATA`,
}

/** decryptObjectValues - decrypts each property in a JSON object */
export async function decryptObjectValues(data) {
    const keys = Object.keys(data);
    for (let i = 0; i < keys.length; i++) {
        //lets make sure to skip the one we know isn't encrypted
        const key = keys[i];
        if (key == `id` || key == `uuid`) {
            continue;
        }
        let value = data[key]
        value = await client.decryptText(value)
        //now we need to account for the data type
        if(value == "true" || value == "false"){
            value = JSON.parse(value)
        }
        
        if(key == "symptoms"){
            value = JSON.parse(value)
        }
        data[key] = value
    }
    return data
  }

/** loadAllDiscData - loads all data stored on disk by our app */
export async function loadAllDiscData(clientId) {
    try {
        let retObj = {};
        for (let k in STORAGE_KEYS) {
            let key = STORAGE_KEYS[k];
            let encryptedStr = AsyncStorage.getItem(`${clientId}_${key}`);
            if (!encryptedStr) {
                console.log(`Couldn't load key-value:${key} from cache`);
            }
            //now lets decrypt
            const decryptedStr = await client.decryptText(encryptedStr)
            const decrypted = JSON.parse(decryptedStr);
            retObj[key] = decrypted;
        }

        return retObj;
    } catch (error) {
        console.log(error);
    }
}

/** getCachedData */
export async function getCachedData(key = null, clientId) {
    try {
        let encryptedStr = await AsyncStorage.getItem(`${clientId}_${STORAGE_KEYS.CACHE_DATA}`);
        if (!encryptedStr) {
            console.log(`Couldn't load key-value:${key} from cache`);
            return null;
        }
        //now lets decrypt
        const decryptedCacheStr = await client.decryptText(encryptedStr)
        const decryptedCache = JSON.parse(decryptedCacheStr);
        //if we were asked for a specific key, return that value
        if (key) {
            return decryptedCache[key];
        } else {
            return decryptedCache;
        }
    } catch (e) {
        console.log(e)
        return null;
    }
}

/** getRawCachedData - gets the cached data without decrypting it */
export async function getRawCachedData() {
    try {
        let keys = await AsyncStorage.getAllKeys();
        let encryptedObjStr = await AsyncStorage.multiGet(keys);
        if (!encryptedObjStr) {
            console.log(`Couldn't load key-value:${keys} from cache`);
            return null;
        }
        return encryptedObjStr;
    } catch (e) {
        console.log(e)
        return null;
    }
}

/** storeSettings - overwrites existing settings with the settings object passed in, with the existing settings in the store */
export async function storeCacheData(cacheData = {}, clientId) {
    try {
        const cacheDataStr = JSON.stringify(cacheData);
        const encryptedStr = await client.encryptText(cacheDataStr);
        const ret = await AsyncStorage.setItem(`${clientId}_${STORAGE_KEYS.CACHE_DATA}`, encryptedStr)
        return true;
    } catch (e) {
        console.log(e)
        return false;
    }
}


/** storeSettings - overwrites existing settings with the settings object passed in, with the existing settings in the store */
export async function storeSettings(settings = {}, clientId) {
    try {
        const encryptedStr = await client.encryptText(JSON.stringify(settings));
        return await AsyncStorage.setItem(`${clientId}_${STORAGE_KEYS.APP_SETTINGS}`, encryptedStr)
    } catch (e) {
        console.log(e)
    }
}

/** clearCache - cleaers all cache data */
export async function clearCache(clientId) {
    try {
        return await AsyncStorage.removeItem(`${clientId}_${STORAGE_KEYS.CACHE_DATA}`);
    } catch (error) {
        console.log(error);
    }
}

/** clearAll - clears all data */
export async function clearAll() {
    try {
        return await AsyncStorage.clear();
    } catch (e) {
        console.log(e);
    }
}

export default {
    loadAllDiscData,
    getCachedData,
    storeCacheData,
    storeSettings,
    getRawCachedData,
    clearCache,
    clearAll,
    decryptObjectValues,
}