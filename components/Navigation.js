import React from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import LogoImg from './LogoImg';
import { useSelector, useDispatch } from 'react-redux';
import { setUser } from '../redux/userSlice';
import navStyles from '../styles/nav/Nav.module.scss';

const Navigation = () => {
  const router = useRouter();
  const userID = useSelector(state => state.user.userID);
  const dispatch = useDispatch();

  const logOut = () => {
    dispatch(setUser({
        userID: 0,
        username: '',
        allTags: [],
        bgImage: ''
    }))
  }

  return (
        <nav className={ `${navStyles.container} ${router.pathname === '/tagCollection/[tagName]/[photoKey]' ? navStyles.hide : null}`}>
            <div className={ `${navStyles.navChunk} ${navStyles.leftNav}` }>
                <div onClick={() => router.push('/')} className={navStyles.appLogo}>
                    <LogoImg />                    
                </div>
            </div>
            <div className={ `${navStyles.navChunk} ${navStyles.rightNav}` }>
                {
                    !userID
                    ? router.asPath === '/register' 
                        ? <Link href='/login'><a>Log In</a></Link>
                        : <Link href='/register'><a>Register</a></Link>
                    : 
                    <>
                        <Link href='/addPhotos'><a>Add Photos</a></Link>
                        <Link href='/login'><a onClick={logOut}>Log Out</a></Link>
                    </>
                }
            </div>
        </nav>
    );
};

export default Navigation;