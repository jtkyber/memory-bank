import React, { useEffect, useRef } from 'react';
import { useRouter } from 'next/router';
import { useSelector, useDispatch } from 'react-redux';
import { setPhotos, addTag, resetTags, removeTag } from '../redux/photoSlice';
import addPhotosStyles from '../styles/_AddPhotos.module.scss'
import { setAllTags } from '../redux/userSlice';
// import { setSessionStorageUser } from '../utils/sessionStorage';

const AddPhotos = () => {
    const router = useRouter();

    const dispatch = useDispatch();
    const userID = useSelector(state => state.user.userID);
    // const allTags = useSelector(state => state.user.allTags);
    const photos = useSelector(state => state.photos.photos);
    const tags = useSelector(state => state.photos.tags);

    const tagInputRef = useRef();

    useEffect(() => {
        tagInputRef.current.addEventListener('input', handleCommaPress);

        return () => {
            tagInputRef?.current?.removeEventListener('input', handleCommaPress);
        }
    }, [])

    useEffect(() => {
        if (tags.length >= 5) {
            tagInputRef.current.disabled = true
        } else if (tagInputRef.current.disabled) {
            tagInputRef.current.disabled = false
        }
    }, [tags])
    
    const handleCommaPress = (e) => {
        if (e?.data?.[e.data.length-1] !== ',') return;
        const currentTag = tagInputRef.current.value.split(',')[0];
        if (currentTag[0] === '-' || currentTag[currentTag.length-1] === '-') return;

        const regex = /^[a-zA-Z0-9- ]+$/;
        if (!currentTag.match(regex)) {
            return console.log('Tags must only contain letters and dashes')
        }
        
        dispatch(addTag(currentTag));
        tagInputRef.current.value = ''; 
    }

    const uploadImgToDB = async (filename, e) => {
        try {
            const description = e.target.querySelector('#desc').value;
            const location = e.target.querySelector('#loc').value;

            const formData = {
                description: description,
                location: location,
                tags: tags,
                id: userID,
                key: filename
            }

            const res = await fetch('/api/uploadImg', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            })
            const newTagList = await res.json()
            sessionStorage.setItem('allTags', newTagList.split(','));
            dispatch(setAllTags(newTagList.split(',')));
            dispatch(resetTags());
            dispatch(setPhotos([]));
            e.target.reset();
        } catch (err) {
            console.log(err)
        }
    }

    const createRandFilename = () => {
        const length = 32;
        const result = '';
        const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        const charactersLength = characters.length;

        for ( const i = 0; i < length; i++ ) {
            result += characters.charAt(Math.floor(Math.random() * charactersLength));
        }
        return result;
    }

    const uploadImgToS3 = async (e) => {
        e.preventDefault();
        try {
            e.target.querySelector('#submit').disabled = true
            if (!userID.length) {
                router.push('/login');
                return;
            } else if (!tags.length) throw new Error('Must include at least one tag')

            const file = e.target.querySelector('#image')?.files[0]
            Object.defineProperty(file, 'name', {
                writable: true,
                value: createRandFilename()
            })

            const filename = encodeURIComponent(file.name);
            const filetype = encodeURIComponent(file.type);
            
            const res = await fetch(`/api/uploadImg?filename=${filename}&filetype=${filetype}`)
            const { url, fields } = await res.json();
            const formData = new FormData();

            Object.entries({ ...fields, file }).forEach(([key, value]) => {
                formData.append(key, value)
            })

            const upload = await fetch(url, {
                method: 'POST',
                body: formData,
            })

            if (upload.ok) {
                uploadImgToDB(file.name, e);
            } else {
                console.error('Upload failed.')
            }
        } catch (err) {
            console.log(err)
        } finally {
            e.target.querySelector('#submit').disabled = false
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
                <form onSubmit={uploadImgToS3}>
                    <input
                        type='file'
                        name='image'
                        id='image'
                        accept='image/*'
                        className={addPhotosStyles.fileInput}
                        onChange={handleImgChange}
                        required
                    />
                    <textarea rows='5' id='desc' className={addPhotosStyles.descInput}></textarea>
                    <input maxLength={30} required type='text' id='loc' className={addPhotosStyles.fileInput} />
                    <div className={addPhotosStyles.tagContainer}>
                        {
                            tags.map((tag, i) => (
                                <div key={i} className={addPhotosStyles.singleTag}>
                                    <h5>{tag}</h5>
                                    <h3 onClick={() => dispatch(removeTag(i))}>x</h3>
                                </div>
                            ))
                        }
                        <input maxLength={18} ref={tagInputRef} type='text' className={addPhotosStyles.tagInput}/>
                    </div>
                    <input id='submit' type='submit'/>
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