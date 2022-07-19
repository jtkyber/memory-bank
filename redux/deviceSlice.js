import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    isMobile: false
}

export const deviceSlice = createSlice({
    name: 'device',
    initialState,
    reducers: {
        setIsMobile: (state, action) => {
            state.isMobile = action.payload
        }
    }
})

export const { setIsMobile } = deviceSlice.actions

export default deviceSlice.reducer;