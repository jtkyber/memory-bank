import React, { useEffect } from 'react';
import { useRouter } from 'next/router';
import { useDispatch, useSelector } from 'react-redux';
import Image from 'next/image';
import slideStyle from '../../../styles/_SlideshowView.module.scss'
import { setUrl } from '../../../redux/photoSlice';

const slideshowView = () => {
    const router = useRouter();
    const { tagName, photoKey } = router.query;
    const userID = useSelector(state => state.user.userID);
    const photos = useSelector(state => state.photos.photos);
    const url = useSelector(state => state.photos.url);
    const dispatch = useDispatch();

    useEffect(() => {
        if (photoKey?.length) {
            const tempUrl = `https://memory-bank-bucket.s3.amazonaws.com/${photoKey}`
            dispatch(setUrl(tempUrl))
        }
    }, [userID, router])

    return (
        <div className={slideStyle.container}>
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
        </div>
    );
};

export default slideshowView;