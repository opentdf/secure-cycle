import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import Config from 'react-native-config'
import secureRequest from './../util/secureRequest'
import encryptedDiskStorage from './../util/encryptedDiskStorage'
import client from 'react-native-opentdf'
import { parse, formatISO } from 'date-fns'

async function decryptObjectValues(data) {
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
  

const fetchUserCycleData = createAsyncThunk(
    'user/fetchUserCycleDataStatus',
    async (userId, thunkAPI) => {
        try {
            //lets grab our uuid id again
            const uuIdresp = await secureRequest.get(`/uuid?client_id=${Config.CLIENT_ID}`)
            let  uuid = uuidResp.data;
            if(uuid) {
                uuid = uuid[0];
            }
            //now lets get our initial data
            const dataResp = await secureRequest.post(`/getdate?uuid=${uuid}`, [])
            const dataArr = dataResp.data;
            //now lets decrypt our data
            let decryptedData = []
            //lets iterate through each item returned from the server and decrypt it
            for (index in dataArr) {
                const decryptedDat = await decryptObjectValues(dataArr[index]);
                decryptedData.push(decryptedDat)
            }
            //now lets cache our data before returning
            await encryptedDiskStorage.storeCacheData(decryptedData)
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
}

export const cycleSlice = createSlice({
    name: 'cycle',
    initialState,
    reducers: {
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
            state.cycleDays = state.cycleDays.concat(action.payload)
        })
    },
})

// Action creators are generated for each case reducer function
export const { addCycleItem, addCycleItems, removeCycleItem, clearAllCycleData } = cycleSlice.actions
export { fetchUserCycleData };

export default cycleSlice.reducer