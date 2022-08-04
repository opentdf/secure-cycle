import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'

const initialState = {
    userId: null,
}


export const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        addUserId: (state, userId) => {
            // Redux Toolkit allows us to write "mutating" logic in reducers. It
            // doesn't actually mutate the state because it uses the Immer library,
            // which detects changes to a "draft state" and produces a brand new
            // immutable state based off those changes
            state.userId = userId;
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
export const { addUserId, removeUserId } = userSlice.actions
export default userSlice.reducer