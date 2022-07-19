import React, { useEffect, useRef } from 'react';
import { useRouter } from 'next/router';
import { useDispatch, useSelector } from 'react-redux';
import { setPhotos } from '../../redux/photoSlice';
import { setUser } from '../../redux/userSlice';
import tagCollectionStyles from '../../styles/_TagCollection.module.scss'
import Image from 'next/image';

const tagCollection = () => {
    const dispatch = useDispatch()
    const router = useRouter();
    const tagName = router.query.tagName;

    const userID = useSelector(state => state.user.userID);
    const photos = useSelector(state => state.photos.photos);

    const s3Bucket = 'https://memory-bank-bucket.s3.amazonaws.com/';
 

    useEffect(() => {
        const storedPhotos = sessionStorage.getItem('photos')
        
        if (tagName) {
            if (tagName !== sessionStorage.getItem('currentTag')) {
                console.log(tagName)
                fetchPhotos()
            } else if (storedPhotos.length && !photos.length) {
                dispatch(setPhotos(JSON.parse(storedPhotos)))
            } else if (!photos.length) fetchPhotos()
        }
    }, [userID, router])

    const fetchPhotos = async () => {
        const res = await fetch(`/api/getPhotosByTag?userID=${userID}&tag=${tagName}`)
        const photosRes = await res.json()

        const photoArrayTemp = [];
        for (let img of photosRes) {
            photoArrayTemp.push({...img, url: `${s3Bucket}${img.key}`})
        }
        sessionStorage.setItem('photos', JSON.stringify(photoArrayTemp));
        sessionStorage.setItem('currentTag', tagName);
        dispatch(setPhotos(photoArrayTemp))
    }

    const handleImgClick = (photo) => {
        router.push(`${router.asPath}/${photo.key}`)
    }

    const onImgLoad = (e, i) => {
        if (e.target.complete && e.target.naturalWidth > 1) {
            console.log('Loaded')
            const loadingText = e.target.parentElement.parentElement.querySelector(`.${tagCollectionStyles.loading}`);
            console.log(loadingText)
            loadingText.classList.add(`${tagCollectionStyles.hide}`)
        }
    }

    return (
        <div className={tagCollectionStyles.container}>
            {
                photos.map((photo, i) => (
                    <div key={i} onClick={() => handleImgClick(photo)} className={tagCollectionStyles.singleImg}>
                        <Image 
                            src={photo.url}
                            alt='image'
                            layout='fill'
                            objectFit='cover'
                            quality={40}
                            placeholder='blur'
                            blurDataURL={photo.url}
                            onLoad={(e) => onImgLoad(e, i)}
                        />

                        <h3 className={tagCollectionStyles.location}>{photo.location}</h3>
                        <h3 className={tagCollectionStyles.loading}>Loading...</h3>
                    </div>
                ))
            }
        </div>
    );
};

export default tagCollection;