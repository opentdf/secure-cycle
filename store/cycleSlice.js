import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import Config from 'react-native-config'
import secureRequest from './../util/secureRequest'
import encryptedDiskStorage, {decryptObjectValues} from './../util/encryptedDiskStorage'
import client from 'react-native-opentdf'
import _ from 'lodash'
import { parse, formatISO } from 'date-fns'


  

const fetchUserCycleData = createAsyncThunk(
    'user/fetchUserCycleDataStatus',
    async (params, thunkAPI) => {
        try {
            const {userId, clientId} = params;
            //lets grab our uuid id again
            const uuidResp = await secureRequest.get(`/uuid?client_id=${clientId}`)
            let  uuid = uuidResp.data;
            if(uuid) {
                uuid = uuid[0];
            }
            //now lets get our initial data
            const dataResp = await secureRequest.post(`/getdate?uuid=${userId}`, [])
            const dataArr = dataResp.data;
            //now lets decrypt our data
            let decryptedData = []
            //lets iterate through each item returned from the server and decrypt it
            for (index in dataArr) {
                const decryptedDat = await decryptObjectValues(dataArr[index]);
                decryptedData.push(decryptedDat)
            }
            //now lets cache our data before returning
            await encryptedDiskStorage.storeCacheData(decryptedData, clientId)
            //now lets add our data to the store
            return decryptedData;
        } catch (error) {
            console.error(error)
        }
    }
)

const initialState = {
    cycleDays: [],
    loading: 'idle',
    useCache: true,
}

export const cycleSlice = createSlice({
    name: 'cycle',
    initialState,
    reducers: {
        updateCacheToggle: (state, useCache) => {
            // Redux Toolkit allows us to write "mutating" logic in reducers. It
            // doesn't actually mutate the state because it uses the Immer library,
            // which detects changes to a "draft state" and produces a brand new
            // immutable state based off those changes
            state.useCache = useCache.payload;
        },
        addCycleItem: (state, cycleDay) => {
            // Redux Toolkit allows us to write "mutating" logic in reducers. It
            // doesn't actually mutate the state because it uses the Immer library,
            // which detects changes to a "draft state" and produces a brand new
            // immutable state based off those changes
            state.cycleDays.push(cycleDay.payload);
        },
        addCycleItems: (state, cycleDays) => {
            // Redux Toolkit allows us to write "mutating" logic in reducers. It
            // doesn't actually mutate the state because it uses the Immer library,
            // which detects changes to a "draft state" and produces a brand new
            // immutable state based off those changes
            state.cycleDays = state.cycleDays.concat(cycleDays.payload);
        },
        removeCycleItem: (state, index) => {
            state.cycleDays.splice(index.payload, 1);
        },

        clearAllCycleData: (state) => {
            state.cycleDays = [];
        },
    },
    extraReducers: (builder) => {
        // Add reducers for additional action types here, and handle loading state as needed
        builder.addCase(fetchUserCycleData.fulfilled, (state, action) => {
            // Add user to the state array
            if(action.payload != null){
                // state.cycleDays = state.cycleDays.concat(action.payload)
                //we seem to be duplicate records on multiple pulls
                state.cycleDays = _.merge(state.cycleDays, action.payload)
            } else {
                console.log(`failed to retrieve cycle data`)
            }
    })
    },
})

// Action creators are generated for each case reducer function
export const { updateCacheToggle, addCycleItem, addCycleItems, removeCycleItem, clearAllCycleData } = cycleSlice.actions
export { fetchUserCycleData };

export default cycleSlice.reducer