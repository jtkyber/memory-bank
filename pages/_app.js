import { wrapper } from '../redux/store';
import Head from 'next/head';
import Layout from '../components/Layout';
import '../styles/globals.scss'
import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { useDispatch, useSelector } from 'react-redux';
import { setUser } from '../redux/userSlice';
import { setSessionStorageUser } from '../utils/sessionStorage';
import { setPhotos } from '../redux/photoSlice';
import { setIsMobile } from '../redux/deviceSlice';

const MyApp = ({ Component, pageProps }) => {
  const router = useRouter();
  const photos = useSelector(state => state.photos.photos);
  const dispatch = useDispatch();
  let userIDFromStorage;
  let usernameFromStorage;
  let allTagsFromStorage;
  let bgImageFromStorage;
  let photosFromStorage;

  useEffect(() => {
    userIDFromStorage = sessionStorage.getItem('userID')
    usernameFromStorage = sessionStorage.getItem('username')
    allTagsFromStorage = JSON?.parse(sessionStorage.getItem('allTags'))
    bgImageFromStorage = sessionStorage.getItem('bgImage')
    photosFromStorage = sessionStorage.getItem('photos')

    if (router.asPath === '/login' || router.asPath === '/register') {
      setSessionStorageUser({
        userID: '',
        username: '',
        allTags: [],
        bgImage: ''
      })
      sessionStorage.setItem('photos', [])
    } else if (userIDFromStorage && usernameFromStorage && allTagsFromStorage && bgImageFromStorage) {
      dispatch(setUser({
        userID: userIDFromStorage,
        username: usernameFromStorage,
        allTags: allTagsFromStorage,
        bgImage: bgImageFromStorage
      }))
    } else router.push('/login')

    if (photosFromStorage?.length && !photos?.length) {
      dispatch(setPhotos(JSON.parse(photosFromStorage)))
    }

    const mobile = (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) || (window.innerWidth < window.innerHeight))
    dispatch(setIsMobile(mobile))
  }, [])

  useEffect(() => {
    if (router.asPath === '/login' || router.asPath === '/register') {
      setSessionStorageUser({
        userID: '',
        username: '',
        allTags: [],
        bgImage: ''
      })

      dispatch(setUser({
        userID: '',
        username: '',
        allTags: [],
        bgImage: ''
      }))
    }

    if (router.pathname !== '/tagCollection/[tagName]/[photoKey]' && router.pathname !== '/tagCollection/[tagName]') {
      dispatch(setPhotos([]))
      sessionStorage.setItem('photos', [])
      sessionStorage.setItem('currentTag', null)
    }
  }, [router.asPath])

  return (
    <> 
      <Head>
        <title>Memory Bank</title>
        <link rel="icon" href="/mb-icon.ico" />
      </Head>
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </>
  )
}

export default wrapper.withRedux(MyApp);
