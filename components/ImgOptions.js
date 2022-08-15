import { useRouter } from 'next/router';
import React, { useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setBg } from '../redux/userSlice';
import { setCurrentTags, setOriginalTags } from '../redux/singlePhotoSlice';
import imgOptionStyles from '../styles/imgOptions/ImgOptions.module.scss';
import OptionsDots from './OptionsDots';

const ImgOptions = () => {
    const dispatch = useDispatch();
    const userID = useSelector(state => state.user.userID);
    const photos = useSelector(state => state.photos.photos);
    const router = useRouter();
    const dropdownRef = useRef();
    const key = router.query.photoKey

    useEffect(() => {
        document.addEventListener('click', handleOptionsBtnClick);

        return () => {
            document.removeEventListener('click', handleOptionsBtnClick);
        }
    }, [])

    const setCurrentImgAsBG = async () => {
        try {
            const res = await fetch('/api/setBgImg', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    userID: userID,
                    key: key
                })
            })
    
            const newBgUrl = await res.json()
            if (!newBgUrl?.length) throw new Error('A problem occured when updating your bg image')

            dispatch(setBg(newBgUrl))
            sessionStorage.setItem('bgImage', newBgUrl)
        } catch (err) {
            console.log(err)
        }
    }

    const getTagsForPhoto = async () => {
        for (const photo of photos) {
            if (photo.key === key) {
                dispatch(setCurrentTags(photo.tags))
                dispatch(setOriginalTags(photo.tags))
                break
            }
        }
    }

    const handleOptionsBtnClick = (e) => {
        if (e.target.classList.contains(`${imgOptionStyles.dropdownBtn}`)) {
            dropdownRef.current.classList.toggle(`${imgOptionStyles.active}`)
        } else {
            dropdownRef.current.classList.remove(`${imgOptionStyles.active}`)
        }
    }

    return (
        <>
            <div ref={dropdownRef} className={imgOptionStyles.dropdown}>
                <button className={imgOptionStyles.dropdownBtn}>
                    <OptionsDots />
                </button>
                <ul className={imgOptionStyles.optionsList}>
                    <li><button onClick={getTagsForPhoto}>Edit Tags</button></li>
                    <li><button onClick={setCurrentImgAsBG}>Set as Background</button></li>
                </ul>
            </div>
        </>
    );
};

export default ImgOptions;