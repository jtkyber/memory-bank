import { useRouter } from 'next/router';
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setBg } from '../redux/userSlice';
import imgOptionStyles from '../styles/imgOptions/ImgOptions.module.scss';
import OptionsDots from './OptionsDots';

const ImgOptions = () => {
    const dispatch = useDispatch();
    const userID = useSelector(state => state.user.userID);
    // const bgImage = useSelector(state => state.user.bg);
    const router = useRouter();

    const setCurrentImgAsBG = async () => {
        try {
            const key = router.query.photoKey
    
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
            if (!newBgUrl.length) throw new Error('A problem occured when updating your bg image')

            dispatch(setBg(newBgUrl))
            sessionStorage.setItem('bgImage', newBgUrl)
        } catch (err) {
            console.log(err)
        }
    }

    return (
        <>
            <div className={imgOptionStyles.dropdown}>
                <button className={imgOptionStyles.dropdownBtn}>
                    <OptionsDots />
                </button>
                <ul className={imgOptionStyles.optionsList}>
                    <li><button onClick={setCurrentImgAsBG}>Set as Background</button></li>
                    <li><button>Update Tags</button></li>
                </ul>
            </div>
        </>
    );
};

export default ImgOptions;