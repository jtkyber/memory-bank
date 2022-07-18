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
        resetTags: (state) => {
            state.tags = []
        },
        setUrl: (state, action) => {
            state.url = action.payload
        }
    }
})

export const { setPhotos, addTag, resetTags, setUrl } = photoSlice.actions

export default photoSlice.reducer;