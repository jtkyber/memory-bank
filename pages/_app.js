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

const MyApp = ({ Component, pageProps }) => {
  const router = useRouter();
  const dispatch = useDispatch();

  useEffect(() => {
    const userIDFromStorage = sessionStorage.getItem('userID')
    const usernameFromStorage = sessionStorage.getItem('username')
    const allTagsFromStorage = sessionStorage.getItem('allTags')

    if (router.asPath === '/login' || router.asPath === '/register') {
      setSessionStorageUser({
        userID: '',
        username: '',
        allTags: ''
      })
      sessionStorage.setItem('photos', [])
    } else if (userIDFromStorage && usernameFromStorage && allTagsFromStorage) {
      dispatch(setUser({
        userID: userIDFromStorage,
        username: usernameFromStorage,
        allTags: allTagsFromStorage
      }))
    } else router.push('/login')
  }, [])

  useEffect(() => {
    if (router.asPath === '/login' || router.asPath === '/register') {
      setSessionStorageUser({
        userID: '',
        username: '',
        allTags: ''
      })
    }

    if (router.pathname !== '/tagCollection/[tagName]/[photoKey]' && router.pathname !== '/tagCollection/[tagName]') {
      dispatch(setPhotos([]))
      sessionStorage.setItem('photos', [])
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