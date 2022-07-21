import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    photos: [],
    tags: [],
    url: ''
}

export const photoSlice = createSlice({
    name: 'photos',
    initialState,
    reducers: {
        setPhotos: (state, action) => {
            state.photos = action.payload
        },
        addTag: (state, action) => {
            state.tags.push(action.payload)
        },
        removeTag: (state, action) => {
            state.tags.splice(action.payload, 1)
        },
        resetTags: (state) => {
            state.tags = []
        },
        setUrl: (state, action) => {
            state.url = action.payload
        }
    }
})

export const { setPhotos, addTag, removeTag, resetTags, setUrl } = photoSlice.actions

export default photoSlice.reducer;