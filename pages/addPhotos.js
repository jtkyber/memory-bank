import React, { useEffect, useRef } from 'react';
import axios from 'axios';
import { useRouter } from 'next/router';
import { useSelector, useDispatch } from 'react-redux';
import { setPhotos, addTag, resetTags } from '../redux/photoSlice';
import addPhotosStyles from '../styles/_AddPhotos.module.scss'
import { setAllTags } from '../redux/userSlice';
import { setSessionStorageUser } from '../utils/sessionStorage';

const AddPhotos = () => {
    const router = useRouter();

    const dispatch = useDispatch();
    const userID = useSelector(state => state.user.userID);
    const allTags = useSelector(state => state.user.allTags);
    const photos = useSelector(state => state.photos.photos);
    const tags = useSelector(state => state.photos.tags);

    const tagInputRef = useRef();

    useEffect(() => {
        tagInputRef.current.addEventListener('keyup', handleCommaPress);

        return () => {
            tagInputRef?.current?.removeEventListener('keyup', handleCommaPress);
        }
    }, [])
    
    const handleCommaPress = (e) => {
        if (e.keyCode !== 188) return;
        const currentTag = tagInputRef.current.value;
        currentTag = currentTag.split(',')[0];
        dispatch(addTag(currentTag));
        tagInputRef.current.value = ''; 
    }

    const uploadImg = async (e) => {
        e.preventDefault();
        try {
            if (!userID.length) {
                router.push('/login');
                return;
            }
            const file = e.target.querySelector('#image').files[0];
            const description = e.target.querySelector('#desc').value;
            const location = e.target.querySelector('#loc').value;
            
            const formData = new FormData();
            formData.append('image', file);
            formData.append('description', description);
            formData.append('location', location);
            formData.append('tags', tags);
            formData.append('id', userID);

            const res = await axios.post('/api/uploadImg', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            })
            sessionStorage.setItem('allTags', res.data.split(','));
            dispatch(setAllTags(res.data.split(',')));
            dispatch(resetTags());
            dispatch(setPhotos([]));
            e.target.reset();
        } catch (err) {
            console.log(err)
        }
    }


    const handleImgChange = (e) => {
        const file = URL.createObjectURL(e.target.files[0]);
        dispatch(setPhotos([file]));
    }

    return (
        <div className={addPhotosStyles.container}>
            <div className={addPhotosStyles.formContainer}>
                <h1>Add Photos</h1>
                <form onSubmit={uploadImg}>
                    <input
                        type='file'
                        name='image'
                        id='image'
                        accept='image/*'
                        className={addPhotosStyles.fileInput}
                        onChange={handleImgChange}
                    />
                    <textarea rows='5' id='desc' className={addPhotosStyles.descInput}></textarea>
                    <input type='text' id='loc' className={addPhotosStyles.fileInput} />
                    <div className={addPhotosStyles.tagContainer}>
                        {
                            tags.map((tag, i) => (
                                <h5 key={i}>{tag}</h5>
                            ))
                        }
                        <input ref={tagInputRef} type='text' className={addPhotosStyles.tagInput}/>
                    </div>
                    <input type='submit'/>
                </form>
            </div>

            <div className={addPhotosStyles.previewContainer}>
                {
                    photos.map((photo, i) => (
                        <div key={i} className={addPhotosStyles.singleImgPreviewContainer}>
                            <img src={photo} className={addPhotosStyles.singleImgPreview}></img>
                        </div>
                    ))
                }
            </div>
        </div>
    );
};

export default AddPhotos;