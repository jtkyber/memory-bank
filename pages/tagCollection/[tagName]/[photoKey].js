import React, { useEffect } from 'react';
import { useRouter } from 'next/router';
import { useDispatch, useSelector } from 'react-redux';
import { setUrl } from '../../../redux/photoSlice';
import Image from 'next/image';
import slideStyle from '../../../styles/_SlideView.module.scss'

const slideshowView = () => {
    const router = useRouter();
    const { photoKey } = router.query;
    const userID = useSelector(state => state.user.userID);
    const photos = useSelector(state => state.photos.photos);
    const url = useSelector(state => state.photos.url);
    const isMobile = useSelector(state => state.device.isMobile);
    const dispatch = useDispatch();

    useEffect(() => {
        if (photoKey?.length) {
            const tempUrl = `https://memory-bank-bucket.s3.amazonaws.com/${photoKey}`
            dispatch(setUrl(tempUrl))
        }
    }, [userID, router])

    const goToPrevImg = () => {
        photos?.forEach((photo, i) => {
            if (photo.key === photoKey) {
                const cuttoffIndex = router.asPath.lastIndexOf('/');
                const newPath = router.asPath.slice(0, cuttoffIndex)
                const newIndex = (i === 0) ? (photos.length - 1) : i - 1;
                router.replace(`${newPath}/${photos[newIndex].key}`)
            }
        });
    }

    const goToNextImg = () => {
        photos?.forEach((photo, i) => {
            if (photo.key === photoKey) {
                const cuttoffIndex = router.asPath.lastIndexOf('/');
                const newPath = router.asPath.slice(0, cuttoffIndex)
                const newIndex = (i === (photos.length - 1)) ? 0 : i + 1;
                router.replace(`${newPath}/${photos[newIndex].key}`)
            }
        });
    }

    const handleExitClick = () => {
        const cuttoffIndex = router.asPath.lastIndexOf('/');
        const newPath = router.asPath.slice(0, cuttoffIndex);
        router.replace(newPath)
    }

    return (
        <div className={slideStyle.container}>
            <div className={`${slideStyle.exitBtn} ${isMobile ? slideStyle.mobile : null}`}>
                <button onClick={handleExitClick}>X</button>
            </div>
            <div onClick={goToPrevImg} className={`
                ${slideStyle.imgBtn} 
                ${slideStyle.prevImgBtn} 
                ${isMobile ? slideStyle.mobile : null}
                ${photos.length === 1 ? slideStyle.hide : null}
            `}>
                <h1>{'<'}</h1>
            </div>
            <div key={photoKey} className={slideStyle.photoContainer}>
                {
                    url?.length ?
                    <Image 
                        src={url}
                        alt='image'
                        layout='fill'
                        objectFit='contain'
                        quality={75}
                        placeholder='blur'
                        blurDataURL={url}
                    />
                    : null
                }
            </div>
            <div onClick={goToNextImg} className={`
                ${slideStyle.imgBtn} 
                ${slideStyle.nextImgBtn}
                ${isMobile ? slideStyle.mobile : null}
                ${photos.length === 1 ? slideStyle.hide : null}
            `}>
                <h1>{'>'}</h1>
            </div>
        </div>
    );
};

export default slideshowView;