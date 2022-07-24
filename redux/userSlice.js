import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    userID: 0,
    username: '',
    allTags: [],
    bgImage: '/testbg.jpg'
}

export const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        setUser: (state, action) => {
            state.userID = action.payload.userID
            state.username = action.payload.username
            state.allTags = action.payload.allTags
            state.bgImage = action.payload.bgImage
        },
        setAllTags: (state, action) => {
            state.allTags = action.payload
        },
        setBg: (state, action) => {
            state.bgImage = action.payload
        }
    }
})

export const { setUser, setAllTags, setBg } = userSlice.actions

export default userSlice.reducer;