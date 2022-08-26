import React, { useEffect, useRef } from 'react';
import { useRouter } from 'next/router';
import { useDispatch, useSelector } from 'react-redux';
import { setUrl } from '../../../redux/photoSlice';
import { setCurrentPhoto } from '../../../redux/singlePhotoSlice';
import Image from 'next/image';
import ImgOptions from '../../../components/ImgOptions';
import slideStyle from '../../../styles/slideView/SlideView.module.scss'
import TagUpdateModal from '../../../components/TagUpdateModal';

const slideshowView = () => {
    const router = useRouter();
    const { photoKey } = router.query;
    const userID = useSelector(state => state.user.userID);
    const photos = useSelector(state => state.photos.photos);
    const currentTags = useSelector(state => state.singlePhoto.currentTags);
    const currentPhoto = useSelector(state => state.singlePhoto.currentPhoto);
    const url = useSelector(state => state.photos.url);
    const isMobile = useSelector(state => state.device.isMobile);
    const dispatch = useDispatch();
    const infoRef = useRef();

    useEffect(() => {
        return () => {
            dispatch(setCurrentPhoto({}))
        }
    }, [])

    useEffect(() => {
        if (photoKey?.length) {
            const tempUrl = `https://memory-bank-bucket.s3.amazonaws.com/${photoKey}`
            dispatch(setUrl(tempUrl))

            photos?.forEach(photo => {
                if (photo.key === photoKey) dispatch(setCurrentPhoto(photo))
            })
        }
    }, [userID, router])

    const goToPrevImg = () => {
        photos?.forEach((photo, i) => {
            if (photo.key === photoKey) {
                const cuttoffIndex = router.asPath.lastIndexOf('/');
                const newPath = router.asPath.slice(0, cuttoffIndex)
                const newIndex = (i === 0) ? (photos?.length - 1) : i - 1;
                router.replace(`${newPath}/${photos[newIndex].key}`)
            }
        });
    }

    const goToNextImg = () => {
        photos?.forEach((photo, i) => {
            if (photo.key === photoKey) {
                const cuttoffIndex = router.asPath.lastIndexOf('/');
                const newPath = router.asPath.slice(0, cuttoffIndex)
                const newIndex = (i === (photos?.length - 1)) ? 0 : i + 1;
                router.replace(`${newPath}/${photos[newIndex].key}`)
            }
        });
    }

    const handleExitClick = () => {
        const cuttoffIndex = router.asPath.lastIndexOf('/');
        const newPath = router.asPath.slice(0, cuttoffIndex);
        router.replace(newPath)
    }

    const handleInfoBtnClick = () => {
        infoRef.current.classList.add(`${slideStyle.active}`)
    }

    const handleInfoClick = () => {
        infoRef.current.classList.remove(`${slideStyle.active}`)
    }

    return (
        <div className={slideStyle.container}>
            {
            currentTags?.length ?
            <TagUpdateModal />
            : null
            }
            <div className={`${slideStyle.exitBtn} ${isMobile ? slideStyle.mobile : null}`}>
                <button onClick={handleExitClick}>X</button>
            </div>
            <div onClick={goToPrevImg} className={`
                ${slideStyle.imgBtn} 
                ${slideStyle.prevImgBtn} 
                ${isMobile ? slideStyle.mobile : null}
                ${photos?.length <= 1 ? slideStyle.hide : null}
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
            <div className={`${slideStyle.rightSide} ${isMobile ? slideStyle.mobile : null}`}>
                <h2 onClick={handleInfoBtnClick}>i</h2>
                <div className={slideStyle.options}>
                    <ImgOptions />
                </div>
            </div>
            <div onClick={handleInfoClick} ref={infoRef} className={slideStyle.imgInfo}>
                <h4>{currentPhoto.description}</h4>
                <h6>{currentPhoto.location}</h6>
            </div>
            <div onClick={goToNextImg} className={`
                ${slideStyle.imgBtn} 
                ${slideStyle.nextImgBtn}
                ${isMobile ? slideStyle.mobile : null}
                ${photos?.length <= 1 ? slideStyle.hide : null}
            `}>
                <h1>{'>'}</h1>
            </div>
        </div>
    );
};

export default slideshowView;