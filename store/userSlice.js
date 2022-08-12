import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'

const initialState = {
    userId: null,
    clientId: null,
    clientSecret: null,
}


export const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        addClientSecret: (state, clientSecret) => {
            // Redux Toolkit allows us to write "mutating" logic in reducers. It
            // doesn't actually mutate the state because it uses the Immer library,
            // which detects changes to a "draft state" and produces a brand new
            // immutable state based off those changes
            state.clientId = clientSecret.payload;
        },
        removeClientSecret: (state) => {
            // Redux Toolkit allows us to write "mutating" logic in reducers. It
            // doesn't actually mutate the state because it uses the Immer library,
            // which detects changes to a "draft state" and produces a brand new
            // immutable state based off those changes
            state.clientId = null;
        },
        addClientId: (state, clientId) => {
            // Redux Toolkit allows us to write "mutating" logic in reducers. It
            // doesn't actually mutate the state because it uses the Immer library,
            // which detects changes to a "draft state" and produces a brand new
            // immutable state based off those changes
            state.clientId = clientId.payload;
        },
        removeClientId: (state) => {
            // Redux Toolkit allows us to write "mutating" logic in reducers. It
            // doesn't actually mutate the state because it uses the Immer library,
            // which detects changes to a "draft state" and produces a brand new
            // immutable state based off those changes
            state.clientId = null;
        },
        addUserId: (state, userId) => {
            // Redux Toolkit allows us to write "mutating" logic in reducers. It
            // doesn't actually mutate the state because it uses the Immer library,
            // which detects changes to a "draft state" and produces a brand new
            // immutable state based off those changes
            state.userId = userId.payload;
        },
        removeUserId: (state, userDays) => {
            // Redux Toolkit allows us to write "mutating" logic in reducers. It
            // doesn't actually mutate the state because it uses the Immer library,
            // which detects changes to a "draft state" and produces a brand new
            // immutable state based off those changes
            state.userId = null;
        },
    },
})

// Action creators are generated for each case reducer function
export const { addUserId, removeUserId, addClientSecret, addClientId, removeClientId, removeClientSecret } = userSlice.actions
export default userSlice.reducer