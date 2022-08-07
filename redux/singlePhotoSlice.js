import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    currentTags: [],
    originalTags: []
}

export const singlePhotoSlice = createSlice({
    name: 'singlePhoto',
    initialState,
    reducers: {
        setCurrentTags: (state, action) => {
            state.currentTags = action.payload
        },
        addTagToCurrent: (state, action) => {
            state.currentTags.push(action.payload)
        },
        removeTagFromCurrent: (state, action) => {
            state.currentTags.splice(action.payload, 1)
        },
        setOriginalTags: (state, action) => {
            state.originalTags = action.payload
        }
    }
})

export const { setCurrentTags, addTagToCurrent, removeTagFromCurrent, setOriginalTags } = singlePhotoSlice.actions

export default singlePhotoSlice.reducer;