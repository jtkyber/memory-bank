import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    userID: 0,
    username: '',
    allTags: []
}

const setTags = (tags) => {
    if (tags?.length > 1) {
        return tags.split(',')
    } else if (tags?.length === 1) {
        return [tags]
    } else {
        return []
    }
}

export const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        setUser: (state, action) => {
            state.userID = action.payload.userID
            state.username = action.payload.username
            state.allTags = setTags(action.payload.allTags)
        },
        setAllTags: (state, action) => {
            state.allTags = action.payload;
        }
    }
})

export const { setUser, setAllTags } = userSlice.actions

export default userSlice.reducer;