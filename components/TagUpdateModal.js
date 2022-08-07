import React, { useEffect, useRef } from 'react';
import tagUpdateStyles from '../styles/tagUpdateModal/TagUpdateModal.module.scss';
import { useDispatch, useSelector } from 'react-redux';
import { setCurrentTags, addTagToCurrent, removeTagFromCurrent, setOriginalTags } from '../redux/singlePhotoSlice';
import { setPhotos } from '../redux/photoSlice';
import { useRouter } from 'next/router';
import { setAllTags } from '../redux/userSlice';

const TagUpdateModal = () => {
    const router = useRouter()
    const currentTags = useSelector(state => state.singlePhoto.currentTags)
    const originalTags = useSelector(state => state.singlePhoto.originalTags)
    const userID = useSelector(state => state.user.userID)
    const photos = useSelector(state => state.photos.photos)
    const dispatch = useDispatch()
    const tagInputRef = useRef()
    const key = router.query.photoKey

    useEffect(() => {
        tagInputRef.current.addEventListener('input', handleCommaPress);

        return () => {
            tagInputRef?.current?.removeEventListener('input', handleCommaPress);
        }
    }, [])

    useEffect(() => {
        if (currentTags.length >= 5) {
            tagInputRef.current.disabled = true
        } else if (tagInputRef.current.disabled) {
            tagInputRef.current.disabled = false
        }
    }, [currentTags])

    const handleCommaPress = (e) => {
        if (e?.data?.[e.data.length-1] !== ',') return
        const currentTag = tagInputRef.current.value.split(',')[0]
        if (currentTag.length <= 2) return
        const endCharsNotAccepted = ['&','-']
        if (endCharsNotAccepted.includes(currentTag[0]) || endCharsNotAccepted.includes(currentTag[currentTag.length-1])) return

        const regex = /^[a-zA-Z0-9-& ]+$/
        if (!currentTag.match(regex)) {
            return console.log('Tags must only contain letters and dashes')
        }

        currentTag = currentTag.toLowerCase()
        
        dispatch(addTagToCurrent(currentTag))
        tagInputRef.current.value = '';
    }

    const updatePhotoTags = async (e) => {
        e.preventDefault();
        try {
            const res = await fetch('/api/editPhotoTags', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    userID: userID,
                    key: key,
                    currentTags: currentTags,
                    originalTags: originalTags
                })
            })
            const data = await res.json();
            if (data.newPhotos && data.allTagsNew) {
                const newPhotos = data.newPhotos
                const allTagsNew = data.allTagsNew
                dispatch(setCurrentTags([]))
                dispatch(setOriginalTags([]))
                dispatch(setPhotos(newPhotos))
                sessionStorage.setItem('photos', JSON.stringify(newPhotos))
                dispatch(setAllTags(allTagsNew))
                sessionStorage.setItem('allTags', JSON.stringify(allTagsNew))
            } else throw new Error('Tag Update Failed')
        } catch (err) {
            console.log(err)
        }
    }

    return (
        <div className={tagUpdateStyles.container}>
            <form onSubmit={updatePhotoTags}>
                <label htmlFor='tags'>Tags</label>
                <div id='tags' className={tagUpdateStyles.tagContainer}>
                    {
                    currentTags.map((tag, i) => (
                        <div key={i} className={tagUpdateStyles.singleTag}>
                            <h5>{tag}</h5>
                            <h3 onClick={() => {if (currentTags.length > 1) dispatch(removeTagFromCurrent(i))}}>x</h3>
                        </div>
                    ))
                    }
                    <input maxLength={18} ref={tagInputRef} type='text' className={tagUpdateStyles.tagInput}/>
                </div>
                <input className={tagUpdateStyles.submitBtn} id='submit' type='submit'/>
                <h5 onClick={() => dispatch(setCurrentTags([]))} className={tagUpdateStyles.cancelBtn}>Cancel</h5>
            </form>
        </div>
    );
};

export default TagUpdateModal;