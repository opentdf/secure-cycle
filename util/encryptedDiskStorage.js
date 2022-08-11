import AsyncStorage from '@react-native-async-storage/async-storage';
import client from 'react-native-opentdf'
import Config from 'react-native-config'
const STORAGE_KEYS = {
    APP_SETTINGS: `APP_SETTINGS`,
    CACHE_DATA: `CACHE_DATA`,
}

/** loadAllDiscData - loads all data stored on disk by our app */
export async function loadAllDiscData() {
    try {
        let retObj = {};
        for (let k in STORAGE_KEYS) {
            let key = STORAGE_KEYS[k];
            let encryptedStr = AsyncStorage.getItem(`${Config.CLIENT_ID}_${key}`);
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
export async function getCachedData(key = null) {
   try {
    let encryptedStr = await AsyncStorage.getItem(`${Config.CLIENT_ID}_${STORAGE_KEYS.CACHE_DATA}`);
    if (!encryptedStr) {
        console.log(`Couldn't load key-value:${key} from cache`);
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
   } catch(e) {
        console.log(e)
   }
}

/** storeSettings - overwrites existing settings with the settings object passed in, with the existing settings in the store */
export async function storeCacheData(cacheData = {}) {
    try {
        const encryptedStr = await client.encryptText(JSON.stringify(cacheData));
        return await AsyncStorage.setItem(`${Config.CLIENT_ID}_${STORAGE_KEYS.CACHE_DATA}`, encryptedStr)
       } catch(e) {
        console.log(e)
       }
}


/** storeSettings - overwrites existing settings with the settings object passed in, with the existing settings in the store */
export async function storeSettings(settings = {}) {
    try {
        const encryptedStr = await client.encryptText(JSON.stringify(settings));
        return await AsyncStorage.setItem(`${Config.CLIENT_ID}_${STORAGE_KEYS.APP_SETTINGS}`, encryptedStr)
       } catch(e) {
            console.log(e)
       }
}

/** clearCache - cleaers all cache data */
export async function clearCache() {
    try {
        return await AsyncStorage.removeItem(`${Config.CLIENT_ID}_${STORAGE_KEYS.CACHE_DATA}`);
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
    clearCache,
    clearAll,
}