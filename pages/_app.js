import { wrapper } from '../redux/store';
import Head from 'next/head';
import Layout from '../components/Layout';
import '../styles/globals.scss'
import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { useSelector, useDispatch } from 'react-redux';
import { setUser } from '../redux/userSlice';
import { setSessionStorageUser } from '../utils/sessionStorage';
import { setPhotos } from '../redux/photoSlice';
import { setIsMobile } from '../redux/deviceSlice';
import { setBg } from '../redux/userSlice';

const MyApp = ({ Component, pageProps }) => {
  const router = useRouter();
  const dispatch = useDispatch();
  let userIDFromStorage;
  let usernameFromStorage;
  let allTagsFromStorage;
  let bgImageFromStorage;
  const bgImage = useSelector(state => state.user.bgImage)

  useEffect(() => {
    userIDFromStorage = sessionStorage.getItem('userID')
    usernameFromStorage = sessionStorage.getItem('username')
    allTagsFromStorage = JSON?.parse(sessionStorage.getItem('allTags'))
    bgImageFromStorage = sessionStorage.getItem('bgImage')

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
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </>
  )
}

export default wrapper.withRedux(MyApp);
